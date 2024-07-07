import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_KEY } from "../core/config";
import placesApi from "../api/PlacesApi";

const SearchPlacesBar = ({ onPlaceSelect }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placePhoto, setPlacePhoto] = useState(null);

  const handlePlaceSelect = async (data, details = null) => {
    try {
      if (details) {
        const placeDetails = await placesApi.getPlaceDetails(details.place_id);
        if (placeDetails.photo_reference) {
          const url = await placesApi.fetchPlacePhoto(
            placeDetails.photo_reference
          );
          if (url) setPlacePhoto(url);
          setSelectedPlace(placeDetails);
          onPlaceSelect(placeDetails, url);
        }
      }
    } catch (error) {
      console.error("Error handling place selection:", error);
    }
  };

  const handleLinking = async () => {
    await placesApi.openInGoogleMaps(selectedPlace);
  };

  return (
    <View>
      <View style={styles.searchContainer}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={handlePlaceSelect}
          styles={{ textInput: styles.textInput }}
          query={{
            key: API_KEY,
            language: "en",
          }}
        />
      </View>
      {selectedPlace && (
        <TouchableOpacity
          style={styles.detailsContainer}
          onPress={handleLinking}
        >
          <View style={styles.placeDetails}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailTitle}>{selectedPlace.name}</Text>
              <Text>{selectedPlace.address}</Text>
              <Text>Rank: {selectedPlace.rank}</Text>
            </View>
            {placePhoto && (
              <Image source={{ uri: placePhoto }} style={styles.placeImage} />
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 10,
  },
  textInput: {
    height: 50,
    backgroundColor: "#eee",
    marginVertical: 5,
  },
  detailsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    top: 50,
  },
  placeDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  placeImage: {
    width: 100,
    height: 100,
    marginLeft: 10,
    borderRadius: 5,
  },
});

export default SearchPlacesBar;
