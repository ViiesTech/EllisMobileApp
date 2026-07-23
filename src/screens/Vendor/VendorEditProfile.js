import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import VendorHeader from '../../components/VendorHeader';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUserProfile } from '../../store/authSlice';
import { showToast } from '../../components/Toast';

const VendorEditProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};

  // Split full name into first and last name
  const nameParts = (userProfile.name || '').trim().split(/\s+/);
  const initialFirstName = nameParts[0] || 'Alex';
  const initialLastName = nameParts.slice(1).join(' ') || 'Charlie';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(
    userProfile.email || 'alexcharlie878@gmail.com',
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    if (!firstName.trim()) {
      showToast('Validation Error', 'First name cannot be empty.', 'error');
      return;
    }
    if (!lastName.trim()) {
      showToast('Validation Error', 'Last name cannot be empty.', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Validation Error', 'Email cannot be empty.', 'error');
      return;
    }

    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast(
        'Validation Error',
        'Please enter a valid email address.',
        'error',
      );
      return;
    }

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        showToast('Validation Error', 'Passwords do not match.', 'error');
        return;
      }
      if (password.length < 6) {
        showToast(
          'Validation Error',
          'Password must be at least 6 characters.',
          'error',
        );
        return;
      }
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    dispatch(
      setUserProfile({
        ...userProfile,
        name: fullName,
        email: email.trim(),
      }),
    );

    showToast('Success', 'Profile changes saved successfully.', 'success');
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="EDIT PROFILE"
        goBack={true}
        homeHeader={false}
        notification={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <TextField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Alex"
            />
            <TextField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Charlie"
            />
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              leftIcon="mail"
            />
            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={true}
              leftIcon="lock"
            />
            <TextField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••••"
              secureTextEntry={true}
              leftIcon="lock"
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            hasArrow={true}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  form: {
    marginTop: 10,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    elevation: 0,
  },
});

export default VendorEditProfile;
