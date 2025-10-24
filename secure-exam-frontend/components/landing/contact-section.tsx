"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mail, Send, Shield, Brain, Activity, Lock } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { useParallax } from "@/hooks/use-parallax"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const { ref: headingRef, inView: headingInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: formRef, inView: formInView } = useInView<HTMLDivElement>({ threshold: 0.2 })
  const { ref: parallax1Ref, offset: parallax1Offset } = useParallax({ speed: 0.15 })
  const { ref: parallax2Ref, offset: parallax2Offset } = useParallax({ speed: 0.2 })
  const { ref: parallax3Ref, offset: parallax3Offset } = useParallax({ speed: 0.1 })
  const { ref: parallax4Ref, offset: parallax4Offset } = useParallax({ speed: 0.18 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <section id="contact" className="relative py-32 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50/50">
      {/* Submerged floating icon cards in background */}
      <div 
        ref={parallax1Ref as React.RefObject<HTMLDivElement>}
        className="absolute top-20 right-[15%] w-24 h-24 bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center rotate-12 animate-drift opacity-60"
        style={{ transform: `translateY(${parallax1Offset}px) rotate(12deg)` }}
      >
        <Shield size={40} className="text-blue-400/60" />
      </div>

      <div 
        ref={parallax2Ref as React.RefObject<HTMLDivElement>}
        className="absolute bottom-32 left-[10%] w-28 h-28 bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center -rotate-6 animate-drift opacity-60"
        style={{ animationDelay: "1s", transform: `translateY(${parallax2Offset}px) rotate(-6deg)` }}
      >
        <Brain size={44} className="text-cyan-400/60" />
      </div>

      <div 
        ref={parallax3Ref as React.RefObject<HTMLDivElement>}
        className="absolute top-40 left-[20%] w-20 h-20 bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center rotate-[-15deg] animate-drift opacity-60"
        style={{ animationDelay: "2s", transform: `translateY(${parallax3Offset}px) rotate(-15deg)` }}
      >
        <Activity size={36} className="text-blue-400/60" />
      </div>

      <div 
        ref={parallax4Ref as React.RefObject<HTMLDivElement>}
        className="absolute bottom-20 right-[20%] w-24 h-24 bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center rotate-6 animate-drift opacity-60"
        style={{ animationDelay: "1.5s", transform: `translateY(${parallax4Offset}px) rotate(6deg)` }}
      >
        <Lock size={40} className="text-cyan-400/60" />
      </div>

      {/* Additional subtle background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-3xl opacity-40" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div ref={headingRef} className="text-center space-y-6 mb-16">
          <h2 className={`text-5xl md:text-6xl font-bold text-slate-900 fade-in ${headingInView ? 'in-view' : ''}`}>
            Get Started with AI Exam Browser
          </h2>
          <p className={`text-xl text-slate-600 max-w-2xl mx-auto fade-in stagger-1 ${headingInView ? 'in-view' : ''}`}>
            Experience the future of secure online examinations. Try our demo today.
          </p>
        </div>

        <div ref={formRef} className={`scale-in stagger-1 ${formInView ? 'in-view' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`slide-up stagger-2 ${formInView ? 'in-view' : ''}`}>
              <label className="block text-sm font-semibold mb-3 text-slate-900">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 border-0 bg-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/80 focus:bg-white/90 shadow-lg hover:shadow-xl"
                placeholder="John Doe"
              />
            </div>

            <div className={`slide-up stagger-3 ${formInView ? 'in-view' : ''}`}>
              <label className="block text-sm font-semibold mb-3 text-slate-900">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 border-0 bg-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/80 focus:bg-white/90 shadow-lg hover:shadow-xl"
                placeholder="john@example.com"
              />
            </div>

            <div className={`slide-up stagger-4 ${formInView ? 'in-view' : ''}`}>
              <label className="block text-sm font-semibold mb-3 text-slate-900">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 resize-none h-36 border-0 bg-white/70 backdrop-blur-md transition-all duration-300 hover:bg-white/80 focus:bg-white/90 shadow-lg hover:shadow-xl"
                placeholder="Tell us about your requirements..."
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className={`w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white gap-2 transition-all duration-300 hover-scale-105 shadow-xl hover:shadow-2xl rounded-2xl py-6 text-base font-semibold slide-up stagger-4 ${formInView ? 'in-view' : ''}`}
            >
              <Send size={20} />
              Send Message
            </Button>
          </form>

          <div className={`mt-10 pt-8 flex flex-col sm:flex-row gap-6 justify-center items-center fade-in stagger-5 ${formInView ? 'in-view' : ''}`}>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail size={20} className="text-blue-600" />
              <a
                href="mailto:team@aiverse.dev"
                className="text-slate-700 hover:text-blue-600 transition-colors duration-300 font-medium"
              >
                team@aiverse.dev
              </a>
            </div>
            <div className="hidden sm:block w-px h-6 bg-slate-300/50" />
            <p className="text-sm text-slate-600">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
