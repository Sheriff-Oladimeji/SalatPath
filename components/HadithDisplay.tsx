import React from 'react';
import { View, Text } from 'react-native';
import { Hadith } from '../src/types';

interface HadithDisplayProps {
  hadith: Hadith | null;
}

const HadithDisplay: React.FC<HadithDisplayProps> = ({ hadith }) => {
  if (!hadith) {
    return null;
  }

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <Text className="text-center text-lg font-semibold text-gray-800 mb-2">
        Daily Hadith
      </Text>
      
      <Text className="text-center text-base text-gray-700 italic mb-2">
        "{hadith.text}"
      </Text>
      
      <Text className="text-center text-sm text-gray-500">
        Source: {hadith.source}
      </Text>
    </View>
  );
};

export default HadithDisplay;
