import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeWindStyleSheet } from 'nativewind';
import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  Dashboard,
} from './src/screens';
import { enableLatestRenderer } from 'react-native-maps';
import DetailsScreen from './src/screens/DetailsScreen';
import Schedule from './src/views/ScheduleScreen';
import HomeScreen from './src/views/HomeScreen';
import DrawerContent from './src/components/DrawerContent';
import SettingsScreen from './src/views/SettingsScreen';
import PreferencesScreen from './src/views/PreferencesScreen';
import LoadingScreen from './LoadingScreen'; // Ensure you have a LoadingScreen component
import { AuthProvider, useAuth } from './AuthContext';

enableLatestRenderer();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

NativeWindStyleSheet.setOutput({
  default: 'native',
});

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

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={Root} />
      <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      <Stack.Screen name="Schedule" component={Schedule} />
    </Stack.Navigator>
  );
}

function UnauthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function App() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthStack /> : <UnauthStack />}
    </NavigationContainer>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
