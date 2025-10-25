"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { MonitoringPreview } from "@/components/landing/monitoring-preview"
import { WorkflowSection } from "@/components/landing/workflow-section"
import { AboutSectionRedesigned } from "@/components/landing/about-section-redesigned"
import { HackathonSection } from "@/components/landing/hackathon-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <MonitoringPreview />
      <WorkflowSection />
      <AboutSectionRedesigned />
      <HackathonSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
