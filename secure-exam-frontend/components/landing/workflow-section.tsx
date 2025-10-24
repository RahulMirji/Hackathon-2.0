"use client"

import { useInView } from "@/hooks/use-in-view"
import { useParallax } from "@/hooks/use-parallax"

const steps = [
  {
    number: 1,
    title: "Compatibility Check",
    description: "Verifies device, camera, microphone, and internet connection",
  },
  {
    number: 2,
    title: "ID Verification",
    description: "Captures selfie and government-issued ID",
  },
  {
    number: 3,
    title: "Policy Agreement",
    description: "Gets student consent for monitoring and recording",
  },
  {
    number: 4,
    title: "Exam Environment",
    description: "Launches secured browser with AI monitoring",
  },
  {
    number: 5,
    title: "AI Monitoring",
    description: "Tracks focus, face detection, and alerts in real-time",
  },
  {
    number: 6,
    title: "Results Report",
    description: "Generates integrity and score report with PDF export",
  },
]

export function WorkflowSection() {
  const { ref: headingRef, inView: headingInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: gridRef, inView: gridInView } = useInView<HTMLDivElement>({ threshold: 0.1 })
  const { ref: parallax1Ref, offset: parallax1Offset } = useParallax({ speed: 0.2 })
  const { ref: parallax2Ref, offset: parallax2Offset } = useParallax({ speed: 0.25 })

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-blue-50/30 via-slate-50 to-blue-50/30">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-cyan-50/20" />
      <div
        ref={parallax1Ref as React.RefObject<HTMLDivElement>}
        className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 animate-drift sm:blur-2xl md:blur-3xl sm:animate-none md:animate-drift"
        style={{ transform: `translateY(${parallax1Offset}px)` }}
      />
      <div
        ref={parallax2Ref as React.RefObject<HTMLDivElement>}
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 animate-drift sm:blur-2xl md:blur-3xl sm:animate-none md:animate-drift"
        style={{ animationDelay: "1s", transform: `translateY(${parallax2Offset}px)` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center space-y-4 mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-slate-900 fade-in ${headingInView ? 'in-view' : ''}`}>
            How It Works
          </h2>
          <p className={`text-lg text-slate-600 max-w-2xl mx-auto fade-in stagger-1 ${headingInView ? 'in-view' : ''}`}>
            A seamless journey from verification to results
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const staggerClass = `stagger-${Math.min(index + 1, 6)}`
            return (
              <div key={index} className="relative">
                {/* Connector line with gradient and glow */}
                {index < steps.length - 1 && (
                  <div className={`hidden md:block absolute top-12 left-1/2 w-full h-1 bg-gradient-to-r from-primary/60 via-accent/40 to-transparent rounded-full animate-pulse-glow slide-in-right ${staggerClass} ${gridInView ? 'in-view' : ''}`} />
                )}

                {/* Step card with enhanced glass effects */}
                <div
                  className={`glass-prism-lg rounded-2xl p-6 relative z-10 hover-lift hover-glow-blue border border-white/20 hover:border-white/40 transition-all duration-500 group cursor-pointer hover:-rotate-1 slide-up ${staggerClass} ${gridInView ? 'in-view' : ''}`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center text-white font-bold hover-scale-105 transition-transform duration-300">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
