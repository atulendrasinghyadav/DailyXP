"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 mix-blend-screen" />
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-brand-secondary/20 blur-[100px] rounded-full pointer-events-none opacity-40 mix-blend-screen" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)] opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full liquid-glass text-xs font-medium text-brand-primary mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
          Level up your daily habits
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Turn Your Life Into a <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
            Masterpiece.
          </span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          DailyXP transforms your routines into a game. Build streaks, earn XP, and unlock your potential with the most satisfying habit tracker ever built.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <button className="group relative px-8 py-4 bg-white text-black font-bold rounded-full text-lg flex items-center gap-2 hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full border border-white/50 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
          </button>
          
          <button className="px-8 py-4 liquid-glass font-medium rounded-full text-lg hover:bg-white/10 transition-colors">
            See the Leaderboard
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-widest text-zinc-500">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
      </motion.div>
    </section>
  )
}
