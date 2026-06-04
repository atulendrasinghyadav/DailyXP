"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  // Disable custom cursor on auth pages, the dashboard, and the profile page
  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isDashboard = pathname === "/" && !!user
  const isProfilePage = pathname === "/profile" || pathname.startsWith("/u/")
  const isWallOfFame = pathname === "/wall-of-fame"
  const isDisabled = isAuthPage || isDashboard || isProfilePage || isWallOfFame
  
  // Track actual mouse position
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)

  // Spring physics for the trailing cursor
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  useEffect(() => {
    if (isDisabled) {
      // Ensure cursor is default when disabled
      document.body.style.cursor = "auto"
      // Force interactive elements back to pointer if they were modified
      const interactive = document.querySelectorAll('a, button, [role="button"]')
      interactive.forEach(el => (el as HTMLElement).style.cursor = "")
      return
    }

    // Set cursor to none only if active
    document.body.style.cursor = "none"
    const interactive = document.querySelectorAll('a, button, [role="button"]')
    interactive.forEach(el => (el as HTMLElement).style.cursor = "none")

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Use elementFromPoint for more accurate detection at the exact cursor coordinate
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
      if (!target || target.tagName === 'BODY' || target.tagName === 'HTML') {
        setIsHovered(false)
        return
      }

      const isInteractive = target.closest("button, a, [role='button'], input, textarea, select")
      const isTextTag = target.closest("p, h1, h2, h3, h4, h5, h6, span, li, blockquote, label, th, td, time, summary, strong, em, b, i")
      
      let hasText = !!(isInteractive || isTextTag)
      
      if (!hasText) {
        // Check if a generic container has direct text
        const textNodes = Array.from(target.childNodes).filter(node => node.nodeType === Node.TEXT_NODE)
        hasText = textNodes.some(node => node.textContent && node.textContent.trim().length > 0)
      }

      setIsHovered(hasText)
    }

    // Optimization: passive event listeners prevent blocking the main thread during scroll/move
    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY, isDisabled])

  if (isDisabled) return null

  return (
    <>
      {/* Primary small dot - just to show the center */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-brand-primary rounded-full pointer-events-none z-[100]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      {/* Secondary trailing circle (Inverting Effect over text) */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[99] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 2 : 1,
          backgroundColor: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0)",
          borderColor: isHovered ? "rgba(255, 255, 255, 0)" : "rgba(255, 255, 255, 0.3)",
          borderWidth: "1px",
          borderStyle: "solid"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </>
  )
}
