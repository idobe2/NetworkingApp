import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button'


const Planner = ({ navigation }) => {
    
    const [destination, setDestination] = useState('');
    const [arrivalDate, setArrivalDate] = useState(new Date());
    const [departureDate, setDepartureDate] = useState(new Date());
    const [showArrivalPicker, setShowArrivalPicker] = useState(false);
    const [showDeparturePicker, setShowDeparturePicker] = useState(false);

    const handleArrivalChange = (event, selectedDate) => {
        const currentDate = selectedDate || arrivalDate;
        setShowArrivalPicker(false);
        setArrivalDate(currentDate);
    };

    const handleDepartureChange = (event, selectedDate) => {
        const currentDate = selectedDate || departureDate;
        setShowDeparturePicker(false);
        setDepartureDate(currentDate);
    };

    const handleContinue = () => {
        if (!destination) {
            alert('Please select a destination');
            return;
        }
        const now = new Date();
        if (arrivalDate < now || departureDate < now) {
            alert('Please select future dates');
            return;
        }
        if (arrivalDate >= departureDate) {
            alert('Departure date must be after arrival date');
            return;
        }
        console.log('destination:', destination, '\narrivalDate:', arrivalDate, '\ndepartureDate:', departureDate);
        // Proceed to the next screen with collected data
        navigation.navigate('Schedule');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Destination:</Text>
            <Picker
                selectedValue={destination}
                style={styles.picker}
                onValueChange={(itemValue) => setDestination(itemValue)}>
                <Picker.Item label="Select destination" value="" />
                <Picker.Item label="Paris" value="Paris" />
                <Picker.Item label="London" value="London" />
                <Picker.Item label="Dubai" value="Dubai" />
            </Picker>
            <Button mode="contained" title={arrivalDate.toDateString()} onPress={() => setShowArrivalPicker(true)}>Arrival Date</Button>
            {showArrivalPicker && (
                <DateTimePicker
                    value={arrivalDate}
                    mode="date"
                    display="default"
                    onChange={handleArrivalChange}
                />
            )}
            <Text style={styles.selectedDate}>
                {arrivalDate.toDateString()}
            </Text>
            <Button mode="contained" title={departureDate.toDateString()} onPress={() => setShowDeparturePicker(true)}>Departure Date</Button>
            {showDeparturePicker && (
                <DateTimePicker
                    value={departureDate}
                    mode="date"
                    display="default"
                    onChange={handleDepartureChange}
                />
            )}
            <Text style={styles.selectedDate}>
                {departureDate.toDateString()}
            </Text>
            <Button mode="outlined" title="Continue" onPress={handleContinue}>Continue</Button>
        </View>
    );
}

const styles = StyleSheet.create({
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
        width: '100%',
    },
    selectedDate: {
        fontSize: 16,
        marginBottom: 25,
        marginLeft: 115
    },
});

export default Planner;
