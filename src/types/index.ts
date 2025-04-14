/**
 * TypeScript interfaces for SalatPath app
 */

// Interface for Hadith objects
export interface Hadith {
  id: number;
  text: string;
  source: string;
}

// Interface for Prayer Log
export interface PrayerLog {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  tahajjud: boolean;
}

// Interface for Streak Data
export interface StreakData {
  count: number;
  lastCompletedDate: string; // 'YYYY-MM-DD' format
}

// Interface for Notification Preferences
export interface NotificationPrefs {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

// Interface for Alarm Preferences (same structure as NotificationPrefs)
export interface AlarmPrefs {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  tahajjud: boolean;
}

// Interface for Alarm Timers
export interface AlarmTimers {
  fajr: NodeJS.Timeout | null;
  dhuhr: NodeJS.Timeout | null;
  asr: NodeJS.Timeout | null;
  maghrib: NodeJS.Timeout | null;
  isha: NodeJS.Timeout | null;
}

// Prayer Times interface (hardcoded for MVP)
export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  tahajjud?: string; // Optional Tahajjud prayer time
}

// Prayer Names type
export type PrayerName =
  | "fajr"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "tahajjud";
