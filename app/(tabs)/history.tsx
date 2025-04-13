import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { getMonthPrayerLogs } from '../../src/utils/storage';

const HistoryScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState<Record<string, any>>({});
  const [currentMonth, setCurrentMonth] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1, // JavaScript months are 0-indexed
  });

  // Load marked dates for the current month
  useEffect(() => {
    loadMarkedDates();
  }, [currentMonth]);

  // Load prayer logs for the current month and mark dates on the calendar
  const loadMarkedDates = async () => {
    try {
      const { year, month } = currentMonth;
      const prayerLogs = await getMonthPrayerLogs(year, month);
      
      const newMarkedDates: Record<string, any> = {};
      
      // Mark dates based on prayer completion
      Object.entries(prayerLogs).forEach(([date, completed]) => {
        newMarkedDates[date] = {
          selected: date === selectedDate,
          marked: true,
          dotColor: completed ? 'green' : 'red',
          selectedColor: date === selectedDate ? '#E0F2F1' : undefined,
        };
      });
      
      // Mark selected date if not already marked
      if (!newMarkedDates[selectedDate]) {
        newMarkedDates[selectedDate] = {
          selected: true,
          selectedColor: '#E0F2F1',
        };
      }
      
      setMarkedDates(newMarkedDates);
    } catch (error) {
      console.error('Error loading marked dates:', error);
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
      selectedColor: '#E0F2F1',
    };
    
    setMarkedDates(updatedMarkedDates);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 p-4">
        <Text className="text-xl font-bold text-center text-gray-800 mb-4">
          Prayer History
        </Text>
        
        <View className="bg-white rounded-lg shadow-sm p-2 mb-4">
          <Calendar
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            markedDates={markedDates}
            theme={{
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#E0F2F1',
              selectedDayTextColor: '#2d4150',
              todayTextColor: '#00adf5',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00adf5',
              selectedDotColor: '#ffffff',
              arrowColor: '#00adf5',
              monthTextColor: '#2d4150',
              indicatorColor: '#00adf5',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16,
            }}
          />
        </View>
        
        <View className="bg-white rounded-lg shadow-sm p-4">
          <Text className="text-center text-base text-gray-700 mb-2">
            {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
          </Text>
          
          <View className="flex-row justify-center items-center">
            <View className="flex-row items-center mr-4">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>
            
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-1" />
              <Text className="text-sm text-gray-600">Incomplete</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HistoryScreen;
