import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { showToast } from '../../components/Toast';
import { Dropdown } from 'react-native-element-dropdown';

const SERVICES_DATA = [
  { label: 'Suit Stitching', value: 'Suit Stitching' },
  { label: 'Shirt Tailoring', value: 'Shirt Tailoring' },
  { label: 'Trouser Alterations', value: 'Trouser Alterations' },
  { label: 'Bespoke Tuxedo', value: 'Bespoke Tuxedo' },
  { label: 'Full Custom Package', value: 'Full Custom Package' },
];

const TailorCompleteProfile = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [experience, setExperience] = useState('');
  const [service, setService] = useState('Suit Stitching');

  const handleContinue = () => {
    if (!fullName.trim()) {
      showToast('Validation Error', 'Please enter your full name', 'info');
      return;
    }
    if (!email.trim()) {
      showToast('Validation Error', 'Please enter your email', 'info');
      return;
    }

    navigation.navigate('UnderReview');
  };

  return (
    <View style={styles.safeArea}>
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
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Alex"
          />

          <TextField
            label="Email"
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
            label="Experience"
            value={experience}
            onChangeText={setExperience}
            placeholder="8 Years"
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
          <CustomButton title="Continue" onPress={handleContinue} />
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
