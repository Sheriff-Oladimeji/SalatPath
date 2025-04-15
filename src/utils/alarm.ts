import { PrayerName, AlarmPrefs, PrayerTimes } from "../types";
import { Platform } from 'react-native';
// @ts-ignore
import { setAlarm } from 'expo-alarm';

// Only import expo-alarm on Android
type SetAlarmParams = {
  hour: number;
  minutes: number;
  message?: string;
  days?: number[];
  vibrate?: boolean;
  skipUi?: boolean;
};

/**
 * Set a native alarm using the Android system clock (expo-alarm)
 * @param params hour, minutes, message, etc.
 */
export async function setNativeAlarm(params: SetAlarmParams) {
  if (Platform.OS !== 'android') {
    throw new Error('Native alarm is only supported on Android devices.');
  }
  try {
    await setAlarm(params);
  } catch (e) {
    console.error('Failed to set native alarm:', e);
  }
}

// Hardcoded prayer times for MVP (same as before)
export const PRAYER_TIMES: PrayerTimes = {
  fajr: "5:50 AM",
  dhuhr: "1:35 PM",
  asr: "4:00 PM",
  maghrib: "6:50 PM",
  isha: "8:05 PM",
  tahajjud: "1:12 AM", // Tahajjud prayer time
};

// Parse time string to get hours and minutes
export const parseTimeString = (
  timeStr: string
): { hours: number; minutes: number } => {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

// Calculate milliseconds until a specific prayer time
export const getMillisecondsUntilPrayer = (timeStr: string): number => {
  // Default to 1 minute from now if timeStr is empty
  if (!timeStr) {
    return 60 * 1000; // 1 minute in milliseconds
  }

  const { hours, minutes } = parseTimeString(timeStr);

  const now = new Date();
  const prayerTime = new Date();
  prayerTime.setHours(hours, minutes, 0, 0);

  // If the prayer time has already passed today, schedule for tomorrow
  if (prayerTime <= now) {
    prayerTime.setDate(prayerTime.getDate() + 1);
  }

  return prayerTime.getTime() - now.getTime();
};

// Schedule an alarm for a specific prayer time
export const scheduleAlarm = (
  prayerName: PrayerName,
  timeStr: string | undefined,
  callback: () => void
): NodeJS.Timeout => {
  // Ensure timeStr is defined, use a default if not
  const safeTimeStr = timeStr || "12:00 AM";
  const msUntilPrayer = getMillisecondsUntilPrayer(safeTimeStr);

  // Schedule the alarm
  return setTimeout(() => {
    callback();
  }, msUntilPrayer);
};

// Schedule all prayer alarms based on user preferences
export const schedulePrayerAlarms = (
  prefs: AlarmPrefs,
  onAlarmTrigger: (prayerName: PrayerName) => void
): Record<PrayerName, NodeJS.Timeout | null> => {
  const alarmTimers: Record<PrayerName, NodeJS.Timeout | null> = {
    fajr: null,
    dhuhr: null,
    asr: null,
    maghrib: null,
    isha: null,
    tahajjud: null,
  };

  // Clear any existing timers
  clearAllAlarms(alarmTimers);

  // Schedule alarms for each prayer based on preferences
  if (prefs.fajr) {
    alarmTimers.fajr = scheduleAlarm("fajr", PRAYER_TIMES.fajr, () =>
      onAlarmTrigger("fajr")
    );
  }

  if (prefs.dhuhr) {
    alarmTimers.dhuhr = scheduleAlarm("dhuhr", PRAYER_TIMES.dhuhr, () =>
      onAlarmTrigger("dhuhr")
    );
  }

  if (prefs.asr) {
    alarmTimers.asr = scheduleAlarm("asr", PRAYER_TIMES.asr, () =>
      onAlarmTrigger("asr")
    );
  }

  if (prefs.maghrib) {
    alarmTimers.maghrib = scheduleAlarm("maghrib", PRAYER_TIMES.maghrib, () =>
      onAlarmTrigger("maghrib")
    );
  }

  if (prefs.isha) {
    alarmTimers.isha = scheduleAlarm("isha", PRAYER_TIMES.isha, () =>
      onAlarmTrigger("isha")
    );
  }

  // Schedule Tahajjud alarm if enabled
  if (prefs.tahajjud) {
    alarmTimers.tahajjud = scheduleAlarm(
      "tahajjud",
      PRAYER_TIMES.tahajjud,
      () => onAlarmTrigger("tahajjud")
    );
  }

  return alarmTimers;
};

// Clear all scheduled alarms
export const clearAllAlarms = (
  alarmTimers: Record<PrayerName, NodeJS.Timeout | null>
): void => {
  Object.values(alarmTimers).forEach((timer) => {
    if (timer) {
      clearTimeout(timer);
    }
  });
};
