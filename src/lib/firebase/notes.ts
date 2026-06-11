import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { DailyNote } from "@/types/dashboard";

export async function getDailyNote(userId: string, date: string): Promise<DailyNote | null> {
  const noteRef = doc(db, "users", userId, "dailyNotes", date);
  const snap = await getDoc(noteRef);
  if (snap.exists()) {
    return snap.data() as DailyNote;
  }
  return null;
}

export async function saveDailyNote(userId: string, date: string, content: string) {
  const noteRef = doc(db, "users", userId, "dailyNotes", date);
  await setDoc(noteRef, {
    date,
    content,
    updatedAt: serverTimestamp(),
    // createdAt will be set only if it doesn't exist, using merge: true
  }, { merge: true });
}

export async function deleteDailyNote(userId: string, date: string) {
  const noteRef = doc(db, "users", userId, "dailyNotes", date);
  // Soft delete by clearing content, keeps the doc for history tracking if needed
  await updateDoc(noteRef, {
    content: "",
    updatedAt: serverTimestamp()
  });
}