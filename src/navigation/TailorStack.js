import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TailorHome from '../screens/Tailor/TailorHome';
import TailorServices from '../screens/Tailor/Services/TailorServices';
import SettingsTailor from '../screens/Tailor/SettingsTailor';

const Stack = createNativeStackNavigator();

const TailorStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TailorHome" component={TailorHome} />
      <Stack.Screen name="TailorServices" component={TailorServices} />
      <Stack.Screen name="SettingsTailor" component={SettingsTailor} />
    </Stack.Navigator>
  );
};

export default TailorStack;
