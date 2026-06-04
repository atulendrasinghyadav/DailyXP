"use client"

import { useAuth } from "@/context/AuthContext"
import DashboardShell from "@/components/dashboard/DashboardShell"
import DashboardNavBar from "@/components/dashboard/DashboardNavBar"
import NavBar from "@/components/landing/NavBar"
import Hero from "@/components/landing/Hero"
import HowToUse from "@/components/landing/HowToUse"
import Features from "@/components/landing/Features"
import WallOfFame from "@/components/landing/WallOfFame"
import Footer from "@/components/landing/Footer"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-brand-primary selection:text-black relative">
        <DashboardNavBar />
        <main className="w-full relative z-0">
          <DashboardShell />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-brand-primary selection:text-black relative">
      <NavBar />
      <main className="w-full">
        <Hero />
        <HowToUse />
        <Features />
        <WallOfFame />
      </main>
      <Footer />
    </div>
  )
}
