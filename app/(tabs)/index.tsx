import React, { useState } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";
import { format } from "date-fns";
import PrayerItem from "../../components/PrayerItem";
import StreakCounter from "../../components/StreakCounter";
import HadithDisplay from "../../components/HadithDisplay";
import CompletionModal from "../../components/CompletionModal";
import { PrayerName } from "../../src/types";
import { PRAYER_TIMES } from "../../src/utils/notifications";
import { hadiths } from "../../src/data/hadiths";
import { usePrayerStore } from "../../src/store/usePrayerStore";

const DashboardScreen: React.FC = () => {
  // State for modal visibility
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Get data and actions from Zustand store
  const {
    currentDate,
    prayerLogs,
    streak,
    togglePrayer,
    areAllPrayersCompleted,
    getDailyHadithIndex,
  } = usePrayerStore();

  // Get prayer log for current date
  const prayerLog = prayerLogs[currentDate] || {
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  };

  // Check if all prayers are completed
  const allCompleted = areAllPrayersCompleted(currentDate);

  // Get daily hadith index
  const hadithIndex = getDailyHadithIndex(currentDate);

  // Handle prayer toggle
  const handlePrayerToggle = (name: PrayerName) => {
    // Show completion modal if prayer is being marked as completed
    if (!prayerLog[name]) {
      setModalVisible(true);
    }

    // Update prayer in store
    togglePrayer(currentDate, name);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        {/* Date display */}
        <Text className="text-xl font-bold text-center text-gray-800 mb-4">
          {format(new Date(currentDate), "EEEE, MMMM d, yyyy")}
        </Text>

        {/* Streak counter */}
        <StreakCounter count={streak} />

        {/* Prayer list */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-2">
            Today's Prayers
          </Text>

          <PrayerItem
            name="fajr"
            time={PRAYER_TIMES.fajr}
            completed={prayerLog.fajr}
            onToggle={handlePrayerToggle}
          />

          <PrayerItem
            name="dhuhr"
            time={PRAYER_TIMES.dhuhr}
            completed={prayerLog.dhuhr}
            onToggle={handlePrayerToggle}
          />

          <PrayerItem
            name="asr"
            time={PRAYER_TIMES.asr}
            completed={prayerLog.asr}
            onToggle={handlePrayerToggle}
          />

          <PrayerItem
            name="maghrib"
            time={PRAYER_TIMES.maghrib}
            completed={prayerLog.maghrib}
            onToggle={handlePrayerToggle}
          />

          <PrayerItem
            name="isha"
            time={PRAYER_TIMES.isha}
            completed={prayerLog.isha}
            onToggle={handlePrayerToggle}
          />
        </View>

        {/* Daily Hadith (shown only when all prayers are completed) */}
        {allCompleted && <HadithDisplay hadith={hadiths[hadithIndex]} />}
      </ScrollView>

      {/* Completion modal */}
      <CompletionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default DashboardScreen;
