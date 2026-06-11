"use client"

import { useState, useEffect, useMemo } from "react"
import { collection, query, onSnapshot, doc, updateDoc, serverTimestamp, where } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/context/AuthContext"
import { Habit, DailyLog } from "@/types/dashboard"
import { format, subDays } from "date-fns"
import { getActiveHabitsQuery, createHabit as apiCreateHabit, updateHabit as apiUpdateHabit, deleteHabit as apiDeleteHabit } from "@/lib/firebase/habits"
import { toggleCheckIn } from "@/lib/firebase/logs"
import { getTodayDateString } from "@/lib/utils"
import { saveDailyNote } from "@/lib/firebase/notes"

export function useDashboardData() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  
  // Real DB logs 
  const [dbLogs, setDbLogs] = useState<DailyLog[]>([])
  // DB notes
  const [notes, setNotes] = useState<Record<string, string>>({})
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setHabits([])
      setDbLogs([])
      setNotes({})
      setLoading(false)
      return
    }

    const habitsQuery = getActiveHabitsQuery(user.uid)
    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habit[]
      setHabits(habitsData)
    })

    const logsQuery = query(collection(db, "logs"), where("userId", "==", user.uid))
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DailyLog[]
      setDbLogs(logsData)
      setLoading(false)
    })

    const notesQuery = query(collection(db, "users", user.uid, "dailyNotes"))
    const unsubscribeNotes = onSnapshot(notesQuery, (snapshot) => {
      const notesData: Record<string, string> = {}
      snapshot.docs.forEach(doc => {
        notesData[doc.id] = doc.data().content || ""
      })
      setNotes(notesData)
    })

    return () => {
      unsubscribeHabits()
      unsubscribeLogs()
      unsubscribeNotes()
    }
  }, [user])

  // Reconstruct the old UI state `logs` mapped by YYYY-MM-DD
  const logs = useMemo(() => {
    const map: Record<string, { id: string, completedHabits: string[], note: string, lastUpdated: any }> = {}
    
    // Group completed habits by date
    dbLogs.forEach(log => {
      if (!map[log.date]) {
        map[log.date] = { id: log.date, completedHabits: [], note: "", lastUpdated: null }
      }
      map[log.date].completedHabits.push(log.habitId)
    })

    // Attach notes
    Object.keys(notes).forEach(date => {
      if (!map[date]) {
        map[date] = { id: date, completedHabits: [], note: "", lastUpdated: null }
      }
      map[date].note = notes[date]
    })

    return map
  }, [dbLogs, notes])

  const toggleHabit = async (habitId: string, date: Date) => {
    if (!user) return
    const dateStr = format(date, "yyyy-MM-dd")
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const isTodayStr = dateStr === getTodayDateString(tz);
    const source = isTodayStr ? "manual" : "backdate";
    await toggleCheckIn(habitId, user.uid, dateStr, tz, source);
  }

  const updateNote = async (note: string, date: Date) => {
    if (!user) return
    const dateStr = format(date, "yyyy-MM-dd")
    await saveDailyNote(user.uid, dateStr, note);
  }

  const createHabit = async (name: string, color: string) => {
    if (!user) return
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    await apiCreateHabit(user.uid, name, color, tz)
  }

  const updateHabit = async (habitId: string, name: string, color: string) => {
    if (!user) return
    await apiUpdateHabit(habitId, name, color)
  }

  const deleteHabit = async (habitId: string) => {
    if (!user) return
    await apiDeleteHabit(habitId)
  }

  // Memoized XP, Streak, and Level Logic
  const stats = useMemo(() => {
    // 1. XP calculation: Total count of completed habits across all time
    let totalXP = 0
    Object.values(logs).forEach(log => {
      totalXP += log.completedHabits?.length || 0
    })

    // 2. Streak calculation: We can use the max 'currentStreak' from our habits for now, or keep the original algorithm.
    // The previous app streak was "global" continuous days with ANY habit check.
    // Let's keep the global streak calculation the same for the dashboard "Global Stats",
    // while individual habits have their own streaks internally!
    let currentStreak = 0
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const todayStr = getTodayDateString(tz)
    let yesterdayStr = getTodayDateString() // Will fix below
    
    // Start checking from today, or yesterday if today isn't done yet
    let checkDate = (logs[todayStr]?.completedHabits.length || 0) > 0 ? new Date() : subDays(new Date(), 1)
    
    while (true) {
      const dateKey = format(checkDate, "yyyy-MM-dd")
      if ((logs[dateKey]?.completedHabits.length || 0) > 0) {
        currentStreak++
        checkDate = subDays(checkDate, 1)
      } else {
        break
      }
    }

    // 3. Level calculation based on unique active days (Fibonacci Series)
    const activeDaysCount = Object.values(logs).filter(log => (log.completedHabits?.length || 0) > 0).length

    const getLevel = (days: number) => {
      if (days === 0) return { level: 0, nextLevelDays: 1 }
      let a = 1, b = 2, currentLevel = 1
      while (b <= days) {
        let temp = a + b
        a = b
        b = temp
        currentLevel++
      }
      return { level: currentLevel, nextLevelDays: b }
    }

    const levelData = getLevel(activeDaysCount)

    // 4. Badge Unlocking Logic
    const badgeDefinitions = [
      { id: 'consistent', criteria: () => currentStreak >= 7 },
      { id: 'habit-master', criteria: () => habits.length >= 5 },
      { id: 'goal-getter', criteria: () => Object.values(logs).some(log => habits.length > 0 && log.completedHabits.length === habits.length) },
      { id: 'marathoner', criteria: () => currentStreak >= 30 },
      { id: 'veteran', criteria: () => levelData.level >= 10 },
      { id: 'overachiever', criteria: () => Object.values(logs).some(log => log.completedHabits.length >= 10) },
      { id: 'centurion', criteria: () => totalXP >= 100 }
    ]

    const unlockedBadgeIds = badgeDefinitions
      .filter(b => b.criteria())
      .map(b => b.id)

    return { 
      xp: totalXP, 
      streak: currentStreak, 
      level: levelData.level, 
      nextLevelDays: levelData.nextLevelDays,
      unlockedBadgeIds
    }
  }, [logs, habits, user])

  // Sync stats to Firestore
  useEffect(() => {
    if (!user || loading) return

    const syncStats = async () => {
      try {
        const userRef = doc(db, "users", user.uid)
        await updateDoc(userRef, {
          streak: stats.streak,
          level: stats.level,
          xp: stats.xp,
          updatedAt: serverTimestamp()
        })
      } catch (error) {
        console.error("Error syncing stats to Firestore:", error)
      }
    }

    const timeoutId = setTimeout(syncStats, 2000)
    return () => clearTimeout(timeoutId)
  }, [user, loading, stats.streak, stats.level, stats.xp])

  return { habits, logs, loading, toggleHabit, updateNote, createHabit, updateHabit, deleteHabit, ...stats }
}
