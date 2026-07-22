import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VendorTabStack from './VendorTabStack';
import AddProduct from '../screens/Vendor/Services/AddProduct';
import VendorOrders from '../screens/Vendor/VendorOrders';
import SettingsVendor from '../screens/Vendor/SettingsVendor';

const Stack = createNativeStackNavigator();

const VendorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainVendor" component={VendorTabStack} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="VendorOrders" component={VendorOrders} />
      <Stack.Screen name="SettingsVendor" component={SettingsVendor} />
    </Stack.Navigator>
  );
};

export default VendorStack;
