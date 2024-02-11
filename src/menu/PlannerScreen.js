import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

// Initialize the locale config for Calendar component
LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};

LocaleConfig.defaultLocale = 'en';

export default function Planner() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    // Here you can fetch events for the selected date and update the state
    // For example, fetchEvents(day.dateString);
  };

  // Function to fetch events for the selected date
  // const fetchEvents = (date) => {
  //   // Fetch events for the selected date and update the events state
  // };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={{ [selectedDate]: { selected: true } }}
        />
      </View>
      <View style={styles.eventsContainer}>
        <Text>Events for {selectedDate || 'selected date'}</Text>
        {/* Display events here based on selectedDate */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
  },
  eventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
