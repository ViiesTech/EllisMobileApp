import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../../config/Colors';
import CustomButton from '../../components/CustomButton';
import AppText from '../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { selectRole } from '../../store/authSlice';

const EmailVerification = ({ navigation }) => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const [code, setCode] = useState(['4', '2', '5', '']);
  const [activeIdx, setActiveIdx] = useState(3);
  const [seconds, setSeconds] = useState(159); // 02:39

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = totalSec => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const mStr = mins < 10 ? `0${mins}` : `${mins}`;
    const sStr = secs < 10 ? `0${secs}` : `${secs}`;
    return `${mStr}:${sStr}`;
  };

  const handleVerify = () => {
    if (role === 'VENDOR') {
      navigation.navigate('VendorCompleteProfile');
    } else if (role === 'TAILOR') {
      navigation.navigate('TailorCompleteProfile');
    } else {
      navigation.navigate('Login');
    }
  };

  const handleDigitChange = (val, index) => {
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    if (val && index < 3) {
      setActiveIdx(index + 1);
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title & Subtitle */}
        <View style={styles.header}>
          <AppText style={styles.title}>Email Verification</AppText>
          <AppText style={styles.sub}>
            Please type OTP code that we give you
          </AppText>
        </View>

        {/* 4 Box OTP Field */}
        <View style={styles.otpOuterContainer}>
          <View style={styles.otpBoxRow}>
            {code.map((digit, i) => {
              const isActive = i === activeIdx;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.digitCard, isActive && styles.digitCardActive]}
                  onPress={() => setActiveIdx(i)}
                  activeOpacity={0.8}
                >
                  <AppText style={styles.digitText}>
                    {digit || (isActive ? '|' : '')}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Subtimer */}
          <View style={styles.timerRow}>
            <AppText style={styles.timerLabel}>
              Resend on{' '}
              <AppText style={styles.timerVal}>{formatTimer(seconds)}</AppText>
            </AppText>
          </View>
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomArea}>
          <CustomButton title="Verify Email" onPress={handleVerify} />
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
    marginBottom: 40,
  },
  title: {
    fontSize: 44,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  sub: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'center',
  },
  otpOuterContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  otpBoxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  digitCard: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitCardActive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  digitText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  timerRow: {
    alignSelf: 'flex-end',
    paddingRight: 4,
  },
  timerLabel: {
    fontSize: 13,
    color: '#4A5568',
  },
  timerVal: {
    fontWeight: '700',
    color: '#000000',
  },
  bottomArea: {
    marginTop: 40,
    width: '100%',
  },
});

export default EmailVerification;
