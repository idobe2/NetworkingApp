import React from 'react';
import { Provider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { theme } from './src/core/theme';
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard
} from './src/screens';
import {enableLatestRenderer} from 'react-native-maps';
import DetailsScreen from './src/screens/DetailsScreen';
import Preferences from './src/menu/PreferencesScreen';
import Planner from './src/menu/PlannerScreen';
import Schedule from './src/menu/ScheduleScreen';
import HomeScreen from './src/menu/HomeScreen'
import DrawerContent from './src/components/DrawerContent';
import SettingsScreen from './src/menu/SettingsScreen';
import PreferencesScreen from './src/menu/PreferencesScreen';



enableLatestRenderer();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  return (
  <Drawer.Navigator>
          <Drawer.Screen name="Tripy" component={HomeScreen} />
          <Drawer.Screen name="Schedule" component={Schedule} />
          <Drawer.Screen name="Profile" component={DrawerContent} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="Preferences" component={PreferencesScreen} />
        </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="StartScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
          <Stack.Screen name="Schedule" component={Schedule} />
      </Stack.Navigator>
    </NavigationContainer>
  );
 }

 export default App;