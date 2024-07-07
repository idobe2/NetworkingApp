import React, { useState } from "react";
import { View, StyleSheet, ToastAndroid} from "react-native";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import DropDownPicker from "react-native-dropdown-picker";
import planApi from "../api/PlanApi";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_KEY } from "../core/config";
import LoadLevelSlider from "../components/LoadLevelSlider";
import SelectDatesModal from "../components/SelectDatesModal";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import AnimatedLogo from "../common/AnimatedLogo"
import HomeBackground from "../components/HomeBackground";

const Planner = ({ navigation }) => {
  const [destination, setDestination] = useState("");
  const [openSocialPicker, setOpenSocialPicker] = useState(false);
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

    // if (await planApi.checkSelectedDates(dateRange.startDate, dateRange.endDate)) {
    //   alert("Dates overlap with existing plan");
    //   return;
    // }

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
    { key: 'dropDownPicker' },
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
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data, details = null) => {
              setDestination(data.structured_formatting.main_text);
              console.log(data, details);
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
        );
      case 'dropDownPicker':
        return (
          <View>
            <DropDownPicker
              open={openSocialPicker}
              value={social}
              items={[
                { label: "Myself", value: "Solo" },
                { label: "Partner", value: "with partner" },
                { label: "Friends", value: "with friends" },
                { label: "Family", value: "with family" },
              ]}
              setOpen={setOpenSocialPicker}
              setValue={setSocial}
              setItems={() => {}}
              zIndex={2000}
            />
            <LoadLevelSlider value={loadLevel} onValueChange={setLoadLevel} />
          </View>
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
    marginTop: 20,
  },
  googlePlacesInput: {
    marginTop: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    position: 'relative',
    marginBottom: 20,
    zIndex: 3000, // Ensure DropDownPicker has higher zIndex
  },
  dropDownPicker: {
    zIndex: 3000,
  },
  dropDownContainerStyle: {
    zIndex: 3000,
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
});

export default Planner;
