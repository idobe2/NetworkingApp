import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
  ToastAndroid,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import placesApi from '../api/PlacesApi';
import plansApi from '../api/PlanApi';
import HomeBackground from '../components/HomeBackground';
import { format, parse } from 'date-fns';
import { API_KEY } from '../core/config';

const NextActivities = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);

  const fetchNextActivities = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedPlans = await plansApi.fetchPlans();

      if (fetchedPlans && fetchedPlans.length > 0) {
        const now = new Date();
        let nextActivities = [];

        for (const plan of fetchedPlans) {
          
          for (const day of plan.travelPlan) {
           
            const activitiesToday = day.activities.map((activity) => ({
              activityId: activity,
              day: day.day,
              destination: plan.destination,
              plan: plan,
            }));

            const activityDate = parse(day.day, 'dd/MM/yy', new Date());
            
            if (activityDate >= now) {
              nextActivities = [...nextActivities, ...activitiesToday];
            }
          }
        }

        nextActivities.sort(
          (a, b) =>
            parse(a.day, 'dd/MM/yy', new Date()) -
            parse(b.day, 'dd/MM/yy', new Date())
        );
        
        const closestDay = nextActivities.length
          ? nextActivities[0].day
          : null;
       

        if (closestDay) {
          const filteredActivities = nextActivities.filter(
            (activity) => activity.day === closestDay
          );
          const detailedActivities = await Promise.all(
            filteredActivities.map(async (activity) => {
              try {
                const details = await placesApi.getPlaceDetails(activity.activityId);
                
                return { ...activity, ...details };
              } catch (error) {
                console.error('Error fetching place details:', error);
                return { ...activity, error: true };
              }
            })
          );
         

          const validDetailedActivities = detailedActivities.filter(
            (activity) => !activity.error
          );

          if (validDetailedActivities.length > 0) {
            setCity(validDetailedActivities[0].destination);
            setDate(format(parse(validDetailedActivities[0].day, 'dd/MM/yy', new Date()), 'MMMM dd, yyyy'));
            setCurrentPlan(validDetailedActivities[0].plan);
          }

          setActivities(validDetailedActivities);
        }
      }
    } catch (error) {
      ToastAndroid.show('Failed to fetch activities', ToastAndroid.SHORT);
      console.error('Error fetching next activities:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchNextActivities);
    return unsubscribe;
  }, [navigation, fetchNextActivities]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1 }}>
        <Text style={styles.placeName}>{item.name || 'Unknown Activity'}</Text>
        <Text>{item.address || 'Unknown Address'}</Text>
      </View>
      {item.photo_reference && (
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photo_reference}&key=${API_KEY}`,
          }}
          style={styles.activityImage}
        />
      )}
    </View>
  );

  const openGoogleMapsRoute = () => {
    if (activities.length === 0) {
      ToastAndroid.show('No activities to show in Google Maps', ToastAndroid.SHORT);
      return;
    }

    const baseUrl = 'https://www.google.com/maps/dir/?api=1&travelmode=driving';
    const origin = `&origin=${encodeURIComponent(activities[0].name + ', ' + activities[0].address)}`;
    const waypoints = activities.slice(1).map((activity) =>
      encodeURIComponent(activity.name + ', ' + activity.address)
    ).join('|');
    const destination = `&destination=${encodeURIComponent(activities[activities.length - 1].name + ', ' + activities[activities.length - 1].address)}`;
    const waypointsParam = waypoints ? `&waypoints=${waypoints}` : '';

    const url = baseUrl + origin + destination + waypointsParam;

    Linking.openURL(url).catch((err) =>
      console.error('An error occurred while opening Google Maps', err)
    );
  };

  const handleOpenGoogleMaps = () => {
    Alert.alert(
      "Open Google Maps",
      "Do you want to open the activities route in Google Maps?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: openGoogleMapsRoute,
        },
      ]
    );
  };

  return (
    <HomeBackground>
      <View style={styles.container}>
        <Text style={styles.city}>{city}</Text>
        <Text style={styles.date}>{date}</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <FlatList
              data={activities}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
            {currentPlan && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('PlanDetails', {
                    trip: currentPlan,
                    image: null,
                  })}
                >
                  <Text style={styles.buttonText}>View Plan Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleOpenGoogleMaps}
                >
                  <Text style={styles.buttonText}>Open in Google Maps</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </HomeBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  city: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  date: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#add8e6',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  activityImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#0000ff',
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NextActivities;
