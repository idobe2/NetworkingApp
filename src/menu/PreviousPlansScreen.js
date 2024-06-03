import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import placesApi from '../api/PlacesApi';

// Sample data of previous trip plans
let previousPlansData = [
    { id: 1, destination: 'Paris', arrivalDate: '2023-05-15', departureDate: '2023-05-20' },
    { id: 2, destination: 'London', arrivalDate: '2023-07-10', departureDate: '2023-07-15' },
    { id: 3, destination: 'New York', arrivalDate: '2023-09-20', departureDate: '2023-09-25' },
    { id: 4, destination: 'Tokyo', arrivalDate: '2023-11-05', departureDate: '2023-11-10' },
];

export default function PreviousPlans() {
  const [destinationImages, setDestinationImages] = useState({});
  const [plans, setPlans] = useState(previousPlansData);

  useEffect(() => {
    const fetchData = async () => {
      const destinationImages = await placesApi.fetchImages(previousPlansData);
      if (destinationImages) {
        setDestinationImages(destinationImages);
      }
    };
    fetchData();
  }, []);


  const handleDelete = (id) => {
        Alert.alert(
          'Delete Plan',
          'Are you sure you want to delete this plan?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                const updatedPlans = plans.filter(plan => plan.id !== id);
                setPlans(updatedPlans);
              },
            },
          ],
          { cancelable: false }
        );
  };

  // Render each item in the list
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => showOptions(item.id)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.destination}>{item.destination}</Text>
        <Text>Arrival: {item.arrivalDate}</Text>
        <Text>Departure: {item.departureDate}</Text>
      </View>
      {destinationImages[item.destination] && (
        <Image
          source={{ uri: destinationImages[item.destination] }}
          style={styles.destinationImage}
        />
      )}
    </TouchableOpacity>
  );

  const showOptions = (id) => {
    Alert.alert(
      "Options",
      "",
      [
        { text: "Edit", onPress: () => Alert.alert("Pressed") },
        { text: "Delete", onPress: () => handleDelete(id) },
        { text: "Cancel", style: "cancel" }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Plans</Text>
      <FlatList
        data={plans} // Updated here
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6E6FA',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  destination: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  destinationImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
});
