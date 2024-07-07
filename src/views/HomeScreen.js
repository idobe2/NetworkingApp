import React from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Planner from './PlannerScreen';
import HomeStack from './HomeStack';
import HomeBackground from '../components/HomeBackground';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
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
