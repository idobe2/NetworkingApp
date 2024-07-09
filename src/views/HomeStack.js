import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { useAuth } from '../common/AuthContext'; // Ensure correct import

import PreviousPlans from './PreviousPlansScreen';
import PlanDetailsScreen from './PlanDeatilsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ExploreScreen from './ExploreScreen';
import Schedule from './ScheduleScreen'; // Ensure ScheduleScreen is imported
import SettingsScreen from './SettingsScreen'; // Ensure SettingsScreen is imported
import PreferencesScreen from './PreferencesScreen'; // Ensure PreferencesScreen is imported

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerList = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Explore" component={ExploreScreen} />
      <Drawer.Screen name="Schedule" component={Schedule} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Preferences" component={PreferencesScreen} />
    </Drawer.Navigator>
  );
};

const Trip = ({ navigation }) => {
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
    <Stack.Navigator>
      <Stack.Screen
        name="PreviousPlans"
        component={PreviousPlans}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlanDetails"
        component={PlanDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const Explore = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExploreDrawer"
        component={DrawerList}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default { Trip, Explore };
