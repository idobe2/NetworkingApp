import React, { useState, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import BottomSheet, { BottomSheetVirtualizedList } from "@gorhom/bottom-sheet";
import { API_KEY } from "../core/config";
import RatingStars from "./RatingStars";
import placesApi from "../api/PlacesApi";
import ConfirmationModal from "./ConfirmationModal";
import Button from "./Button";

const ActivityBottomSheet = ({
  visible,
  onClose,
  activity,
  additionalActivities,
  onSelect,
  caller,
}) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const sheetRef = useRef(null);
  const listRef = useRef(null);

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const handleSheetChange = useCallback((index) => {
  }, []);

  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
    onClose();
  }, [onClose]);

  const handleSelect = (item) => {
    setSelectedActivity(item);
    setModalVisible(true);
  };

  const handleConfirmSelect = () => {
    if (selectedActivity) {
      onSelect(
        selectedActivity.place_id,
        activity.activityIndex,
        activity.dayIndex,
        activity.tripId,
        selectedActivity.name
      );
      setSelectedActivity(null);
      setModalVisible(false);
      handleClosePress();
    }
  };

  const handleGoogleMaps = async () => {
    if (selectedActivity) {
      await placesApi.openInGoogleMaps(selectedActivity);
    }
  };

  if (!activity) return null;

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        index={visible ? 1 : -1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        onClose={handleClosePress}
        enablePanDownToClose={true} // Enable dragging down to close
        onOpenStart={() => {
          if (listRef.current) {
            listRef.current.scrollToIndex({ index: 0, animated: false });
          }
        }}
      >
        <BottomSheetVirtualizedList
          ref={listRef}
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
          getItemCount={(data) => data.length}
          getItem={(data, index) => data[index]}
          contentContainerStyle={styles.contentContainer}
        />
        <Button mode="contained" style={styles.button} onPress={handleClosePress}>
          <Text>Close</Text>
        </Button>
      </BottomSheet>
      <ConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmSelect}
        onGoogleMaps={handleGoogleMaps}
        selectedActivity={selectedActivity}
        caller={caller}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
  },
  modalContainer: {
    width: "100%",
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
    width: "90%",
    padding: 10,
    backgroundColor: "#E6E6FA",
    borderRadius: 10,
    alignSelf: "center",
  },
  selectedActivityContainer: {
    backgroundColor: "#D3D3D3",
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
  button: {
    borderRadius: 10,
    elevation: 2,
    width: '50%',
    alignSelf: 'center',
  },
});

export default ActivityBottomSheet;
