import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../src/store/useThemeStore";
import { PrayerName } from "../src/types";

interface AlarmModalProps {
  visible: boolean;
  prayerName: PrayerName | null;
  onDismiss: () => void;
}

const AlarmModal: React.FC<AlarmModalProps> = ({
  visible,
  prayerName,
  onDismiss,
}) => {
  const { colors } = useThemeStore();

  // Format prayer name for display
  const formatPrayerName = (name: PrayerName | null): string => {
    if (!name) return "";
    const names: Record<string, string> = {
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      tahajjud: 'Tahajjud'
    };
    
    return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center bg-black/70">
        <View className="bg-card dark:bg-[#1E2A45] rounded-[20px] p-6 w-4/5 items-center border border-border dark:border-[#2D3A59] shadow-md">
          <View className="w-20 h-20 rounded-full bg-primary justify-center items-center mb-4">
            <Ionicons name="alarm" size={40} color="white" />
          </View>

          <Text className="text-2xl font-bold text-text dark:text-white mb-2 text-center">
            {formatPrayerName(prayerName)} Prayer Time
          </Text>

          <Text className="text-lg text-text dark:text-white text-center mb-6">
            It's time for {formatPrayerName(prayerName)} prayer. May Allah accept your prayers.
          </Text>

          <TouchableOpacity 
            onPress={onDismiss} 
            className="bg-primary py-3 px-6 rounded-full flex-row items-center"
          >
            <Ionicons name="checkmark-circle" size={20} color="white" />
            <Text className="text-white font-semibold text-base ml-2">Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AlarmModal;
