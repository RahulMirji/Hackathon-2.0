"use client"

import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Github, Loader } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useParallax } from "@/hooks/use-parallax"

// Cache for GitHub URL
const GITHUB_URL = "https://github.com/RahulMirji/Hackathon-2.0.git"

export function HeroSection() {
  const router = useRouter()
  const [isNavigating, setIsNavigating] = useState(false)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const authCheckRef = useRef<Promise<boolean>>(null as any)
  const firebaseCacheRef = useRef<any>(null)
  
  const { ref: contentRef, inView: contentInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: mockupRef, inView: mockupInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: parallax1Ref, offset: parallax1Offset } = useParallax({ speed: 0.2 })
  const { ref: parallax2Ref, offset: parallax2Offset } = useParallax({ speed: 0.3 })

  // Pre-initialize Firebase on component mount (cache it)
  useEffect(() => {
    const preinitializeFirebase = async () => {
      try {
        // Check if already cached
        if (firebaseCacheRef.current) {
          setIsFirebaseReady(true)
          return
        }

        // Import Firebase module
        const firebaseModule = await import("@/lib/firebase")
        firebaseCacheRef.current = firebaseModule.auth

        // Warm up the connection by checking auth state
        if (firebaseModule.auth.currentUser !== undefined) {
          setIsFirebaseReady(true)
        }
      } catch (error) {
        console.warn("Firebase pre-initialization failed, will initialize on demand:", error)
        // Still mark as ready so buttons work, it'll load on demand
        setIsFirebaseReady(true)
      }
    }

    // Execute on next tick to not block rendering
    const timeoutId = setTimeout(preinitializeFirebase, 100)
    return () => clearTimeout(timeoutId)
  }, [])

  const checkAuthAndNavigate = async () => {
    try {
      // Use cached Firebase if available, otherwise import fresh
      let authModule = firebaseCacheRef.current
      
      if (!authModule) {
        const { auth } = await import("@/lib/firebase")
        authModule = auth
        firebaseCacheRef.current = auth
      }

      // Check current auth state (non-blocking)
      const currentUser = authModule.currentUser

      if (currentUser) {
        // Already logged in - go directly to compatibility check
        router.push("/exam/compatibility-check")
      } else {
        // Not logged in - go to login with redirect intent
        // User will be redirected to compatibility page after login
        router.push("/auth/login?redirect=demo")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      // Default to login on error with redirect intent
      router.push("/auth/login?redirect=demo")
    }
  }

  const handleTryDemo = () => {
    // Immediate UI feedback - no waiting
    setIsNavigating(true)
    
    // If Firebase is ready, navigate immediately
    if (isFirebaseReady) {
      // Use requestAnimationFrame for instant responsiveness
      requestAnimationFrame(() => {
        checkAuthAndNavigate()
      })
    } else {
      // If not ready yet, still proceed with navigation
      // It will complete faster than waiting
      requestAnimationFrame(() => {
        checkAuthAndNavigate()
      })
    }
  }

  const handleGithub = () => {
    // Instant navigation to GitHub - no processing needed
    window.open(GITHUB_URL, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-50 to-cyan-50" />

      {/* Subtle animated background elements with drift and parallax */}
      <div 
        ref={parallax1Ref as React.RefObject<HTMLDivElement>}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl opacity-40 animate-drift sm:blur-2xl md:blur-3xl"
        style={{ transform: `translateY(${parallax1Offset}px)` }}
      />
      <div
        ref={parallax2Ref as React.RefObject<HTMLDivElement>}
        className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl opacity-40 animate-drift sm:blur-2xl md:blur-3xl"
        style={{ animationDelay: "1s", transform: `translateY(${parallax2Offset}px)` }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="space-y-6">
              <h1 className={`text-5xl md:text-6xl font-bold leading-tight text-balance text-slate-900 slide-up stagger-1 ${contentInView ? 'in-view' : ''}`}>
                Your AI Assistant for <span className="text-blue-600">Secure Exams</span>
              </h1>
              <p className={`text-xl text-slate-700 text-balance leading-relaxed slide-up stagger-2 ${contentInView ? 'in-view' : ''}`}>
                Experience next-generation proctoring with real-time AI monitoring, identity verification, and
                intelligent integrity scoring. Fair, secure, and transparent exam administration.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col gap-4 pt-4 slide-up stagger-3 ${contentInView ? 'in-view' : ''}`}>
              {/* Main CTA Button - Extra Prominent */}
              <div className="relative">
                {/* Glowing background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur-xl opacity-50 animate-pulse-glow"></div>
                
                <Button
                  size="lg"
                  onClick={handleTryDemo}
                  disabled={isNavigating}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl px-12 py-8 text-xl md:text-2xl cursor-pointer animate-float disabled:opacity-70 pointer-events-auto"
                >
                  <span className="flex items-center justify-center gap-3 pointer-events-none">
                    {isNavigating ? (
                      <>
                        <Loader size={24} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <span className="text-3xl">🎯</span>
                        Try Demo Exam Now
                        <span className="text-3xl">→</span>
                      </>
                    )}
                  </span>
                </Button>
              </div>

              {/* GitHub Button - Below */}
              <Button
                size="lg"
                variant="outline"
                onClick={handleGithub}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-2xl px-12 py-8 text-xl md:text-2xl transition-all duration-300 bg-white hover-scale-105 hover:shadow-xl cursor-pointer pointer-events-auto"
              >
                <span className="flex items-center justify-center gap-3 pointer-events-none">
                  <Github size={28} />
                  View on GitHub
                </span>
              </Button>
            </div>
          </div>

          {/* Right Visual - Professional mockup */}
          <div ref={mockupRef} className="relative h-96 md:h-full">
            <div className="relative h-full flex items-center justify-center">
              <div className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-blue-100 slide-in-right stagger-2 animate-drift hover-lift hover-glow-blue ${mockupInView ? 'in-view' : ''}`}>
                {/* Mockup header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Mockup content */}
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">AI Exam Browser</h3>
                    <p className="text-sm text-slate-600">Real-time monitoring & integrity verification</p>
                  </div>

                  {/* Status indicators */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Face Detection</span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Attention Score</span>
                      <span className="text-sm font-semibold text-blue-600">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Connection</span>
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        Secure
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Exam Progress</span>
                      <span className="text-xs font-semibold text-slate-700">65%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
