import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../config/Colors';
import TextField from '../../components/TextField';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { showToast } from '../../components/Toast';

const VendorCompleteProfile = ({ navigation }) => {
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const handleContinue = () => {
    if (!businessName.trim()) {
      showToast('Validation Error', 'Please enter your business name', 'info');
      return;
    }
    if (!businessEmail.trim()) {
      showToast('Validation Error', 'Please enter your business email', 'info');
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
