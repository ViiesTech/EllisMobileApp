import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import TailorHome from '../screens/Tailor/TailorHome';
import TailorBookings from '../screens/Tailor/TailorBookings';
import MyServices from '../screens/Tailor/Services/MyServices';
import TailorProfile from '../screens/Tailor/TailorProfile';
import Colors from '../config/Colors';

const Tab = createBottomTabNavigator();

// Static helper to avoid react/no-unstable-nested-components warning
const renderTabIcon = (focusedName, name) => {
  const IconComponent = ({ color, focused }) => (
    <Ionicons name={focused ? focusedName : name} size={20} color={color} />
  );
  return IconComponent;
};

const TailorTabStack = () => {
  const tabBarLabelStyle = {
    fontSize: 12,
    fontWeight: '600',
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#333333',
        tabBarStyle: {
          backgroundColor: Colors.primary,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: tabBarLabelStyle,
      }}
    >
      <Tab.Screen
        name="TailorHome"
        component={TailorHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: renderTabIcon('home', 'home-outline'),
        }}
      />
      <Tab.Screen
        name="TailorBookingsTab"
        component={TailorBookings}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: renderTabIcon('clipboard', 'clipboard-outline'),
        }}
      />
      <Tab.Screen
        name="MyServices"
        component={MyServices}
        options={{
          tabBarLabel: 'Services',
          tabBarIcon: renderTabIcon('cut', 'cut-outline'),
        }}
      />
      <Tab.Screen
        name="TailorProfileTab"
        component={TailorProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: renderTabIcon('person', 'person-outline'),
        }}
      />
    </Tab.Navigator>
  );
};

export default TailorTabStack;
