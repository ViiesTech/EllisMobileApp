import React, { useState } from 'react';
import { StyleSheet, KeyboardAvoidingView, ScrollView } from 'react-native';
import VendorHeader from '../../components/VendorHeader';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import { useChangePasswordMutation } from '../../Services/Auth';
import { showToast, showToastError } from '../../components/Toast';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [changePasswordMutation, { isLoading }] = useChangePasswordMutation();

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      showToast(
        'Validation Error',
        'Current password cannot be empty.',
        'error',
      );
      return;
    }
    if (!newPassword.trim()) {
      showToast('Validation Error', 'New password cannot be empty.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast(
        'Validation Error',
        'New password must be at least 6 characters long.',
        'error',
      );
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast(
        'Validation Error',
        'New password and confirm password do not match.',
        'error',
      );
      return;
    }

    try {
      const payload = {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmNewPassword,
      };

      const response = await changePasswordMutation(payload).unwrap();

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Password changed successfully.',
          'success',
        );
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to change password.',
          'error',
        );
      }
    } catch (err) {
      console.log('Error changing password:', err);
      showToastError('Change Password Failed', err);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="CHANGE PASSWORD"
        goBack={true}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <TextField
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextField
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextField
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        <CustomButton
          title="Change Password"
          onPress={handleSave}
          loading={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    marginTop: 20,
  },
});

export default ChangePassword;
