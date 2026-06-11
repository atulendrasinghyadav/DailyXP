import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, subDays, addDays, startOfWeek } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayDateString(timezone?: string): string {
  if (timezone) {
    try {
      return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
    } catch (e) {
      // Fallback
    }
  }
  return new Date().toLocaleDateString('en-CA');
}

export function getDateString(date: Date, timezone?: string): string {
  if (timezone) {
    try {
      return date.toLocaleDateString('en-CA', { timeZone: timezone });
    } catch (e) {
      // Fallback
    }
  }
  return date.toLocaleDateString('en-CA');
}

export function getWeekStartDate(timezone?: string): string {
  const today = new Date();
  // startOfWeek in date-fns defaults to Sunday (0)
  const sunday = startOfWeek(today, { weekStartsOn: 0 });
  return getDateString(sunday, timezone);
}

export function getYesterdayString(dateStr: string): string {
  // Parse YYYY-MM-DD assuming local time noon to avoid timezone shift
  const [y, m, d] = dateStr.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0);
  const yesterday = subDays(date, 1);
  return format(yesterday, 'yyyy-MM-dd');
}

export function getNextDayString(dateStr: string): string {
  const [y, m, d] = dateStr.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d), 12, 0, 0);
  const next = addDays(date, 1);
  return format(next, 'yyyy-MM-dd');
}
