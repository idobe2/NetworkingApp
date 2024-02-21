import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import TextInput from '../components/TextInput';
import Button from '../components/Button'
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import CalendarPicker from 'react-native-calendar-picker';
import RNPickerSelect from 'react-native-picker-select';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

export default function DetailsScreen({ navigation }) {
  const route = useRoute(); // Hook to get the route object
  const { userId } = route.params;
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [gender, setGender] = useState(null);
  const apiUrl = 'https://backend-app-jbun.onrender.com';


  const onDateChange = (date) => {
    setSelectedDate(date);
    setShowCalendar(false); // Close calendar after date selection
  };

  // Function to format date to MM/DD/YYYY
  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Array of gender options
  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];


  const handleDetails = async () => {
    console.log('Name:', name);
    const formattedDateString = formatDate(selectedDate);
    const day = formattedDateString.split('/')[0];
    console.log('Day of birth:', selectedDate);
    console.log('Gender:', gender );
    console.log('uid',userId);

    response = await axios.post(apiUrl + '/addDetails', {
      uid: userId,
      name: name,
      birthday: formattedDateString,
      gender: gender
  })
  navigation.navigate('Preferences', { userId: userId });

  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      {/* Gender selection */}
      <View style={styles.input}>
        <RNPickerSelect
          onValueChange={(value) => setGender(value)}
          placeholder={{ label: 'Select gender', value: null }}
          items={genderOptions}
        />
      </View>
      <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.input}>
        <Text style={styles.inputText}>
          {selectedDate ? formatDate(selectedDate) : 'Select birth date'}
        </Text>
      </TouchableOpacity>
      <Button
        mode="contained"
        onPress={handleDetails}
        style={{ marginTop: 24 }}
        title="Sign Up"
      >
        Send
      </Button>
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={onDateChange}
            selectedStartDate={selectedDate}
            previousTitle="Previous"
            nextTitle="Next"
          />
        </View>
      )}
      <View style={styles.eventsContainer}>
        {/* Display events here based on selectedDate */}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
  },
  eventsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    marginVertical: 12,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.roundness,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.text,
  },
});
