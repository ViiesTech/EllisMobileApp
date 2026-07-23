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
import { selectUser, setUserProfile } from '../../store/authSlice';
import { showToast } from '../../components/Toast';

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

  const [fullName, setFullName] = useState(userProfile.name || 'Alex');
  const [email, setEmail] = useState(userProfile.email || 'your@email.com');
  const [phone, setPhone] = useState(userProfile.phone || '+123-456-7890');
  const [city, setCity] = useState(userProfile.city || 'New York');
  const [address, setAddress] = useState(userProfile.address || 'New York');
  const [experience, setExperience] = useState(userProfile.experience || '8 Years');
  const [servicesOffered, setServicesOffered] = useState(
    userProfile.servicesOffered || 'Suit Stitching'
  );

  const handleSave = () => {
    if (!fullName.trim()) {
      showToast('Validation Error', 'Full name cannot be empty.', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Validation Error', 'Email cannot be empty.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showToast(
        'Validation Error',
        'Please enter a valid email address.',
        'error'
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

    dispatch(
      setUserProfile({
        ...userProfile,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        experience: experience.trim(),
        servicesOffered: servicesOffered,
      })
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
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
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
              label="Experience"
              value={experience}
              onChangeText={setExperience}
              placeholder="Experience"
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
                onChange={(item) => setServicesOffered(item.value)}
              />
            </View>
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
