"use client"

import React, { useState, useEffect } from "react"
import { useDashboardData } from "@/hooks/useDashboardData"
import ZoneACheckIn from "./ZoneACheckIn"
import ZoneBGrid from "./ZoneBGrid"
import ZoneCChart from "./ZoneCChart"
import ZoneDNotepad from "./ZoneDNotepad"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function DashboardShell() {
  const { habits, logs, loading, toggleHabit, updateNote, createHabit } = useDashboardData()
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Dynamic Glow State
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring physics for smooth movement
  const springX = useSpring(mouseX, { damping: 50, stiffness: 200 })
  const springY = useSpring(mouseY, { damping: 50, stiffness: 200 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-brand-primary/30 border-t-brand-primary rounded-full animate-spin" />
          <span className="text-sm text-zinc-400 font-medium animate-pulse">Loading your dashboard…</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Ambient Glow Background — softened to not overwhelm card surfaces */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#070b16]">
        {/* Mouse-following glow — reduced opacity for readability */}
        <motion.div 
          className="absolute w-[560px] h-[560px] bg-cyan-400/12 blur-[140px] rounded-full"
          style={{
            x: springX,
            y: springY,
            translateX: "-50%",
            translateY: "-50%",
          }}
        />
        {/* Static ambient orbs — subtle environment lighting */}
        <div className="absolute top-[-10%] right-[-5%] w-[620px] h-[620px] bg-emerald-400/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[560px] h-[560px] bg-cyan-500/12 blur-[160px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[860px] h-[860px] bg-sky-500/8 blur-[220px] rounded-full" />
      </div>
      
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6 relative z-10">
        <ZoneACheckIn 
          habits={habits} 
          logs={logs} 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
          onToggleHabit={toggleHabit}
          onCreateHabit={createHabit}
        />
        
        <ZoneBGrid 
          habits={habits} 
          logs={logs} 
          selectedDate={selectedDate} 
        />
        
        <ZoneCChart 
          habits={habits} 
          logs={logs} 
          selectedDate={selectedDate}
        />
        
        <ZoneDNotepad 
          logs={logs} 
          selectedDate={selectedDate} 
          onUpdateNote={updateNote}
        />
      </div>
    </>
  )
}
