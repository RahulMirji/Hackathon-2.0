"use client"

import React, { useRef, useEffect, useState, TouchEvent } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export interface TeamMember {
    id: number
    name: string
    role: string
    bio: string
    imageUrl: string
    isLeader?: boolean
}

interface ThreeDCarouselProps {
    members: TeamMember[]
    autoRotate?: boolean
    rotateInterval?: number
    cardHeight?: number
}

export function ThreeDCarousel({
    members,
    autoRotate = true,
    rotateInterval = 4000,
    cardHeight = 500,
}: ThreeDCarouselProps) {
    const [active, setActive] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)
    const [isInView, setIsInView] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const minSwipeDistance = 50

    useEffect(() => {
        if (autoRotate && isInView && !isHovering) {
            const interval = setInterval(() => {
                setActive((prev) => (prev + 1) % members.length)
            }, rotateInterval)
            return () => clearInterval(interval)
        }
    }, [isInView, isHovering, autoRotate, rotateInterval, members.length])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold: 0.2 }
        )
        if (carouselRef.current) {
            observer.observe(carouselRef.current)
        }
        return () => observer.disconnect()
    }, [])

    const onTouchStart = (e: TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
        setTouchEnd(null)
    }

    const onTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        if (distance > minSwipeDistance) {
            setActive((prev) => (prev + 1) % members.length)
        } else if (distance < -minSwipeDistance) {
            setActive((prev) => (prev - 1 + members.length) % members.length)
        }
    }

    const getCardAnimationClass = (index: number) => {
        if (index === active) return "scale-100 opacity-100 z-20"
        if (index === (active + 1) % members.length)
            return "translate-x-[70%] scale-85 opacity-80 z-10"
        if (index === (active - 1 + members.length) % members.length)
            return "translate-x-[-70%] scale-85 opacity-80 z-10"
        return "scale-75 opacity-0"
    }

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div
                className="relative overflow-hidden h-[600px]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                ref={carouselRef}
            >
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    {members.map((member, index) => (
                        <div
                            key={member.id}
                            className={`absolute top-0 w-full max-w-md transform transition-all duration-500 ${getCardAnimationClass(index)}`}
                        >
                            <Card
                                className={`overflow-hidden bg-white border-2 shadow-xl hover:shadow-2xl flex flex-col h-[${cardHeight}px]`}
                            >
                                <div className="relative bg-gradient-to-br from-blue-600 to-cyan-500 p-8 flex items-center justify-center h-64 overflow-visible">
                                    <div className="absolute inset-0 bg-black/20" />
                                    <div className="relative z-10 w-52 h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white flex items-center justify-center">
                                        <Image
                                            src={member.imageUrl}
                                            alt={member.name}
                                            width={208}
                                            height={208}
                                            className="object-cover w-full h-full object-center-bottom"
                                            style={{ objectPosition: '50% 35%' }}
                                        />
                                    </div>
                                    {member.isLeader && (
                                        <div className="absolute top-4 right-4 bg-white text-blue-600 px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                                            Team Leader
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-8 flex flex-col flex-grow text-center">
                                    <h3 className="text-2xl font-bold mb-3 text-slate-900">
                                        {member.name}
                                    </h3>
                                    <p className="text-blue-600 text-base font-semibold mb-2">
                                        {member.role}
                                    </p>
                                    <p className="text-slate-600 text-sm mb-2">
                                        {member.bio.split('\n')[0]}
                                    </p>
                                    <p className="text-slate-500 text-sm flex-grow">
                                        {member.bio.split('\n')[1] || member.bio}
                                    </p>
                                    {member.isLeader && (
                                        <div className="flex gap-3 justify-center mt-6">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer transition-all">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                </svg>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer transition-all">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-600 hover:bg-white z-30 shadow-lg transition-all hover:scale-110"
                    onClick={() =>
                        setActive((prev) => (prev - 1 + members.length) % members.length)
                    }
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-600 hover:bg-white z-30 shadow-lg transition-all hover:scale-110"
                    onClick={() => setActive((prev) => (prev + 1) % members.length)}
                    aria-label="Next"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center space-x-3 z-30">
                    {members.map((_, idx) => (
                        <button
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${active === idx
                                ? "bg-blue-600 w-8"
                                : "bg-slate-300 w-2 hover:bg-slate-400"
                                }`}
                            onClick={() => setActive(idx)}
                            aria-label={`Go to member ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
