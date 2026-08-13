import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabStack from './TabStack';
import Measurement from '../screens/User/Booking/Measurement';
import BookingConfirm from '../screens/User/BookingConfirm';
import BookingCheckout from '../screens/User/BookingCheckout';
import CartCheckout from '../screens/User/Booking/CartCheckout';
import UserEditProfile from '../screens/User/UserEditProfile';
import PrivacyPolicy from '../screens/CommonScreens/PrivacyPolicy';
import TermsAndCoditions from '../screens/CommonScreens/TermsAndCoditions';
import UserOrderDetails from '../screens/User/UserOrderDetails';
import UserProductDetails from '../screens/User/UserProductDetails';
import UserBookingDetails from '../screens/User/Booking/UserBookingDetails';
import NearByTailors from '../screens/User/NearByTailors';
import TailorDetails from '../screens/User/TailorDetails';

const Stack = createNativeStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabStack} />
      <Stack.Screen name="NearByTailors" component={NearByTailors} />
      <Stack.Screen name="TailorDetails" component={TailorDetails} />
      <Stack.Screen name="Measurement" component={Measurement} />
      <Stack.Screen name="BookingConfirm" component={BookingConfirm} />
      <Stack.Screen name="BookingCheckout" component={BookingCheckout} />
      <Stack.Screen name="ProductDetails" component={UserProductDetails} />
      <Stack.Screen name="CartCheckout" component={CartCheckout} />
      <Stack.Screen name="UserEditProfile" component={UserEditProfile} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsAndCoditions" component={TermsAndCoditions} />
      <Stack.Screen name="UserOrderDetails" component={UserOrderDetails} />
      <Stack.Screen name="UserBookingDetails" component={UserBookingDetails} />
    </Stack.Navigator>
  );
};

export default UserStack;
