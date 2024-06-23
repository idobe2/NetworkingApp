import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert, RefreshControl } from 'react-native';
import placesApi from '../api/PlacesApi';
import plansApi from '../api/PlanApi';

export default function PreviousPlans({ navigation }) {
  const [destinationImages, setDestinationImages] = useState({});
  const [plans, setPlans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const fetchedPlans = await plansApi.fetchPlans();
    if (fetchedPlans && fetchedPlans.length > 0) {
      const plansWithId = fetchedPlans.map((plan, index) => ({
        ...plan,
        id: plan.id || index.toString(),
      }));
      setPlans(plansWithId);
      const destination = await placesApi.fetchImages(plansWithId);
      if (destination) {
        setDestinationImages(destination);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

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
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('PlanDetails', {
        trip: item,
        image: destinationImages[item.destination]
      })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.destination}>{item.destination}</Text>
        <Text>Arrival: {item.arrivalDate}</Text>
        <Text>Departure: {item.departureDate}</Text>
        <Text>Social: {item.social}</Text>
      </View>
      {destinationImages[item.destination] && (
        <Image
          source={{ uri: destinationImages[item.destination] }}
          style={styles.destinationImage}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previous Plans</Text>
      <FlatList
        data={plans}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
