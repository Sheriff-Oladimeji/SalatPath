import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { format, isSameDay } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import ModernPrayerItem from "../../components/ModernPrayerItem";
import DateSelector from "../../components/DateSelector";
import HadithDisplay from "../../components/HadithDisplay";
import CompletionModal from "../../components/CompletionModal";
import { PrayerName } from "../../src/types";
import { PRAYER_TIMES } from "../../src/utils/notifications";
import { hadiths } from "../../src/data/hadiths";
import { usePrayerStore } from "../../src/store/usePrayerStore";
import { useThemeStore } from "../../src/store/useThemeStore";

const DashboardScreen: React.FC = () => {
  // State for modal visibility and selected date
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get theme from store
  const { colors, isDarkMode } = useThemeStore();

  // Get data and actions from Zustand store
  const {
    prayerLogs,
    streak,
    togglePrayer,
    areAllPrayersCompleted,
    getDailyHadithIndex,
  } = usePrayerStore();

  // Format selected date to string
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");

  // Check if selected date is today
  const isCurrentDate = isSameDay(selectedDate, new Date());

  // Get prayer log for selected date
  const prayerLog = prayerLogs[selectedDateStr] || {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };

  // Check if all prayers are completed
  const allCompleted = areAllPrayersCompleted(selectedDateStr);

  // Get daily hadith index for the Hadith of the Day
  const hadithIndex = getDailyHadithIndex(selectedDateStr);

  // Handle prayer toggle (only for current date)
  const handlePrayerToggle = (name: PrayerName) => {
    if (!isCurrentDate) return;

    // Show completion modal if prayer is being marked as completed
    if (!prayerLog[name]) {
      setModalVisible(true);
    }

    // Update prayer in store
    togglePrayer(selectedDateStr, name);
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Create styles based on theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.card,
      paddingTop: StatusBar.currentHeight || 40,
      paddingBottom: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
    },
    monthYearText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    topStreakContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.background,
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    streakCount: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.secondary,
      marginLeft: 4,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    hadithContainer: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    completionContainer: {
      backgroundColor: colors.card,
      borderRadius: 20,
      padding: 12,
      marginTop: 16,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    completionText: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
      textAlign: "center",
    },
  });

  // Set status bar based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.card);
    }
  }, [isDarkMode]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.monthYearText}>
            {format(selectedDate, "MMMM yyyy")}
          </Text>
          <View style={styles.topStreakContainer}>
            <Ionicons name="flame" size={18} color={colors.secondary} />
            <Text style={styles.streakCount}>{streak}</Text>
          </View>
        </View>

        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 12 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Hadith */}
        <View style={styles.hadithContainer}>
          <Text style={styles.sectionTitle}>Hadith of the Day</Text>
          <HadithDisplay hadith={hadiths[hadithIndex]} />
        </View>

        {/* Prayer List */}
        <Text style={styles.sectionTitle}>
          {isCurrentDate ? "Today's Prayers" : "Prayers"}
        </Text>

        <ModernPrayerItem
          name="fajr"
          time={PRAYER_TIMES.fajr}
          completed={prayerLog.fajr}
          onToggle={handlePrayerToggle}
          isCurrentDate={isCurrentDate}
        />

        <ModernPrayerItem
          name="dhuhr"
          time={PRAYER_TIMES.dhuhr}
          completed={prayerLog.dhuhr}
          onToggle={handlePrayerToggle}
          isCurrentDate={isCurrentDate}
        />

        <ModernPrayerItem
          name="asr"
          time={PRAYER_TIMES.asr}
          completed={prayerLog.asr}
          onToggle={handlePrayerToggle}
          isCurrentDate={isCurrentDate}
        />

        <ModernPrayerItem
          name="maghrib"
          time={PRAYER_TIMES.maghrib}
          completed={prayerLog.maghrib}
          onToggle={handlePrayerToggle}
          isCurrentDate={isCurrentDate}
        />

        <ModernPrayerItem
          name="isha"
          time={PRAYER_TIMES.isha}
          completed={prayerLog.isha}
          onToggle={handlePrayerToggle}
          isCurrentDate={isCurrentDate}
        />

        {/* Completion status */}
        <View style={styles.completionContainer}>
          <Text style={styles.completionText}>
            {allCompleted
              ? "All prayers completed for today! 🎉"
              : isCurrentDate
              ? "May Allah accept your prayers"
              : "Prayer record for this date"}
          </Text>
        </View>
      </ScrollView>

      {/* Completion modal */}
      <CompletionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default DashboardScreen;
