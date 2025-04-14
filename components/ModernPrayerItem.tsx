import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PrayerName } from "../src/types";
import { useThemeStore } from "../src/store/useThemeStore";

interface ModernPrayerItemProps {
  name: PrayerName;
  time: string | undefined;
  completed: boolean;
  onToggle: (name: PrayerName) => void;
  isCurrentDate: boolean;
}

const ModernPrayerItem: React.FC<ModernPrayerItemProps> = ({
  name,
  time,
  completed,
  onToggle,
  isCurrentDate,
}) => {
  const { colors } = useThemeStore();

  // Format prayer name for display
  const formatPrayerName = (name: PrayerName): string => {
    const names: Record<string, string> = {
      fajr: "Fajr",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
      tahajjud: "Tahajjud",
    };

    return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Get prayer icon
  const getPrayerIcon = (name: PrayerName): string => {
    const icons: Record<string, string> = {
      fajr: "sunny-outline",
      dhuhr: "sunny",
      asr: "partly-sunny-outline",
      maghrib: "moon-outline",
      isha: "moon",
      tahajjud: "star",
    };

    return icons[name] || "time-outline";
  };

  return (
    <View
      style={{ backgroundColor: colors.card }}
      className="rounded-[20px] mb-3 overflow-hidden relative"
    >
      <TouchableOpacity
        onPress={() => isCurrentDate && onToggle(name)}
        disabled={!isCurrentDate}
        className="flex-row items-center p-3.5"
      >
        <View
          className="w-[46px] h-[46px] rounded-full justify-center items-center mr-3.5"
          style={{
            backgroundColor: completed ? colors.success : colors.secondary,
          }}
        >
          <Ionicons name={getPrayerIcon(name) as any} size={24} color="white" />
        </View>

        <View className="flex-1">
          <Text
            style={{ color: colors.text }}
            className="text-lg font-semibold mb-1"
          >
            {formatPrayerName(name)}
          </Text>
          <Text style={{ color: colors.gray }} className="text-sm">
            {time}
          </Text>
        </View>

        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 2,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: completed ? colors.success : "transparent",
            borderColor: completed ? colors.success : colors.border,
          }}
        >
          {completed && <Ionicons name="checkmark" size={18} color="white" />}
        </View>
      </TouchableOpacity>

      {!isCurrentDate && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: colors.background,
            opacity: 0.5,
            borderRadius: 16,
          }}
        />
      )}
    </View>
  );
};

export default ModernPrayerItem;
