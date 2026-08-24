import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useDispatch } from 'react-redux';
import { setToken, setRole, setUser } from '../../store/authSlice';
import { useLoginMutation } from '../../Services/Auth';
import { showToast, showToastError } from '../../components/Toast';
import { getFcmToken } from '../../config/Firebase';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const fcmToken = await getFcmToken();
      console.log('fcmToken:-', fcmToken);
      const payload = {
        email: email.trim(),
        password: password,
        device_token: fcmToken || '',
        device_type: Platform.OS,
      };
      console.log('payload:-', payload);
      const response = await login(payload).unwrap();
      console.log('Login response:-', response);

      if (response?.success) {
        // Save token to Redux
        const token = response?.data?.token;
        if (token) {
          dispatch(setToken(token));
        }

        // Save user data to Redux
        const userData = response?.data;
        if (userData) {
          dispatch(setUser(userData));
        }

        // Map API role to Redux role format and save
        const apiRole = response?.data?.role?.slug?.toUpperCase();
        if (apiRole) {
          dispatch(setRole(apiRole));
        }

        showToast(
          'Success',
          response?.message || 'Login successful',
          'success',
        );
      } else {
        showToast('Error', response?.message || 'Login failed', 'error');
      }
    } catch (err) {
      console.log('Login error:-', err);
      showToastError('Login Failed', err);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={styles.header}>
          <AppText style={styles.title}>Login</AppText>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <TextField
            label="Email"
            leftIcon="mail"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: null }));
              }
            }}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <TextField
            label="Password"
            leftIcon="lock"
            value={password}
            onChangeText={text => {
              setPassword(text);
              if (errors.password) {
                setErrors(prev => ({ ...prev, password: null }));
              }
            }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.password}
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => navigation.navigate('Forgot_password')}
            activeOpacity={0.7}
          >
            <AppText style={styles.forgotText}>Forgot password?</AppText>
          </TouchableOpacity>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={isLoading}
          />

          <View style={styles.signupRow}>
            <AppText style={styles.noAccountText}>
              Don't have an Account?{' '}
            </AppText>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              activeOpacity={0.7}
            >
              <AppText style={styles.signupLink}>SignUp</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontFamily: 'serif',
    color: '#000000',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 14,
    fontFamily: 'serif',
    fontWeight: '700',
    color: '#000000',
  },
  bottomArea: {
    marginTop: 40,
    width: '100%',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  noAccountText: {
    fontSize: 14,
    color: '#4A5568',
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'serif',
    color: '#000000',
  },
});

export default Login;
