import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/context/AuthContext"
import CustomCursor from "@/components/ui/CustomCursor"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DailyXP | Level up your daily habits",
  description: "DailyXP transforms your routines into a game. Build streaks, earn XP, and unlock your potential with the most satisfying habit tracker ever built.",
  icons: {
    icon: "/DailyXP.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(inter.className, "antialiased")}>
        <AuthProvider>
          <CustomCursor />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
