import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationPrefs, PrayerName, PrayerTimes } from '../types';

/**
 * Notification utility functions for SalatPath app
 */

// Hardcoded prayer times for MVP
export const PRAYER_TIMES: PrayerTimes = {
  fajr: '5:50 AM',
  dhuhr: '1:35 PM',
  asr: '4:00 PM',
  maghrib: '6:50 PM',
  isha: '8:05 PM'
};

// Configure notifications
export const configureNotifications = async (): Promise<boolean> => {
  try {
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission for notifications not granted!');
      return false;
    }

    // Create notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('prayer-times', {
        name: 'Prayer Times',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return true;
  } catch (error) {
    console.error('Error configuring notifications:', error);
    return false;
  }
};

// Parse time string to get hours and minutes
const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return { hours, minutes };
};

// Schedule a notification for a specific prayer time
const schedulePrayerNotification = async (
  prayerName: PrayerName,
  timeStr: string
): Promise<string> => {
  try {
    const { hours, minutes } = parseTimeString(timeStr);
    
    // Calculate the next occurrence of this prayer time
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }
    
    // Format prayer name for display
    const formattedPrayerName = prayerName.charAt(0).toUpperCase() + prayerName.slice(1);
    
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `SalatPath - ${formattedPrayerName} Time`,
        body: `Time for ${formattedPrayerName} prayer (${timeStr})`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
    
    return notificationId;
  } catch (error) {
    console.error(`Error scheduling ${prayerName} notification:`, error);
    return '';
  }
};

// Schedule all prayer notifications based on user preferences
export const schedulePrayerNotifications = async (
  prefs: NotificationPrefs
): Promise<Record<PrayerName, string>> => {
  try {
    // Cancel all existing notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    const notificationIds: Record<PrayerName, string> = {
      fajr: '',
      dhuhr: '',
      asr: '',
      maghrib: '',
      isha: ''
    };
    
    // Schedule notifications for each prayer based on preferences
    if (prefs.fajr) {
      notificationIds.fajr = await schedulePrayerNotification('fajr', PRAYER_TIMES.fajr);
    }
    
    if (prefs.dhuhr) {
      notificationIds.dhuhr = await schedulePrayerNotification('dhuhr', PRAYER_TIMES.dhuhr);
    }
    
    if (prefs.asr) {
      notificationIds.asr = await schedulePrayerNotification('asr', PRAYER_TIMES.asr);
    }
    
    if (prefs.maghrib) {
      notificationIds.maghrib = await schedulePrayerNotification('maghrib', PRAYER_TIMES.maghrib);
    }
    
    if (prefs.isha) {
      notificationIds.isha = await schedulePrayerNotification('isha', PRAYER_TIMES.isha);
    }
    
    return notificationIds;
  } catch (error) {
    console.error('Error scheduling prayer notifications:', error);
    return { fajr: '', dhuhr: '', asr: '', maghrib: '', isha: '' };
  }
};
