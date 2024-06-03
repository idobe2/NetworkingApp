import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Explore from './ExploreScreen';
import Planner from './PlannerScreen';
import PreviousPlans from './PreviousPlansScreen';

const Tab = createBottomTabNavigator();

export default function HomeScreen({ navigation }) {
  return (
    <>
      <NavigationContainer independent={true}>
      <Tab.Navigator
        screenOptions={{
          activeTintColor: 'blue',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Explore"
          component={Explore}
          options={{headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Planner"
          component={Planner}
          options={{headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Previous Plans"
          component={PreviousPlans}
          options={{headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="briefcase-outline" color={color} size={size} />
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
});