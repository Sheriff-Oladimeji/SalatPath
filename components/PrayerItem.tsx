import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PrayerName } from '../src/types';

interface PrayerItemProps {
  name: PrayerName;
  time: string;
  completed: boolean;
  onToggle: (name: PrayerName) => void;
}

const PrayerItem: React.FC<PrayerItemProps> = ({ name, time, completed, onToggle }) => {
  // Format prayer name for display
  const formatPrayerName = (name: PrayerName): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <View className="flex-row items-center justify-between p-4 mb-2 bg-white rounded-lg shadow-sm">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">{formatPrayerName(name)}</Text>
        <Text className="text-sm text-gray-500">{time}</Text>
      </View>
      
      <TouchableOpacity
        onPress={() => onToggle(name)}
        className={`w-6 h-6 rounded-md border ${
          completed ? 'bg-green-500 border-green-600' : 'bg-white border-gray-300'
        } justify-center items-center`}
      >
        {completed && (
          <Text className="text-white font-bold">✓</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PrayerItem;
