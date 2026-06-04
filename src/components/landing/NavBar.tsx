"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { logOut } from "@/lib/firebase/auth"

export default function NavBar() {
  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, loading } = useAuth()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  })

  return (
    <motion.header
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center gap-8 transition-all duration-300"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        boxShadow: isScrolled 
          ? "0 10px 30px -10px rgba(0,0,0,0.5), inset 0 1px 0 0 rgba(255,255,255,0.1)" 
          : "inset 0 1px 0 0 rgba(255,255,255,0.1)",
      }}
    >
      <Link href="/" className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
        DailyXP
      </Link>
      
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300">
        <Link href="#how-to-use" className="hover:text-white transition-colors relative group">
          How it Works
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link href="#features" className="hover:text-white transition-colors relative group">
          Features
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link href="#wall-of-fame" className="hover:text-white transition-colors relative group">
          Wall of Fame
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
        </Link>
      </nav>

      <div className="flex items-center gap-4">
        {!loading && (
          <>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-zinc-300 hidden sm:inline-block">
                  Hi, {user.displayName?.split(" ")[0] || "Player"}
                </span>
                <button 
                  onClick={() => logOut()}
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Log out
                </button>
                <button className="px-4 py-2 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Dashboard
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link href="/signup">
                  <button className="px-4 py-2 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Start Tracking
                  </button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </motion.header>
  )
}
