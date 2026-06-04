"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

interface AuthLayoutProps {
  children: React.ReactNode
  showcase: React.ReactNode
}

export default function AuthLayout({ children, showcase }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-zinc-950 overflow-hidden">
      {/* Left Side: Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-brand-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-brand-secondary/20 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 w-full flex flex-col items-center justify-center p-12 text-center">
          {showcase}
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 xl:p-24 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full mx-auto"
        >
          <div className="lg:hidden mb-8">
            <Link href="/" className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
              DailyXP
            </Link>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}
