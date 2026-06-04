export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: any;
  archived: boolean;
}

export interface DailyLog {
  id: string; // YYYY-MM-DD
  completedHabits: string[]; // habit IDs
  note: string;
  lastUpdated: any;
}

export type ViewType = "Weekly" | "Monthly" | "Yearly";
