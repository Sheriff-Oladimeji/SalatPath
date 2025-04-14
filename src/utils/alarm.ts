import { Audio } from "expo-av";
import { PrayerName, AlarmPrefs, PrayerTimes } from "../types";

// Sound object reference
let sound: Audio.Sound | null = null;

// Hardcoded prayer times for MVP (same as before)
export const PRAYER_TIMES: PrayerTimes = {
  fajr: "5:50 AM",
  dhuhr: "1:35 PM",
  asr: "4:00 PM",
  maghrib: "6:50 PM",
  isha: "8:05 PM",
  tahajjud: "1:12 AM", // Tahajjud prayer time
};

// Initialize audio
export const initializeAudio = async (): Promise<boolean> => {
  try {
    // Set audio mode for playback with safer configuration
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });

    return true;
  } catch (error) {
    console.error("Error initializing audio:", error);
    return false;
  }
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

// Play the alarm sound
export const playAlarm = async (): Promise<void> => {
  try {
    console.log("Playing alarm sound...");

    // Unload any existing sound
    if (sound) {
      await sound.unloadAsync();
    }

    // Load and play the alarm sound
    const { sound: newSound } = await Audio.Sound.createAsync(
      require("../../assets/taweel_al_shawq.mp3"),
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
        progressUpdateIntervalMillis: 1000,
      }
    );

    // Add status update listener
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        console.log(
          `Alarm playing: ${status.isPlaying}, position: ${status.positionMillis}ms`
        );
      } else if (status.error) {
        console.error(`Alarm playback error: ${status.error}`);
      }
    });

    sound = newSound;
  } catch (error) {
    console.error("Error playing alarm:", error);
  }
};

// Stop the alarm sound
export const stopAlarm = async (): Promise<void> => {
  try {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      sound = null;
    }
  } catch (error) {
    console.error("Error stopping alarm:", error);
  }
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
