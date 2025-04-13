import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView } from "react-native";

import { format } from "date-fns";
import PrayerItem from "../../components/PrayerItem";
import StreakCounter from "../../components/StreakCounter";
import HadithDisplay from "../../components/HadithDisplay";
import CompletionModal from "../../components/CompletionModal";
import { PrayerLog, PrayerName, StreakData } from "../../src/types";
import { PRAYER_TIMES } from "../../src/utils/notifications";
import {
  getPrayerLog,
  savePrayerLog,
  getStreakData,
  updateStreak,
  getDailyHadithIndex,
  areAllPrayersCompleted,
} from "../../src/utils/storage";
import { hadiths } from "../../src/data/hadiths";

const DashboardScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [prayerLog, setPrayerLog] = useState<PrayerLog>({
    fajr: false,
    dhuhr: false,
    asr: false,
    maghrib: false,
    isha: false,
  });
  const [streakData, setStreakData] = useState<StreakData>({
    count: 0,
    lastCompletedDate: "",
  });
  const [hadithIndex, setHadithIndex] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [allCompleted, setAllCompleted] = useState<boolean>(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Load prayer log, streak data, and daily hadith
  const loadData = async () => {
    try {
      // Get prayer log for current date
      const savedPrayerLog = await getPrayerLog(currentDate);
      if (savedPrayerLog) {
        setPrayerLog(savedPrayerLog);

        // Check if all prayers are completed
        const completed = await areAllPrayersCompleted(currentDate);
        setAllCompleted(completed);
      }

      // Get streak data
      const savedStreakData = await getStreakData();
      setStreakData(savedStreakData);

      // Get daily hadith index
      const index = await getDailyHadithIndex(currentDate);
      setHadithIndex(index);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Handle prayer toggle
  const handlePrayerToggle = async (name: PrayerName) => {
    try {
      // Update prayer log
      const updatedPrayerLog = {
        ...prayerLog,
        [name]: !prayerLog[name],
      };

      // Save updated prayer log
      await savePrayerLog(currentDate, updatedPrayerLog);
      setPrayerLog(updatedPrayerLog);

      // Show completion modal if prayer is marked as completed
      if (!prayerLog[name]) {
        setModalVisible(true);
      }

      // Check if all prayers are now completed
      const completed =
        updatedPrayerLog.fajr &&
        updatedPrayerLog.dhuhr &&
        updatedPrayerLog.asr &&
        updatedPrayerLog.maghrib &&
        updatedPrayerLog.isha;

      setAllCompleted(completed);

      // Update streak if all prayers are completed
      if (completed) {
        const newStreakData = await updateStreak(currentDate);
        setStreakData(newStreakData);
      }
    } catch (error) {
      console.error("Error toggling prayer:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 p-4">
        {/* Date display */}
        <Text className="text-xl font-bold text-center text-gray-800 mb-4">
          {format(new Date(currentDate), "EEEE, MMMM d, yyyy")}
        </Text>

        {/* Streak counter */}
        <StreakCounter count={streakData.count} />

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
