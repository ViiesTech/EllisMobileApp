import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import VendorHome from '../screens/Vendor/VendorHome';
import Products from '../screens/Vendor/Product/Products';
import VendorOrders from '../screens/Vendor/VendorOrders';
import VendorProfile from '../screens/Vendor/VendorProfile';
import Colors from '../config/Colors';

const Tab = createBottomTabNavigator();

const VendorTabStack = () => {
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
        name="VendorHome"
        component={VendorHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="VendorProducts"
        component={Products}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'pricetag' : 'pricetag-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="VendorOrders"
        component={VendorOrders}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'document-text' : 'document-text-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="VendorProfile"
        component={VendorProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default VendorTabStack;
