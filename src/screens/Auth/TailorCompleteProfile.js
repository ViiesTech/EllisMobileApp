import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { showToast, showToastError } from '../../components/Toast';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';
import { setUser, setBusinessProfile } from '../../store/authSlice';
import { useTailorBusinessProfileMutation } from '../../Services/Auth';

const SERVICES_DATA = [
  { label: 'Suit Stitching', value: 'Suit Stitching' },
  { label: 'Shirt Tailoring', value: 'Shirt Tailoring' },
  { label: 'Trouser Alterations', value: 'Trouser Alterations' },
  { label: 'Bespoke Tuxedo', value: 'Bespoke Tuxedo' },
  { label: 'Full Custom Package', value: 'Full Custom Package' },
];

const TailorCompleteProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [service, setService] = useState('');

  const [tailorBusinessProfile, { isLoading }] =
    useTailorBusinessProfileMutation();

  const handleContinue = async () => {
    if (!businessName.trim()) {
      showToast('Validation Error', 'Please enter your business name', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Validation Error', 'Please enter your email', 'error');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast(
        'Validation Error',
        'Please enter a valid email address',
        'error',
      );
      return;
    }
    if (!phone.trim()) {
      showToast('Validation Error', 'Please enter your phone number', 'error');
      return;
    }
    if (!city.trim()) {
      showToast('Validation Error', 'Please enter your city', 'error');
      return;
    }
    if (!address.trim()) {
      showToast('Validation Error', 'Please enter your address', 'error');
      return;
    }
    if (!experience.trim()) {
      showToast('Validation Error', 'Please enter your experience', 'error');
      return;
    }
    if (!service.trim()) {
      showToast('Validation Error', 'Please select a service', 'error');
      return;
    }

    try {
      const payload = {
        business_name: businessName.trim(),
        phone_number: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        experience: experience.trim(),
        services: service.trim(),
        business_email: email.trim(),
      };

      const response = await tailorBusinessProfile(payload).unwrap();
      console.log('tailorBusinessProfile response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Tailor profile saved successfully.',
          'success',
        );
        if (response?.data?.user) {
          dispatch(setUser(response.data.user));
        }
        if (response?.data?.tailor) {
          dispatch(setBusinessProfile(response.data.tailor));
        }
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to save tailor profile.',
          'error',
        );
      }
    } catch (err) {
      console.log('tailorBusinessProfile error:-', err);
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
              placeholder="Business Name"
            />

            <TextField
              label="Business Email"
              leftIcon="mail"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextField
              label="Number"
              value={phone}
              onChangeText={setPhone}
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

            <TextField
              label="Experience In Years"
              value={experience}
              onChangeText={setExperience}
              placeholder="8 Years"
              keyboardType="number-pad"
            />

            {/* Services Offered Dropdown */}
            <View style={styles.dropdownContainer}>
              <AppText style={styles.dropdownLabel}>Services Offered</AppText>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={SERVICES_DATA}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Service"
                value={service}
                onChange={item => setService(item.value)}
              />
            </View>
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
    marginTop: 50,
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
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 8,
    marginLeft: 4,
  },
  dropdown: {
    height: 52,
    borderColor: '#E2E2E2',
    borderWidth: 1,
    borderRadius: 26,
    paddingHorizontal: 18,
    backgroundColor: Colors.white,
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000000',
  },
  bottomArea: {
    marginTop: 30,
    width: '100%',
  },
});

export default TailorCompleteProfile;
