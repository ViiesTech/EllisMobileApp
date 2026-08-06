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
import AppText from '../../components/AppText';
import { Dropdown } from 'react-native-element-dropdown';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectBusinessProfile,
  selectUser,
  setBusinessProfile,
  setUser,
  setUserProfile,
} from '../../store/authSlice';
import { showToast, showToastError } from '../../components/Toast';
import { useTailorBusinessProfileMutation } from '../../Services/Auth';

const SERVICES_DATA = [
  { label: 'Suit Stitching', value: 'Suit Stitching' },
  { label: 'Alteration', value: 'Alteration' },
  { label: 'Tuxedo Stitching', value: 'Tuxedo Stitching' },
  { label: 'Shirt Tailoring', value: 'Shirt Tailoring' },
  { label: 'Trouser Hemming', value: 'Trouser Hemming' },
];

const TailorBusinessProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};
  const businessProfile = useSelector(selectBusinessProfile) || {};

  let _businessName =
    businessProfile?.business_name?.trim() || userProfile?.name?.trim();
  let _email =
    businessProfile?.business_email?.trim() ||
    userProfile?.business_email?.trim();
  let _phone =
    businessProfile?.phone_number?.trim() || userProfile?.phone_number?.trim();
  let _city = businessProfile?.city?.trim() || userProfile?.city?.trim();
  let _address =
    businessProfile?.address?.trim() || userProfile?.address?.trim();
  let _experience =
    businessProfile?.experience?.trim() || userProfile?.experience?.trim();
  let _servicesOffered =
    businessProfile?.services?.trim() || userProfile?.services?.trim();

  const [businessName, setBusinessName] = useState(_businessName);
  const [email, setEmail] = useState(_email);
  const [phone, setPhone] = useState(_phone);
  const [city, setCity] = useState(_city);
  const [address, setAddress] = useState(_address);
  const [experience, setExperience] = useState(_experience);
  const [servicesOffered, setServicesOffered] = useState(_servicesOffered);

  const [tailorBusinessProfile, { isLoading }] =
    useTailorBusinessProfileMutation();

  const handleSave = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!businessName.trim()) {
      showToast('Validation Error', 'Business name cannot be empty.', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Validation Error', 'Email cannot be empty.', 'error');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      showToast(
        'Validation Error',
        'Please enter a valid email address.',
        'error',
      );
      return;
    }
    if (!phone.trim()) {
      showToast('Validation Error', 'Phone number cannot be empty.', 'error');
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
    if (!experience.trim()) {
      showToast('Validation Error', 'Experience cannot be empty.', 'error');
      return;
    }

    try {
      const payload = {
        business_name: businessName.trim(),
        phone_number: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        experience: experience.trim(),
        services: servicesOffered.trim(),
        business_email: email.trim(),
      };

      const response = await tailorBusinessProfile(payload).unwrap();
      console.log('tailorBusinessProfile response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'Business profile updated successfully.',
          'success',
        );
        if (response?.data?.user) {
          dispatch(setUser(response.data.user));
        }
        if (response?.data?.tailor) {
          dispatch(setBusinessProfile(response.data.tailor));
        }
        navigation.goBack();
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

  console.log('userProfile:- ', userProfile);
  console.log('businessProfile:- ', businessProfile);
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
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
              leftIcon="mail"
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
              placeholder="City"
            />
            <TextField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
            />
            <TextField
              label="Experience In Years"
              value={experience}
              onChangeText={setExperience}
              placeholder="Experience"
              keyboardType="number-pad"
            />

            {/* Services Offered Dropdown */}
            <View style={styles.dropdownContainer}>
              <AppText style={styles.dropdownLabel}>Services Offered</AppText>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.dropdownMenuContainer}
                data={SERVICES_DATA}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Service"
                value={servicesOffered}
                onChange={item => setServicesOffered(item.value)}
              />
            </View>
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
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdownLabel: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 6,
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
    color: '#A3A3A3',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#000000',
  },
  dropdownMenuContainer: {
    marginTop: -20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
});

export default TailorBusinessProfile;
