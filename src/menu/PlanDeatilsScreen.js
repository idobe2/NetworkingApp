import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import placesApi from '../api/PlacesApi';
import { API_KEY } from '../core/config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function PlanDetailsScreen({ route }) {
  const { trip, image } = route.params;
  const [activitiesDetails, setActivitiesDetails] = useState([]);

  useEffect(() => {
    const fetchActivitiesDetails = async () => {
      const details = await Promise.all(
        trip.travelPlan.flatMap(day =>
          day.activities.map(activity =>
            placesApi.getPlaceDetails(activity)
          )
        )
      );
      setActivitiesDetails(details);
    };

    fetchActivitiesDetails();
  }, [trip]);

  const handleEdit = (activity) => {
    Alert.alert(
      "Generate",
      "Do you want to generate new activities?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => console.log('Generate activity:', activity),
        }
      ],
      { cancelable: true }
    );
  };

  const handleDelete = (activity) => {
    Alert.alert(
      "Delete",
      "Do you want to delete this activity?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => console.log('Delete activity:', activity),
        }
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
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => await placesApi.openInGoogleMaps(place)
        }
      ],
      { cancelable: true }
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Icon key={i} name="star" style={styles.myStarStyle} />);
      } else if (i === 5 && rating >= 4.5 && rating < 4.9) {
        stars.push(<Icon key={i} name="star-half" style={styles.myStarStyle} />);
      } else if (i === 5 && rating > 4.9) {
        stars.push(<Icon key={i} name="star" style={styles.myStarStyle} />);
      } else {
        stars.push(<Icon key={i} name="star-outline" style={[styles.myStarStyle, styles.myEmptyStarStyle]} />);
      }
    }
    return stars;
  };

  const truncateText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length) + '...';
    }
    return text;
  };

  const renderActivity = ({ item }) => (
    <TouchableOpacity onPress={() => handleLinking(item)} style={styles.activityContainer}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>{truncateText(item.name, 20)}</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Icon name="pencil" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)}>
            <Icon name="delete" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.activityText}>{item.address}</Text>
      <View style={styles.activityRating}>
        {renderStars(item.rank)}
      </View>
      {item.photo_reference && (
        <Image
          source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${API_KEY}` }}
          style={styles.activityImage}
        />
      )}
    </TouchableOpacity>
  );

  const renderDay = ({ item }) => {
    const dayActivities = activitiesDetails.slice(
      item.startIndex,
      item.endIndex + 1
    );

    return (
      <ScrollView>
        <View>
          <Text style={styles.dayTitle}>Day: {item.day}</Text>
          <FlatList
            data={dayActivities}
            renderItem={renderActivity}
            keyExtractor={(activity, index) => index.toString()}
          />
        </View>
      </ScrollView>
    );
  };

  // Add startIndex and endIndex to each day for easier slicing
  const travelPlanWithIndices = trip.travelPlan.map((day, index) => ({
    ...day,
    startIndex: index * day.activities.length,
    endIndex: (index + 1) * day.activities.length - 1,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {image && (
          <Image source={{ uri: image }} style={styles.destinationImage} />
        )}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>{trip.destination}</Text>
          <Text style={styles.subtitle}>{trip.social}</Text>
          <Text style={styles.date}>{trip.arrivalDate} to {trip.departureDate}</Text>
        </View>
      </View>
      <FlatList
        data={travelPlanWithIndices}
        renderItem={renderDay}
        keyExtractor={(day, index) => index.toString()}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: -5,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: 'grey',
    bottom: 5,
  },
  destinationImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  activityContainer: {
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#E6E6FA',
    borderRadius: 5,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
    fontSize: 22,
    color: 'grey',
  },
  activityText: {
    fontSize: 12,
  },
  activityRating: {
    flexDirection: 'row',
    marginTop: 5,
  },
  activityImage: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginTop: 10,
  },
  myStarStyle: {
    color: '#FFD700',
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: '#D3D3D3',
  },
});
