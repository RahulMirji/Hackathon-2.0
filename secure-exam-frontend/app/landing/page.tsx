"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesGrid } from "@/components/landing/features-grid"
import { WorkflowSection } from "@/components/landing/workflow-section"
import { MonitoringPreview } from "@/components/landing/monitoring-preview"
import { HackathonSection } from "@/components/landing/hackathon-section"
import { ContactSection } from "@/components/landing/contact-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <WorkflowSection />
      <MonitoringPreview />
      <HackathonSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
