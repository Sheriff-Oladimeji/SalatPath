import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationPrefs, PrayerName } from '../types';
import { schedulePrayerNotifications, configureNotifications } from '../utils/notifications';

interface NotificationState {
  // Notification preferences for each prayer
  notificationPrefs: NotificationPrefs;
  
  // Actions
  toggleNotification: (prayer: PrayerName) => Promise<void>;
  initializeNotifications: () => Promise<void>;
}

// Create the store with persistence
export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Initial state - all notifications enabled by default
      notificationPrefs: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true,
      },
      
      // Toggle notification for a specific prayer
      toggleNotification: async (prayer: PrayerName) => {
        // Update state
        set((state) => {
          const updatedPrefs = {
            ...state.notificationPrefs,
            [prayer]: !state.notificationPrefs[prayer],
          };
          
          return { notificationPrefs: updatedPrefs };
        });
        
        // Reschedule notifications with updated preferences
        await get().initializeNotifications();
      },
      
      // Initialize notifications
      initializeNotifications: async () => {
        try {
          // Configure notifications
          const configured = await configureNotifications();
          
          if (configured) {
            // Schedule notifications based on current preferences
            await schedulePrayerNotifications(get().notificationPrefs);
          }
        } catch (error) {
          console.error('Error initializing notifications:', error);
        }
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
