import { User } from "firebase/auth"
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "./config"

export const DEFAULT_PROFILE_BIO = "I am leveling up my life one habit at a time."

type TimestampLike = {
  toDate?: () => Date
}

export interface PublicProfileData {
  displayName?: string
  bio?: string
  email?: string
  photoURL?: string
  createdAt?: TimestampLike | Date | string | null
  updatedAt?: TimestampLike | Date | string | null
  streak?: number
  level?: number
  xp?: number
}

export function formatProfileDate(value?: PublicProfileData["createdAt"]) {
  if (!value) return ""

  if (typeof value === "string") {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? "" : date
  }

  if (value instanceof Date) return value

  if (typeof value === "object" && value && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate()
  }

  return ""
}

export async function fetchUserProfile(userId: string) {
  const profileRef = doc(db, "users", userId)
  const snap = await getDoc(profileRef)

  if (!snap.exists()) return null

  return snap.data() as PublicProfileData
}

export async function syncCurrentUserProfile(user: User) {
  const profileRef = doc(db, "users", user.uid)
  const snap = await getDoc(profileRef)

  const baseData = {
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    updatedAt: serverTimestamp(),
  }

  if (!snap.exists()) {
    await setDoc(
      profileRef,
      {
        ...baseData,
        bio: DEFAULT_PROFILE_BIO,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    )
    return
  }

  await setDoc(profileRef, baseData, { merge: true })
}

export async function saveCurrentUserProfile(
  user: User,
  data: { displayName: string; bio: string }
) {
  const profileRef = doc(db, "users", user.uid)

  await setDoc(
    profileRef,
    {
      displayName: data.displayName,
      bio: data.bio,
      email: user.email || "",
      photoURL: user.photoURL || "",
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
