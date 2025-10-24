"use client"

import { AboutSection } from "@/components/landing/about-section"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <AboutSection />
            <Footer />
        </main>
    )
}
