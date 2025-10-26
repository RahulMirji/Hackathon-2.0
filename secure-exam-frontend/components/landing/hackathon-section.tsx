"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Trophy, FileText, ArrowRight } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useRouter } from "next/navigation"

export function HackathonSection() {
  const router = useRouter()
  const { ref: sectionRef, inView: sectionInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const [activeWordIndex, setActiveWordIndex] = useState(0)

  // Words that will be highlighted in sequence
  const sentence1Words = ["Ideas", "to", "Impact"]
  const sentence2Words = ["Code", "to", "Creation"]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % sentence2Words.length)
    }, 800)

    return () => clearInterval(interval)
  }, [sentence2Words.length])

  const hackathonDetails = [
    { icon: Trophy, label: "Prize Pool", value: "₹50,000" },
    { icon: Users, label: "Registration Fee", value: "₹350 per team" },
    { icon: Calendar, label: "Date", value: "24th - 26th Oct 2025" },
    { icon: Users, label: "Team Size", value: "3 – 5" },
  ]

  return (
    <section id="hackathon" className="relative py-32 px-4 overflow-visible bg-gradient-to-br from-blue-50/30 via-slate-50 to-blue-50/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={sectionRef} className="space-y-16">
          {/* Thank You Heading */}
          <div className={`text-left mb-12 fade-in ${sectionInView ? 'in-view' : ''}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
              Thank You{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                @BMS College of Engineering
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 font-medium">
              for Organising this
            </p>
          </div>

          {/* Hackathon Header */}
          <div className="space-y-8">
            {/* Title */}
            <div className={`space-y-4 fade-in ${sectionInView ? 'in-view' : ''}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                A 48-Hour Online Hackathon
              </h2>
              <p className="text-xl md:text-2xl text-blue-600 font-semibold">
                Presented By Augment AI
              </p>
            </div>

            {/* Animated Tagline */}
            <div className="space-y-4">
              <div className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight fade-in stagger-1 ${sectionInView ? 'in-view' : ''}`}>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-300">
                  {sentence1Words.map((word, index) => (
                    <span key={`s1-${index}`} className="inline-block">
                      {word}
                    </span>
                  ))}
                  <span className="text-slate-900">|</span>
                </div>
              </div>

              <div className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight fade-in stagger-2 ${sectionInView ? 'in-view' : ''}`}>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {sentence2Words.map((word, index) => (
                    <span
                      key={`s2-${index}`}
                      className={`inline-block transition-all duration-500 ${
                        index === activeWordIndex ? "text-slate-900" : "text-slate-300"
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Hackathon Details Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 fade-in stagger-3 ${sectionInView ? 'in-view' : ''}`}>
            {hackathonDetails.map((detail, index) => {
              const Icon = detail.icon
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100"
                >
                  <Icon className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-sm text-slate-600 font-medium mb-1">{detail.label}</p>
                  <p className="text-lg md:text-xl font-bold text-slate-900">{detail.value}</p>
                </div>
              )
            })}
          </div>


        </div>
      </div>
    </section>
  )
}
