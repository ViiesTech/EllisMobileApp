import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../screens/Auth/Splash';
import OnBoarding from '../screens/Auth/OnBoarding';
import TypeSelection from '../screens/Auth/TypeSelection';
import Login from '../screens/Auth/Login';
import SignUp from '../screens/Auth/Signup';
import VerifyOTP from '../screens/Auth/VerifyOTP';
import EmailVerification from '../screens/Auth/EmailVerification';
import ForgetPassword from '../screens/Auth/forgetpassword/Forgot_password';
import SetPassword from '../screens/Auth/SetPassword';
import VendorCompleteProfile from '../screens/Auth/VendorCompleteProfile';
import TailorCompleteProfile from '../screens/Auth/TailorCompleteProfile';
import UnderReview from '../screens/Auth/UnderReview';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="OnBoarding" component={OnBoarding} />
      <Stack.Screen name="TypeSelection" component={TypeSelection} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="VerifyOTP" component={VerifyOTP} />
      <Stack.Screen name="EmailVerification" component={EmailVerification} />
      <Stack.Screen name="Forgot_password" component={ForgetPassword} />
      <Stack.Screen name="SetPassword" component={SetPassword} />
      <Stack.Screen
        name="VendorCompleteProfile"
        component={VendorCompleteProfile}
      />
      <Stack.Screen
        name="TailorCompleteProfile"
        component={TailorCompleteProfile}
      />
      <Stack.Screen name="UnderReview" component={UnderReview} />
    </Stack.Navigator>
  );
};

export default AuthStack;
