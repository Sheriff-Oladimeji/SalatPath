import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  format,
  addDays,
  isSameDay,
  isBefore,
  differenceInDays,
} from "date-fns";
import { usePrayerStore } from "../src/store/usePrayerStore";
import { useThemeStore } from "../src/store/useThemeStore";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const { prayerLogs, areAllPrayersCompleted, getFirstLogDate } =
    usePrayerStore();
  const { colors, isDarkMode } = useThemeStore();

  // Get the first date the user started using the app
  const firstLogDate = getFirstLogDate() || new Date();

  // Calculate item width based on screen width
  const screenWidth = Dimensions.get("window").width;
  const itemWidth = screenWidth / 7;
  const visibleItemsCount = 21; // Show 3 weeks of dates

  // Generate initial dates centered around today
  useEffect(() => {
    const today = new Date();
    const startDate = addDays(today, -10); // Start 10 days before today

    // Generate dates
    const dates = Array.from({ length: visibleItemsCount }, (_, i) =>
      addDays(startDate, i)
    );

    setVisibleDates(dates);

    // Scroll to today
    const todayIndex = dates.findIndex((date) => isSameDay(date, today));
    if (todayIndex !== -1 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: todayIndex * itemWidth,
          animated: false,
        });
      }, 100);
    }
  }, []);

  // Handle scroll to load more dates
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isScrollingRight =
      contentOffset.x > contentSize.width - layoutMeasurement.width - 50;
    const isScrollingLeft = contentOffset.x < 50;

    if (isScrollingRight) {
      // Add more dates to the right (future)
      const lastDate = visibleDates[visibleDates.length - 1];
      const newDates = Array.from({ length: 7 }, (_, i) =>
        addDays(lastDate, i + 1)
      );
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        setVisibleDates((prevDates) => [...prevDates, ...newDates]);
      }, 0);
    } else if (isScrollingLeft) {
      // Add more dates to the left (past), but not before firstLogDate
      const firstDate = visibleDates[0];

      // Only add past dates if they're not before the first log date
      if (differenceInDays(firstDate, firstLogDate) > 1) {
        const newDates = Array.from({ length: 7 }, (_, i) =>
          addDays(firstDate, -(7 - i))
        ).filter((date) => !isBefore(date, firstLogDate));

        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          setVisibleDates((prevDates) => [...newDates, ...prevDates]);

          // Adjust scroll position to keep the same dates visible
          if (scrollViewRef.current) {
            scrollViewRef.current?.scrollTo({
              x: contentOffset.x + newDates.length * itemWidth,
              animated: false,
            });
          }
        }, 0);
      }
    }
  };

  // Check if a date has all prayers completed
  const isDateCompleted = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return areAllPrayersCompleted(dateStr);
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  // Get status dot color
  const getDotColor = (date: Date) => {
    if (isToday(date)) return colors.accent;
    if (isDateCompleted(date)) return colors.success;

    const dateStr = format(date, "yyyy-MM-dd");
    return prayerLogs[dateStr] ? colors.error : "transparent";
  };

  // Format month and year for header - use the middle date for display
  const middleIndex = Math.floor(visibleDates.length / 2);
  const middleDate = visibleDates[middleIndex] || new Date();
  const monthYear = format(middleDate, "MMMM yyyy");

  // Create styles
  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    monthYearText: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.secondary,
    },
    buttonRow: {
      flexDirection: "row",
    },
    navButton: {
      padding: 8,
    },
    rightButton: {
      marginLeft: 8,
    },
    dayNameText: {
      fontSize: 12,
      marginBottom: 4,
    },
    dateButton: {
      alignItems: "center",
      paddingVertical: 8,
      marginHorizontal: 1,
    },
    dateText: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 2,
    },
    dateDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 2,
    },
  });

  return (
    <View style={styles.container}>
      {/* Month and Year Header */}
      <View style={styles.header}>
        <Text style={styles.monthYearText}>{monthYear}</Text>
      </View>

      {/* Combined Day Names and Date Selector */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 2 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {visibleDates.map((date, index) => {
          const dayOfWeek = format(date, "E"); // Get short day name (Mon, Tue, etc.)
          const isSelected = isSameDay(date, selectedDate);
          const dotColor = getDotColor(date);
          const day = format(date, "d");
          const isCurrentDate = isToday(date);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDateSelect(date)}
              style={[
                styles.dateButton,
                {
                  width: itemWidth,
                  backgroundColor: isSelected
                    ? colors.secondary
                    : "transparent",
                  borderRadius: 12,
                },
              ]}
            >
              {/* Day of week */}
              <Text
                style={[
                  styles.dayNameText,
                  {
                    color: isSelected
                      ? isDarkMode
                        ? "#121826"
                        : "white"
                      : colors.gray,
                  },
                ]}
              >
                {dayOfWeek}
              </Text>

              {/* Date number */}
              <Text
                style={[
                  styles.dateText,
                  {
                    color: isSelected
                      ? isDarkMode
                        ? "#121826"
                        : "white"
                      : isCurrentDate
                      ? colors.accent
                      : colors.text,
                  },
                ]}
              >
                {day}
              </Text>
              <View
                style={[
                  styles.dateDot,
                  {
                    backgroundColor: dotColor,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DateSelector;
