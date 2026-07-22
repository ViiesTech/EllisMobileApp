import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Colors from '../../config/Colors';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { selectRole } from '../../store/authSlice';
import { showToast } from '../../components/Toast';

const CELL_COUNT = 4;

const VerifyOTP = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState(59);
  const { email, forgotPassword } = route.params || {};

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

  const handleVerify = () => {
    if (value.length !== 4) {
      showToast('Validation Error', 'Please enter a valid 4-digit OTP', 'info');
      return;
    }
    if (forgotPassword) {
      navigation.navigate('SetPassword', { email });
    } else if (role === 'VENDOR') {
      navigation.navigate('VendorCompleteProfile');
    } else if (role === 'TAILOR') {
      navigation.navigate('TailorCompleteProfile');
    } else {
      navigation.navigate('Login');
    }
  };

  const handleResend = () => {
    setValue('');
    setTimer(59);
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
          <AppText style={styles.title}>Verify Account</AppText>
          <AppText style={styles.sub}>
            Code has been send to{' '}
            <AppText style={styles.emailText}>{email}.</AppText>
            {'\n'}Enter the code to verify your account.
          </AppText>
        </View>

        {/* 4 Digit OTP Code Field */}
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
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <AppText style={styles.resendLink}>Resend Code</AppText>
              </TouchableOpacity>
            </View>
            <AppText style={styles.timerText}>
              Resend code in{' '}
              <AppText style={styles.boldTimer}>{formattedTimer}</AppText>
            </AppText>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton title="Verify Account" onPress={handleVerify} />
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
    width: 64,
    height: 64,
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
  resendLink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: 'serif',
    textDecorationLine: 'underline',
  },
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

export default VerifyOTP;
