"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs 
} from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { PublicProfileData } from "@/lib/firebase/profile"
import DashboardNavBar from "@/components/dashboard/DashboardNavBar"
import { 
  Trophy, 
  Flame, 
  Star, 
  TrendingUp, 
  Crown, 
  Medal, 
  ChevronLeft, 
  ChevronRight,
  User,
  Loader2,
  Calendar
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { format } from "date-fns"
import Footer from "@/components/landing/Footer"

export default function WallOfFame() {
  const [users, setUsers] = useState<PublicProfileData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 10

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true)
      try {
        // Complex query for leaderboard
        const leaderboardQuery = query(
          collection(db, "users"),
          orderBy("streak", "desc"),
          orderBy("level", "desc"),
          orderBy("xp", "desc"),
          orderBy("displayName", "asc"),
          orderBy("createdAt", "asc"),
          limit(100)
        )

        const snapshot = await getDocs(leaderboardQuery)
        const leaderboardData = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        })) as (PublicProfileData & { uid: string })[]
        
        setUsers(leaderboardData)
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err)
        if (err.message?.includes("index")) {
          setError("Leaderboard is being prepared. Please check back in a few minutes.")
        } else {
          setError("Failed to load the Wall of Fame.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const top10 = users.slice(0, 10)
  const others = users.slice(10)
  
  const totalPages = Math.ceil(others.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedOthers = others.slice(startIndex, startIndex + usersPerPage)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b16] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-zinc-100 pb-20">
      <DashboardNavBar />
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/8 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-32">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-200 transition-colors group mb-8">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6"
          >
            <Trophy size={20} />
            <span className="text-sm font-black uppercase tracking-widest">Global Leaderboard</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-4">
            Wall of <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-500">Fame</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto font-medium">
            Celebrating the elite who have mastered consistency and leveled up their lives.
          </p>
        </header>

        {error ? (
          <div className="text-center p-12 bg-zinc-900/50 rounded-3xl border border-zinc-800 backdrop-blur-md">
            <p className="text-zinc-300 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Top 10 High Detail */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Crown className="text-amber-400" /> The Elite Ten
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {top10.map((user, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "group relative p-4 rounded-2xl border transition-all hover:scale-[1.01] active:scale-[0.99]",
                      idx === 0 ? "bg-gradient-to-r from-amber-500/20 to-amber-500/5 border-amber-500/30" :
                      idx === 1 ? "bg-gradient-to-r from-slate-400/20 to-slate-400/5 border-slate-400/30" :
                      idx === 2 ? "bg-gradient-to-r from-orange-600/20 to-orange-600/5 border-orange-600/30" :
                      "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 font-black text-xl italic text-zinc-500">
                        {idx + 1}
                      </div>
                      
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden flex items-center justify-center shadow-lg">
                          {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="text-zinc-600" size={24} />
                          )}
                        </div>
                        {idx < 3 && (
                          <div className="absolute -top-1 -right-1">
                            {idx === 0 && <Crown size={20} className="text-amber-400 drop-shadow-lg" />}
                            {idx === 1 && <Medal size={20} className="text-slate-300 drop-shadow-lg" />}
                            {idx === 2 && <Medal size={20} className="text-orange-500 drop-shadow-lg" />}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg text-white truncate group-hover:text-amber-400 transition-colors">
                          {user.displayName || "Elite Player"}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                            <TrendingUp size={12} className="text-emerald-400" /> LVL {user.level || 0}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                            <Star size={12} className="text-amber-400" /> {user.xp || 0} XP
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center gap-1 text-orange-500 font-black text-2xl">
                          <Flame size={20} />
                          {user.streak || 0}
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Streak</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: 90 Others Compact with Pagination */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Star className="text-zinc-400" /> Rising Stars
                </h2>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                   {others.length} Contenders
                </div>
              </div>

              <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-2 backdrop-blur-md min-h-[600px] flex flex-col">
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="divide-y divide-zinc-800/50"
                    >
                      {paginatedOthers.map((user, idx) => {
                        const rank = 11 + startIndex + idx
                        return (
                          <div key={rank} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-4">
                              <span className="w-6 text-xs font-bold text-zinc-600 text-center">{rank}</span>
                              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center">
                                {user.photoURL ? (
                                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                                ) : (
                                  <User className="text-zinc-700" size={16} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-zinc-200 group-hover:text-white transition-colors">
                                  {user.displayName || "Daily Player"}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-black text-zinc-600 uppercase">Lvl {user.level || 0}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-400 font-black">
                              <Flame size={14} className="text-orange-500/70" />
                              {user.streak || 0}
                            </div>
                          </div>
                        )
                      })}
                      {paginatedOthers.length === 0 && (
                        <div className="p-12 text-center text-zinc-500 font-medium italic">
                          More players climbing the ranks...
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-zinc-800/50 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
