import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Colors from '../../../config/Colors';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { showToast, showToastError } from '../../../components/Toast';
import {
  useForgotOTPMutation,
  useForgotPasswordMutation,
} from '../../../Services/Auth';

const CELL_COUNT = 6;

const ForgotOTP = ({ navigation, route }) => {
  const [verifyForgotOtp, { isLoading }] = useForgotOTPMutation();
  const [resendOtp] = useForgotPasswordMutation();
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(59);
  const { email } = route.params || {};

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (value.length !== CELL_COUNT) {
      showToast(
        'Validation Error',
        `Please enter a valid ${CELL_COUNT}-digit OTP`,
        'info',
      );
      return;
    }

    try {
      const payload = {
        email: email,
        otp: value,
      };

      const response = await verifyForgotOtp(payload).unwrap();
      console.log('ForgotOTP response:-', response);

      if (response?.success) {
        showToast(
          'Success',
          response?.message || 'OTP verified successfully',
          'success',
        );
        navigation.navigate('SetPassword', { email });
      } else {
        showToast(
          'Error',
          response?.message || 'OTP verification failed',
          'error',
        );
      }
    } catch (err) {
      console.log('ForgotOTP error:-', err);
      showToastError('Verification Failed', err);
    }
  };

  const handleResend = async () => {
    try {
      const res = await resendOtp({ email }).unwrap();
      if (res?.success) {
        showToast(
          'Success',
          res?.message || 'Verification code sent successfully',
          'success',
        );
        setValue('');
        setTimer(59);
      } else {
        showToast('Error', res?.message || 'OTP Not Sent', 'error');
      }
    } catch (err) {
      console.log('Resend OTP error:-', err);
      showToastError('Error', err);
    }
  };

  const formattedTimer = `00:${timer < 10 ? `0${timer}` : timer}`;

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Subtitle */}
        <View style={styles.header}>
          <AppText style={styles.title}>Verify Code</AppText>
          <AppText style={styles.sub}>
            Code has been sent to{' '}
            <AppText style={styles.emailText}>{email}.</AppText>
            {'\n'}Enter the code to reset your password.
          </AppText>
        </View>

        {/* 6 Digit OTP Code Field */}
        <View style={styles.form}>
          <AppText style={styles.fieldLabel}>Enter Code</AppText>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <View
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                <AppText style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </AppText>
              </View>
            )}
          />

          <View style={styles.resendContainer}>
            <View style={styles.resendRow}>
              <AppText style={styles.didNotText}>Didn't Receive Code? </AppText>
              <TouchableOpacity
                disabled={timer > 0}
                onPress={handleResend}
                activeOpacity={0.7}
              >
                <AppText style={styles.resendLink(timer > 0)}>
                  Resend Code
                </AppText>
              </TouchableOpacity>
            </View>
            {timer > 0 && (
              <AppText style={styles.timerText}>
                Resend code in{' '}
                <AppText style={styles.boldTimer}>{formattedTimer}</AppText>
              </AppText>
            )}
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton
            title="Verify Code"
            onPress={handleVerify}
            loading={isLoading}
          />
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
    marginTop: 70,
    marginBottom: 30,
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
    paddingHorizontal: 10,
  },
  emailText: {
    fontWeight: '700',
    color: '#1F2937',
  },
  form: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 8,
    marginLeft: 4,
  },
  codeFieldRoot: {
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  cell: {
    width: 48,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusCell: {
    borderColor: '#000000',
    borderWidth: 1.5,
  },
  cellText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  didNotText: {
    fontSize: 14,
    color: '#4A5568',
  },
  resendLink: disabled => ({
    fontSize: 14,
    fontWeight: '700',
    color: disabled ? '#9E9E9E' : '#000000',
    fontFamily: 'serif',
    textDecorationLine: 'underline',
  }),
  timerText: {
    fontSize: 14,
    color: '#4A5568',
  },
  boldTimer: {
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: 'serif',
  },
  bottomArea: {
    marginTop: 40,
    width: '100%',
  },
});

export default ForgotOTP;
