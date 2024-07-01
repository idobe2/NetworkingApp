import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import placesApi from "../api/PlacesApi";
import { API_KEY } from "../core/config";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ActivityBottomSheet from "../components/ActivityBottomSheet";
import PlanApi from "../api/PlanApi";
import RatingStars from "../components/RatingStars";
import AnimatedLogo from "../common/AnimatedLogo"

export default function PlanDetailsScreen({ route }) {
  const { trip, image } = route.params;
  const [activitiesDetails, setActivitiesDetails] = useState([]);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [additionalActivitiesDetails, setAdditionalActivitiesDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchActivitiesDetails = async () => {
    setLoading(true);
    const details = await Promise.all(
      trip.travelPlan.flatMap((day) =>
        day.activities.map((activity) => placesApi.getPlaceDetails(activity))
      )
    );
    setActivitiesDetails(details);
    setLoading(false);
  };

  useEffect(() => {
    fetchActivitiesDetails();
  }, [trip]);

  const handleEdit = (activity, activityIndex, dayIndex) => {
    Alert.alert(
      "Generate",
      "Do you want to generate new activities?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            console.log("Generate activity:", activity);
            const response = await PlanApi.generateActivities(
              trip.planId,
              dayIndex,
              activityIndex
            );
            console.log("Response:", response);

            const additionalDetails = await Promise.all(
              response.additionalActivities.map((placeId) =>
                placesApi.getPlaceDetails(placeId)
              )
            );
            setBottomSheetVisible(true);
            setAdditionalActivitiesDetails(additionalDetails);
            setSelectedActivity({
              ...activity,
              activityIndex,
              dayIndex,
              tripId: trip.planId,
            });
            setBottomSheetVisible(true);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = (activity, activityIndex, dayIndex) => {
    Alert.alert(
      "Delete",
      "Do you want to delete this activity?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            console.log("Delete activity:", activity);
            const response = await PlanApi.deleteActivity(trip.planId, dayIndex, activityIndex);
            console.log("Response:", response);
            // Remove the deleted activity from the activitiesDetails state
            const newActivitiesDetails = activitiesDetails.filter(
              (item, index) => index !== activityIndex
            );

            setActivitiesDetails(newActivitiesDetails);
          }
        },
      ],
      { cancelable: true }
    );
  };

  const handleLinking = async (place) => {
    Alert.alert(
      `${place.name}`,
      "Do you want to open this place in Google Maps?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => await placesApi.openInGoogleMaps(place),
        },
      ],
      { cancelable: true }
    );
  };

  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };

  const renderActivity = ({ item, index, dayIndex }) => (
    <TouchableOpacity
      onPress={() => handleLinking(item)}
      style={styles.activityContainer}
    >
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>{truncateText(item.name, 20)}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => handleEdit(item, index, dayIndex)}
          >
            <Icon name="pencil" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item, index, dayIndex)}>
            <Icon name="delete" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.activityText}>{item.address}</Text>
      <RatingStars rating={item.rank} />
      {item.photo_reference && (
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${API_KEY}`,
          }}
          style={styles.activityImage}
        />
      )}
    </TouchableOpacity>
  );

  const renderDay = ({ item, index }) => {
    const dayActivities = activitiesDetails.slice(
      item.startIndex,
      item.endIndex + 1
    );

    return (
      <ScrollView nestedScrollEnabled={true}>
        <View>
          <Text style={styles.dayTitle}>Day: {item.day}</Text>
          <FlatList
            data={dayActivities}
            renderItem={(props) =>
              renderActivity({ ...props, dayIndex: index })
            }
            keyExtractor={(activity, index) => index.toString()}
          />
        </View>
      </ScrollView>
    );
  };

  const travelPlanWithIndices = trip.travelPlan.map((day, index) => ({
    ...day,
    startIndex: index * day.activities.length,
    endIndex: (index + 1) * day.activities.length - 1,
  }));

  const handleSelectActivity = async (newActivity, activityIndex, dayIndex, planId) => {
    console.log("Selected Activity:", {
      planId: planId,
      dayIndex: dayIndex,
      activityIndex: activityIndex,
      newActivity: newActivity
    });
    const response = await PlanApi.replaceActivity(planId, dayIndex, activityIndex, newActivity);
    trip.travelPlan[dayIndex].activities[activityIndex] = newActivity;
    await fetchActivitiesDetails();
    setBottomSheetVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {image && (
          <Image source={{ uri: image }} style={styles.destinationImage} />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{trip.destination}</Text>
          <Text style={styles.subtitle}>{trip.social}</Text>
          <Text style={styles.date}>
            {trip.arrivalDate} to {trip.departureDate}
          </Text>
        </View>
      </View>
      <FlatList
        data={travelPlanWithIndices}
        renderItem={renderDay}
        keyExtractor={(day, index) => index.toString()}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <AnimatedLogo />
        </View>
      )}
      <ActivityBottomSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        activity={selectedActivity}
        additionalActivities={additionalActivitiesDetails}
        onSelect={handleSelectActivity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: -5,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "grey",
    bottom: 5,
  },
  destinationImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  activityContainer: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: "#E6E6FA",
    borderRadius: 5,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 10,
    fontSize: 28,
    color: "grey",
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
    zIndex: 1,
  },
});
