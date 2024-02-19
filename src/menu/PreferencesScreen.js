import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import Swiper from 'react-native-swiper';


const Preferences = () => {
    const navigation = useNavigation();

//   const [selectedReason, setSelectedReason] = useState(null);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

//   const handleReasonPress = (season) => {
//     setSelectedReason(season);
//   };

  const handlePreferencePress = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(selectedPreferences.filter((item) => item !== preference));
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };    

  const handleContinuePress = () => {
    console.log('selectedPreferences:', selectedPreferences);
    navigation.replace('HomeScreen');
  };
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Welcome to our app Tripy!</Text>
        <Text style={styles.instruction}>To get the best results please select your preferences:</Text>
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>The reason of your trip</Text>
          <Button title="Business" style={selectedReason === 'Business' ? styles.selectedButton : styles.button} onPress={() => handleReasonPress('Business')} />
          <Button title="Pleasure" style={selectedReason === 'Pleasure' ? styles.selectedButton : styles.button} onPress={() => handleReasonPress('Pleasure')} />
        </View> */}

        <Text style={styles.sectionTitle}>Preferences and motivations</Text>
        <Swiper style={styles.swiperContainer}>
        <View style={styles.page}>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Leisure') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Leisure')}>
            <Text>Leisure</Text>
            {selectedPreferences.includes('Leisure') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Adventure') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Adventure')}>
            <Text>Adventure</Text>
            {selectedPreferences.includes('Adventure') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Solo') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Solo')}>
            <Text>Solo</Text>
            {selectedPreferences.includes('Solo') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Family') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Family')}>
            <Text>Family</Text>
            {selectedPreferences.includes('Family') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          {/* Add more preferences as TouchableOpacity */}
        </View>

        <View style={styles.page}>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Cultural') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Cultural')}>
            <Text>Cultural</Text>
            {selectedPreferences.includes('Cultural') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Backpackers') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Backpackers')}>
            <Text>Backpackers</Text>
            {selectedPreferences.includes('Backpackers') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Luxury') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Luxury')}>
            <Text>Luxury</Text>
            {selectedPreferences.includes('Luxury') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, selectedPreferences.includes('Food and Culinary') && styles.selectedButton]}
            onPress={() => handlePreferencePress('Food and Culinary')}>
            <Text>Food and Culinary</Text>
            {selectedPreferences.includes('Food and Culinary') && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          </View>
        {/* Add more pages as necessary */}
      </Swiper>
  
      <TouchableOpacity style={styles.continueButton} onPress={handleContinuePress}>
        <Text style={styles.continueButton} >Save Changes</Text>
      </TouchableOpacity>
      </View>
    )
}

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
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      button: {
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
      },
      selectedButton: {
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#4CAF50', // Green for selected
      },
      continueButton: {
        borderRadius: 10,
        padding: 5,
        backgroundColor: '#007bff', // Blue for continue button
      },
      checkmark: {
        marginLeft: 'auto',
        color: 'green',
        fontWeight: 'bold',
      },
      });

export default Preferences;