"use client"

import { AboutSectionRedesigned } from "@/components/landing/about-section-redesigned"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <AboutSectionRedesigned />
            <Footer />
        </main>
    )
}
