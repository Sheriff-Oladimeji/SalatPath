import React, { useState, useEffect } from 'react';
import { View, Text, Switch, SafeAreaView, ScrollView } from 'react-native';
import { NotificationPrefs, PrayerName } from '../../src/types';
import { getNotificationPrefs, saveNotificationPrefs } from '../../src/utils/storage';
import { schedulePrayerNotifications, configureNotifications, PRAYER_TIMES } from '../../src/utils/notifications';

const SettingsScreen: React.FC = () => {
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load notification preferences on component mount
  useEffect(() => {
    loadNotificationPrefs();
  }, []);

  // Load notification preferences from storage
  const loadNotificationPrefs = async () => {
    try {
      setIsLoading(true);
      const prefs = await getNotificationPrefs();
      setNotificationPrefs(prefs);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      setIsLoading(false);
    }
  };

  // Handle toggle change for a specific prayer
  const handleToggleChange = async (prayer: PrayerName, value: boolean) => {
    try {
      // Update state
      const updatedPrefs = {
        ...notificationPrefs,
        [prayer]: value,
      };
      setNotificationPrefs(updatedPrefs);
      
      // Save to storage
      await saveNotificationPrefs(updatedPrefs);
      
      // Configure and schedule notifications
      await configureNotifications();
      await schedulePrayerNotifications(updatedPrefs);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
    }
  };

  // Format prayer name for display
  const formatPrayerName = (name: PrayerName): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        <Text className="text-xl font-bold text-center text-gray-800 mb-4">
          Settings
        </Text>
        
        {/* Prayer Time Notifications */}
        <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Prayer Time Notifications
          </Text>
          
          {isLoading ? (
            <Text className="text-center text-gray-500">Loading preferences...</Text>
          ) : (
            <>
              {/* Fajr */}
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <View>
                  <Text className="text-base text-gray-800">
                    {formatPrayerName('fajr')}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {PRAYER_TIMES.fajr}
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.fajr}
                  onValueChange={(value) => handleToggleChange('fajr', value)}
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor="#ffffff"
                />
              </View>
              
              {/* Dhuhr */}
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <View>
                  <Text className="text-base text-gray-800">
                    {formatPrayerName('dhuhr')}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {PRAYER_TIMES.dhuhr}
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.dhuhr}
                  onValueChange={(value) => handleToggleChange('dhuhr', value)}
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor="#ffffff"
                />
              </View>
              
              {/* Asr */}
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <View>
                  <Text className="text-base text-gray-800">
                    {formatPrayerName('asr')}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {PRAYER_TIMES.asr}
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.asr}
                  onValueChange={(value) => handleToggleChange('asr', value)}
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor="#ffffff"
                />
              </View>
              
              {/* Maghrib */}
              <View className="flex-row justify-between items-center py-2 border-b border-gray-100">
                <View>
                  <Text className="text-base text-gray-800">
                    {formatPrayerName('maghrib')}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {PRAYER_TIMES.maghrib}
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.maghrib}
                  onValueChange={(value) => handleToggleChange('maghrib', value)}
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor="#ffffff"
                />
              </View>
              
              {/* Isha */}
              <View className="flex-row justify-between items-center py-2">
                <View>
                  <Text className="text-base text-gray-800">
                    {formatPrayerName('isha')}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {PRAYER_TIMES.isha}
                  </Text>
                </View>
                <Switch
                  value={notificationPrefs.isha}
                  onValueChange={(value) => handleToggleChange('isha', value)}
                  trackColor={{ false: '#d1d5db', true: '#10b981' }}
                  thumbColor="#ffffff"
                />
              </View>
            </>
          )}
        </View>
        
        {/* About */}
        <View className="bg-white rounded-lg shadow-sm p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            About
          </Text>
          
          <Text className="text-base text-gray-700 mb-2">
            SalatPath helps you track your five daily prayers, maintain a streak, and receive timely notifications.
          </Text>
          
          <Text className="text-sm text-gray-500 italic">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
