"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export function Footer() {
  const router = useRouter()

  const footerSections = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#features" },
        { label: "AI Proctoring", href: "#features" },
        { label: "Security", href: "#features" },
      ],
    },
    {
      title: "Platform",
      links: [
        { label: "Exam Browser", href: "/exam/compatibility-check" },
        { label: "Dashboard", href: "/exam/compatibility-check" },
        { label: "Reports", href: "/exam/compatibility-check" },
        { label: "Integration", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#features" },
        { label: "Hackathon", href: "#hackathon" },
        { label: "GitHub", href: "#" },
        { label: "Support", href: "#contact" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#home" },
        { label: "Contact", href: "#contact" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Data Processing", href: "#" },
        { label: "Cookie Policy", href: "#" },
      ],
    },
  ]

  return (
    <footer className="relative border-t border-slate-200 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo Section */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-500 flex items-center justify-center transition-all duration-300 hover-scale-105">
                <span className="text-lg font-bold text-white">AI</span>
              </div>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              AI Exam Browser
            </p>
          </div>

          {/* Footer Columns */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-slate-900 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </span>
          </div>
          <p className="text-sm text-slate-600">
            © 2025 AI Verse Team – Built for AI Verse 2.0 Hackathon
          </p>
        </div>
      </div>
    </footer>
  )
}
