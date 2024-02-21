import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

const Settings = ({ navigation }) => {

    // Function to handle logout
  const handleLogout = () => {
    
    // For example, clearing tokens, resetting state, etc.
    navigation.navigate('StartScreen'); // Navigate to StartScreen
  };

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Hello, This is Settings Screeen</Text>
             {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    logoutButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: 'red',
      padding: 10,
      borderRadius: 5,
    },
    logoutText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });

export default Settings;