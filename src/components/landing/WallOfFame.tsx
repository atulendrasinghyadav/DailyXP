"use client"

import { motion } from "framer-motion"

const fakeUsers = [
  { name: "Alex M.", level: 42, streak: 365, avatar: "AM" },
  { name: "Sarah K.", level: 38, streak: 210, avatar: "SK" },
  { name: "David J.", level: 55, streak: 500, avatar: "DJ" },
  { name: "Emily R.", level: 29, streak: 120, avatar: "ER" },
  { name: "Michael B.", level: 61, streak: 730, avatar: "MB" },
  { name: "Chloe T.", level: 45, streak: 400, avatar: "CT" },
]

export default function WallOfFame() {
  // Duplicate for seamless infinite scroll
  const marqueeUsers = [...fakeUsers, ...fakeUsers, ...fakeUsers]

  return (
    <section id="wall-of-fame" className="py-32 overflow-hidden relative">
      <div className="text-center mb-16 px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Wall of Fame</h2>
        <p className="text-zinc-400 text-lg">Join thousands of others building unbreakable streaks.</p>
      </div>

      <div className="relative w-full flex items-center">
        {/* Fade Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10" />

        {/* Marquee Track */}
        <div className="flex gap-6 animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] px-6">
          {marqueeUsers.map((user, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 w-72 liquid-glass rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center font-bold text-white shadow-lg">
                  {user.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{user.name}</h4>
                  <p className="text-sm text-brand-primary font-medium">Lvl {user.level} Tracker</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-2xl">🔥</span>
                <span className="font-bold text-xl">{user.streak} Day Streak</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
