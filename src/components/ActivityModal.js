// This component is not used in the application. It was intended to be used to display additional activities that the user can add to their trip.
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { API_KEY } from "../core/config";
import RatingStars from "./RatingStars";
import placesApi from "../api/PlacesApi";

const ActivityModal = ({
  visible,
  onClose,
  activity,
  additionalActivities,
  onSelect,
}) => {
  const [selectedActivity, setSelectedActivity] = useState(null);

  if (!activity) return null;

  const handleLinking = async (place) => {
    await placesApi.openInGoogleMaps(place);
  };

  const handleSelect = (item) => {
    setSelectedActivity(item);
  };

  const handleConfirmSelect = () => {
    if (selectedActivity) {
      onSelect(
        selectedActivity.place_id,
        activity.activityIndex,
        activity.dayIndex,
        activity.tripId
      );
      setSelectedActivity(null);
      onClose();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <ScrollView nestedScrollEnabled={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Activities</Text>
            <FlatList
              data={additionalActivities}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.additionalActivityContainer,
                    selectedActivity?.place_id === item.place_id &&
                      styles.selectedActivityContainer,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.activityTitle}>{item.name}</Text>
                  <Text style={styles.activityText}>{item.address}</Text>
                  <RatingStars rating={item.rank} />
                  <Image
                    source={{
                      uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${API_KEY}`,
                    }}
                    style={styles.activityImage}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              style={styles.additionalActivitiesList}
            />
            {selectedActivity && (
              <View style={styles.confirmationContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleConfirmSelect}
                >
                  <Text style={styles.confirmButtonText}>Select</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => handleLinking(selectedActivity)}
                >
                  <Text style={styles.confirmButtonText}>Google Maps</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  additionalActivityContainer: {
    marginBottom: 10,
    width: "100%",
    padding: 10,
    backgroundColor: "#E6E6FA",
    borderRadius: 5,
    alignItems: "center",
  },
  selectedActivityContainer: {
    backgroundColor: "#D3D3D3",
  },
  additionalActivitiesList: {
    marginTop: 20,
    width: "100%",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#2196F3",
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  activityText: {
    fontSize: 12,
  },
  activityImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    marginTop: 10,
  },
  confirmationContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});

export default ActivityModal;
