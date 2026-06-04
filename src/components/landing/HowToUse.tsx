"use client"

import { motion } from "framer-motion"
import { Target, CheckCircle2, Trophy } from "lucide-react"

const steps = [
  {
    icon: Target,
    title: "Define Your Quest",
    description: "Choose the habits you want to build. Set your daily targets and customize your goals."
  },
  {
    icon: CheckCircle2,
    title: "Track Daily",
    description: "Check off your completed habits. Watch your streak grow and feel the satisfaction of progress."
  },
  {
    icon: Trophy,
    title: "Level Up",
    description: "Earn XP for every completed habit. Unlock new levels and climb the global leaderboard."
  }
]

export default function HowToUse() {
  return (
    <section id="how-to-use" className="py-32 px-6 max-w-6xl mx-auto relative">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Your Path to Greatness</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Three simple steps to transform your daily routine into a rewarding adventure.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* Connecting line for desktop */}
        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />

        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full liquid-glass flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 group-hover:border-brand-primary/50 transition-all duration-500">
                <Icon className="w-10 h-10 text-brand-primary" />
                <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.description}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
