"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, isAfter, getDayOfYear } from "date-fns"
import { Plus, Check, ChevronLeft, ChevronRight, Edit3, Trash2 } from "lucide-react"
import { Habit, UI_DailyLog } from "@/types/dashboard"
import { cn } from "@/lib/utils"

export const habitColors: Record<string, { bg: string, border: string, shadow: string, text: string, glow: string }> = {
  emerald: { bg: "bg-emerald-500", border: "border-emerald-500", shadow: "shadow-emerald-500/25", text: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]" },
  blue: { bg: "bg-blue-500", border: "border-blue-500", shadow: "shadow-blue-500/25", text: "text-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]" },
  purple: { bg: "bg-purple-500", border: "border-purple-500", shadow: "shadow-purple-500/25", text: "text-purple-400", glow: "shadow-[0_0_20px_rgba(139,92,246,0.25)]" },
  amber: { bg: "bg-amber-500", border: "border-amber-500", shadow: "shadow-amber-500/25", text: "text-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]" },
  rose: { bg: "bg-rose-500", border: "border-rose-500", shadow: "shadow-rose-500/25", text: "text-rose-400", glow: "shadow-[0_0_20px_rgba(244,63,94,0.25)]" },
  cyan: { bg: "bg-cyan-500", border: "border-cyan-500", shadow: "shadow-cyan-500/25", text: "text-cyan-400", glow: "shadow-[0_0_20px_rgba(6,182,212,0.25)]" },
}

interface ZoneAProps {
  habits: Habit[]
  logs: Record<string, UI_DailyLog>
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onToggleHabit: (habitId: string, date: Date) => void
  onCreateHabit: (name: string, color: string) => void
  onUpdateHabit: (habitId: string, name: string, color: string) => void
  onDeleteHabit: (habitId: string) => void
}

export default function ZoneACheckIn({ 
  habits, 
  logs, 
  selectedDate, 
  onDateSelect, 
  onToggleHabit,
  onCreateHabit,
  onUpdateHabit,
  onDeleteHabit
}: ZoneAProps) {
  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const currentLog = logs[dateStr]
  const allDone = habits.length > 0 && habits.every(h => currentLog?.completedHabits.includes(h.id))
  const isFutureSelected = isAfter(selectedDate, new Date()) && !isToday(selectedDate)
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)

  // Generate days for the spine (current month)
  const monthStart = startOfMonth(selectedDate)
  const monthEnd = endOfMonth(selectedDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const spineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scroll today into view on mount
    if (spineRef.current) {
      const todayEl = spineRef.current.querySelector(".is-today")
      if (todayEl) {
        todayEl.scrollIntoView({ behavior: "smooth", inline: "center" })
      }
    }
  }, [])

  // Count completed habits for the progress indicator
  const completedCount = currentLog?.completedHabits.filter(id => habits.some(h => h.id === id)).length || 0

  return (
    <section id="habits" className="pt-24 pb-6">
      {/* A.1 Header Bar */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-zinc-50 tracking-tight drop-shadow-[0_0_14px_rgba(125,211,252,0.15)]">
              {format(selectedDate, "EEEE, MMMM d")}
            </h2>
            <AnimatePresence>
              {allDone && (
                <motion.span 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-[0_0_16px_rgba(16,185,129,0.2)]"
                >
                  ✓ All Clear
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-zinc-300 font-medium">
              Week {format(selectedDate, "w")} · Day {getDayOfYear(selectedDate)} of the year
            </p>
            {habits.length > 0 && (
              <span className="text-xs font-mono text-cyan-200 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-400/20">
                {completedCount}/{habits.length} done
              </span>
            )}
          </div>
        </div>

        {habits.length > 0 && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="group flex items-center gap-2 bg-slate-800/85 hover:bg-slate-700/85 border border-slate-500/50 hover:border-cyan-300/40 text-zinc-50 text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-950/20"
          >
            <Plus className="w-4 h-4 text-cyan-200 group-hover:text-cyan-50 transition-colors" />
            Add Habit
          </button>
        )}
      </div>

      {/* A.2 Habit Toggle Row */}
      {habits.length === 0 ? (
        <div className="h-56 rounded-2xl border border-dashed border-cyan-400/30 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center relative overflow-hidden shadow-xl shadow-cyan-950/20">
          {/* Ghost Grid Background */}
          <div className="absolute inset-0 z-0 grid grid-cols-7 gap-2 p-8 opacity-25 pointer-events-none blur-[1px]">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-sm bg-cyan-300/20" />
            ))}
          </div>
          
          <button 
            onClick={() => setShowAddModal(true)}
            className="relative z-10 w-16 h-16 rounded-full bg-cyan-500/20 hover:bg-cyan-400/25 border border-cyan-300/35 flex items-center justify-center transition-all duration-300 hover:scale-110 group shadow-lg shadow-cyan-500/10"
          >
            <Plus className="w-7 h-7 text-cyan-50 group-hover:text-white" />
          </button>
          <p className="text-sm text-zinc-100 mt-4 font-bold relative z-10">Add your first habit</p>
          <p className="text-xs text-cyan-100/70 mt-1 relative z-10 font-medium">Build the grid one day at a time</p>
        </div>
      ) : (
        <div className="flex items-start gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {habits.map((habit) => {
            const isChecked = currentLog?.completedHabits.includes(habit.id)
            const colorObj = habitColors[habit.color] || habitColors.emerald
            const colorClass = colorObj.bg
            const borderClass = colorObj.border
            const shadowClass = colorObj.shadow
            const glowClass = colorObj.glow
            
            return (
              <div key={habit.id} className="flex flex-col items-center gap-2.5 min-w-[72px] group">
                {/* Color Dot */}
              <div className={cn(
                "w-1.5 h-1.5 rounded-full mb-0.5 transition-opacity duration-300 shadow-[0_0_8px_currentColor]",
                isChecked ? "opacity-100" : (isFutureSelected ? "opacity-10" : "opacity-70 group-hover:opacity-95"),
                colorClass
              )} />

                {/* Circle Toggle */}
                <button
                  onClick={() => !isFutureSelected && onToggleHabit(habit.id, selectedDate)}
                  disabled={isFutureSelected}
                  className={cn(
                    "w-[60px] h-[60px] rounded-full flex items-center justify-center relative transition-all duration-300",
                    isChecked 
                      ? `${colorClass} ${glowClass} border-0 scale-100` 
                      : "bg-slate-800/75 border-2 border-slate-500/70 text-zinc-200 hover:border-cyan-300/70 hover:text-zinc-50 hover:scale-[1.05] hover:bg-slate-700/70",
                    isFutureSelected && "opacity-20 cursor-not-allowed hover:scale-100 border-slate-800"
                  )}
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
                  }}
                >
                  <AnimatePresence>
                    {isChecked && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Check className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                <button
                  onClick={() => setEditingHabit(habit)}
                  className="flex flex-col items-center justify-center gap-0.5 mt-2 group/editbtn px-0.5 w-full"
                  title="Edit habit"
                >
                  <span className={cn(
                    "text-[10px] font-bold text-center w-full line-clamp-2 leading-tight transition-colors duration-300 group-hover/editbtn:text-cyan-300 min-h-[24px]",
                    isChecked ? "text-zinc-50" : "text-zinc-200"
                  )}>
                    {habit.name}
                  </span>
                  <Edit3 className="w-2 h-2 opacity-0 group-hover/editbtn:opacity-100 text-cyan-400 transition-opacity" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* A.3 Monthly Date Spine */}
      <div className="relative h-10 flex items-center mt-2 group/spine">
        <div className="absolute left-0 z-10 w-10 h-full bg-gradient-to-r from-[#070b16] via-[#070b16]/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 z-10 w-10 h-full bg-gradient-to-l from-[#070b16] via-[#070b16]/80 to-transparent pointer-events-none" />
        
        <div 
          ref={spineRef}
          className="flex items-center gap-1.5 overflow-x-auto px-8 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {days.map((day) => {
            const isSel = isSameDay(day, selectedDate)
            const isT = isToday(day)
            const isFut = isAfter(day, new Date()) && !isT
            const logForDay = logs[format(day, "yyyy-MM-dd")]
            const dayDone = habits.length > 0 && habits.every(h => logForDay?.completedHabits.includes(h.id))
            const partial = !dayDone && logForDay && logForDay.completedHabits.length > 0

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "min-w-[36px] h-8 rounded-lg flex flex-col items-center justify-center relative transition-all duration-200",
                  isSel 
                    ? "bg-blue-500/25 text-blue-100 ring-1 ring-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.15)] font-bold" 
                    : "bg-transparent text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200",
                  isT && "is-today",
                  dayDone && !isSel && "text-emerald-300 font-black",
                  partial && !isSel && "text-amber-300 font-black",
                  isFut && "text-zinc-600 font-medium"
                )}
              >
                <span className="text-[10px] uppercase font-mono mb-0.5">{format(day, "eee")}</span>
                <span className="text-xs font-semibold">{format(day, "d")}</span>
                
                {isT && (
                  <div className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Add Habit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700/70 rounded-2xl p-6 shadow-2xl shadow-black/40"
            >
              <h3 className="text-xl font-bold text-zinc-50 mb-1">New Habit</h3>
              <p className="text-sm text-zinc-400 mb-5">Start tracking something new</p>
              <AddHabitForm 
                onAdd={(name, color) => {
                  onCreateHabit(name, color)
                  setShowAddModal(false)
                }} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Edit Habit Modal */}
      <AnimatePresence>
        {editingHabit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingHabit(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-zinc-900 border border-zinc-700/70 rounded-2xl p-6 shadow-2xl shadow-black/40"
            >
              <h3 className="text-xl font-bold text-zinc-50 mb-1">Edit Habit</h3>
              <p className="text-sm text-zinc-400 mb-5">Change details or remove it</p>
              <EditHabitForm 
                habit={editingHabit}
                onSave={(name, color) => {
                  onUpdateHabit(editingHabit.id, name, color)
                  setEditingHabit(null)
                }} 
                onDelete={() => {
                  onDeleteHabit(editingHabit.id)
                  setEditingHabit(null)
                }}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

function EditHabitForm({ habit, onSave, onDelete }: { habit: Habit, onSave: (name: string, color: string) => void, onDelete: () => void }) {
  const [name, setName] = useState(habit.name)
  const [color, setColor] = useState(habit.color)
  const colors = ["emerald", "blue", "purple", "amber", "rose", "cyan"]
  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (name) onSave(name, color); }} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Habit Name</label>
        <input 
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-zinc-950/80 border border-zinc-700/70 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Color Theme</label>
        <div className="flex gap-2.5">
          {colors.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "w-9 h-9 rounded-full border-2 transition-all duration-200",
                color === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-80",
                habitColors[c]?.bg || "bg-zinc-500"
              )}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-2">
        <button 
          type="submit"
          disabled={!name.trim()}
          className={cn(
            "w-full font-bold py-3 rounded-xl transition-all duration-200",
            name.trim()
              ? "bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg shadow-white/10"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          )}
        >
          Save Changes
        </button>
        {isDeleting ? (
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={onDelete}
              className="flex-1 font-bold py-3 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 transition-all duration-200"
            >
              Confirm
            </button>
            <button 
              type="button"
              onClick={() => setIsDeleting(false)}
              className="flex-1 font-bold py-3 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => setIsDeleting(true)}
            className="w-full font-bold py-3 flex items-center justify-center gap-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4" /> Delete Habit
          </button>
        )}
      </div>
    </form>
  )
}

function AddHabitForm({ onAdd }: { onAdd: (name: string, color: string) => void }) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("emerald")
  const colors = ["emerald", "blue", "purple", "amber", "rose", "cyan"]

  return (
    <form onSubmit={(e) => { e.preventDefault(); if (name) onAdd(name, color); }} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Habit Name</label>
        <input 
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full bg-zinc-950/80 border border-zinc-700/70 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-brand-primary/60 focus:ring-1 focus:ring-brand-primary/20 transition-all"
          placeholder="Drink water, Meditation..."
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Color Theme</label>
        <div className="flex gap-2.5">
          {colors.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "w-9 h-9 rounded-full border-2 transition-all duration-200",
                color === c ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-80",
                habitColors[c]?.bg || "bg-zinc-500"
              )}
            />
          ))}
        </div>
      </div>
      <button 
        type="submit"
        disabled={!name.trim()}
        className={cn(
          "w-full font-bold py-3 rounded-xl transition-all duration-200",
          name.trim()
            ? "bg-white text-zinc-900 hover:bg-zinc-200 shadow-lg shadow-white/10"
            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
        )}
      >
        Create Habit
      </button>
    </form>
  )
}
