import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../menu/HomeScreen'
import SettingsScreen from '../menu/SettingsScreen';
// import DrawerContent from '../components/DrawerContent';

const Drawer = createDrawerNavigator();

export default function MainScreen() {
  return (
    <>
    <Drawer.Navigator initialRouteName='Home' >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
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
