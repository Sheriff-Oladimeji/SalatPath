import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import QiblaCompass from '../../components/QiblaCompass';

const QiblaScreen: React.FC = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-4">
        <Text className="text-xl font-bold text-center text-gray-800 mb-4">
          Qibla Direction
        </Text>
        
        <QiblaCompass />
      </View>
    </SafeAreaView>
  );
};

export default QiblaScreen;
