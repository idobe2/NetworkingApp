import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NativeWindStyleSheet } from 'nativewind';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

import {
  StartScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
} from './src/screens';
import { enableLatestRenderer } from 'react-native-maps';
import DetailsScreen from './src/screens/DetailsScreen';
import Schedule from './src/views/ScheduleScreen';
import HomeScreen from './src/views/HomeScreen';
import SettingsScreen from './src/views/SettingsScreen';
import PreferencesScreen from './src/views/PreferencesScreen';
import LoadingScreen from './src/common/LoadingScreen';
import { AuthProvider, useAuth } from './src/common/AuthContext';

enableLatestRenderer();

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const NewStack = createStackNavigator();

NativeWindStyleSheet.setOutput({
  default: 'native',
});

function Root() {
  return (
    <NewStack.Navigator screenOptions={{ headerShown: false }}>
      <NewStack.Screen name="Tripy" component={HomeScreen} />
      <NewStack.Screen name="Schedule" component={Schedule} />
      <NewStack.Screen name="Settings" component={SettingsScreen} />
      <NewStack.Screen name="Preferences" component={PreferencesScreen} />
    </NewStack.Navigator>
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
  const { loading, isAuthenticated, setIsAuthenticated } = useAuth();
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
