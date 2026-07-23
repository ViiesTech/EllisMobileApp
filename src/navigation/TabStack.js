import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../screens/User/Home';
import SelectLandscaper from '../screens/User/SelectLandscaper';
import UserBookings from '../screens/User/Booking/UserBookings';
import UserOrders from '../screens/User/UserOrders';
import UserProfile from '../screens/User/UserProfile';

const Tab = createBottomTabNavigator();

const renderTabIcon = (focusedName, outlineName) => {
  return ({ focused, color }) => (
    <Ionicons
      name={focused ? focusedName : outlineName}
      size={22}
      color={color}
    />
  );
};

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: 'rgba(0, 0, 0, 0.45)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#DBA83A',
          height: Platform.OS === 'ios' ? 82 : 66,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000000',
          shadowOpacity: 0.15,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -4 },
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: renderTabIcon('home', 'home-outline'),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={SelectLandscaper}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: renderTabIcon('bag', 'bag-outline'),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={UserBookings}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: renderTabIcon('clipboard', 'clipboard-outline'),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={UserOrders}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: renderTabIcon('document-text', 'document-text-outline'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: renderTabIcon('person', 'person-outline'),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabStack;
