import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import { format, isSameDay } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import ModernPrayerItem from "../../components/ModernPrayerItem";
import DateSelector from "../../components/DateSelector";
import HadithDisplay from "../../components/HadithDisplay";
import CompletionModal from "../../components/CompletionModal";
import AlarmModal from "../../components/AlarmModal";
import { PrayerName } from "../../src/types";
import { PRAYER_TIMES } from "../../src/utils/alarm";
import { hadiths } from "../../src/data/hadiths";
import { usePrayerStore } from "../../src/store/usePrayerStore";
import { useThemeStore } from "../../src/store/useThemeStore";
import { useAlarmStore } from "../../src/store/useAlarmStore";

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

  // Get alarm state and actions
  const { activeAlarm, dismissAlarm } = useAlarmStore();

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
    tahajjud: false,
  };

  // Check if all prayers are completed
  const allPrayersCompleted = areAllPrayersCompleted(selectedDateStr);

  // Get hadith index for the day
  const hadithIndex = getDailyHadithIndex(selectedDateStr);

  // Handle prayer toggle
  const handlePrayerToggle = (name: PrayerName) => {
    togglePrayer(selectedDateStr, name);

    // Show completion modal if all prayers are completed
    if (!prayerLog[name] && areAllPrayersCompleted(selectedDateStr)) {
      setModalVisible(true);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Set status bar based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(colors.card);
    }
  }, [isDarkMode]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      className="flex-1"
    >
      {/* Header */}
      <View className="pt-2">
        <View className="flex-row justify-between items-center px-4 pb-2">
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "600",
            }}
          >
            {format(selectedDate, "MMMM yyyy")}
          </Text>
          <View
            style={{
              backgroundColor: colors.card,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 20,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="flame" size={20} color={colors.secondary} />
            <Text
              style={{
                color: colors.secondary,
                fontSize: 16,
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              {streak}
            </Text>
          </View>
        </View>

        {/* Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Hadith */}
        <View
          style={{ backgroundColor: colors.card }}
          className="rounded-[20px] p-4 mb-4"
        >
          <Text
            style={{ color: colors.text }}
            className="text-lg font-semibold mb-3"
          >
            Hadith of the Day
          </Text>
          <HadithDisplay hadith={hadiths[hadithIndex]} />
        </View>

        {/* Prayer List */}
        <Text
          style={{ color: colors.text }}
          className="text-lg font-semibold mb-3 mt-2"
        >
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

        {/* Tahajjud Prayer (Optional) */}
        <ModernPrayerItem
          name="tahajjud"
          time={PRAYER_TIMES.tahajjud}
          completed={prayerLog.tahajjud}
          onToggle={handlePrayerToggle}
          isCurrentDate={isCurrentDate}
        />

        {/* Completion Message */}
        <View
          style={{ backgroundColor: colors.card }}
          className="rounded-[20px] p-3 mt-4 items-center"
        >
          <Text
            style={{ color: colors.text }}
            className="text-base font-medium text-center"
          >
            {allPrayersCompleted
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

      {/* Alarm modal */}
      <AlarmModal
        visible={activeAlarm !== null}
        prayerName={activeAlarm}
        onDismiss={dismissAlarm}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;
