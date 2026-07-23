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

const VendorBusinessProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};

  const [businessName, setBusinessName] = useState(
    userProfile.businessName || 'Alex',
  );
  const [businessEmail, setBusinessEmail] = useState(
    userProfile.businessEmail || 'your@email.com',
  );
  const [businessPhone, setBusinessPhone] = useState(
    userProfile.businessPhone || '+123-456-7890',
  );
  const [city, setCity] = useState(userProfile.city || 'New York');
  const [address, setAddress] = useState(
    userProfile.businessAddress || 'New York',
  );

  const handleSave = () => {
    if (!businessName.trim()) {
      showToast('Validation Error', 'Business name cannot be empty.', 'error');
      return;
    }
    if (!businessEmail.trim()) {
      showToast('Validation Error', 'Business email cannot be empty.', 'error');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessEmail.trim())) {
      showToast(
        'Validation Error',
        'Please enter a valid business email.',
        'error',
      );
      return;
    }

    if (!businessPhone.trim()) {
      showToast('Validation Error', 'Business phone cannot be empty.', 'error');
      return;
    }
    if (!city.trim()) {
      showToast('Validation Error', 'City cannot be empty.', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Validation Error', 'Address cannot be empty.', 'error');
      return;
    }

    dispatch(
      setUserProfile({
        ...userProfile,
        businessName: businessName.trim(),
        businessEmail: businessEmail.trim(),
        businessPhone: businessPhone.trim(),
        city: city.trim(),
        businessAddress: address.trim(),
      }),
    );

    showToast('Success', 'Business profile saved successfully.', 'success');
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="BUSINESS PROFILE"
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
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Business Name"
            />
            <TextField
              label="Business Email"
              value={businessEmail}
              onChangeText={setBusinessEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              leftIcon="mail"
            />
            <TextField
              label="Business Phone"
              value={businessPhone}
              onChangeText={setBusinessPhone}
              placeholder="+123-456-7890"
              keyboardType="phone-pad"
            />
            <TextField
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="City"
            />
            <TextField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
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
  },
});

export default VendorBusinessProfile;
