import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import VendorHome from '../screens/Vendor/VendorHome';
import VendorOrders from '../screens/Vendor/VendorOrders';
import SettingsVendor from '../screens/Vendor/SettingsVendor';
import AddProduct from '../screens/Vendor/Services/AddProduct';

const Tab = createBottomTabNavigator();

const VendorTabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000000',
        tabBarInactiveTintColor: '#333333',
        tabBarStyle: {
          backgroundColor: '#DBA83A',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name="VendorHome"
        component={VendorHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VendorProducts"
        component={AddProduct}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color }) => (
            <Feather name="tag" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="VendorOrders"
        component={VendorOrders}
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color }) => (
            <Feather name="file-text" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsVendor"
        component={SettingsVendor}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default VendorTabStack;
