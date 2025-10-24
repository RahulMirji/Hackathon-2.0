"use client"

import { Home, Sparkles, Trophy, Mail } from "lucide-react"
import { NavBar } from "@/components/ui/tubelight-navbar"

export function Navbar() {
  const navItems = [
    { name: "Home", url: "#home", icon: Home },
    { name: "Features", url: "#features", icon: Sparkles },
    { name: "Hackathon", url: "#hackathon", icon: Trophy },
    { name: "Contact", url: "#contact", icon: Mail },
  ]

  return <NavBar items={navItems} />
}
