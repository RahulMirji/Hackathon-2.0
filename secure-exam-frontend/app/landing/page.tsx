"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesGrid } from "@/components/landing/features-grid"
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
      <AboutSectionRedesigned />
      <HackathonSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
