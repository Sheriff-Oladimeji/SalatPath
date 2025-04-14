import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlarmPrefs, PrayerName, AlarmTimers } from "../types";
import {
  initializeAudio,
  schedulePrayerAlarms,
  playAlarm,
  stopAlarm,
  clearAllAlarms,
} from "../utils/alarm";

interface AlarmState {
  // Alarm preferences for each prayer
  alarmPrefs: AlarmPrefs;

  // Current active alarm timers
  alarmTimers: AlarmTimers;

  // Current active alarm (if any)
  activeAlarm: PrayerName | null;

  // Actions
  toggleAlarm: (prayer: PrayerName) => Promise<void>;
  initializeAlarms: () => Promise<void>;
  triggerAlarm: (prayer: PrayerName) => void;
  dismissAlarm: () => void;
}

// Create the store with persistence
export const useAlarmStore = create<AlarmState>()(
  persist(
    (set, get) => ({
      // Initial state - all alarms enabled by default
      alarmPrefs: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
        tahajjud: true, // Enable Tahajjud alarm by default
      },

      // Initial alarm timers - all null
      alarmTimers: {
        fajr: null,
        dhuhr: null,
        asr: null,
        maghrib: null,
        isha: null,
        tahajjud: null,
      },

      // No active alarm initially
      activeAlarm: null,

      // Toggle alarm for a specific prayer
      toggleAlarm: async (prayer: PrayerName) => {
        // Update state
        set((state) => {
          const updatedPrefs = {
            ...state.alarmPrefs,
            [prayer]: !state.alarmPrefs[prayer],
          };

          return { alarmPrefs: updatedPrefs };
        });

        // Reschedule alarms with updated preferences
        await get().initializeAlarms();
      },

      // Initialize alarms
      initializeAlarms: async () => {
        try {
          // Initialize audio
          const initialized = await initializeAudio();

          if (initialized) {
            // Schedule alarms based on current preferences
            const timers = schedulePrayerAlarms(
              get().alarmPrefs,
              (prayer: PrayerName) => get().triggerAlarm(prayer)
            );

            // Update timers in state
            set({ alarmTimers: timers });
          }
        } catch (error) {
          console.error("Error initializing alarms:", error);
        }
      },

      // Trigger alarm for a specific prayer
      triggerAlarm: (prayer: PrayerName) => {
        // Play the alarm sound
        playAlarm();

        // Set the active alarm
        set({ activeAlarm: prayer });

        // Reschedule alarms for the next day
        get().initializeAlarms();
      },

      // Dismiss the active alarm
      dismissAlarm: () => {
        // Stop the alarm sound
        stopAlarm();

        // Clear the active alarm
        set({ activeAlarm: null });
      },
    }),
    {
      name: "alarm-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        alarmPrefs: state.alarmPrefs,
        // Don't persist timers or active alarm
      }),
    }
  )
);
