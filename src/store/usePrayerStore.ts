import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format, addDays, isYesterday, isToday, parseISO } from "date-fns";
import { PrayerLog, PrayerName } from "../types";

interface PrayerState {
  // Current date in 'YYYY-MM-DD' format
  currentDate: string;

  // Prayer logs for different dates
  prayerLogs: Record<string, PrayerLog>;

  // Streak information
  streak: number;
  lastCompletedDate: string;

  // Daily Hadith index for different dates
  dailyHadithIndices: Record<string, number>;

  // Actions
  togglePrayer: (date: string, prayer: PrayerName) => void;
  resetPrayers: (date: string) => void;
  getDailyHadithIndex: (date: string) => number;
  areAllPrayersCompleted: (date: string) => boolean;
  updateStreak: (date: string) => void;
  getFirstLogDate: () => Date | null;
  saveState: () => void;
}

// Create the store with persistence
export const usePrayerStore = create<PrayerState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDate: format(new Date(), "yyyy-MM-dd"),
      prayerLogs: {},
      streak: 0,
      lastCompletedDate: "",
      dailyHadithIndices: {},

      // Toggle a prayer's completion status
      togglePrayer: (date, prayer) => {
        set((state) => {
          // Get the prayer log for the date or create a new one
          const prayerLog = state.prayerLogs[date] || {
            fajr: false,
            dhuhr: false,
            asr: false,
            maghrib: false,
            isha: false,
            tahajjud: false,
          };

          // Toggle the prayer status
          const updatedPrayerLog = {
            ...prayerLog,
            [prayer]: !prayerLog[prayer],
          };

          // Update the prayer logs
          const updatedPrayerLogs = {
            ...state.prayerLogs,
            [date]: updatedPrayerLog,
          };

          return { prayerLogs: updatedPrayerLogs };
        });

        // Update streak after toggling prayer
        get().updateStreak(date);
      },

      // Reset all prayers for a specific date
      resetPrayers: (date) => {
        set((state) => {
          const updatedPrayerLogs = { ...state.prayerLogs };

          // Set all prayers to false for the date
          updatedPrayerLogs[date] = {
            fajr: false,
            dhuhr: false,
            asr: false,
            maghrib: false,
            isha: false,
            tahajjud: false,
          };

          return { prayerLogs: updatedPrayerLogs };
        });

        // Update streak after resetting prayers
        get().updateStreak(date);
      },

      // Get the daily Hadith index for a specific date
      getDailyHadithIndex: (date) => {
        const { dailyHadithIndices } = get();

        // If we already have an index for this date, return it
        if (dailyHadithIndices[date] !== undefined) {
          return dailyHadithIndices[date];
        }

        // Generate a random index between 0 and 49 (for 50 hadiths)
        const randomIndex = Math.floor(Math.random() * 50);

        // Save the index for this date
        set((state) => ({
          dailyHadithIndices: {
            ...state.dailyHadithIndices,
            [date]: randomIndex,
          },
        }));

        return randomIndex;
      },

      // Check if all prayers are completed for a specific date
      areAllPrayersCompleted: (date) => {
        const { prayerLogs } = get();
        const prayerLog = prayerLogs[date];

        if (!prayerLog) return false;

        // Check the 5 obligatory prayers (tahajjud is optional)
        return (
          prayerLog.fajr &&
          prayerLog.dhuhr &&
          prayerLog.asr &&
          prayerLog.maghrib &&
          prayerLog.isha
        );
      },

      // Get the first date the user started using the app
      getFirstLogDate: () => {
        const { prayerLogs } = get();
        const dates = Object.keys(prayerLogs);

        if (dates.length === 0) {
          return null;
        }

        // Sort dates in ascending order
        dates.sort((a, b) => a.localeCompare(b));

        // Return the earliest date
        return parseISO(dates[0]);
      },

      // Update streak based on prayer completion
      // Force save state to AsyncStorage
      saveState: () => {
        // The persist middleware should handle this automatically,
        // but we can force a save by setting state
        set((state) => ({ ...state }));
      },

      updateStreak: (date) => {
        set((state) => {
          const allCompleted = get().areAllPrayersCompleted(date);
          const { streak, lastCompletedDate } = state;

          // If all prayers are completed for the date
          if (allCompleted) {
            // If this is the first completion
            if (lastCompletedDate === "") {
              return {
                streak: 1,
                lastCompletedDate: date,
              };
            }

            // Check if the last completed date was yesterday or today
            const lastDate = new Date(lastCompletedDate);
            const currentDate = new Date(date);
            const expectedDate = addDays(lastDate, 1);

            // If the current date is the expected next date (continuing streak)
            if (
              format(currentDate, "yyyy-MM-dd") ===
                format(expectedDate, "yyyy-MM-dd") ||
              (isToday(currentDate) && isYesterday(lastDate))
            ) {
              return {
                streak: streak + 1,
                lastCompletedDate: date,
              };
            }

            // If the current date is the same as the last completed date (no change)
            if (
              format(currentDate, "yyyy-MM-dd") ===
              format(lastDate, "yyyy-MM-dd")
            ) {
              return state;
            }

            // Otherwise, reset streak (gap in days)
            return {
              streak: 1,
              lastCompletedDate: date,
            };
          } else {
            // If prayers for today were previously completed but now they're not
            if (date === lastCompletedDate) {
              // Deduct streak by 1, but don't go below 0
              return {
                streak: Math.max(0, streak - 1),
                // Keep the last completed date if streak is still positive
                lastCompletedDate: streak > 1 ? lastCompletedDate : "",
              };
            }

            // If prayers for a different date are incomplete, no change to streak
            return state;
          }
        });
      },
    }),
    {
      name: "prayer-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
