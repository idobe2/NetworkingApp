import React from 'react'
import { View, StyleSheet } from 'react-native'
import Button from '../components/Button'
import TopBar from '../components/TopBar'
// import DrawerContent from '../components/DrawerContent'
import DrawerContent from '../components/DrawerContent'; // Update the import path

import Constants from 'expo-constants';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../components/Home'
import Planner from '../components/Planner';
import About from '../components/About';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  return (
    <>
      <TopBar title="Home" />
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={navigation.openDrawer}
          style={{ width: 160 }}
        >
          Open Menu
        </Button>
        {/* <NavigationContainer>
          <Tab.Navigatior>
            <Tab.Screen
            name="Home"
            component={Home}
            options={{
              tabBarIcon:({color, size})=>(
              <Ionicons name="home" size={size} color={color} /> )
            }}
            >
            </Tab.Screen>
          </Tab.Navigatior>
        </NavigationContainer> */}
      </View>
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
