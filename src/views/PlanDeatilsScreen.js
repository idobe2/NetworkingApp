import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import placesApi from "../api/PlacesApi";
import { API_KEY } from "../core/config";
import ActivityActions from "../components/ActivityActions";
import ActivityBottomSheet from "../components/ActivityBottomSheet";
import PlanApi from "../api/PlanApi";
import RatingStars from "../components/RatingStars";
import AnimatedLogo from "../common/AnimatedLogo";
import HomeBackground from "../components/HomeBackground";
import BackButton from "../components/BackButton";
import MealTypeModal from "../components/MealTypeModal";

export default function PlanDetailsScreen({ route, navigation }) {
  const { trip, image } = route.params;
  const [activitiesDetails, setActivitiesDetails] = useState([]);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [additionalActivitiesDetails, setAdditionalActivitiesDetails] =
    useState([]);
  const [loading, setLoading] = useState(false);
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [mealDetails, setMealDetails] = useState({});
  const [caller, setCaller] = useState(null);

  const fetchActivitiesDetails = async () => {
    setLoading(true);
    try {
      const details = await Promise.all(
        trip?.travelPlan?.flatMap((day) =>
          day.activities.map((activity) => placesApi.getPlaceDetails(activity))
        ) || []
      );
      setActivitiesDetails(details);
    } catch (error) {
      console.error("Error fetching activity details:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivitiesDetails();
  }, [trip]);

  const handleEdit = (activity, activityIndex, dayIndex) => {
    setCaller("edit");
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
            const response = await PlanApi.deleteActivity(
              trip.planId,
              dayIndex,
              activityIndex
            );
            console.log("Response:", response);
            const newActivitiesDetails = activitiesDetails.filter(
              (item, index) => index !== activityIndex
            );

            setActivitiesDetails(newActivitiesDetails);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleMeal = (activity, activityIndex, dayIndex) => {
    setCaller("meal");
    setMealDetails({ activity, activityIndex, dayIndex });
    setMealModalVisible(true);
  };

  const onMealSelect = async (mealType) => {
    setMealModalVisible(false);
    const { activity, activityIndex, dayIndex } = mealDetails;
    console.log("Add meal to activity:", activity, "Meal Type:", mealType);
    const response = await PlanApi.generateMeals(
      trip.planId,
      dayIndex,
      activityIndex,
      mealType
    );

    const additionalDetails = await Promise.all(
      response.map((place) => placesApi.getPlaceDetails(place.placeId))
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

  const fixedDate = (date) => {
    const [day, month, year] = date.split("/");
    const newDate = new Date(`20${year}-${month}-${day}T00:00:00.000Z`);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = newDate.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const handleCalendar = (item, index, dayIndex) => {
    let startHour, endHour;
    if (index === 0) {
      startHour = "10:00";
      endHour = "12:00";
    } else if (index === 1) {
      startHour = "12:00";
      endHour = "14:00";
    } else if (index === 2) {
      startHour = "14:00";
      endHour = "16:00";
    } else {
      startHour = "16:00";
      endHour = "18:00";
    }

    const [day, month, year] = trip.travelPlan[dayIndex].day.split("/");
    const startDate = new Date(
      `20${year}-${month}-${day}T${startHour}:00.000Z`
    );
    const endDate = new Date(`20${year}-${month}-${day}T${endHour}:00.000Z`);

    // RNCalendarEvents.requestPermissions()
    // .then(status => {
    //   if (status === 'authorized') {
    //     RNCalendarEvents.saveEvent(item.name, {
    //       startDate: startDate.toISOString(),
    //       endDate: endDate.toISOString(),
    //       location: item.address,
    //       notes: `Activity: ${item.name}\nAddress: ${item.address}`,
    //     }).then(id => {
    //       console.log(`Event created with id: ${id}`);
    //     }).catch(error => {
    //       console.log(`Error creating event: ${error}`);
    //     });
    //   } else {
    //     console.log('Permission not granted');
    //   }
    // }).catch(error => {
    //   console.log(`Error requesting calendar permissions: ${error}`);
    // });

    const startDateString = startDate.toISOString().replace(/-|:|\.\d{3}/g, "");
    const endDateString = endDate.toISOString().replace(/-|:|\.\d{3}/g, "");

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&
    text=${encodeURIComponent(item.name)}&
    dates=${startDateString}/${endDateString}&
    details=${encodeURIComponent(
      `Activity: ${item.name}\nAddress: ${item.address}`
    )}&
    location=${encodeURIComponent(item.address)}`;
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err)
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
        <Text style={styles.activityTitle}>{truncateText(item.name, 19)}</Text>
        <ActivityActions
          onEdit={() => handleEdit(item, index, dayIndex)}
          onMeal={() => handleMeal(item, index, dayIndex)}
          onDelete={() => handleDelete(item, index, dayIndex)}
          onCalendar={() => handleCalendar(item, index, dayIndex)}
        />
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
      trip.travelPlan
        .slice(0, index)
        .reduce((sum, day) => sum + day.activities.length, 0),
      trip.travelPlan
        .slice(0, index + 1)
        .reduce((sum, day) => sum + day.activities.length, 0)
    );

    return (
      <View>
        <Text style={styles.dayTitle}>{fixedDate(item.day)}</Text>
        <FlatList
          data={dayActivities}
          renderItem={(props) => renderActivity({ ...props, dayIndex: index })}
          keyExtractor={(activity, index) => index.toString()}
        />
      </View>
    );
  };

  const travelPlanWithIndices = trip.travelPlan.map((day, index) => ({
    ...day,
    startIndex: index * day.activities.length,
    endIndex: (index + 1) * day.activities.length - 1,
  }));

  const handleSelectActivity = async (
    newActivity,
    activityIndex,
    dayIndex,
    planId,
    activityName
  ) => {
    console.log("Caller:", caller);
    console.log("Selected Activity:", {
      planId: planId,
      dayIndex: dayIndex,
      activityIndex: activityIndex,
      newActivity: newActivity,
      activityName: activityName,
    });
    if (caller === "edit") {
      const response = await PlanApi.replaceActivity(
        planId,
        dayIndex,
        activityIndex,
        newActivity
      );
      trip.travelPlan[dayIndex].activities[activityIndex] = newActivity;
    } else if (caller === "meal") {
      const response = await PlanApi.addMeal(
        planId,
        dayIndex,
        activityIndex,
        activityName,
        newActivity
      );
    }
    await fetchActivitiesDetails();
    setBottomSheetVisible(false);
  };

  return (
    <HomeBackground>
      <BackButton goBack={navigation.goBack} />
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
          caller={caller}
        />
      </View>
      <MealTypeModal
        visible={mealModalVisible}
        onClose={() => setMealModalVisible(false)}
        onSelect={onMealSelect}
      />
    </HomeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    top: 20,
    marginTop: 50,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent background
    zIndex: 1,
  },
});
