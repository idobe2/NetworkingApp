import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For icons
import Button from "../components/Button";
import { theme } from "../core/theme";
import userApi from "../api/UserApi";
import Header from "../components/Header";
import AnimatedLogo from "../common/AnimatedLogo"


const Preferences = ({ navigation }) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const preferences = await userApi.getUserPreferences();
        if (preferences) {
          setSelectedPreferences(preferences);
        }
      } catch (error) {
        console.log("Error fetching preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

  const handlePreferencePress = (preference) => {
    if (selectedPreferences.includes(preference)) {
      setSelectedPreferences(
        selectedPreferences.filter((item) => item !== preference)
      );
    } else {
      setSelectedPreferences([...selectedPreferences, preference]);
    }
  };

  const handleContinuePress = async () => {
    try {
      setIsLoading(true);
      await userApi.addUserPreferences(selectedPreferences);
      navigation.navigate("Root", {
        screen: "Tripy",
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <AnimatedLogo />
      </View>
    );
  }

  const preferenceIcons = {
    Beach: "sunny",
    Mountains: "trail-sign",
    City: "business",
    Nature: "leaf",
    History: "book",
    Adventure: "airplane",
    Relaxation: "bed",
    "Food and Drinks": "restaurant",
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://example.com/header-image.jpg" }} // Replace with your image URL
        style={styles.headerImage}
      />
      {/* <Text style={styles.title}>Welcome to Tripy!</Text> */}
      <Header style={{bottom: 20}}>To tailor the best trip for you,{'\n'}we'd love to know more about you 😊{'\n'}What do you like?</Header>
      {/* <Text style={styles.instruction}>Please select your preferences:</Text> */}
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
            <Ionicons
              name={preferenceIcons[preference]}
              size={24}
              color="white"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>{preference}</Text>
            {selectedPreferences.includes(preference) && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color="white"
                style={styles.checkmark}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Button
        mode="contained"
        style={styles.continueButton}
        onPress={handleContinuePress}
      >
        Save Preferences
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: theme.colors.primary,
    textAlign: "center",
  },
  instruction: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  scrollView: {
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#4caf50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedButton: {
    backgroundColor: "#388e3c",
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    flex: 1,
  },
  checkmark: {
    marginLeft: "auto",
  },
  continueButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
    zIndex: 1,
  },
});

export default Preferences;
