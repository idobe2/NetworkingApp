import React, { useEffect, useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { useAuth } from '../common/AuthContext'; // Ensure correct import
import Planner from './PlannerScreen';
import HomeStack from './HomeStack';
import HomeBackground from '../components/HomeBackground';

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  const { setIsAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    if (!isConnected) {
      Alert.alert("No Network", "You are offline. Redirecting to Start Screen.", [
        {
          text: "OK",
          onPress: () => {
            setIsAuthenticated(false);
          }
        }
      ]);
    }

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  return (
    <HomeBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -64}
      >
        <NavigationContainer independent={true}>
          <Tab.Navigator
            screenOptions={{
              activeTintColor: 'blue',
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen
              name="Explore"
              component={HomeStack.Explore}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="search-outline" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Planner"
              component={Planner}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="map" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Previous Plans"
              component={HomeStack.Trip}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="briefcase-outline" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </KeyboardAvoidingView>
    </HomeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
