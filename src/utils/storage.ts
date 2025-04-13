import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrayerLog, StreakData, NotificationPrefs } from '../types';

/**
 * Storage utility functions for SalatPath app
 */

// Storage keys
const PRAYER_LOG_KEY_PREFIX = 'prayerLogs_';
const STREAK_DATA_KEY = 'streakData';
const DAILY_HADITH_INDEX_KEY_PREFIX = 'dailyHadithIndex_';
const NOTIFICATION_PREFS_KEY = 'notificationPrefs';

// Get prayer log for a specific date
export const getPrayerLog = async (date: string): Promise<PrayerLog | null> => {
  try {
    const key = `${PRAYER_LOG_KEY_PREFIX}${date}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting prayer log:', error);
    return null;
  }
};

// Save prayer log for a specific date
export const savePrayerLog = async (date: string, prayerLog: PrayerLog): Promise<boolean> => {
  try {
    const key = `${PRAYER_LOG_KEY_PREFIX}${date}`;
    await AsyncStorage.setItem(key, JSON.stringify(prayerLog));
    return true;
  } catch (error) {
    console.error('Error saving prayer log:', error);
    return false;
  }
};

// Get streak data
export const getStreakData = async (): Promise<StreakData> => {
  try {
    const data = await AsyncStorage.getItem(STREAK_DATA_KEY);
    return data ? JSON.parse(data) : { count: 0, lastCompletedDate: '' };
  } catch (error) {
    console.error('Error getting streak data:', error);
    return { count: 0, lastCompletedDate: '' };
  }
};

// Save streak data
export const saveStreakData = async (streakData: StreakData): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STREAK_DATA_KEY, JSON.stringify(streakData));
    return true;
  } catch (error) {
    console.error('Error saving streak data:', error);
    return false;
  }
};

// Get daily Hadith index for a specific date
export const getDailyHadithIndex = async (date: string): Promise<number> => {
  try {
    const key = `${DAILY_HADITH_INDEX_KEY_PREFIX}${date}`;
    const data = await AsyncStorage.getItem(key);
    
    if (data) {
      return parseInt(data, 10);
    } else {
      // Generate a random index between 0 and 49 (for 50 hadiths)
      const randomIndex = Math.floor(Math.random() * 50);
      await AsyncStorage.setItem(key, randomIndex.toString());
      return randomIndex;
    }
  } catch (error) {
    console.error('Error getting daily Hadith index:', error);
    return 0; // Default to first Hadith in case of error
  }
};

// Get notification preferences
export const getNotificationPrefs = async (): Promise<NotificationPrefs> => {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATION_PREFS_KEY);
    return data 
      ? JSON.parse(data) 
      : { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true };
  }
};

// Save notification preferences
export const saveNotificationPrefs = async (prefs: NotificationPrefs): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(prefs));
    return true;
  } catch (error) {
    console.error('Error saving notification preferences:', error);
    return false;
  }
};

// Check if all prayers are completed for a specific date
export const areAllPrayersCompleted = async (date: string): Promise<boolean> => {
  const prayerLog = await getPrayerLog(date);
  if (!prayerLog) return false;
  
  return (
    prayerLog.fajr &&
    prayerLog.dhuhr &&
    prayerLog.asr &&
    prayerLog.maghrib &&
    prayerLog.isha
  );
};

// Update streak based on prayer completion
export const updateStreak = async (date: string): Promise<StreakData> => {
  const allCompleted = await areAllPrayersCompleted(date);
  const streakData = await getStreakData();
  
  if (allCompleted) {
    // Check if this is a consecutive day
    const lastDate = new Date(streakData.lastCompletedDate);
    const currentDate = new Date(date);
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    // If this is the first completion or a consecutive day
    if (
      streakData.lastCompletedDate === '' || 
      Math.abs(currentDate.getTime() - lastDate.getTime()) <= oneDayInMs
    ) {
      const newStreakData: StreakData = {
        count: streakData.count + 1,
        lastCompletedDate: date
      };
      await saveStreakData(newStreakData);
      return newStreakData;
    } else {
      // Reset streak if not consecutive
      const newStreakData: StreakData = {
        count: 1,
        lastCompletedDate: date
      };
      await saveStreakData(newStreakData);
      return newStreakData;
    }
  }
  
  return streakData;
};

// Get all prayer logs for a month (for calendar view)
export const getMonthPrayerLogs = async (year: number, month: number): Promise<Record<string, boolean>> => {
  try {
    const result: Record<string, boolean> = {};
    
    // Get all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    const prayerLogKeys = keys.filter(key => key.startsWith(PRAYER_LOG_KEY_PREFIX));
    
    // Filter keys for the specified month
    const monthStr = month < 10 ? `0${month}` : `${month}`;
    const monthPrefix = `${PRAYER_LOG_KEY_PREFIX}${year}-${monthStr}`;
    
    const monthKeys = prayerLogKeys.filter(key => key.startsWith(monthPrefix));
    
    // Get all prayer logs for the month
    for (const key of monthKeys) {
      const date = key.replace(PRAYER_LOG_KEY_PREFIX, '');
      const prayerLog = await getPrayerLog(date);
      
      if (prayerLog) {
        // Mark date as completed if all prayers are done
        result[date] = prayerLog.fajr && prayerLog.dhuhr && prayerLog.asr && prayerLog.maghrib && prayerLog.isha;
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error getting month prayer logs:', error);
    return {};
  }
};
