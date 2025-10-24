"use client"

import { Home, Info, Sparkles, Trophy, Mail } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

export function Navbar() {
  const navItems = [
    { name: "Home", url: "/landing", icon: Home },
    { name: "About", url: "/about", icon: Info },
    { name: "Features", url: "/landing#features", icon: Sparkles },
    { name: "Hackathon", url: "/landing#hackathon", icon: Trophy },
    { name: "Contact", url: "/landing#contact", icon: Mail },
  ]

  return <NavBar items={navItems} />
}
