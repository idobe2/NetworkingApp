import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  RefreshControl,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import placesApi from "../api/PlacesApi";
import plansApi from "../api/PlanApi";

export default function PreviousPlans({ navigation }) {
  const [destinationImages, setDestinationImages] = useState({});
  const [plans, setPlans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (loading) return; // Prevent multiple fetches
    setLoading(true);

    const fetchedPlans = await plansApi.fetchPlans();
    if (!fetchedPlans) {
      setPlans([]);
    } else if (fetchedPlans.length > 0) {
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
    
    setLoading(false);
  }, [loading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => { fetchData(); });
    return () => unsubscribe();
  }, [navigation, fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  const handleEdit = (activity) => {
    Alert.alert(
      "Generate",
      "Do you want to edit this plan?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => console.log("Edit plan:", activity),
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (item) => {
    const response = await plansApi.deletePlan(item.planId);
    if (response) {
      const updatedPlans = plans.filter((plan) => plan.id !== item.id);
      setPlans(updatedPlans);
      fetchData();
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      "Delete Selected Plans",
      "Are you sure you want to delete the selected plans?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            const promises = selectedPlans.map((item) => handleDelete(item));
            await Promise.all(promises);
            setSelectedPlans([]);
            setIsSelectionMode(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  const toggleSelectPlan = (item) => {
    setSelectedPlans((prevSelectedPlans) =>
      prevSelectedPlans.includes(item)
        ? prevSelectedPlans.filter((plan) => plan !== item)
        : [...prevSelectedPlans, item]
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        if (isSelectionMode) {
          toggleSelectPlan(item);
        } else {
          navigation.navigate("PlanDetails", {
            trip: item,
            image: destinationImages[item.destination],
          });
        }
      }}
    >
      {isSelectionMode && (
        <CheckBox
          value={selectedPlans.includes(item)}
          onValueChange={() => toggleSelectPlan(item)}
        />
      )}
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
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setIsSelectionMode(!isSelectionMode)}
        >
          <Text style={styles.selectButtonText}>
            {isSelectionMode ? "Cancel" : "Select"}
          </Text>
        </TouchableOpacity>
        {isSelectionMode && selectedPlans.length > 0 && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteSelected}
          >
            <Text style={styles.deleteButtonText}>Delete Selected</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={plans}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  selectButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  selectButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#E6E6FA",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  destination: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  destinationImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
});
