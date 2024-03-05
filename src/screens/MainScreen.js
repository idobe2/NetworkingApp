import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';


import DrawerContent from '../components/DrawerContent';
import HomeScreen from '../menu/HomeScreen'
import SettingsScreen from '../menu/SettingsScreen';
import PreferencesScreen from '../menu/PreferencesScreen';
import ScheduleScreen from '../menu/ScheduleScreen';

const Drawer = createDrawerNavigator();

export default function MainScreen() {
  return (
    <>
    <Drawer.Navigator initialRouteName='Home' >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Schedule" component={ScheduleScreen} />
          <Drawer.Screen name="Profile" component={DrawerContent} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="Preferences" component={PreferencesScreen} />
        </Drawer.Navigator>
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
