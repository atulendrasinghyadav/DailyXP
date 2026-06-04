"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { logOut } from "@/lib/firebase/auth"
import { User, LogOut, UserCircle, Settings, ChevronDown, CheckCircle2, Flame, BarChart3, StickyNote, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardNavBar() {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems = [
    { label: "Habits", icon: <CheckCircle2 size={16} />, href: "#habits" },
    { label: "Streak", icon: <Flame size={16} />, href: "#streak" },
    { label: "Analytics", icon: <BarChart3 size={16} />, href: "#analytics" },
    { label: "Notes", icon: <StickyNote size={16} />, href: "#notes" },
  ]

  return (
    <motion.header
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-zinc-900/85 backdrop-blur-2xl border border-zinc-700/50 flex items-center justify-between gap-8 min-w-[320px] md:min-w-[650px] shadow-2xl shadow-black/30"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Link href="/" className="font-bold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 shrink-0 ml-2">
        DailyXP
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link 
            key={item.label} 
            href={item.href}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-zinc-300 hover:text-zinc-50 hover:bg-white/8 transition-all text-sm font-bold tracking-tight"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-600/50 hover:border-zinc-500/60 transition-all active:scale-95"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.displayName?.[0] || <User size={16} />
            )}
          </div>
          <span className="text-sm font-semibold text-zinc-100 hidden sm:inline-block max-w-[100px] truncate">
            {user?.displayName?.split(" ")[0] || "Player"}
          </span>
          <ChevronDown size={14} className={cn("text-zinc-400 transition-transform duration-300", isMenuOpen && "rotate-180")} />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-56 rounded-2xl bg-zinc-900/95 border border-zinc-700/60 p-2 shadow-2xl shadow-black/40 z-[60] backdrop-blur-xl"
            >
              <div className="px-3 py-2 mb-2 border-b border-zinc-700/40">
                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-0.5">Account</p>
                <p className="text-xs text-zinc-300 truncate font-medium">{user?.email}</p>
              </div>
              
              <Link href="/profile" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:bg-white/6 hover:text-white transition-all group">
                <UserCircle size={18} className="text-zinc-400 group-hover:text-blue-400" />
                View Profile
              </Link>
              
              <Link href="/wall-of-fame" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-200 hover:bg-white/6 hover:text-white transition-all group">
                <Trophy size={18} className="text-zinc-400 group-hover:text-amber-400" />
                Wall of Fame
              </Link>
              
              <div className="h-px bg-zinc-700/40 my-2 mx-2" />
              
              <button 
                onClick={() => logOut()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all group"
              >
                <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                Log out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
