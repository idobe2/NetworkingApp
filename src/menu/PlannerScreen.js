import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Button from "../components/Button"; // Adjust this import to your actual Button component path
import { Calendar } from "react-native-calendars";

const Planner = ({ navigation }) => {
  const [destination, setDestination] = useState("");
  const [social, setSocial] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
    markedDates: {},
  });

  const handleDayPress = (day) => {
    const { dateString } = day;
    const { startDate, endDate } = dateRange;

    // If we're starting fresh or already have both start and end dates, set new start
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
      // Completing the range
      let newMarkedDates = { ...dateRange.markedDates };
      const start = new Date(startDate);
      const end = new Date(dateString);

      // Ensure correct order
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

      // Mark all days in range
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

  const handleContinue = () => {
    if (!destination) {
      alert("Please select a destination");
      return;
    }
    if (!dateRange.startDate || !dateRange.endDate) {
      alert("Please select a date range");
      return;
    }
    console.log(
      "destination:",
      destination,
      "dateRange:",
      "socail:",
      social,
      dateRange.startDate,
      dateRange.endDate
    );
    // Proceed to the next screen with collected data
    navigation.navigate("Previous Plans", {
      destination,
      arrivalDate: dateRange.startDate,
      departureDate: dateRange.endDate,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Plan</Text>
      <Text style={styles.label}>Destination:</Text>
      <Picker
        selectedValue={destination}
        style={styles.picker}
        onValueChange={(itemValue) => setDestination(itemValue)}
      >
        <Picker.Item label="I'm traveling to:" value="" />
        <Picker.Item label="Paris" value="Paris" />
        <Picker.Item label="London" value="London" />
        <Picker.Item label="Dubai" value="Dubai" />
      </Picker>
      <Text style={styles.label}>Social:</Text>
      <Picker
        selectedValue={social}
        style={styles.picker}
        onValueChange={(itemValue) => setSocial(itemValue)}
      >
        <Picker.Item label="I'm traveling with:" value="" />
        <Picker.Item label="Myself" value="Solo" />
        <Picker.Item label="Partner" value="with partner" />
        <Picker.Item label="Friends" value="with friends" />
        <Picker.Item label="Family" value="with family" />
      </Picker>
      <Button mode="contained" onPress={() => setShowCalendar(true)}>
        Select Dates
      </Button>
      {/* Display the selected date range */}
      {dateRange.startDate && dateRange.endDate && (
        <Text style={styles.dateRangeText}>
          Selected Dates: {dateRange.startDate} - {dateRange.endDate}
        </Text>
      )}
      <Modal
        transparent={true}
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalView}>
          <Calendar
            onDayPress={handleDayPress}
            markingType={"period"}
            markedDates={dateRange.markedDates}
          />
          <Button mode="contained" onPress={() => setShowCalendar(false)}>
            OK
          </Button>
        </View>
      </Modal>
      <Button mode="outlined" onPress={handleContinue}>
        Continue
      </Button>
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  picker: {
    marginBottom: 10,
    width: "100%",
  },
  modalView: {
    marginTop: 200,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateRangeText: {
    marginTop: 10,
    fontSize: 16,
    color: "grey",
    marginLeft: 40,
    marginBottom: 10,
  },
});

export default Planner;
