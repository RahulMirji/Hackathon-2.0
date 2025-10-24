"use client"

import { Activity, Wifi } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useParallax } from "@/hooks/use-parallax"

export function MonitoringPreview() {
  const { ref: dashboardRef, inView: dashboardInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: featuresRef, inView: featuresInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: parallax1Ref, offset: parallax1Offset } = useParallax({ speed: 0.2 })
  const { ref: parallax2Ref, offset: parallax2Offset } = useParallax({ speed: 0.25 })

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50/30 via-slate-50 to-blue-50/30">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20" />
      <div 
        ref={parallax1Ref as React.RefObject<HTMLDivElement>}
        className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-drift sm:blur-2xl md:blur-3xl sm:animate-none md:animate-drift" 
        style={{ transform: `translateY(${parallax1Offset}px)` }}
      />
      <div 
        ref={parallax2Ref as React.RefObject<HTMLDivElement>}
        className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-drift sm:blur-2xl md:blur-3xl sm:animate-none md:animate-drift" 
        style={{ animationDelay: "1s", transform: `translateY(${parallax2Offset}px)` }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Dashboard Mockup with enhanced glass effects */}
          <div ref={dashboardRef} className={`glass-prism-lg rounded-3xl p-8 space-y-6 border border-white/30 hover:border-white/50 transition-all duration-300 hover-lift hover-glow-blue slide-in-left ${dashboardInView ? 'in-view' : ''}`}>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">AI Monitoring Dashboard</h3>
              <p className="text-slate-600">Real-time tracking and integrity verification</p>
            </div>

            {/* Monitoring Cards with enhanced effects */}
            <div className="space-y-3">
              {/* Face Detection */}
              <div className="glass-prism-sm rounded-xl p-4 flex items-center justify-between border border-white/20 hover:border-white/40 transition-all duration-300 hover-brightness">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse-glow" />
                  <span className="text-sm font-medium text-slate-900">Face Detection</span>
                </div>
                <span className="text-xs text-accent font-semibold">Active</span>
              </div>

              {/* Attention Score */}
              <div className="glass-prism-sm rounded-xl p-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover-brightness">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-900">Attention Score</span>
                  <span className="text-sm font-bold text-accent">94%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full w-11/12 bg-gradient-to-r from-primary via-accent to-secondary rounded-full animate-shimmer" />
                </div>
              </div>

              {/* Connection Status */}
              <div className="glass-prism-sm rounded-xl p-4 flex items-center justify-between border border-white/20 hover:border-white/40 transition-all duration-300 hover-brightness">
                <div className="flex items-center gap-3">
                  <Wifi size={16} className="text-accent" />
                  <span className="text-sm font-medium text-slate-900">Connection</span>
                </div>
                <span className="text-xs text-accent font-semibold">Stable</span>
              </div>
            </div>
          </div>

          {/* Right: Features List */}
          <div ref={featuresRef} className="space-y-6">
            <h3 className={`text-3xl font-bold text-slate-900 slide-in-right stagger-1 ${featuresInView ? 'in-view' : ''}`}>
              Live Monitoring Features
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: "AI Face Detection",
                  description: "Continuous facial recognition to ensure test taker identity",
                },
                {
                  title: "Attention Scoring System",
                  description: "Real-time analysis of focus and engagement levels",
                },
                {
                  title: "Real-Time Alerts",
                  description: "Immediate notifications for suspicious activity or anomalies",
                },
              ].map((item, index) => {
                const staggerClass = `stagger-${index + 2}`
                return (
                  <div
                    key={index}
                    className={`glass-prism-sm rounded-xl p-4 flex gap-4 border border-white/20 hover:border-white/40 transition-all duration-300 hover-lift group cursor-pointer slide-up ${staggerClass} ${featuresInView ? 'in-view' : ''}`}
                  >
                    <Activity
                      size={20}
                      className="text-primary flex-shrink-0 mt-1 hover-scale-105 transition-transform duration-300"
                    />
                    <div>
                      <h4 className="font-semibold mb-1 text-slate-900">{item.title}</h4>
                      <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
