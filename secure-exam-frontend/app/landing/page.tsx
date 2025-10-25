"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { WorkflowSection } from "@/components/landing/workflow-section"
import { MonitoringPreview } from "@/components/landing/monitoring-preview"
import { AboutSectionRedesigned } from "@/components/landing/about-section-redesigned"
import { HackathonSection } from "@/components/landing/hackathon-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>
      <div id="features">
        <FeaturesGrid />
        <WorkflowSection />
        <MonitoringPreview />
      </div>
      <div id="about">
        <AboutSectionRedesigned />
      </div>
      <div id="hackathon">
        <HackathonSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
      <Footer />
    </main>
  )
}
