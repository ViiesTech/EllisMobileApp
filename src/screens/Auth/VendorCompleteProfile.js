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
import AppText from '../../components/AppText';
import { showToast, showToastError } from '../../components/Toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBusinessProfile,
  selectBusinessProfile,
} from '../../store/authSlice';
import { useVendorBusinessProfileMutation } from '../../Services/Auth';

const VendorCompleteProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const businessProfile = useSelector(selectBusinessProfile);
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const [vendorBusinessProfile, { isLoading }] =
    useVendorBusinessProfileMutation();

  const handleContinue = async () => {
    if (!businessName.trim()) {
      showToast('Validation Error', 'Please enter your business name', 'error');
      return;
    }
    if (!businessEmail.trim()) {
      showToast(
        'Validation Error',
        'Please enter your business email',
        'error',
      );
      return;
    }
    if (!businessPhone.trim()) {
      showToast(
        'Validation Error',
        'Please enter your business phone number',
        'error',
      );
      return;
    }
    if (!city.trim()) {
      showToast('Validation Error', 'Please enter your city', 'error');
      return;
    }
    if (!address.trim()) {
      showToast(
        'Validation Error',
        'Please enter your business address',
        'error',
      );
      return;
    }

    try {
      const payload = {
        business_name: businessName.trim(),
        business_email: businessEmail.trim(),
        business_phone: businessPhone.trim(),
        city: city.trim(),
        address: address.trim(),
      };

      const response = await vendorBusinessProfile(payload).unwrap();
      console.log('vendorBusinessProfile response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Business profile created successfully',
          'success',
        );
        dispatch(
          setBusinessProfile({
            ...response?.data?.vendor,
            is_business_profile: true,
          }),
        );
        // navigation.navigate('UnderReview');
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to create business profile',
          'error',
        );
      }
    } catch (err) {
      console.log('createVendorBusinessProfile error:-', err);
      showToastError('Error', err);
    }
  };

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <View style={styles.header}>
            <AppText style={styles.title}>Profile Setup</AppText>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            <TextField
              label="Business Name"
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="Alex"
            />

            <TextField
              label="Business Email"
              leftIcon="mail"
              value={businessEmail}
              onChangeText={setBusinessEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="New York"
            />

            <TextField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="New York"
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
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 44,
    fontFamily: 'serif',
    color: '#000000',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  bottomArea: {
    marginTop: 30,
    width: '100%',
  },
});

export default VendorCompleteProfile;
