import React from 'react';
import { View, Text } from 'react-native';

interface StreakCounterProps {
  count: number;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ count }) => {
  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <Text className="text-center text-lg font-semibold text-gray-800 mb-1">
        Current Streak
      </Text>
      
      <Text className="text-center text-3xl font-bold text-green-600 mb-2">
        {count} {count === 1 ? 'Day' : 'Days'}
      </Text>
      
      <Text className="text-center text-xs text-gray-500 italic">
        Streak helps track consistency. The true reward is from Allah.
      </Text>
    </View>
  );
};

export default StreakCounter;
