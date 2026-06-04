"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { useAuth } from "@/context/AuthContext"
import { useDashboardData } from "@/hooks/useDashboardData"
import DashboardNavBar from "@/components/dashboard/DashboardNavBar"
import {
  User,
  Mail,
  Calendar,
  Flame,
  Award,
  TrendingUp,
  Edit3,
  CheckCircle2,
  ShieldCheck,
  Star,
  Zap,
  Target,
  ChevronLeft,
  Crown,
  Medal,
  Infinity,
  Share2,
  Copy,
  ExternalLink,
  Check,
  Link2,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DEFAULT_PROFILE_BIO,
  fetchUserProfile,
  formatProfileDate,
  saveCurrentUserProfile,
  syncCurrentUserProfile,
  type PublicProfileData
} from "@/lib/firebase/profile"
import { updateProfile } from "firebase/auth"

interface ProfileViewProps {
  profileUserId: string
  showNav?: boolean
}

export default function ProfileView({ profileUserId, showNav = false }: ProfileViewProps) {
  const { user, loading: authLoading } = useAuth()
  const { habits, xp, streak, level, unlockedBadgeIds } = useDashboardData()
  const isOwner = user?.uid === profileUserId

  const [profile, setProfile] = useState<PublicProfileData | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState(DEFAULT_PROFILE_BIO)
  const [isSaving, setIsSaving] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const badgeConfig = [
    { id: 'early-bird', name: "Early Bird", description: "Complete a habit before 6 AM", icon: <Zap size={24} />, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
    { id: 'consistent', name: "Consistent", description: "Maintain a 7-day streak", icon: <ShieldCheck size={24} />, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { id: 'habit-master', name: "Habit Master", description: "Create 5 unique habits", icon: <Award size={24} />, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
    { id: 'goal-getter', name: "Goal Getter", description: "Complete all daily habits", icon: <Target size={24} />, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    { id: 'marathoner', name: "Marathoner", description: "Hit a 30-day streak", icon: <Flame size={24} />, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { id: 'veteran', name: "Veteran", description: "Reach Level 10", icon: <Crown size={24} />, color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20" },
    { id: 'overachiever', name: "Overachiever", description: "10 completions in one day", icon: <Medal size={24} />, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
    { id: 'centurion', name: "Centurion", description: "Reach 100 total XP", icon: <Infinity size={24} />, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ]

  const stats = [
    { label: "Current Habits", value: habits.length, icon: <CheckCircle2 className="text-blue-400" />, color: "from-blue-500/20 to-blue-500/5" },
    { label: "Current Streak", value: `${streak} Days`, icon: <Flame className="text-orange-400" />, color: "from-orange-500/20 to-orange-500/5" },
    { label: "Current Level", value: `Level ${level}`, icon: <TrendingUp className="text-emerald-400" />, color: "from-emerald-500/20 to-emerald-500/5" },
    { label: "XP Points", value: xp.toLocaleString(), icon: <Star className="text-amber-400" />, color: "from-amber-500/20 to-amber-500/5" },
  ]

  const publicProfilePath = `/u/${profileUserId}`
  const backLabel = isOwner ? "Back to Dashboard" : "Back Home"
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${publicProfilePath}` : publicProfilePath

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      setProfileLoading(true)
      setProfileError("")

      try {
        const data = await fetchUserProfile(profileUserId)
        if (cancelled) return

        setProfile(data)
        if (!data && !isOwner) {
          setProfileError("This profile is not available yet.")
          return
        }

        setName(data?.displayName || user?.displayName || "")
        setBio(data?.bio || DEFAULT_PROFILE_BIO)
      } catch (error) {
        if (cancelled) return
        setProfileError("Unable to load this profile right now.")
        console.error("Error fetching profile:", error)
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [profileUserId, user?.displayName, isOwner])

  useEffect(() => {
    if (!user || !isOwner) return
    void syncCurrentUserProfile(user).catch((error) => {
      console.error("Error syncing profile doc:", error)
    })
  }, [user, isOwner])

  const joinedAt = formatProfileDate(profile?.createdAt)
  const joinedLabel = joinedAt instanceof Date ? format(joinedAt, "MMMM yyyy") : "Recently"

  const handleSave = async () => {
    if (!user || !isOwner) return

    setIsSaving(true)
    try {
      await updateProfile(user, { displayName: name })
      await saveCurrentUserProfile(user, { displayName: name, bio })
      setProfile((current) => current ? { ...current, displayName: name, bio } : current)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch (error) {
      console.error("Error copying profile link:", error)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#070b16] text-zinc-100 selection:bg-brand-primary selection:text-black pb-20">
        {showNav && <DashboardNavBar />}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/8 blur-[120px] rounded-full" />
        </div>
        <main className="max-w-4xl mx-auto px-4 pt-32">
          <div className="h-[420px] rounded-3xl border border-white/10 bg-white/5 animate-pulse" />
        </main>
      </div>
    )
  }

  if (!profileLoading && !profile && profileError) {
    return (
      <div className="min-h-screen bg-[#070b16] text-zinc-100 selection:bg-brand-primary selection:text-black pb-20">
        {showNav && <DashboardNavBar />}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/8 blur-[120px] rounded-full" />
        </div>
        <main className="max-w-4xl mx-auto px-4 pt-32">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <h1 className="text-2xl font-black text-white mb-2">Profile unavailable</h1>
            <p className="text-zinc-300">{profileError}</p>
          </div>
        </main>
      </div>
    )
  }

  const displayName = profile?.displayName || user?.displayName || "Player Name"
  const displayBio = profile?.bio || DEFAULT_PROFILE_BIO
  const photoURL = profile?.photoURL || user?.photoURL || ""

  return (
    <div className="min-h-screen bg-[#070b16] text-zinc-100 selection:bg-brand-primary selection:text-black pb-20">
      {showNav && <DashboardNavBar />}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/8 blur-[120px] rounded-full" />
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-32 space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-200 transition-colors group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          {backLabel}
        </Link>

        <section className="relative bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden backdrop-blur-md min-h-[280px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400" />

          <div className="mb-8 flex flex-wrap items-center justify-end gap-2">
            <div className="relative" ref={shareMenuRef}>
              <button
                onClick={() => setShareOpen((value) => !value)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition-all active:scale-95 shadow-lg"
              >
                <Share2 size={14} /> Share Profile
              </button>

              <AnimatePresence>
                {shareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl bg-zinc-950/95 border border-zinc-700/70 p-3 shadow-2xl shadow-black/40 z-50 backdrop-blur-xl"
                  >
                    <div className="flex items-center gap-2 px-2 py-1.5 mb-3">
                      <Link2 size={14} className="text-cyan-400" />
                      <div>
                        <p className="text-xs font-bold text-zinc-100">Share profile link</p>
                        <p className="text-[11px] text-zinc-500">Send this link to anyone</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-xl border border-zinc-700/60 bg-zinc-900/90 px-3 py-2 text-xs text-zinc-300 font-mono truncate">
                        {shareUrl}
                      </div>
                      <button
                        onClick={handleCopyShareLink}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/20 text-cyan-200 hover:bg-cyan-500/25 transition-colors"
                        aria-label="Copy profile link"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                      </button>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Link
                        href={publicProfilePath}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-semibold text-zinc-100 transition-colors"
                      >
                        <ExternalLink size={14} />
                        Open
                      </Link>
                    </div>

                    {copied && (
                      <p className="mt-2 text-[11px] font-medium text-emerald-300">Link copied to clipboard.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {isOwner && !isEditing ? (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 hover:text-white transition-all active:scale-95 shadow-lg">
                <Edit3 size={14} /> Edit Profile
              </button>
            ) : isOwner && (
              <div className="flex items-center gap-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:text-zinc-300 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 border border-cyan-500/50 rounded-xl text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)] active:scale-95 disabled:opacity-50">
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 via-blue-500 to-emerald-400 shadow-2xl relative shrink-0">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border-4 border-zinc-900">
                {photoURL ? <img src={photoURL} alt="Profile" className="w-full h-full object-cover" /> : <User size={64} className="text-zinc-700" />}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left pt-2">
              {isEditing && isOwner ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1.5 ml-1">Display Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white font-bold focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-1.5 ml-1">Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 focus:outline-none focus:border-cyan-500 text-sm leading-relaxed" rows={3} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                    <h1 className="text-4xl font-black tracking-tight text-white">{displayName}</h1>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                      isOwner ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" : "border-cyan-400/25 bg-cyan-500/10 text-cyan-100"
                    )}>
                      {isOwner ? "Your profile" : "Public profile"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-zinc-400">
                    {isOwner && (
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Mail size={14} className="text-zinc-500" />
                        {user?.email}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                      <Calendar size={14} className="text-zinc-500" />
                      Joined {joinedLabel}
                    </div>
                    {!isOwner && (
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Lock size={14} className="text-zinc-500" />
                        View only
                      </div>
                    )}
                  </div>
                  <p className="mt-6 text-zinc-400 text-sm leading-relaxed max-w-xl italic">&ldquo;{displayBio}&rdquo;</p>
                </>
              )}
            </div>
          </div>
        </section>

        {isOwner && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={cn("p-6 rounded-3xl border border-zinc-800 bg-gradient-to-br shadow-xl", stat.color)}>
                  <div className="p-2 bg-zinc-950/50 rounded-xl border border-white/5 w-fit mb-4">{stat.icon}</div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2"><Award className="text-amber-400" /> Badges Earned</h2>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                  {unlockedBadgeIds?.length || 0} / {badgeConfig.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {badgeConfig.map((badge, i) => {
                  const isUnlocked = unlockedBadgeIds?.includes(badge.id)
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className={cn(
                        "p-5 rounded-3xl border flex flex-col items-center text-center gap-3 transition-all relative group bg-zinc-900/50",
                        isUnlocked ? badge.border : "border-zinc-800/50 grayscale opacity-40 hover:opacity-60"
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl relative transition-transform duration-500 group-hover:rotate-12",
                        isUnlocked ? badge.bg + " " + badge.color : "bg-zinc-800"
                      )}>
                        {badge.icon}
                        {isUnlocked && <div className="absolute inset-0 rounded-full border-2 border-white/5 animate-ping opacity-20" />}
                      </div>
                      <div>
                        <h3 className={cn("font-bold text-sm", isUnlocked ? "text-zinc-100" : "text-zinc-600")}>
                          {isUnlocked ? badge.name : "Locked"}
                        </h3>
                        <p className={cn("text-[10px] font-medium leading-tight mt-1 px-2", isUnlocked ? "text-zinc-500" : "text-zinc-700")}>
                          {badge.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
