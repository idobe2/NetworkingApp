import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { useAuth } from '../common/AuthContext';

import PreviousPlans from './PreviousPlansScreen';
import PlanDeatilsScreen from './PlanDeatilsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ExploreScreen from './ExploreScreen';
import Schedule from './ScheduleScreen';
import SettingsScreen from './SettingsScreen';
import PreferencesScreen from './PreferencesScreen';
import NextActivities from '../screens/NextActivities';
import clientApi from '../api/ClientApi';

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

  const checkAuthentication = async () => {
    try {
      const valid = await clientApi.get('/check');
      if (valid?.data.message === 'Authenticated') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected !== isConnected) {
        setIsConnected(state.isConnected);
        if (state.isConnected) {
          Alert.alert("Back Online", "You are back online.");
          checkAuthentication();
        } else {
          Alert.alert("No Network", "You are offline. Please connect to the network in order to return to the app.", [
            {
              text: "OK",
              onPress: () => {
                setIsAuthenticated(false);
              }
            }
          ]);
        }
      }
    });

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
        component={PlanDeatilsScreen}
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
      <Stack.Screen
        name="NextActivities"
        component={NextActivities}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlanDetails"
        component={PlanDeatilsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default { Trip, Explore };
