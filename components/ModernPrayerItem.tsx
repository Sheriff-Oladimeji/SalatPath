import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PrayerName } from "../src/types";
import { useThemeStore } from "../src/store/useThemeStore";

interface ModernPrayerItemProps {
  name: PrayerName;
  time: string;
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
    const names: Record<PrayerName, string> = {
      fajr: "Fajr",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha",
    };

    return names[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Get prayer icon
  const getPrayerIcon = (name: PrayerName): string => {
    const icons: Record<PrayerName, string> = {
      fajr: "sunny-outline",
      dhuhr: "sunny",
      asr: "partly-sunny-outline",
      maghrib: "moon-outline",
      isha: "moon",
    };

    return icons[name] || "time-outline";
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 20,
      marginBottom: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      padding: 14,
    },
    iconContainer: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: completed ? colors.success : colors.secondary,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    textContainer: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 4,
    },
    time: {
      fontSize: 14,
      color: colors.gray,
    },
    checkboxContainer: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: completed ? colors.success : colors.lightGray,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: completed ? colors.success : "transparent",
    },
    disabledOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.background,
      opacity: 0.5,
      borderRadius: 16,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => isCurrentDate && onToggle(name)}
        disabled={!isCurrentDate}
        style={styles.content}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={getPrayerIcon(name) as any} size={24} color="white" />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{formatPrayerName(name)}</Text>
          <Text style={styles.time}>{time}</Text>
        </View>

        <View style={styles.checkboxContainer}>
          {completed && <Ionicons name="checkmark" size={18} color="white" />}
        </View>
      </TouchableOpacity>

      {!isCurrentDate && <View style={styles.disabledOverlay} />}
    </View>
  );
};

export default ModernPrayerItem;
