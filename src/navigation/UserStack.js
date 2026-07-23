import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabStack from './TabStack';
import SelectedLandscaper from '../screens/User/SelectedLandscaper';
import Measurement from '../screens/User/Booking/Measurement';
import CartCheckout from '../screens/User/Booking/CartCheckout';
import ProductDetails from '../screens/Vendor/Product/ProductDetails';
import UserEditProfile from '../screens/User/UserEditProfile';
import PrivacyPolicy from '../screens/CommonScreens/PrivacyPolicy';
import TermsAndCoditions from '../screens/CommonScreens/TermsAndCoditions';

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabStack} />
      <Stack.Screen name="SelectedLandscaper" component={SelectedLandscaper} />
      <Stack.Screen name="Measurement" component={Measurement} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="CartCheckout" component={CartCheckout} />
      <Stack.Screen name="UserEditProfile" component={UserEditProfile} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsAndCoditions" component={TermsAndCoditions} />
    </Stack.Navigator>
  );
};

export default UserStack;
