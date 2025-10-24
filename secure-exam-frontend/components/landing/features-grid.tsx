"use client"

import { Camera, Brain, Shield, Wifi, BarChart3, Lock } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useParallax } from "@/hooks/use-parallax"

const features = [
  {
    icon: Camera,
    title: "AI Proctoring",
    description: "Real-time face and attention tracking with advanced computer vision",
  },
  {
    icon: Brain,
    title: "Smart Integrity Engine",
    description: "Detects suspicious movements and behaviors automatically",
  },
  {
    icon: Shield,
    title: "ID Verification",
    description: "Dual-layer face and government ID authentication",
  },
  {
    icon: Wifi,
    title: "Offline Recovery",
    description: "Seamless reconnection with automatic data synchronization",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Live performance and integrity reports during exam",
  },
  {
    icon: Lock,
    title: "Secure Sandbox",
    description: "Prevents tab switching and external interference",
  },
]

export function FeaturesGrid() {
  const { ref: headingRef, inView: headingInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>({ threshold: 0.1 })
  const { ref: parallax1Ref, offset: parallax1Offset } = useParallax({ speed: 0.2 })
  const { ref: parallax2Ref, offset: parallax2Offset } = useParallax({ speed: 0.25 })

  return (
    <section id="features" className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50/30 via-slate-50 to-blue-50/30">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20" />
      <div 
        ref={parallax1Ref as React.RefObject<HTMLDivElement>}
        className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-drift sm:blur-2xl md:blur-3xl sm:animate-none md:animate-drift" 
        style={{ transform: `translateY(${parallax1Offset}px)` }}
      />
      <div 
        ref={parallax2Ref as React.RefObject<HTMLDivElement>}
        className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-20 animate-drift sm:blur-2xl md:blur-3xl sm:animate-none md:animate-drift" 
        style={{ animationDelay: "1s", transform: `translateY(${parallax2Offset}px)` }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center space-y-4 mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-900 fade-in ${headingInView ? 'in-view' : ''}`}>
            Why Our AI Exam Browser Stands Apart
          </h2>
          <p className={`text-lg text-slate-600 max-w-2xl mx-auto fade-in stagger-1 ${headingInView ? 'in-view' : ''}`}>
            Cutting-edge technology meets educational integrity
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const staggerClass = `stagger-${Math.min(index + 1, 6)}`
            return (
              <div
                key={index}
                className={`glass-prism-lg rounded-2xl p-6 transition-all duration-500 group cursor-pointer hover-lift hover-glow-blue border border-white/20 hover:border-white/40 scale-in ${staggerClass} ${gridInView ? 'in-view' : ''} hover:rotate-1`}
              >
                {/* Icon container with enhanced glow */}
                <div className="mb-4 inline-block p-3 bg-gradient-to-br from-primary/40 via-accent/30 to-secondary/40 rounded-xl hover-scale-105 transition-transform duration-300">
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
