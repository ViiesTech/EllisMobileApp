import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Fonts from '../../../config/Fonts';
import TextField from '../../../components/TextField';
import AppText from '../../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { showToast } from '../../../components/Toast';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../store/authSlice';
import VendorHeader from '../../../components/VendorHeader';

const Measurement = ({ route, navigation }) => {
  const userProfile = useSelector(selectUser) || {};
  const tailor = route.params?.tailor;
  const service = route.params?.service;

  const requiredMeasurements = useMemo(() => service?.required_measurements || [], [service]);
  const [measurementValues, setMeasurementValues] = useState({});
  const [errors, setErrors] = useState({});

  // Springfield default fallback constants
  const [date] = useState('2026-07-28');
  const [time] = useState('10:30 AM');
  const [address] = useState('742 Evergreen Terrace, Springfield');

  // Initialize measurement inputs
  useEffect(() => {
    if (requiredMeasurements.length > 0) {
      const initialValues = {};
      requiredMeasurements.forEach(item => {
        initialValues[item.key] = '';
      });
      setMeasurementValues(initialValues);
    }
  }, [service, requiredMeasurements]);

  const handleConfirm = () => {
    const newErrors = {};

    requiredMeasurements.forEach(item => {
      const val = measurementValues[item.key] || '';
      const isRequired = item.required === '1' || item.required === 1 || item.required === true;
      if (isRequired && !val.trim()) {
        newErrors[item.key] = `${item.title} is required`;
      } else if (val.trim() && (isNaN(val) || Number(val) <= 0)) {
        newErrors[item.key] = 'Must be a valid number';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(
        'Validation Error',
        'Please fill all required measurements with valid numbers.',
        'error',
      );
      return;
    }

    setErrors({});

    const measurementsArray = requiredMeasurements.map(item => ({
      key: item.key,
      title: item.title,
      description: item.description,
      unit: item.unit || 'inches',
      required: item.required === '1' || item.required === 1 || item.required === true,
      value: Number(measurementValues[item.key]) || 0,
    }));

    const serializedDetails = measurementsArray
      .map(item => `${item.title}: ${item.value} ${item.unit}`)
      .join('\n');

    const bookingData = {
      serviceName: service ? service.name : 'Custom Fitting',
      tailorName: tailor ? tailor.name : 'Master Tailor',
      price: service ? service.price : 150,
      date,
      time,
      customerName:
        [userProfile.name, userProfile.last_name].filter(Boolean).join(' ') ||
        'Alan Charles',
      phone: userProfile.phone || '+1 234 567 8900',
      address,
      measurementDetails: serializedDetails,
      measurements: measurementsArray,
    };

    navigation.navigate('BookingConfirm', {
      bookingData,
      tailor,
      service,
    });
  };

  const inputContainerStyle = {
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    backgroundColor: 'transparent',
    height: 40,
    marginBottom: 10,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <View style={styles.container}>
        <VendorHeader
          navigation={navigation}
          title="MEASUREMENTS"
          goBack={true}
          homeHeader={false}
          notification={false}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {requiredMeasurements.length > 0 ? (
            <>
              <AppText style={styles.sectionHeader}>REQUIRED MEASUREMENTS</AppText>
              {requiredMeasurements.map(item => {
                const isRequired = item.required === '1' || item.required === 1 || item.required === true;
                return (
                  <View key={item.key} style={styles.inputWrapper}>
                    <AppText style={styles.subsectionHeader}>
                      {item.title.toUpperCase()} {isRequired ? '*' : ''}
                    </AppText>
                    {item.description && (
                      <AppText style={styles.descriptionText}>
                        {item.description}
                      </AppText>
                    )}
                    <TextField
                      placeholder={`Enter ${item.title} (${item.unit || 'inches'})`}
                      value={measurementValues[item.key] || ''}
                      onChangeText={text => {
                        setMeasurementValues(prev => ({ ...prev, [item.key]: text }));
                        if (errors[item.key]) {
                          setErrors(prev => ({ ...prev, [item.key]: null }));
                        }
                      }}
                      keyboardType="numeric"
                      containerStyle={inputContainerStyle}
                      error={errors[item.key]}
                    />
                  </View>
                );
              })}
            </>
          ) : (
            <View style={styles.centerContainer}>
              <AppText style={styles.emptyText}>No measurements required for this style.</AppText>
            </View>
          )}
        </ScrollView>

        {/* Gold Bottom Continue Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.bookBtn}
            activeOpacity={0.9}
            onPress={handleConfirm}
          >
            <AppText style={styles.bookBtnText}>Continue</AppText>
            <Feather
              name="arrow-right"
              size={20}
              color="#000000"
              style={styles.bookBtnArrow}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    letterSpacing: 4,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '400',
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: 44,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    marginTop: 6,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: '#DBA83A',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 110,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 2,
    fontFamily: Fonts.regular,
    marginTop: 22,
    marginBottom: 12,
  },
  subsectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A8A8F',
    letterSpacing: 1,
    fontFamily: Fonts.regular,
    marginTop: 10,
    marginBottom: 6,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingLeft: 4,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioOuterSelected: {
    borderColor: '#000000',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000000',
  },
  radioLabel: {
    fontSize: 14,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
  },
  radioLabelSelected: {
    color: '#000000',
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  bookBtn: {
    backgroundColor: '#DBA83A',
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  bookBtnArrow: {
    position: 'absolute',
    right: 18,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 2,
    marginLeft: 4,
    marginBottom: 8,
    fontFamily: Fonts.regular,
  },
  descriptionText: {
    fontSize: 12,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
    marginBottom: 8,
    lineHeight: 16,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
  },
});

export default Measurement;
