"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, LayoutGrid, Share2, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    title: "Frictionless Tracking",
    description: "One-tap daily check-ins. Create up to 5 habits with custom colors and track them effortlessly.",
    icon: CheckCircle2,
    className: "md:col-span-2 md:row-span-2 flex flex-col",
    visual: () => (
      <div className="flex-1 w-full flex flex-col justify-center items-center px-4 md:px-12 opacity-80 group-hover:opacity-100 transition-opacity duration-500 mt-8 mb-4">
        <div className="w-full flex items-end justify-between gap-1 md:gap-3 h-32 md:h-48 border-b border-zinc-800 pb-2">
          {[30, 50, 40, 70, 60, 90, 85, 100, 75, 95].map((h, i) => (
            <div key={i} className="flex-1 bg-zinc-800/30 rounded-t-md relative overflow-hidden group-hover:bg-zinc-800/60 transition-colors duration-300 flex items-end h-full">
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.05 + 0.2, type: "spring", bounce: 0.4 }}
                className="w-full bg-gradient-to-t from-brand-primary to-brand-secondary rounded-t-md"
              />
            </div>
          ))}
        </div>
        <div className="w-full flex justify-between mt-3 text-[10px] md:text-xs text-zinc-500 font-semibold uppercase tracking-widest">
          <span>Week 1</span>
          <span>Week 5</span>
          <span>Week 10</span>
        </div>
      </div>
    )
  },
  {
    title: "52-Week Grids",
    description: "Visualize your year at a glance with GitHub-style contribution heatmaps.",
    icon: LayoutGrid,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Streak Freezes",
    description: "Life happens. Use your weekly freeze to protect your hard-earned streaks.",
    icon: Shield,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Show Your Progress",
    description: "Get a public profile (/u/username) and auto-generated shareable cards for Instagram.",
    icon: Share2,
    className: "md:col-span-2 md:row-span-1",
    visual: () => (
      <motion.div 
        className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 w-72 bg-zinc-950/80 backdrop-blur-xl border border-zinc-800/80 p-5 rounded-2xl shadow-2xl rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 opacity-80 group-hover:opacity-100 z-20 flex-col gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-white shadow-lg">
            UX
          </div>
          <div>
            <div className="font-bold text-white">@dailyxper</div>
            <div className="text-xs text-brand-primary font-medium tracking-wide">Level 42</div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900 rounded-xl p-3 border border-zinc-800 shadow-inner">
          <span className="text-2xl drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">🔥</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Current Streak</span>
            <span className="font-black text-white leading-none text-lg">365 Days</span>
          </div>
        </div>
      </motion.div>
    )
  }
]

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon
  const [mousePos, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const Visual = feature.visual

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 p-8 overflow-hidden transition-all duration-500 flex flex-col",
        feature.className
      )}
    >
      {/* Decorative large background icon */}
      <Icon className="absolute -right-8 -bottom-8 w-48 h-48 text-zinc-800/20 group-hover:text-brand-primary/10 group-hover:rotate-12 transition-all duration-700 pointer-events-none z-0" />

      {/* Dynamic Cursor Highlight */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(20, 184, 166, 0.1), transparent 100%)`
        }}
      />

      {/* Persistent subtle glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      
      <div className="relative z-10 w-14 h-14 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex flex-shrink-0 items-center justify-center mb-auto group-hover:scale-110 group-hover:bg-brand-primary/20 group-hover:border-brand-primary/50 transition-all duration-500 shadow-lg shadow-black/50">
        <Icon className="w-7 h-7 text-zinc-400 group-hover:text-brand-primary transition-colors duration-500" />
      </div>

      {Visual && <Visual />}

      <div className={cn("relative z-10", !Visual && "mt-8", Visual && "mt-auto pt-6")}>
        <h3 className={cn("text-2xl font-bold mb-3 text-zinc-100 group-hover:text-white transition-colors relative z-10 w-full", feature.className.includes('col-span-2') ? "md:w-1/2" : "md:w-full")}>
          {feature.title}
        </h3>
        <p className={cn("text-zinc-400 leading-relaxed font-medium group-hover:text-zinc-300 transition-colors relative z-10 w-full", feature.className.includes('col-span-2') ? "md:w-1/2" : "md:w-full")}>
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function Features() {
  return (
    <section id="features" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="mb-20 text-center md:text-left">
        <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">Built for consistency.</h2>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl font-light">Everything you need to build lasting habits, wrapped in a beautiful, distraction-free interface.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>
    </section>
  )
}
