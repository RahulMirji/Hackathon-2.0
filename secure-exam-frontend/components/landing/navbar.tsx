"use client"

import { Home, Info, Sparkles, Trophy, Mail, Globe } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { AuthButton } from "@/components/auth/auth-button"

export function Navbar() {
  const navItems = [
    { name: "Home", url: "#home", icon: Home },
    { name: "Features", url: "#features", icon: Sparkles },
    { name: "About Us", url: "#about", icon: Info },
    { name: "Hackathon", url: "#hackathon", icon: Trophy },
    { name: "Contact", url: "#contact", icon: Mail },
  ]

  return (
    <div className="w-full flex justify-center items-center">
      <div className="fixed top-6 left-12 md:left-24 lg:left-32 xl:left-40 z-50 flex items-center gap-2 bg-background/5 border border-border backdrop-blur-lg px-6 py-2.5 rounded-full shadow-lg">
        <Globe className="w-5 h-5 text-primary" strokeWidth={2.5} />
        <span className="hidden md:inline font-bold text-sm text-foreground">
          Nxt Gen Browser
        </span>
      </div>
      <NavBar items={navItems} />
      <div className="fixed top-6 right-6 z-50">
        <AuthButton />
      </div>
    </div>
  )
}
