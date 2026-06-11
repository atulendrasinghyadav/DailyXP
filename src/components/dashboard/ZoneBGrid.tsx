"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isToday,
  subDays,
  startOfYear,
  endOfYear,
  eachWeekOfInterval,
  isSameMonth,
  eachMonthOfInterval,
  differenceInCalendarWeeks
} from "date-fns"
import { Habit, UI_DailyLog, ViewType } from "@/types/dashboard"
import { cn } from "@/lib/utils"
import { habitColors } from "./ZoneACheckIn"

interface ZoneBProps {
  habits: Habit[]
  logs: Record<string, UI_DailyLog>
  selectedDate: Date
}

export default function ZoneBGrid({ habits, logs, selectedDate }: ZoneBProps) {
  const [view, setView] = useState<ViewType>("Weekly")

  return (
    <section id="streak" className="mt-2">
      {/* B.1 View Segmented Control */}
      <div className="flex items-center justify-center mb-6">
        <div className="inline-flex items-center bg-slate-800/70 border border-slate-500/40 rounded-xl p-1 relative backdrop-blur-sm shadow-lg shadow-cyan-950/10">
          {["Weekly", "Monthly", "Yearly"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as ViewType)}
              className={cn(
                "px-5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 relative z-10",
                view === v ? "text-zinc-50" : "text-zinc-300 hover:text-zinc-50"
              )}
            >
              {v}
              {view === v && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-cyan-500/20 rounded-lg -z-10 shadow-sm border border-cyan-300/25"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* B.2 Grid Content */}
      <div className="dashboard-card p-5 md:p-6 min-h-[120px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === "Weekly" && <WeeklyView habits={habits} logs={logs} selectedDate={selectedDate} />}
            {view === "Monthly" && <MonthlyView habits={habits} logs={logs} selectedDate={selectedDate} />}
            {view === "Yearly" && <YearlyView habits={habits} logs={logs} selectedDate={selectedDate} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function WeeklyView({ habits, logs, selectedDate }: ZoneBProps) {
  const weekStart = startOfWeek(selectedDate)
  const weekEnd = endOfWeek(selectedDate)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]

  const weeklyColorMap: Record<string, { bg: string, border: string, dot: string, indicator: string }> = {
    emerald: { bg: "bg-emerald-500/35", border: "border-emerald-400/60", dot: "bg-emerald-200", indicator: "bg-emerald-500" },
    blue: { bg: "bg-blue-500/35", border: "border-blue-400/60", dot: "bg-blue-200", indicator: "bg-blue-500" },
    purple: { bg: "bg-purple-500/35", border: "border-purple-400/60", dot: "bg-purple-200", indicator: "bg-purple-500" },
    amber: { bg: "bg-amber-500/35", border: "border-amber-400/60", dot: "bg-amber-200", indicator: "bg-amber-500" },
    rose: { bg: "bg-rose-500/35", border: "border-rose-400/60", dot: "bg-rose-200", indicator: "bg-rose-500" },
    cyan: { bg: "bg-cyan-500/35", border: "border-cyan-400/60", dot: "bg-cyan-200", indicator: "bg-cyan-500" },
  }

  return (
    <div>
      <div className="grid grid-cols-[112px_1fr] gap-3 mb-3">
        <div />
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((name, i) => (
            <div
              key={i}
              className={cn(
                "text-[10px] font-mono uppercase text-center",
                isToday(weekDays[i]) ? "text-cyan-300 font-bold" : "text-zinc-300"
              )}
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {habits.map((habit) => {
          const colors = weeklyColorMap[habit.color] || weeklyColorMap.emerald
          return (
            <div key={habit.id} className="grid grid-cols-[112px_1fr] items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_6px_currentColor]", colors.indicator)} />
                <span className="text-sm text-zinc-100 font-medium truncate">{habit.name}</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const dateKey = format(day, "yyyy-MM-dd")
                  const isDone = logs[dateKey]?.completedHabits.includes(habit.id)
                  const isFut = day > new Date() && !isToday(day)

                  return (
                    <div
                      key={dateKey}
                      className={cn(
                        "aspect-square rounded-lg border transition-all relative",
                        isDone
                          ? `${colors.bg} ${colors.border} shadow-[inset_0_0_8px_rgba(255,255,255,0.08)]`
                          : "bg-slate-800/75 border-slate-500/35 hover:border-slate-300/45",
                        isFut && "opacity-25 cursor-not-allowed"
                      )}
                    >
                      {isDone && (
                        <div className={cn("w-2 h-2 rounded-full absolute top-1.5 right-1.5 shadow-[0_0_8px_currentColor]", colors.dot)} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MonthlyView({ habits, logs, selectedDate }: ZoneBProps) {
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map(name => (
          <div key={name} className="text-xs text-zinc-400 font-mono font-bold uppercase text-center">{name}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd")
          const log = logs[dateKey]
          const isCurrMonth = isSameMonth(day, selectedDate)
          const isT = isToday(day)

          return (
            <div
              key={dateKey}
              className={cn(
                "aspect-square rounded-xl border p-1.5 flex flex-col justify-between transition-all",
                isCurrMonth
                  ? "bg-slate-800/70 border-slate-500/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  : "opacity-10 pointer-events-none",
                isT && "ring-2 ring-cyan-300/35 bg-slate-800/80 border-cyan-300/25"
              )}
            >
              <span className={cn(
                "text-[10px] font-mono font-bold",
                isT ? "text-cyan-300" : "text-zinc-100"
              )}>{format(day, "d")}</span>
              <div className="flex flex-wrap gap-1 content-end">
                {habits.filter(h => log?.completedHabits.includes(h.id)).slice(0, 4).map(h => {
                  const colorObj = habitColors[h.color] || habitColors.emerald
                  return (
                    <div key={h.id} className={cn("w-1.5 h-1.5 rounded-full shadow-[0_0_4px_rgba(0,0,0,0.5)]", colorObj.bg)} />
                  )
                })}
                {(log?.completedHabits.length || 0) > 4 && (
                  <span className="text-[8px] text-cyan-100/70 font-bold">+{log!.completedHabits.length - 4}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function YearlyView({ habits, logs, selectedDate }: ZoneBProps) {
  const yearStart = startOfYear(selectedDate)
  const yearEnd = endOfYear(selectedDate)
  const yearGridStart = startOfWeek(yearStart)
  const weeks = eachWeekOfInterval({ start: yearStart, end: yearEnd })
  const [filterHabit, setFilterHabit] = useState<string>("all")
  const monthLabels = eachMonthOfInterval({ start: yearStart, end: yearEnd }).map((monthDate) => ({
    label: format(monthDate, "MMM"),
    weekIndex: Math.max(
      0,
      differenceInCalendarWeeks(startOfMonth(monthDate), yearGridStart)
    ),
  }))
  const cellSizePx = 13
  const weekGapPx = 4
  const dayGapPx = 2
  const heatmapWidthPx = weeks.length * cellSizePx + Math.max(0, weeks.length - 1) * weekGapPx

  return (
    <div className="inline-flex min-w-full flex-col items-start gap-3 pb-4">
      <div className="flex flex-col gap-3 min-w-full sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[11px] font-mono font-bold text-zinc-400">
          Year heatmap
        </div>
        <select
          value={filterHabit}
          onChange={e => setFilterHabit(e.target.value)}
          className="bg-zinc-800/80 border border-zinc-600/50 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-medium focus:outline-none focus:ring-1 focus:ring-brand-primary/50 transition-colors"
        >
          <option value="all">All Habits (Combined)</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      <div className="relative inline-flex w-fit max-w-full flex-col items-start pt-4">
        <div
          className="grid h-4 shrink-0"
          style={{
            width: `${heatmapWidthPx}px`,
            gridTemplateColumns: `repeat(${weeks.length}, ${cellSizePx}px)`,
            columnGap: `${weekGapPx}px`,
          }}
        >
          {monthLabels.map((month) => (
            <span
              key={month.label}
              className="col-start-1 text-[10px] font-mono font-bold tracking-wide text-cyan-100/75 whitespace-nowrap"
              style={{
                gridColumnStart: month.weekIndex + 1,
              }}
            >
              {month.label}
            </span>
          ))}
        </div>

        <div
          className="inline-flex w-fit gap-px"
          style={{ width: `${heatmapWidthPx}px` }}
        >
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="flex flex-col" style={{ gap: `${dayGapPx}px` }}>
              {Array.from({ length: 7 }).map((_, dIndex) => {
                const day = subDays(week, -dIndex)
                if (day < yearStart || day > yearEnd) {
                  return <div key={dIndex} className="w-[13px] h-[13px]" />
                }

                const dateKey = format(day, "yyyy-MM-dd")
                const log = logs[dateKey]

                let color = "bg-zinc-800/60"
                if (filterHabit === "all") {
                  const count = log?.completedHabits.length || 0
                  if (count === 1) color = "bg-emerald-900/50"
                  else if (count === 2) color = "bg-emerald-700/60"
                  else if (count === 3) color = "bg-emerald-600/80"
                  else if (count >= 4) color = "bg-emerald-500"
                } else {
                  const isDone = log?.completedHabits.includes(filterHabit)
                  if (isDone) {
                    const habit = habits.find(h => h.id === filterHabit)
                    const colorObj = habitColors[habit?.color || 'emerald'] || habitColors.emerald
                    color = colorObj.bg
                  }
                }

                return (
                  <div
                    key={dIndex}
                    className={cn(
                      "w-[14px] h-[14px] rounded-sm transition-colors border border-transparent m-[1px]",
                      color,
                      color === "bg-zinc-800/60" && "border-zinc-700/30"
                    )}
                    title={`${format(day, "MMM d, yyyy")}: ${log?.completedHabits.length || 0} habits`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
