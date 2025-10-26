"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useParallax } from "@/hooks/use-parallax"

export function HeroSection() {
  const router = useRouter()
  const { ref: contentRef, inView: contentInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: mockupRef, inView: mockupInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: parallax1Ref, offset: parallax1Offset } = useParallax({ speed: 0.2 })
  const { ref: parallax2Ref, offset: parallax2Offset } = useParallax({ speed: 0.3 })

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
                  onClick={() => {
                    // Check if user is logged in by checking for auth token
                    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
                    if (token) {
                      // User is logged in, proceed to exam
                      router.push("/exam/compatibility-check");
                    } else {
                      // User not logged in, redirect to login
                      router.push("/auth/login");
                    }
                  }}
                  className="relative w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl px-12 py-8 text-xl md:text-2xl cursor-pointer animate-float"
                >
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-3xl">🎯</span>
                    Try Demo Exam Now
                    <span className="text-3xl">→</span>
                  </span>
                </Button>
              </div>

              {/* GitHub Button - Below */}
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open("https://github.com/RahulMirji/Hackathon-2.0.git", "_blank")}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-2xl px-12 py-8 text-xl md:text-2xl transition-all duration-300 bg-white hover-scale-105 hover:shadow-xl cursor-pointer"
              >
                <span className="flex items-center justify-center gap-3">
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
