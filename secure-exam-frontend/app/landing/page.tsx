"use client"

import dynamic from "next/dynamic"
import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"

// Lazy load heavy components that appear below the fold
const FeaturesGrid = dynamic(() => import("@/components/landing/features-grid").then(m => ({ default: m.FeaturesGrid })), {
  loading: () => null,
  ssr: true,
})

const AboutSectionRedesigned = dynamic(() => import("@/components/landing/about-section-redesigned").then(m => ({ default: m.AboutSectionRedesigned })), {
  loading: () => null,
  ssr: true,
})

const HackathonSection = dynamic(() => import("@/components/landing/hackathon-section").then(m => ({ default: m.HackathonSection })), {
  loading: () => null,
  ssr: true,
})

const ContactSection = dynamic(() => import("@/components/landing/contact-section").then(m => ({ default: m.ContactSection })), {
  loading: () => null,
  ssr: true,
})

const Footer = dynamic(() => import("@/components/landing/footer").then(m => ({ default: m.Footer })), {
  loading: () => null,
  ssr: true,
})

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
