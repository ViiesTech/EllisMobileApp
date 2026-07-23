import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TailorTabStack from './TailorTabStack';
import TailorBookings from '../screens/Tailor/TailorBookings';
import TailorBookingDetails from '../screens/Tailor/TailorBookingDetails';
import ServiceDetails from '../screens/Tailor/Services/ServiceDetails';
import CreateService from '../screens/Tailor/Services/CreateService';
import TailorEditProfile from '../screens/Tailor/TailorEditProfile';
import TailorBusinessProfile from '../screens/Tailor/TailorBusinessProfile';
import BankAccount from '../screens/CommonScreens/BankAccount';
import AddBankAccount from '../screens/CommonScreens/AddBankAccount';
import PrivacyPolicy from '../screens/CommonScreens/PrivacyPolicy';
import TermsAndCoditions from '../screens/CommonScreens/TermsAndCoditions';

const Stack = createNativeStackNavigator();

const TailorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTailor" component={TailorTabStack} />
      <Stack.Screen name="TailorBookings" component={TailorBookings} />
      <Stack.Screen
        name="TailorBookingDetails"
        component={TailorBookingDetails}
      />
      <Stack.Screen name="ServiceDetails" component={ServiceDetails} />
      <Stack.Screen name="CreateService" component={CreateService} />
      <Stack.Screen name="TailorEditProfile" component={TailorEditProfile} />
      <Stack.Screen
        name="TailorBusinessProfile"
        component={TailorBusinessProfile}
      />
      <Stack.Screen name="BankAccount" component={BankAccount} />
      <Stack.Screen name="AddBankAccount" component={AddBankAccount} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsAndCoditions" component={TermsAndCoditions} />
    </Stack.Navigator>
  );
};

export default TailorStack;
