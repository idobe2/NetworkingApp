import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Button from "../components/Button";
import { theme } from "../core/theme";
import userApi from "../api/UserApi";

const Preferences = ({ navigation }) => {
  // const navigation = useNavigation();
  const route = useRoute(); // Hook to get the route object
  const { userId } = route.params;
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePreferencePress = (preference) => {
    try {
      if (selectedPreferences.includes(preference)) {
        setSelectedPreferences(
          selectedPreferences.filter((item) => item !== preference)
        );
      } else {
        setSelectedPreferences([...selectedPreferences, preference]);
      }
      console.log("selectedPreferences2:", selectedPreferences);
    } catch (err) {
      console.log(err);
    }
  };

  const handleContinuePress = async () => {
    try {
      setIsLoading(true);
      console.log("selectedPreferences:", selectedPreferences);
      response = await userApi.addUserPreferences(userId, selectedPreferences);
      navigation.navigate("Root", { screen: "Tripy",
        params: { userId: userId },
       });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Tripy!</Text>
      <Text style={styles.instruction}>Please select your preferences:</Text>
      <ScrollView style={styles.scrollView}>
        {[
          "Beach",
          "Mountains",
          "City",
          "Nature",
          "History",
          "Adventure",
          "Relaxation",
          "Food and Drinks",
        ].map((preference, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              selectedPreferences.includes(preference) && styles.selectedButton,
            ]}
            onPress={() => handlePreferencePress(preference)}
          >
            <Text>{preference}</Text>
            {selectedPreferences.includes(preference) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} /> // Display the loading indicator
      ) : (
        <Button
          mode="outlined"
          style={styles.continueButton}
          onPress={handleContinuePress}
        >
          Save Preferences
        </Button>
      )}
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
    fontWeight: "bold",
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
    backgroundColor: "#f0f0f0",
  },
  selectedButton: {
    backgroundColor: "#69ABCE",
  },
  checkmark: {
    marginLeft: "auto",
    color: "blue",
    fontWeight: "bold",
  },
});

export default Preferences;
