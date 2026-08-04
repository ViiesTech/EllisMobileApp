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
import {
  selectBusinessProfile,
  setBusinessProfile,
} from '../../store/authSlice';
import { showToast, showToastError } from '../../components/Toast';
import { useVendorBusinessProfileMutation } from '../../Services/Auth';

const VendorBusinessProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const businessProfile = useSelector(selectBusinessProfile) || {};
  const [vendorBusinessProfile, { isLoading }] =
    useVendorBusinessProfileMutation();

  const [businessName, setBusinessName] = useState(
    businessProfile.business_name,
  );
  const [businessEmail, setBusinessEmail] = useState(
    businessProfile.business_email,
  );
  const [businessPhone, setBusinessPhone] = useState(
    businessProfile.business_phone,
  );
  const [city, setCity] = useState(businessProfile.city);
  const [address, setAddress] = useState(businessProfile.address);

  const handleSave = async () => {
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
          response?.message || 'Business profile saved successfully.',
          'success',
        );
        dispatch(setBusinessProfile(response?.data?.vendor));
        navigation.goBack();
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to save business profile',
          'error',
        );
      }
    } catch (err) {
      console.log('vendorBusinessProfile error:-', err);
      showToastError('Error', err);
    }
  };

  console.log('businessProfile:-', businessProfile);
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
            loading={isLoading}
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
