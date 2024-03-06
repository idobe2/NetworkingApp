import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Button as RNButton, TouchableWithoutFeedback   } from 'react-native';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';



export default function DetailsScreen({ navigation }) {
  const route = useRoute(); // Hook to get the route object
  // const { userId } = route.params;
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = 'https://backend-app-jbun.onrender.com';

  const onDateChange = (date) => {
    setSelectedDate(date);
    setShowModal(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const handleDetails = async () => {
    const formattedDateString = formatDate(selectedDate);
    response = await axios.post(apiUrl + '/addDetails', {
      uid: userId,
      name: name,
      birthday: formattedDateString,
      gender: gender,
    });
    navigation.navigate('LoginScreen');
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
      <View style={styles.input}>
        <Picker
                selectedValue={gender}
                style={styles.picker}
                onValueChange={(itemValue) => setGender(itemValue)}>
                <Picker.Item label="Select gender" value="" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
            </Picker>
      </View>
      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.input}>
        <Text style={styles.inputText}>
          {selectedDate ? formatDate(selectedDate) : 'Birth date' }
        </Text>
        <FontAwesome name="calendar" size={24} color={theme.colors.primary} style={styles.icon} />
      </TouchableOpacity>
      <Button mode="contained" onPress={handleDetails} style={{ marginTop: 24 }} title="Details">
        Send
      </Button>
      
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          
          
            <CalendarPicker
              onDateChange={onDateChange}
              selectedStartDate={selectedDate}
              previousTitle="Previous"
              nextTitle="Next"
              selectedDayTextColor={theme.colors.primary}
              selectedDayBackgroundColor={theme.colors.accent}
              todayBackgroundColor={theme.colors.background}
              selectedDayStyle={styles.selectedDayStyle}
              selectedDayTextStyles={styles.selectedDayText}
            />
            <RNButton title="Close" onPress={() => setShowModal(false)} color={theme.colors.primary} />
          </View>
        </View>
      </Modal>
      <View style={styles.eventsContainer}></View>
    </Background>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
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
    paddingHorizontal: 12,
    flexDirection: 'row', // Align icon and text in a row
    alignItems: 'center', // Center items vertically
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1, // Allow text to take remaining space
  },
  icon: {
    marginLeft: 10, // Add some spacing between text and icon
  },
  selectedDayStyle: {
    backgroundColor: theme.colors.accent,
    borderRadius: 16,
  },
  selectedDayText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  picker: {
    marginBottom: 10,
    width: '100%',
},
});
