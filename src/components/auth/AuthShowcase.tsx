"use client"

import { motion } from "framer-motion"

const items = [
  { title: "Track Habits", description: "Level up your life, one day at a time.", icon: "🔥" },
  { title: "Earn XP", description: "Gamify your growth with satisfying rewards.", icon: "✨" },
  { title: "Build Streaks", description: "Stay consistent and unlock your potential.", icon: "📈" },
]

export default function AuthShowcase() {
  return (
    <div className="space-y-12">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">Level Up?</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-sm mx-auto">
          Join thousands of players transforming their routines into epic quests.
        </p>
      </motion.div>

      <div className="space-y-6 text-left max-w-sm mx-auto">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="text-2xl">{item.icon}</div>
            <div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
