import { collection, doc, getDocs, query, updateDoc, where, orderBy } from "firebase/firestore";
import { db } from "./config";
import { getTodayDateString, getYesterdayString, getNextDayString } from "../utils";

// Returns current and longest streaks
export async function recalculateStreaks(habitId: string, userId: string, timezone?: string) {
  // Fetch all logs
  const logsQuery = query(
    collection(db, "logs"),
    where("userId", "==", userId),
    where("habitId", "==", habitId),
    orderBy("date", "desc")
  );
  const logsSnap = await getDocs(logsQuery);
  const logDates = logsSnap.docs.map(d => d.data().date as string);

  // Fetch all freezes
  const freezesQuery = query(
    collection(db, "freezes"),
    where("userId", "==", userId),
    where("habitId", "==", habitId)
  );
  const freezesSnap = await getDocs(freezesQuery);
  const freezeDates = new Set(freezesSnap.docs.map(d => d.data().usedForDate as string));

  const logDatesSet = new Set(logDates);
  const today = getTodayDateString(timezone);
  const yesterday = getYesterdayString(today);

  // 1. Calculate Current Streak
  let currentStreak = 0;
  let cursor = today;

  if (logDatesSet.has(today)) {
    currentStreak = 1;
    cursor = yesterday;
  } else if (logDatesSet.has(yesterday)) {
    cursor = yesterday;
  } else if (freezeDates.has(yesterday)) { // missed yesterday, but frozen
      cursor = yesterday;
  } else {
    // Current streak broken
  }

  if (currentStreak > 0 || logDatesSet.has(yesterday) || freezeDates.has(yesterday)) {
    while (true) {
      if (logDatesSet.has(cursor)) {
        currentStreak += 1;
        cursor = getYesterdayString(cursor);
      } else if (freezeDates.has(cursor)) {
        currentStreak += 1; // freeze bridges gap
        cursor = getYesterdayString(cursor);
      } else {
        break;
      }
    }
  }

  // 2. Calculate Longest Streak
  // Sort dates ascending for longest streak
  const allDatesDesc = Array.from(new Set([...logDates, ...Array.from(freezeDates)])).sort((a, b) => b.localeCompare(a));
  const allDatesAsc = [...allDatesDesc].reverse();

  let longest = 0;
  let currentRun = 0;
  let prev: string | null = null;

  for (const date of allDatesAsc) {
    if (!prev) {
      currentRun = 1;
    } else {
      const expected = getNextDayString(prev);
      if (date === expected) {
        currentRun += 1;
      } else {
          // It's a gap
          longest = Math.max(longest, currentRun);
          currentRun = 1; // Reset run to 1
      }
    }
    prev = date;
  }
  longest = Math.max(longest, currentRun);

  // Find max log date for lastCheckInDate
  const maxDate = logDates.length > 0 ? logDates[0] : null; // Already sorted desc

  // Update habit doc
  const habitRef = doc(db, "habits", habitId);
  await updateDoc(habitRef, {
    currentStreak,
    longestStreak: longest,
    totalCheckIns: logDates.length,
    lastCheckInDate: maxDate
  });

  return { currentStreak, longestStreak: longest };
}