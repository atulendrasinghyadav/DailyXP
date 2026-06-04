"use client"

import React, { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { DailyLog } from "@/types/dashboard"
import { FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ZoneDProps {
  logs: Record<string, DailyLog>
  selectedDate: Date
  onUpdateNote: (note: string, date: Date) => void
}

export default function ZoneDNotepad({ logs, selectedDate, onUpdateNote }: ZoneDProps) {
  const dateStr = format(selectedDate, "yyyy-MM-dd")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    const existingNote = logs[dateStr]?.note || ""
    setContent(existingNote)
    setCharCount(existingNote.length)
  }, [dateStr, logs])

  // Simple debounce for auto-save
  useEffect(() => {
    if (content === (logs[dateStr]?.note || "")) return

    const timer = setTimeout(async () => {
      setIsSaving(true)
      await onUpdateNote(content, selectedDate)
      setIsSaving(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [content, dateStr, onUpdateNote, selectedDate, logs])

  return (
    <section id="notes" className="mt-8 mb-24">
      <div className="dashboard-card overflow-hidden">
        {/* D.1 Toolbar Header */}
        <div className="bg-slate-800/40 border-b border-slate-500/25 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-bold text-zinc-50 ml-2.5">Today&apos;s Notes</span>
            <div className="ml-3 text-[10px] font-mono text-cyan-100 font-bold bg-cyan-500/10 border border-cyan-300/20 px-2 py-0.5 rounded-md">
              {format(selectedDate, "MMM d, yyyy")}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors duration-500 shadow-[0_0_4px_currentColor]",
              isSaving ? "bg-amber-300 animate-pulse text-amber-300" : "bg-emerald-300 text-emerald-300"
            )} />
            <span className="text-[11px] text-zinc-400 font-medium">
              {isSaving ? "Saving..." : "Auto-saved"}
            </span>
          </div>
        </div>

        {/* D.2 Writing Surface */}
        <div className="relative bg-slate-950/35 min-h-[220px] md:min-h-[260px] ruled-paper">
          <div className="absolute left-10 top-0 bottom-0 w-px bg-cyan-300/15" />
          <textarea
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= 2000) {
                setContent(e.target.value)
                setCharCount(e.target.value.length)
              }
            }}
            placeholder="What happened today? How did the habit feel? Any friction?"
            className="w-full h-full bg-transparent border-none outline-none resize-none pl-12 pr-6 pt-2 text-zinc-100 text-[15px] leading-[32px] placeholder:text-slate-500 min-h-[220px] md:min-h-[260px]"
          />
        </div>

        {/* D.3 Footer */}
        <div className="bg-slate-800/25 border-t border-slate-500/20 px-5 py-2.5 flex items-center justify-between">
          <span className={cn(
            "text-xs font-mono font-bold tracking-tight",
            charCount >= 2000 ? "text-rose-300" : charCount >= 1800 ? "text-amber-300" : "text-cyan-200/70"
          )}>
            {charCount} / 2000
          </span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Markdown supported
          </span>
        </div>
      </div>

      <style jsx>{`
        .ruled-paper {
          background-image: linear-gradient(to bottom, transparent 31px, rgba(125, 211, 252, 0.12) 31px);
          background-size: 100% 32px;
        }
      `}</style>
    </section>
  )
}
