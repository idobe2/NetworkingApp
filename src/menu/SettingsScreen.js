import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useColorScheme } from "nativewind";
import React from "react";

const Settings = ({ navigation }) => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  console.log("colorScheme:", colorScheme);

  // Function to handle logout
  const handleLogout = () => {
    // For example, clearing tokens, resetting state, etc.
    navigation.navigate("StartScreen"); // Navigate to StartScreen
  };

  return (
    <View
      className="dark:bg-neutral-900"
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text style={styles.title}>Hello, This is Settings Screeen</Text>
      <Text className="text-xl">Dark Mode</Text>
      <Switch value={colorScheme == "dark"} onChange={toggleColorScheme} />
      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: -30,
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Settings;
