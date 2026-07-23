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
import VendorHeader from '../../components/VendorHeader';
import { Dropdown } from 'react-native-element-dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, setUserProfile } from '../../store/authSlice';
import { showToast } from '../../components/Toast';

const BANKS_DATA = [
  { label: 'Bank of America', value: 'Bank of America' },
  { label: 'Chase Bank NA', value: 'Chase Bank NA' },
  { label: 'Wells Fargo', value: 'Wells Fargo' },
  { label: 'Citibank', value: 'Citibank' },
  { label: 'Capital One', value: 'Capital One' },
];

const AddBankAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};

  const [bank, setBank] = useState(userProfile.bankName || 'Bank of America');
  const [accountHolderName, setAccountHolderName] = useState(
    userProfile.bankHolderName || userProfile.name || 'Alex Charlie',
  );
  const [accountNumber, setAccountNumber] = useState(
    userProfile.bankAccount || '000123456789',
  );
  const [iban, setIban] = useState(userProfile.bankIban || '000123456789');

  const handleAddAccount = () => {
    if (!bank) {
      showToast('Validation Error', 'Please select a bank.', 'error');
      return;
    }
    if (!accountHolderName.trim()) {
      showToast(
        'Validation Error',
        'Account holder name cannot be empty.',
        'error',
      );
      return;
    }
    if (!accountNumber.trim()) {
      showToast('Validation Error', 'Account number cannot be empty.', 'error');
      return;
    }
    if (!iban.trim()) {
      showToast('Validation Error', 'IBAN number cannot be empty.', 'error');
      return;
    }

    // Update Redux Store
    dispatch(
      setUserProfile({
        ...userProfile,
        bankName: bank,
        bankAccount: accountNumber.trim(),
        bankHolderName: accountHolderName.trim(),
        bankIban: iban.trim(),
        bankExpiry: '07/26', // Set active expiration or default
      }),
    );

    showToast('Success', 'Bank account added successfully.', 'success');
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="ADD NEW ACCOUNT"
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
            {/* Select Bank Dropdown */}
            <View style={styles.dropdownContainer}>
              <AppText style={styles.dropdownLabel}>Select Bank</AppText>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                containerStyle={styles.dropdownMenuContainer}
                data={BANKS_DATA}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Bank"
                value={bank}
                onChange={item => setBank(item.value)}
              />
            </View>

            <TextField
              label="Account Holder Name"
              value={accountHolderName}
              onChangeText={setAccountHolderName}
              placeholder="Account Holder Name"
            />
            <TextField
              label="Account Number"
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Account Number"
              keyboardType="number-pad"
            />
            <TextField
              label="IBAN Number"
              value={iban}
              onChangeText={setIban}
              placeholder="IBAN Number"
            />
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Add Account"
            onPress={handleAddAccount}
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
    marginTop: -20, // Moves options up closer to the input field
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

export default AddBankAccount;
