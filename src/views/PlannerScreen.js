import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid, Text} from "react-native";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import { Dropdown } from 'react-native-element-dropdown';
import planApi from "../api/PlanApi";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_KEY } from "../core/config";
import LoadLevelSlider from "../components/LoadLevelSlider";
import SelectDatesModal from "../components/SelectDatesModal";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import AnimatedLogo from "../common/AnimatedLogo";
import HomeBackground from "../components/HomeBackground";

const Planner = ({ navigation }) => {
  const [destination, setDestination] = useState("");
  const [social, setSocial] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    markedDates: {},
  });
  const [loadLevel, setLoadLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleDayPress = (day) => {
    const { dateString } = day;
    const { startDate, endDate } = dateRange;

    if (!startDate || (startDate && endDate)) {
      const newMarkedDates = {
        [dateString]: {
          startingDay: true,
          endingDay: true,
          color: "blue",
          textColor: "white",
        },
      };
      setDateRange({
        startDate: dateString,
        endDate: null,
        markedDates: newMarkedDates,
      });
    } else if (startDate && !endDate) {
      let newMarkedDates = { ...dateRange.markedDates };
      const start = new Date(startDate);
      const end = new Date(dateString);

      if (end < start) {
        newMarkedDates = {
          [dateString]: {
            startingDay: true,
            endingDay: true,
            color: "blue",
            textColor: "white",
          },
        };
        setDateRange({
          startDate: dateString,
          endDate: null,
          markedDates: newMarkedDates,
        });
        return;
      }

      for (let d = new Date(startDate); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split("T")[0];
        if (key === startDate) {
          newMarkedDates[key] = {
            startingDay: true,
            color: "blue",
            textColor: "white",
          };
        } else if (key === dateString) {
          newMarkedDates[key] = {
            endingDay: true,
            color: "blue",
            textColor: "white",
          };
        } else {
          newMarkedDates[key] = { color: "blue", textColor: "white" };
        }
      }

      setDateRange({
        startDate,
        endDate: dateString,
        markedDates: newMarkedDates,
      });
    }
  };

  const handleContinue = async () => {
    if (!destination) {
      alert("Please select a destination");
      return;
    }

    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select a date range");
      return;
    }

    const today = new Date();
    const selectedStartDate = new Date(dateRange.startDate);
    const selectedEndDate = new Date(dateRange.endDate);
    if (selectedStartDate < today || selectedEndDate < today) {
      alert("Please select dates later than today's date");
      return;
    }

    setLoading(true); // Show the activity indicator

    try {
      console.log(
        "destination:",
        destination,
        "dateRange:",
        "social:",
        social,
        dateRange.startDate,
        dateRange.endDate,
        "loadLevel:",
        loadLevel
      );
      const response = await planApi.addPlan(
        destination,
        dateRange.startDate,
        dateRange.endDate,
        social,
        loadLevel
      );
      if (!response) {
        alert("Failed to create plan");
      } else {
        navigation.navigate("Previous Plans");
        ToastAndroid.show("Plan created successfully", ToastAndroid.SHORT);
      }
    } finally {
      setLoading(false); // Hide the activity indicator
    }
  };

  const data = [
    { key: 'header' },
    { key: 'paragraph' },
    { key: 'googlePlacesAutocomplete' },
    { key: 'dropdown' },
    { key: 'loadLevelSlider' },
    { key: 'selectDatesButton' },
    { key: 'dateRange' },
    { key: 'continueButton' },
  ];

  const renderItem = ({ item }) => {
    switch (item.key) {
      case 'header':
        return <Header>Create Plan</Header>;
      case 'paragraph':
        return (
          <Paragraph>
            The magic starts here ✨{"\n"}
            Please select a city, who you are traveling with and dates of your
            trip.{"\n"}
          </Paragraph>
        );
      case 'googlePlacesAutocomplete':
        return (
          <View style={styles.searchContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.headerLabel}>Select Destination</Text>
              <GooglePlacesAutocomplete
                placeholder="Search"
                onPress={(data, details = null) => {
                  setDestination(data.structured_formatting.main_text);
                }}
                query={{
                  key: API_KEY,
                  language: "en",
                  types: "(cities)",
                }}
                styles={{
                  textInput: styles.googlePlacesInput,
                }}
              />
            </View>
          </View>
        );
      case 'dropdown':
        return (
          <View style={styles.dropdownContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.headerLabel}>Who are you traveling with?</Text>
              <Dropdown
                data={[
                  { label: "Myself", value: "Solo" },
                  { label: "Partner", value: "with partner" },
                  { label: "Friends", value: "with friends" },
                  { label: "Family", value: "with family" },
                ]}
                labelField="label"
                valueField="value"
                placeholder="Select one"
                value={social}
                onChange={item => {
                  setSocial(item.value);
                }}
                style={styles.dropdown}
                containerStyle={styles.dropdownContainerStyle}
              />
            </View>
          </View>
        );
      case 'loadLevelSlider':
        return (
          <LoadLevelSlider value={loadLevel} onValueChange={setLoadLevel} />
        );
      case 'selectDatesButton':
        return (
          <Button mode="contained" onPress={() => setShowCalendar(true)}>
            Select Dates
          </Button>
        );
      case 'dateRange':
        return dateRange.startDate && dateRange.endDate ? (
          <Paragraph style={{ textAlign: "center" }}>
            {dateRange.startDate} - {dateRange.endDate}
          </Paragraph>
        ) : null;
      case 'continueButton':
        return (
          <Button mode="outlined" onPress={handleContinue}>
            Create Plan
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <HomeBackground>
        <KeyboardAwareFlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        />
      </HomeBackground>
      <SelectDatesModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDayPress={handleDayPress}
        markedDates={dateRange.markedDates}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <AnimatedLogo />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    top: 20,
  },
  googlePlacesInput: {
    marginTop: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  dropdownContainer: {
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  dropdown: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 10,
  },
  dropdownContainerStyle: {
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
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
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  labelContainer: {
    justifyContent: 'space-between',
  },
  headerLabel: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'left',
    color: '#333',
    marginBottom: 10,
  },
});

export default Planner;
  