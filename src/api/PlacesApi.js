import { API_KEY } from "../core/config";
import { Linking } from "react-native";

const fetchImages = async (plansData) => {
  const imageRequests = plansData.map(async (item) => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${item.destination}&inputtype=textquery&fields=photos&key=${API_KEY}`
    );
    const data = await response.json();
    if (data && data.candidates && data.candidates.length > 0) {
      const photoReference = data.candidates[0].photos[0].photo_reference;
      return {
        [item.destination]: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`,
      };
    }
    return { [item.destination]: null };
  });
  const images = await Promise.all(imageRequests);
  const destinationImagesObject = Object.assign({}, ...images);
  return destinationImagesObject;
};

const getPlaceDetails = async (place_id) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${API_KEY}`
    );
    if (response.ok) {
      const data = await response.json();
      const details = {
        place_id: data?.result?.place_id,
        name: data?.result?.name,
        address: data?.result?.formatted_address,
        rank: data?.result?.rating,
        photo_reference: data?.result?.photos?.[0]?.photo_reference, // Get the reference to the first photo
      };
      return details;
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
  return null;
};

const fetchPlacePhoto = async (photoReference) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`
    );
    return response.url;
  } catch (error) {
    console.error("Error fetching place photo:", error);
  }
  return null;
};

const openInGoogleMaps = async (place) => {
  if (place) {
    const { name, address } = place;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      name
    )},${encodeURIComponent(address)}`;
    Linking.openURL(url);
  }
};

export default {
  fetchImages,
  getPlaceDetails,
  fetchPlacePhoto,
  openInGoogleMaps,
};
