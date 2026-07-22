import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { showToast } from '../../components/Toast';

const SetPassword = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    if (!newPassword.trim()) {
      showToast('Validation Error', 'Please enter a new password', 'info');
      return;
    }
    if (newPassword.length < 3) {
      showToast(
        'Validation Error',
        'Password must be at least 3 characters',
        'info',
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Validation Error', 'Passwords do not match', 'info');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(
        'Success',
        'Your password has been reset successfully',
        'success',
      );
      navigation.navigate('Login');
    }, 600);
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
            Now you can create new password and confirm a below
          </AppText>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <TextField
            label="New Password"
            leftIcon="lock"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="••••••••"
            secureTextEntry
          />

          <TextField
            label="Confirm New Password"
            leftIcon="lock"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
          />
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton
            title="Confirm New Password"
            onPress={handleConfirm}
            loading={loading}
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
