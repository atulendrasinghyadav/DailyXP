import { collection, doc, query, where, orderBy, setDoc, updateDoc, serverTimestamp, runTransaction, getDoc, getDocs } from "firebase/firestore";
import { db } from "./config";
import { Habit } from "@/types/dashboard";
import { getWeekStartDate } from "../utils";

// Create Habit
export async function createHabit(userId: string, name: string, color: string, timezone?: string) {
  // Check active habits count
  const q = query(
    collection(db, "habits"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  const snap = await getDocs(q);
  if (snap.size >= 5) {
    throw new Error("Max 5 active habits allowed");
  }

  const habitRef = doc(collection(db, "habits"));
  const weekStart = getWeekStartDate(timezone);

  const habitData: Omit<Habit, "id"> = {
    userId,
    name,
    color,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
    status: "active",
    currentStreak: 0,
    longestStreak: 0,
    lastCheckInDate: null,
    totalCheckIns: 0,
    weekStartDate: weekStart,
    freezesAvailable: 1,
    freezeResetDate: null
  };

  await setDoc(habitRef, habitData);
  return habitRef.id;
}

// Queries for UI
export function getActiveHabitsQuery(userId: string) {
  return query(
    collection(db, "habits"),
    where("userId", "==", userId),
    where("status", "==", "active"),
    orderBy("createdAt", "asc")
  );
}

export function getDeletedHabitsQuery(userId: string) {
  return query(
    collection(db, "habits"),
    where("userId", "==", userId),
    where("status", "==", "deleted"),
    orderBy("deletedAt", "desc")
  );
}

// Update Habit
export async function updateHabit(habitId: string, name: string, color: string) {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, {
    name,
    color,
    updatedAt: serverTimestamp()
  });
}

// Soft Delete Habit
export async function deleteHabit(habitId: string, reason?: string) {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, {
    status: "deleted",
    deletedAt: serverTimestamp(),
    deletedReason: reason || "user_deleted"
  });
}

// Restore Habit
export async function restoreHabit(habitId: string) {
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, {
    status: "active",
    deletedAt: null
  });
}