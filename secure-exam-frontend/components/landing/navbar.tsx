"use client"

import { Home, Info, Sparkles, Trophy, Mail } from "lucide-react"
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
      <NavBar items={navItems} />
      <div className="fixed top-6 right-6 z-50">
        <AuthButton />
      </div>
    </div>
  )
}
