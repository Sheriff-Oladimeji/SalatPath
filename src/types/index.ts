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

// Prayer Times interface (hardcoded for MVP)
export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Prayer Names type
export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
