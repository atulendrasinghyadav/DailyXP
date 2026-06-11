import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, runTransaction } from "firebase/firestore";
import { db } from "./config";
import { DailyLog } from "@/types/dashboard";
import { recalculateStreaks } from "./streaks";

export async function toggleCheckIn(habitId: string, userId: string, date: string, timezone: string, source: "manual" | "backdate" = "manual") {
  const logId = `${habitId}_${date}`;
  const logRef = doc(db, "logs", logId);
  const habitRef = doc(db, "habits", habitId);

  let isCheck = true;

  await runTransaction(db, async (transaction) => {
    const habitDoc = await transaction.get(habitRef);
    if (!habitDoc.exists()) {
      throw new Error("Habit does not exist!");
    }

    const logDoc = await transaction.get(logRef);

    if (logDoc.exists()) {
      // Uncheck
      transaction.delete(logRef);
      transaction.update(habitRef, {
        updatedAt: serverTimestamp()
      });
      isCheck = false;
    } else {
      // Check in
      const logData: Omit<DailyLog, "id"> = {
        habitId,
        userId,
        date,
        createdAt: serverTimestamp() as any,
        timezone,
        source
      };
      transaction.set(logRef, logData);
      transaction.update(habitRef, {
        updatedAt: serverTimestamp()
      });
    }
  });

  // Post-commit: recalculate streak
  await recalculateStreaks(habitId, userId, timezone);
  return isCheck;
}