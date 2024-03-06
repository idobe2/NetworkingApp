import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, Linking } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_KEY } from '../core/config';
import MapView from 'react-native-maps';

export default function Explore() {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [placePhoto, setPlacePhoto] = useState(null);

    const getPlaceDetails = async (place_id) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}`);
            const data = await response.json();
            const details = {
                name: data?.result?.name,
                address: data?.result?.formatted_address,
                rank: data?.result?.rating,
                photo_reference: data?.result?.photos?.[0]?.photo_reference // Get the reference to the first photo
            };
            setSelectedPlace(details);
            if (details.photo_reference) {
                fetchPlacePhoto(details.photo_reference);
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
        }
    };

    const fetchPlacePhoto = async (photoReference) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`);
            setPlacePhoto(response.url);
        } catch (error) {
            console.error('Error fetching place photo:', error);
        }
    };

    useEffect(() => {
        if (selectedPlace) {
            if (selectedPlace.photo_reference) {
                fetchPlacePhoto(selectedPlace.photo_reference);
            }
        }
    }, [selectedPlace]);

    const openInGoogleMaps = () => {
        if (selectedPlace) {
            const { name, address } = selectedPlace;
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)},${encodeURIComponent(address)}`;
            Linking.openURL(url);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <GooglePlacesAutocomplete
                    placeholder='Search'
                    onPress={(data, details = null) => {
                        console.log(data, details);
                        if (details) {
                            getPlaceDetails(details.place_id);
                        }
                    }}
                    styles={{ textInput: styles.textInput }}
                    query={{
                        key: API_KEY,
                        language: 'en',
                    }}
                />
                {selectedPlace && (
                    <TouchableOpacity style={styles.detailsContainer} onPress={openInGoogleMaps}>
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
        backgroundColor: '#eee',
        marginVertical: 5
    },
    detailsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5
    },
    placeDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    placeImage: {
        width: 100,
        height: 100,
        marginLeft: 10,
        borderRadius: 5
    }
});
