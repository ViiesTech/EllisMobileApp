import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { showToast, showToastError } from '../../components/Toast';
import { useResetPasswordMutation } from '../../Services/Auth';

const SetPassword = ({ navigation, route }) => {
  const { email } = route.params || {};
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    try {
      const payload = {
        email: email,
        password: newPassword,
        password_confirmation: confirmPassword,
      };

      const response = await resetPassword(payload).unwrap();
      console.log('ResetPassword response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Your password has been reset successfully',
          'success',
        );
        navigation.navigate('Login');
      } else {
        showToast(
          'Error',
          response?.message || 'Password reset failed',
          'error',
        );
      }
    } catch (err) {
      console.log('ResetPassword error:-', err);
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
          <AppText style={styles.title}>Set New Password</AppText>
          <AppText style={styles.sub}>
            Now you can create new password and confirm it below
          </AppText>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <TextField
            label="New Password"
            leftIcon="lock"
            value={newPassword}
            onChangeText={text => {
              setNewPassword(text);
              if (errors.newPassword) {
                setErrors(prev => ({ ...prev, newPassword: null }));
              }
            }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.newPassword}
          />

          <TextField
            label="Confirm New Password"
            leftIcon="lock"
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: null }));
              }
            }}
            placeholder="••••••••"
            secureTextEntry
            error={errors.confirmPassword}
          />
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton
            title="Confirm New Password"
            onPress={handleConfirm}
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
    justifyContent: 'space-between',
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
    paddingHorizontal: 10,
  },
  form: {
    width: '100%',
  },
  bottomArea: {
    marginTop: 40,
    width: '100%',
  },
});

export default SetPassword;
