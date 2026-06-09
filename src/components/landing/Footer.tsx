"use client"

import Link from "next/link"
import { Briefcase, Share2, GitBranch } from "lucide-react"

const NAV_LINKS = [
  { label: "How it Works", href: "#how-to-use" },
  { label: "Features", href: "#features" },
  { label: "Wall of Fame", href: "#wall-of-fame" },
  { label: "Privacy", href: "#" },
]

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/atulendra-singh-yadav/", icon: Share2 },
  { label: "GitHub", href: "https://github.com/atulendrasinghyadav", icon: GitBranch },
  { label: "Portfolio", href: "https://atulendrasinghyadavportfolio.vercel.app/", icon: Briefcase },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-[#070b16] py-12 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10">
          {/* Brand & Tagline */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="font-bold text-2xl tracking-tight text-text-primary">
                Daily<span className="text-brand-primary">XP</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm max-w-xs leading-relaxed">
              Level up your life, one quest at a time. The ultimate productivity RPG.
            </p>
          </div>

          {/* Optimized Navigation */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-text-muted hover:text-brand-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Social Icons Mapping */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:text-brand-primary hover:bg-white/10 hover:border-brand-primary/30 transition-all duration-300 border border-white/5"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
          <p>© {currentYear} DailyXP. All rights reserved.</p>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
            <span className="font-medium text-text-secondary/80">Systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
