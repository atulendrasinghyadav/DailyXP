"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  where,
  addDoc
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/context/AuthContext"
import { Habit, DailyLog } from "@/types/dashboard"
import { format, subDays } from "date-fns"

export function useDashboardData() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<Record<string, DailyLog>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setHabits([])
      setLogs({})
      setLoading(false)
      return
    }

    const habitsQuery = query(
      collection(db, "users", user.uid, "habits"),
      where("archived", "==", false)
    )
    const unsubscribeHabits = onSnapshot(habitsQuery, (snapshot) => {
      const habitsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habit[]
      setHabits(habitsData)
    })

    const logsQuery = query(collection(db, "users", user.uid, "logs"))
    const unsubscribeLogs = onSnapshot(logsQuery, (snapshot) => {
      const logsData: Record<string, DailyLog> = {}
      snapshot.docs.forEach(doc => {
        logsData[doc.id] = { id: doc.id, ...doc.data() } as DailyLog
      })
      setLogs(logsData)
      setLoading(false)
    })

    return () => {
      unsubscribeHabits()
      unsubscribeLogs()
    }
  }, [user])

  const toggleHabit = async (habitId: string, date: Date) => {
    if (!user) return
    const dateStr = format(date, "yyyy-MM-dd")
    const logRef = doc(db, "users", user.uid, "logs", dateStr)
    const currentLog = logs[dateStr]

    if (currentLog) {
      const isCompleted = currentLog.completedHabits.includes(habitId)
      const newCompleted = isCompleted
        ? currentLog.completedHabits.filter(id => id !== habitId)
        : [...currentLog.completedHabits, habitId]
      
      await updateDoc(logRef, {
        completedHabits: newCompleted,
        lastUpdated: serverTimestamp()
      })
    } else {
      await setDoc(logRef, {
        completedHabits: [habitId],
        note: "",
        lastUpdated: serverTimestamp()
      })
    }
  }

  const updateNote = async (note: string, date: Date) => {
    if (!user) return
    const dateStr = format(date, "yyyy-MM-dd")
    const logRef = doc(db, "users", user.uid, "logs", dateStr)
    
    if (logs[dateStr]) {
      await updateDoc(logRef, { note, lastUpdated: serverTimestamp() })
    } else {
      await setDoc(logRef, {
        completedHabits: [],
        note,
        lastUpdated: serverTimestamp()
      })
    }
  }

  const createHabit = async (name: string, color: string) => {
    if (!user) return
    await addDoc(collection(db, "users", user.uid, "habits"), {
      name,
      color,
      archived: false,
      createdAt: serverTimestamp()
    })
  }

  // Memoized XP, Streak, and Level Logic
  const stats = useMemo(() => {
    // 1. XP calculation: Total count of completed habits across all time
    let totalXP = 0
    Object.values(logs).forEach(log => {
      totalXP += log.completedHabits?.length || 0
    })

    // 2. Streak calculation: Continuous days from today (or yesterday) backwards
    let currentStreak = 0
    const todayStr = format(new Date(), "yyyy-MM-dd")
    
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
      { id: 'early-bird', criteria: () => Object.values(logs).some(log => {
        const lastUpdated = log.lastUpdated?.toDate?.() || new Date(log.lastUpdated)
        return log.completedHabits.length > 0 && lastUpdated.getHours() < 6
      })},
      { id: 'consistent', criteria: () => currentStreak >= 7 },
      { id: 'habit-master', criteria: () => habits.length >= 5 },
      { id: 'goal-getter', criteria: () => Object.values(logs).some(log => habits.length > 0 && log.completedHabits.length === habits.length) },
      { id: 'marathoner', criteria: () => currentStreak >= 30 }, // Tough: 1 month streak
      { id: 'veteran', criteria: () => levelData.level >= 10 }, // Tough: Fibonacci level 10 (needs many active days)
      { id: 'overachiever', criteria: () => Object.values(logs).some(log => log.completedHabits.length >= 10) }, // Tough: 10 habits in one day
      { id: 'centurion', criteria: () => totalXP >= 100 } // Tough: 100 total habit completions
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
  }, [logs, habits])

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

    // Debounce sync to avoid excessive writes
    const timeoutId = setTimeout(syncStats, 2000)
    return () => clearTimeout(timeoutId)
  }, [user, loading, stats.streak, stats.level, stats.xp])

  return { habits, logs, loading, toggleHabit, updateNote, createHabit, ...stats }
}
