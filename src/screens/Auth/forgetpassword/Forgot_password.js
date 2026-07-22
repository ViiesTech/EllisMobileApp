import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Colors from '../../../config/Colors';
import TextField from '../../../components/TextField';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { showToast } from '../../../components/Toast';

const Forgot_password = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (email?.trim() === '') {
      showToast('Validation Error', 'Please enter your email', 'info');
      return;
    }
    navigation.navigate('VerifyOTP', {
      email: email,
      forgotPassword: true,
    });
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Subtitle */}
        <View style={styles.header}>
          <AppText style={styles.title}>Forgot Password</AppText>
          <AppText style={styles.sub}>
            No worries! Enter your email address below and we will send you a
            code to reset password.
          </AppText>
        </View>

        {/* Input */}
        <View style={styles.form}>
          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter Your Email"
            keyboardType="email-address"
            autoCapitalize="none"
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
    // justifyContent: 'space-between',
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontFamily: 'serif',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  sub: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 30,
    width: '100%',
  },
});

export default Forgot_password;
