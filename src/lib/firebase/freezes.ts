import { collection, doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { Freeze } from "@/types/dashboard";
import { recalculateStreaks } from "./streaks";

export async function useFreeze(habitId: string, userId: string, usedForDate: string, weekStartDate: string, timezone: string) {
  const habitRef = doc(db, "habits", habitId);
  const freezeRef = doc(collection(db, "freezes"));

  await runTransaction(db, async (transaction) => {
    const habitDoc = await transaction.get(habitRef);
    if (!habitDoc.exists()) {
      throw new Error("Habit not found");
    }

    const data = habitDoc.data();
    if (data.freezesAvailable <= 0) {
      throw new Error("No freezes available");
    }

    const freezeData: Omit<Freeze, "id"> = {
      habitId,
      userId,
      weekStartDate,
      usedForDate,
      createdAt: serverTimestamp() as any
    };

    transaction.set(freezeRef, freezeData);
    transaction.update(habitRef, {
      freezesAvailable: data.freezesAvailable - 1
    });
  });

  // Post-commit: recalculate streak
  await recalculateStreaks(habitId, userId, timezone);
}