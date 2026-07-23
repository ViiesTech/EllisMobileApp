import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VendorTabStack from './VendorTabStack';
import VendorOrders from '../screens/Vendor/VendorOrders';
import VendorProfile from '../screens/Vendor/VendorProfile';
import VendorOrderDetails from '../screens/Vendor/VendorOrderDetails';
import AddProduct from '../screens/Vendor/Product/AddProduct';
import ProductDetails from '../screens/Vendor/Product/ProductDetails';
import VendorEditProfile from '../screens/Vendor/VendorEditProfile';
import VendorBusinessProfile from '../screens/Vendor/VendorBusinessProfile';
import BankAccount from '../screens/CommonScreens/BankAccount';
import AddBankAccount from '../screens/CommonScreens/AddBankAccount';
import PrivacyPolicy from '../screens/CommonScreens/PrivacyPolicy';
import TermsAndCoditions from '../screens/CommonScreens/TermsAndCoditions';

const Stack = createNativeStackNavigator();

const VendorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainVendor" component={VendorTabStack} />
      <Stack.Screen name="AddProduct" component={AddProduct} />
      <Stack.Screen name="VendorOrders" component={VendorOrders} />
      <Stack.Screen name="VendorProfile" component={VendorProfile} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="VendorOrderDetails" component={VendorOrderDetails} />
      <Stack.Screen name="VendorEditProfile" component={VendorEditProfile} />
      <Stack.Screen name="VendorBusinessProfile" component={VendorBusinessProfile} />
      <Stack.Screen name="BankAccount" component={BankAccount} />
      <Stack.Screen name="AddBankAccount" component={AddBankAccount} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsAndCoditions" component={TermsAndCoditions} />
    </Stack.Navigator>
  );
};

export default VendorStack;
