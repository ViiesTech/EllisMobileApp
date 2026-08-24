import React from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import {
  selectBusinessProfile,
  selectRole,
  selectToken,
  selectUser,
} from '../store/authSlice';

import AuthStack from './AuthStack';
import UserStack from './UserStack';
import VendorStack from './VendorStack';
import TailorStack from './TailorStack';
import VendorCompleteProfile from '../screens/Auth/VendorCompleteProfile';
import TailorCompleteProfile from '../screens/Auth/TailorCompleteProfile';

const Stack = createNativeStackNavigator();
export const navigationRef = createNavigationContainerRef();

const Routes = () => {
  const token = useSelector(selectToken);
  const role = useSelector(selectRole);
  const user = useSelector(selectUser);
  const businessProfile = useSelector(selectBusinessProfile);
  const isBusinessProfile =
    user?.is_business_profile || businessProfile?.is_business_profile;

  console.log('Token:-', token);
  console.log('User:-', user);
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : role === 'VENDOR' ? (
          !isBusinessProfile ? (
            <Stack.Screen
              name="VendorCompleteProfile"
              component={VendorCompleteProfile}
            />
          ) : (
            <Stack.Screen name="VendorStack" component={VendorStack} />
          )
        ) : role === 'TAILOR' ? (
          !isBusinessProfile ? (
            <Stack.Screen
              name="TailorCompleteProfile"
              component={TailorCompleteProfile}
            />
          ) : (
            <Stack.Screen name="TailorStack" component={TailorStack} />
          )
        ) : (
          <Stack.Screen name="UserStack" component={UserStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
