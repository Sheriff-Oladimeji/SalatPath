import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useThemeStore } from "../src/store/useThemeStore";
import { useAlarmStore } from "../src/store/useAlarmStore";
import { PRAYER_TIMES, getMillisecondsUntilPrayer } from "../src/utils/alarm";

const TahajjudAlarmButton: React.FC = () => {
  const { colors } = useThemeStore();
  const { triggerAlarm } = useAlarmStore();
  const [timeUntilAlarm, setTimeUntilAlarm] = useState<string>("");

  // Calculate and format time until Tahajjud alarm
  useEffect(() => {
    const updateTimeUntilAlarm = () => {
      const msUntilAlarm = getMillisecondsUntilPrayer(
        PRAYER_TIMES.tahajjud || ""
      );

      // Convert to hours, minutes, seconds
      const seconds = Math.floor(msUntilAlarm / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      const formattedTime = `${hours}h ${minutes % 60}m ${seconds % 60}s`;
      setTimeUntilAlarm(formattedTime);
    };

    // Update immediately and then every second
    updateTimeUntilAlarm();
    const interval = setInterval(updateTimeUntilAlarm, 1000);

    return () => clearInterval(interval);
  }, []);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      marginVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    title: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
    },
    timeText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.secondary,
      marginBottom: 16,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#FFFFFF",
      fontWeight: "600",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tahajjud Alarm</Text>
      <Text style={styles.infoText}>
        Scheduled for {PRAYER_TIMES.tahajjud || "1:12 AM"}
      </Text>
      <Text style={styles.timeText}>Time until alarm: {timeUntilAlarm}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => triggerAlarm("tahajjud")}
      >
        <Text style={styles.buttonText}>Trigger Tahajjud Alarm Now</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TahajjudAlarmButton;
