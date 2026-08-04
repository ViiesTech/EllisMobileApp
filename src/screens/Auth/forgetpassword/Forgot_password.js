import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../../config/Colors';
import TextField from '../../../components/TextField';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { showToast, showToastError } from '../../../components/Toast';
import { useForgotPasswordMutation } from '../../../Services/Auth';

const Forgot_password = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate()) return;

    try {
      const payload = { email: email.trim() };
      const response = await forgotPassword(payload).unwrap();
      console.log('ForgotPassword response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'OTP sent to your email',
          'success',
        );
        navigation.navigate('ForgotOTP', {
          email: email.trim(),
        });
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to send OTP',
          'error',
        );
      }
    } catch (err) {
      console.log('ForgotPassword error:-', err);
      showToastError('Error', err);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Subtitle */}
        <View style={styles.header}>
          <AppText style={styles.title}>Forgot Password</AppText>
          <AppText style={styles.sub}>
            No worries! Enter your email address below and we will send you a
            code to reset password.
          </AppText>
        </View>

        {/* Input */}
        <View style={styles.form}>
          <TextField
            label="E-mail"
            value={email}
            onChangeText={text => {
              setEmail(text);
              if (errors.email) {
                setErrors(prev => ({ ...prev, email: null }));
              }
            }}
            placeholder="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
          />
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
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontFamily: 'serif',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  sub: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
    width: '100%',
  },
});

export default Forgot_password;
