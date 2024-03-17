import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button'
import axios from 'axios';
import { SERVER_URL } from '../core/config';

const Preferences = ({ navigation }) => {
  // const navigation = useNavigation();
  const route = useRoute(); // Hook to get the route object
  const { userId } = route.params;
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const handlePreferencePress = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
    console.log('selectedPreferences2:', selectedPreferences);
  };

  const handleContinuePress = async () => {
    console.log('selectedPreferences:', selectedPreferences);
    response = await axios.post(SERVER_URL + '/addPreferences', {
      uid: userId,
      preferences: selectedPreferences,
    });
    // Here you can calculate the decision tree based on selectedPreferences
    navigation.navigate('Root' ,{ screen: 'Tripy' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tripy!</Text>
      <Text style={styles.instruction}>Please select your preferences:</Text>
      <ScrollView style={styles.scrollView}>
        {['Beach', 'Mountains', 'City', 'Nature', 'History', 'Adventure', 'Relaxation', 'Food and Drinks'].map((preference, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, selectedPreferences.includes(preference) && styles.selectedButton]}
            onPress={() => handlePreferencePress(preference)}>
            <Text>{preference}</Text>
            {selectedPreferences.includes(preference) && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button mode="outlined" style={styles.continueButton} onPress={handleContinuePress}>
        Save Preferences
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  selectedButton: {
    backgroundColor: '#69ABCE',
  },
  checkmark: {
    marginLeft: 'auto',
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default Preferences;
