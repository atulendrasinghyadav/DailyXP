"use client"

import ProfileView from "@/components/profile/ProfileView"
import { useAuth } from "@/context/AuthContext"

export default function ProfilePage() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return null

  return <ProfileView profileUserId={user.uid} showNav />
}
