import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PreviousPlans from './PreviousPlansScreen';
import PlanDetailsScreen from './PlanDeatilsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ExploreScreen from './ExploreScreen';

const Stack = createStackNavigator();

const Trip = () => {
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
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

const Explore = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Explore Stack"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}

export default { Trip, Explore };