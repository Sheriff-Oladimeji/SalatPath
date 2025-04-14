import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { format } from "date-fns";
import { usePrayerStore } from "../../src/store/usePrayerStore";
import { useThemeStore } from "../../src/store/useThemeStore";

const HistoryScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [currentMonth, setCurrentMonth] = useState<{
    year: number;
    month: number;
  }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // JavaScript months are 0-indexed
  });

  // Get prayer logs from Zustand store
  const { prayerLogs, areAllPrayersCompleted } = usePrayerStore();

  // Get theme colors
  const { colors, isDarkMode } = useThemeStore();

  // Update marked dates when current month or prayer logs change
  useEffect(() => {
    loadMarkedDates();
  }, [currentMonth, prayerLogs]);

  // Mark dates on the calendar based on prayer completion
  const loadMarkedDates = () => {
    try {
      const { year, month } = currentMonth;
      const newMarkedDates: Record<string, any> = {};

      // Get month string (e.g., '01', '02', etc.)
      const monthStr = month < 10 ? `0${month}` : `${month}`;
      const monthPrefix = `${year}-${monthStr}`;

      // Filter prayer logs for the current month
      Object.keys(prayerLogs).forEach((date) => {
        if (date.startsWith(monthPrefix)) {
          const completed = areAllPrayersCompleted(date);

          newMarkedDates[date] = {
            selected: date === selectedDate,
            marked: true,
            dotColor: completed ? "green" : "red",
            selectedColor: date === selectedDate ? "#E0F2F1" : undefined,
          };
        }
      });

      // Mark selected date if not already marked
      if (!newMarkedDates[selectedDate]) {
        newMarkedDates[selectedDate] = {
          selected: true,
          selectedColor: "#E0F2F1",
        };
      }

      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error("Error loading marked dates:", error);
    }
  };

  // Handle month change
  const handleMonthChange = (monthData: any) => {
    setCurrentMonth({
      year: monthData.year,
      month: monthData.month,
    });
  };

  // Handle date selection
  const handleDayPress = (day: DateData) => {
    const newSelectedDate = day.dateString;
    setSelectedDate(newSelectedDate);

    // Update marked dates to reflect new selection
    const updatedMarkedDates = { ...markedDates };

    // Remove selection from previously selected date
    Object.keys(updatedMarkedDates).forEach((date) => {
      if (updatedMarkedDates[date].selected) {
        updatedMarkedDates[date] = {
          ...updatedMarkedDates[date],
          selected: false,
        };
      }
    });

    // Mark new selected date
    updatedMarkedDates[newSelectedDate] = {
      ...updatedMarkedDates[newSelectedDate],
      selected: true,
      selectedColor: "#E0F2F1",
    };

    setMarkedDates(updatedMarkedDates);
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
    calendarContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
      marginBottom: 16,
    },
    infoContainer: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
    },
    dateText: {
      fontSize: 16,
      textAlign: "center",
      color: colors.text,
      marginBottom: 8,
    },
    legendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 4,
    },
    legendText: {
      fontSize: 14,
      color: colors.text,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Prayer History</Text>

        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            markedDates={markedDates}
            theme={{
              calendarBackground: colors.card,
              textSectionTitleColor: colors.gray,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: colors.accent,
              dayTextColor: colors.text,
              textDisabledColor: colors.lightGray,
              dotColor: colors.primary,
              selectedDotColor: "#FFFFFF",
              arrowColor: colors.primary,
              monthTextColor: colors.text,
              indicatorColor: colors.primary,
              textDayFontWeight: "300",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "300",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.dateText}>
            {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
          </Text>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.success }]}
              />
              <Text style={styles.legendText}>Completed</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.error }]}
              />
              <Text style={styles.legendText}>Incomplete</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
