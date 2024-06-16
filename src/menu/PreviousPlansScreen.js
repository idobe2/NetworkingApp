import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import placesApi from '../api/PlacesApi';
import plansApi from '../api/PlanApi';

export default function PreviousPlans({ navigation }) {
  const [destinationImages, setDestinationImages] = useState({});
  const [plans, setPlans] = useState([]);

  const fetchData = async () => {
    const fetchedPlans = await plansApi.fetchPlans();
    if (fetchedPlans && fetchedPlans.length > 0) {
      // Add a unique identifier to each plan if not already present
      const plansWithId = fetchedPlans.map((plan, index) => ({
        ...plan,
        id: plan.id || index.toString(), // Ensure each plan has a unique id
      }));
      setPlans(plansWithId);
      const destination = await placesApi.fetchImages(plansWithId);
      // console.log("destination", destination);
      if (destination) {
        setDestinationImages(destination);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

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

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => showOptions(item.id)}>
      <View style={{ flex: 1 }}>
        <Text style={styles.destination}>{item.destination}</Text>
        <Text>Arrival: {item.arrivalDate}</Text>
        <Text>Departure: {item.departureDate}</Text>
        <Text>Social: {item.planId}</Text>
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
        data={plans}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()} // Ensure keyExtractor is using the correct property
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
