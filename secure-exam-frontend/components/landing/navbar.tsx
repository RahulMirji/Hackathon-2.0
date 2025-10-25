"use client"

import { Home, Info, Sparkles, Trophy, Mail } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { AuthButton } from "@/components/auth/auth-button"

export function Navbar() {
  const navItems = [
    { name: "Home", url: "/landing", icon: Home },
    { name: "About", url: "/about", icon: Info },
    { name: "Features", url: "/landing#features", icon: Sparkles },
    { name: "Hackathon", url: "/landing#hackathon", icon: Trophy },
    { name: "Contact", url: "/landing#contact", icon: Mail },
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
