import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Switch, ScrollView, ActivityIndicator, ToastAndroid,} from "react-native";
import { useColorScheme } from "nativewind";
import React from "react";
import Button from '../components/Button';
import userApi from "../api/UserApi";
import { theme } from "../core/theme";
import { useAuth } from "../../AuthContext";

const Settings = ({ navigation }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();

  console.log("colorScheme:", colorScheme);

  // TODO: handle different types of logout
  // const handleLogout = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await userApi.userGoogleSignOut();
  //       if (response.success) {
  //         console.log("Signed out successfully");
  //         ToastAndroid.show("Signed Out", ToastAndroid.TOP);
  //       } else {
  //         console.log("Google sign out failed:", response.error);
  //       }
  //     } catch (error) {
  //       console.error("Error signing out:", error);
  //     } finally {
  //       setIsLoading(false);
  //   };
  //   navigation.navigate("StartScreen"); // Navigate to StartScreen
  // };

  const handleLogout = async () => {
    console.log("Logout Button Pressed");
    try {
      setIsLoading(true);
      await userApi.check();
      await userApi.userLogout();
      setIsAuthenticated(false); // Update authentication state
      navigation.navigate("StartScreen");
      ToastAndroid.show(
        "Goodbye 👋, See you again soon 😊",
        ToastAndroid.SHORT
      );
    } catch (err) {
      console.log("Logout failed " + err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Account deleted");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch value={colorScheme == "dark"} onChange={toggleColorScheme} />
        </View>
      </View>
      {/* Add more sections and settings as needed */}
      {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : (
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
      )}
      <Button 
        mode="contained" 
        onPress={handleDeleteAccount} 
        style={styles.button}
        buttonStyle={{ backgroundColor: 'red' }}
      >
        Delete Account
      </Button>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  section: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
  button: {
    marginVertical: 10,
  },
});

export default Settings;
