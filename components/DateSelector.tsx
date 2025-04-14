import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
  const { colors } = useThemeStore();

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
    if (todayIndex !== -1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: todayIndex * itemWidth - screenWidth / 2 + itemWidth / 2,
          animated: false,
        });
      }, 100);
    }
  }, []);

  // Handle scroll to load more dates
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isScrollingRight = contentOffset.x > 0;
    const isNearEnd =
      contentOffset.x + layoutMeasurement.width > contentSize.width - 100;
    const isNearStart = contentOffset.x < 100;

    if (isScrollingRight && isNearEnd) {
      // Add more dates to the end
      const lastDate = visibleDates[visibleDates.length - 1];
      const newDates = Array.from({ length: 7 }, (_, i) =>
        addDays(lastDate, i + 1)
      );
      setVisibleDates([...visibleDates, ...newDates]);
    } else if (!isScrollingRight && isNearStart && visibleDates.length > 0) {
      // Add more dates to the beginning
      const firstDate = visibleDates[0];
      const newDates = Array.from({ length: 7 }, (_, i) =>
        addDays(firstDate, -(7 - i))
      );
      setVisibleDates([...newDates, ...visibleDates]);

      // Maintain scroll position
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: 7 * itemWidth,
          animated: false,
        });
      }, 10);
    }
  };

  // Day names
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View className="mb-0">
      {/* Combined Day Names and Date Selector */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="pb-2"
      >
        {visibleDates.map((date, index) => {
          const dayName = dayNames[date.getDay()];
          const dayNumber = format(date, "d");
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const isPast = isBefore(date, new Date()) && !isToday;
          const isCompleted = areAllPrayersCompleted(
            format(date, "yyyy-MM-dd")
          );
          const daysSinceFirstLog = differenceInDays(date, firstLogDate);
          const isBeforeFirstLog = daysSinceFirstLog < 0;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDateSelect(date)}
              disabled={isBeforeFirstLog}
              style={{
                width: itemWidth,
                opacity: isBeforeFirstLog ? 0.5 : 1,
                backgroundColor: isSelected ? colors.secondary : "transparent",
                borderRadius: 20,
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 8,
                marginHorizontal: 2,
              }}
            >
              <Text
                style={{
                  color: isSelected ? "#FFFFFF" : colors.gray,
                  fontSize: 14,
                  marginBottom: 6,
                }}
              >
                {dayName}
              </Text>
              <Text
                style={{
                  color: isSelected ? "#FFFFFF" : colors.text,
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 6,
                }}
              >
                {dayNumber}
              </Text>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isCompleted
                    ? colors.success
                    : isToday
                    ? colors.secondary
                    : "transparent",
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default DateSelector;
