"use client"

import React, { useState, useMemo } from "react"
import { 
  format, 
  eachDayOfInterval, 
  eachWeekOfInterval, 
  startOfWeek, 
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear
} from "date-fns"
import { Habit, UI_DailyLog, ViewType } from "@/types/dashboard"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface ZoneCProps {
  habits: Habit[]
  logs: Record<string, UI_DailyLog>
  selectedDate: Date
}

export default function ZoneCChart({ habits, logs, selectedDate }: ZoneCProps) {
  const [view, setView] = useState<ViewType>("Weekly")

  const { data, labels } = useMemo(() => {
    let days: Date[]

    if (view === "Weekly") {
      const start = startOfWeek(selectedDate)
      const end = endOfWeek(selectedDate)
      days = eachDayOfInterval({ start, end })
      return {
        data: days.map(day => logs[format(day, "yyyy-MM-dd")]?.completedHabits.length || 0),
        labels: { first: format(start, "MMM d"), last: format(end, "MMM d") }
      }
    } else if (view === "Monthly") {
      const start = startOfMonth(selectedDate)
      const end = endOfMonth(selectedDate)
      days = eachDayOfInterval({ start, end })
      return {
        data: days.map(day => logs[format(day, "yyyy-MM-dd")]?.completedHabits.length || 0),
        labels: { first: format(start, "MMM d"), last: format(end, "MMM d") }
      }
    } else {
      const start = startOfYear(selectedDate)
      const end = endOfYear(selectedDate)
      const weeks = eachWeekOfInterval({ start, end })
      return {
        data: weeks.map(week => {
          const weekDays = eachDayOfInterval({ 
            start: startOfWeek(week), 
            end: endOfWeek(week) 
          })
          const completions = weekDays.map(d => logs[format(d, "yyyy-MM-dd")]?.completedHabits.length || 0)
          const sum = completions.reduce((a, b) => a + b, 0)
          return sum / 7
        }),
        labels: { first: format(start, "yyyy"), last: "Dec 31" }
      }
    }
  }, [view, logs, selectedDate])

  const maxHabits = habits.length || 5
  const chartHeight = 200
  const chartWidth = 800
  const padding = 40

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - padding * 2) + padding
    const y = chartHeight - (value / maxHabits) * (chartHeight - padding * 2) - padding
    return { x, y }
  })

  // Generate SVG path for a smooth curve
  const generatePath = (pts: { x: number, y: number }[]) => {
    if (pts.length < 2) return ""
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i]
      const next = pts[i + 1]
      const cp1x = curr.x + (next.x - curr.x) / 2
      const cp2x = next.x - (next.x - curr.x) / 2
      d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`
    }
    return d
  }

  const pathD = generatePath(points)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`

  const hasData = data.some(v => v > 0)

  // Compute average & max for stat badges
  const avg = data.length > 0 ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1) : "0"
  const peak = Math.max(...data)

  return (
    <section id="analytics" className="mt-8">
      <div className="dashboard-card p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-base font-bold text-zinc-50 drop-shadow-[0_0_10px_rgba(52,211,153,0.12)]">Daily Momentum</h3>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.7)]" />
                <span className="text-xs text-zinc-300 font-medium">Habits completed</span>
              </div>
              {hasData && (
                <>
                  <span className="text-[10px] text-zinc-600">|</span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    avg <span className="text-zinc-200 font-bold">{avg}</span>
                  </span>
                  <span className="text-[10px] text-zinc-600">|</span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    peak <span className="text-cyan-300 font-bold">{peak}</span>
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="inline-flex items-center bg-slate-800/70 border border-slate-500/40 rounded-xl p-1 relative self-start md:self-auto backdrop-blur-sm shadow-lg shadow-cyan-950/10">
            {["Weekly", "Monthly", "Yearly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as ViewType)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 relative z-10",
                  view === v ? "text-zinc-50" : "text-zinc-300 hover:text-zinc-50"
                )}
              >
                {v === "Weekly" ? "7D" : v === "Monthly" ? "30D" : "1Y"}
                {view === v && (
                  <motion.div
                    layoutId="activeChartTab"
                    className="absolute inset-0 bg-cyan-500/20 rounded-lg -z-10 border border-cyan-300/25 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-64 w-full">
          {!hasData && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <p className="text-sm text-zinc-300 font-medium bg-zinc-800/90 px-4 py-2.5 rounded-xl border border-zinc-700/60 backdrop-blur-sm shadow-lg shadow-black/20">
                Check in for a few more days to see your trend line
              </p>
            </div>
          )}
          
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className={cn(
              "w-full h-full overflow-visible transition-all duration-500",
              !hasData ? 'opacity-15 blur-[2px]' : 'opacity-100'
            )}
          >
            {/* Grid Lines — one per habit level */}
            {Array.from({ length: maxHabits }).map((_, i) => {
              const y = chartHeight - ((i + 1) / maxHabits) * (chartHeight - padding * 2) - padding
              return (
                  <line
                  key={i}
                  x1={padding}
                  y1={y}
                  x2={chartWidth - padding}
                  y2={y}
                  stroke="rgba(148, 163, 184, 0.28)"
                  strokeDasharray="4 4"
                />
              )
            })}



            <AnimatePresence mode="wait">
              <motion.g
                key={view}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Area under the line — more visible gradient */}
                <path d={areaD} fill="url(#emeraldGradientV2)" className="opacity-30" />
                
                {/* Glow line underneath for soft halo */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="opacity-15 blur-[4px]"
                />

                {/* The actual line */}
                <path 
                  d={pathD} 
                  fill="none" 
                  stroke="#22d3ee" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Data points */}
                {points.map((point, i) => (
                  data[i] > 0 && (
                    <g key={i}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill="#070b16"
                        stroke="#67e8f9"
                        strokeWidth="2"
                      />
                    </g>
                  )
                ))}
              </motion.g>
            </AnimatePresence>

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="emeraldGradientV2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* X-axis labels */}
            <text x={padding} y={chartHeight - 10} fontSize="12" fill="#cbd5e1" fontWeight="bold" fontFamily="monospace">{labels.first}</text>
            <text x={chartWidth - padding} y={chartHeight - 10} fontSize="12" fill="#cbd5e1" fontWeight="bold" textAnchor="end" fontFamily="monospace">{labels.last}</text>
          </svg>
        </div>
      </div>
    </section>
  )
}
