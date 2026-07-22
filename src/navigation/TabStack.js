import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Colors from '../config/Colors';
import AppText from '../components/AppText';

import Home from '../screens/User/Home';
import SelectLandscaper from '../screens/User/SelectLandscaper';
import UserBookings from '../screens/User/Booking/UserBookings';
import CartCheckout from '../screens/User/Booking/CartCheckout';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primaryDark,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          backgroundColor: Colors.white,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <AppText style={{ fontSize: 18 }}>🏠</AppText>,
        }}
      />
      <Tab.Screen
        name="Tailors"
        component={SelectLandscaper}
        options={{
          tabBarLabel: 'Tailors',
          tabBarIcon: ({ color }) => <AppText style={{ fontSize: 18 }}>✂️</AppText>,
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={UserBookings}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color }) => <AppText style={{ fontSize: 18 }}>📋</AppText>,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartCheckout}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color }) => <AppText style={{ fontSize: 18 }}>🛍️</AppText>,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabStack;
