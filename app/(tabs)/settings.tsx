import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PrayerName } from "../../src/types";
import { PRAYER_TIMES } from "../../src/utils/alarm";
import { useAlarmStore } from "../../src/store/useAlarmStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import TahajjudAlarmButton from "../../components/TahajjudAlarmButton";

const SettingsScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get alarm preferences and actions from Zustand store
  const { alarmPrefs, toggleAlarm, initializeAlarms } = useAlarmStore();

  // Get theme from store
  const { colors, isDarkMode, toggleTheme } = useThemeStore();

  // Initialize alarms on component mount
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);
      await initializeAlarms();
      setIsLoading(false);
    };

    initialize();
  }, []);

  // Handle toggle change for a specific prayer
  const handleToggleChange = async (prayer: PrayerName) => {
    try {
      await toggleAlarm(prayer);
    } catch (error) {
      console.error("Error updating alarm preferences:", error);
    }
  };

  // Format prayer name for display
  const formatPrayerName = (name: PrayerName): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Create styles based on theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      color: colors.text,
      marginBottom: 16,
    },
    sectionContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 16,
    },
    loadingText: {
      textAlign: "center",
      color: colors.gray,
    },
    prayerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastPrayerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    prayerName: {
      fontSize: 16,
      color: colors.text,
    },
    prayerTime: {
      fontSize: 14,
      color: colors.gray,
    },
    themeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    themeIconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    themeIcon: {
      marginRight: 12,
    },
    themeText: {
      fontSize: 16,
      color: colors.text,
    },
    aboutText: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 8,
    },
    versionText: {
      fontSize: 14,
      color: colors.gray,
      fontStyle: "italic",
    },
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        {/* Prayer Time Notifications */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Prayer Time Alarms</Text>

          {isLoading ? (
            <Text style={styles.loadingText}>Loading preferences...</Text>
          ) : (
            <>
              {/* Fajr */}
              <View style={styles.prayerRow}>
                <View>
                  <Text style={styles.prayerName}>
                    {formatPrayerName("fajr")}
                  </Text>
                  <Text style={styles.prayerTime}>{PRAYER_TIMES.fajr}</Text>
                </View>
                <Switch
                  value={alarmPrefs.fajr}
                  onValueChange={() => handleToggleChange("fajr")}
                  trackColor={{ false: colors.lightGray, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Dhuhr */}
              <View style={styles.prayerRow}>
                <View>
                  <Text style={styles.prayerName}>
                    {formatPrayerName("dhuhr")}
                  </Text>
                  <Text style={styles.prayerTime}>{PRAYER_TIMES.dhuhr}</Text>
                </View>
                <Switch
                  value={alarmPrefs.dhuhr}
                  onValueChange={() => handleToggleChange("dhuhr")}
                  trackColor={{ false: colors.lightGray, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Asr */}
              <View style={styles.prayerRow}>
                <View>
                  <Text style={styles.prayerName}>
                    {formatPrayerName("asr")}
                  </Text>
                  <Text style={styles.prayerTime}>{PRAYER_TIMES.asr}</Text>
                </View>
                <Switch
                  value={alarmPrefs.asr}
                  onValueChange={() => handleToggleChange("asr")}
                  trackColor={{ false: colors.lightGray, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Maghrib */}
              <View style={styles.prayerRow}>
                <View>
                  <Text style={styles.prayerName}>
                    {formatPrayerName("maghrib")}
                  </Text>
                  <Text style={styles.prayerTime}>{PRAYER_TIMES.maghrib}</Text>
                </View>
                <Switch
                  value={alarmPrefs.maghrib}
                  onValueChange={() => handleToggleChange("maghrib")}
                  trackColor={{ false: colors.lightGray, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Isha */}
              <View style={styles.prayerRow}>
                <View>
                  <Text style={styles.prayerName}>
                    {formatPrayerName("isha")}
                  </Text>
                  <Text style={styles.prayerTime}>{PRAYER_TIMES.isha}</Text>
                </View>
                <Switch
                  value={alarmPrefs.isha}
                  onValueChange={() => handleToggleChange("isha")}
                  trackColor={{ false: colors.lightGray, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              {/* Tahajjud */}
              <View style={styles.lastPrayerRow}>
                <View>
                  <Text style={styles.prayerName}>Tahajjud</Text>
                  <Text style={styles.prayerTime}>{PRAYER_TIMES.tahajjud}</Text>
                </View>
                <Switch
                  value={alarmPrefs.tahajjud}
                  onValueChange={() => handleToggleChange("tahajjud")}
                  trackColor={{ false: colors.lightGray, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>
            </>
          )}
        </View>

        {/* Theme Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Appearance</Text>

          <View style={styles.themeRow}>
            <View style={styles.themeIconContainer}>
              <Ionicons
                name={isDarkMode ? "moon" : "sunny"}
                size={24}
                color={isDarkMode ? colors.gray : "#FFB800"}
                style={styles.themeIcon}
              />
              <Text style={styles.themeText}>
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.lightGray, true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Tahajjud Alarm (for debugging) */}
        <TahajjudAlarmButton />

        {/* About */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>

          <Text style={styles.aboutText}>
            SalahTrack helps you track your five daily prayers and receive
            timely notifications.
          </Text>

          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
