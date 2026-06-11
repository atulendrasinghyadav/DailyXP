import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  username?: string;
  displayName?: string;
  email?: string;
  timezone?: string;
  publicProfile?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Habit {
  id: string; // auto-generated
  userId: string;
  name: string;
  color: string; // Hex code
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "active" | "deleted";
  deletedAt?: Timestamp;
  deletedReason?: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null; // YYYY-MM-DD
  totalCheckIns: number;
  weekStartDate: string; // YYYY-MM-DD (Sunday)
  freezesAvailable: number; // 0 or 1
  freezeResetDate: string | null; // YYYY-MM-DD
}

export interface DailyLog {
  id: string; // composite: `${habitId}_${date}`
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  createdAt: Timestamp;
  timezone: string;
  source: "manual" | "backdate" | "import";
}

export interface Freeze {
  id: string; // auto-generated
  habitId: string;
  userId: string;
  weekStartDate: string;
  usedForDate: string; // YYYY-MM-DD
  createdAt: Timestamp;
}

export interface DailyNote {
  date: string; // YYYY-MM-DD
  content: string;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface UI_DailyLog {
  id: string; // YYYY-MM-DD
  completedHabits: string[];
  note: string;
  lastUpdated: any;
}

export type ViewType = "Weekly" | "Monthly" | "Yearly";
