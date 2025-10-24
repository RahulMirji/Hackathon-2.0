"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

export function HackathonSection() {
  const { ref: sectionRef, inView: sectionInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const [activeWordIndex, setActiveWordIndex] = useState(0)

  // Words that will be highlighted in sequence
  const sentence1Words = ["Secure", "online", "exams", "with", "AI."]
  const sentence2Words = ["Real-time", "proctoring", "and", "integrity", "verification."]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % sentence2Words.length)
    }, 800) // Change highlighted word every 800ms

    return () => clearInterval(interval)
  }, [sentence2Words.length])

  return (
    <section id="hackathon" className="relative py-32 px-4 overflow-hidden bg-gradient-to-br from-blue-50/30 via-slate-50 to-blue-50/30">
      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={sectionRef} className="space-y-16">
          {/* Animated Headline */}
          <div className="space-y-8">
            {/* Small intro text */}
            <p className={`text-base md:text-lg text-slate-900 font-medium fade-in ${sectionInView ? 'in-view' : ''}`}>
              Built for AI Verse 2.0
            </p>

            {/* Large animated text - First sentence (light gray) */}
            <div className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight fade-in stagger-1 ${sectionInView ? 'in-view' : ''}`}>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-slate-300">
                {sentence1Words.map((word, index) => (
                  <span key={`s1-${index}`} className="inline-block">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Large animated text - Second sentence (with animation) */}
            <div className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight fade-in stagger-2 ${sectionInView ? 'in-view' : ''}`}>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {sentence2Words.map((word, index) => (
                  <span
                    key={`s2-${index}`}
                    className={`inline-block transition-all duration-500 ${index === activeWordIndex
                      ? "text-slate-900"
                      : "text-slate-300"
                      }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Description text */}
            <p className={`text-lg md:text-xl text-slate-600 max-w-4xl leading-relaxed fade-in stagger-3 ${sectionInView ? 'in-view' : ''}`}>
              An innovative AI-powered examination system designed to revolutionize online testing with real-time
              proctoring, identity verification, and intelligent integrity scoring.
            </p>
          </div>

          {/* CTA Button */}
          <div className={`fade-in stagger-4 ${sectionInView ? 'in-view' : ''}`}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white gap-2 transition-all duration-300 hover-scale-105 shadow-xl hover:shadow-2xl rounded-2xl px-8 py-6 text-base font-semibold"
            >
              <Github size={20} />
              Try Demo Exam
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
