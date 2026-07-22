import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectRole, selectToken } from '../store/authSlice';

import AuthStack from './AuthStack';
import UserStack from './UserStack';
import VendorStack from './VendorStack';
import TailorStack from './TailorStack';

const Stack = createNativeStackNavigator();

const Routes = () => {
  const token = useSelector(selectToken);
  const role = useSelector(selectRole);

  console.log('Token:-', token);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!token ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : role === 'VENDOR' ? (
          <Stack.Screen name="VendorStack" component={VendorStack} />
        ) : role === 'TAILOR' ? (
          <Stack.Screen name="TailorStack" component={TailorStack} />
        ) : (
          <Stack.Screen name="UserStack" component={UserStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
