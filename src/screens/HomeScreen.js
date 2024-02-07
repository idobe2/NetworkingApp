import React from 'react'
import { View, StyleSheet } from 'react-native'
import Button from '../components/Button'
import TopBar from '../components/TopBar'
import DrawerContent from '../components/DrawerContent'; // Update the import path

import Constants from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../components/Home'
import Planner from '../components/Planner';
import About from '../components/About';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  return (
    <>
      <NavigationContainer independent={true}>
      <TopBar title="Tripy" />
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Planner"
          component={Planner}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="About"
          component={About}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="information-circle" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
