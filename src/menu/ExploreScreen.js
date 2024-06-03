import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { API_KEY } from "../core/config";
import placesApi from "../api/PlacesApi";

export default function Explore() {
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={handlePlaceSelect}
          styles={{ textInput: styles.textInput }}
          query={{
            key: API_KEY,
            language: "en",
          }}
        />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
