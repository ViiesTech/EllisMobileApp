import React, { useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../../store/authSlice';
import { addBooking } from '../../../store/bookingSlice';
import VendorHeader from '../../../components/VendorHeader';

const Measurement = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};
  const tailor = route.params?.tailor;
  const service = route.params?.service;

  // Basic Sizing States
  const [suitType, setSuitType] = useState('');
  const [fitType, setFitType] = useState('');

  // Coat Measurements States
  const [coatLength, setCoatLength] = useState('');
  const [shoulderWidth, setShoulderWidth] = useState('');
  const [chestRound, setChestRound] = useState('');
  const [coatWaist, setCoatWaist] = useState('');
  const [coatHip, setCoatHip] = useState('');
  const [sleeveLength, setSleeveLength] = useState('');
  const [neckSize, setNeckSize] = useState('');

  // Pant Measurements States
  const [pantWaist, setPantWaist] = useState('');
  const [pantHip, setPantHip] = useState('');
  const [trouserLength, setTrouserLength] = useState('');
  const [rise, setRise] = useState('');
  const [leg, setLeg] = useState('');

  // Helper States
  const [errors, setErrors] = useState({});

  // Springfield default fallback constants
  const [date] = useState('2026-07-28');
  const [time] = useState('10:30 AM');
  const [address] = useState('742 Evergreen Terrace, Springfield');

  const handleConfirm = () => {
    const newErrors = {};

    // Validate Sizing Selections
    if (!suitType) {
      newErrors.suitType = 'Suit Type selection is required';
    }
    if (!fitType) {
      newErrors.fitType = 'Fit Type selection is required';
    }
    if (!rise) {
      newErrors.rise = 'Rise selection is required';
    }
    if (!leg) {
      newErrors.leg = 'Leg selection is required';
    }

    // Validate Coat Sizing Metrics
    if (!coatLength.trim()) {
      newErrors.coatLength = 'Coat Length is required';
    } else if (isNaN(coatLength) || Number(coatLength) <= 0) {
      newErrors.coatLength = 'Must be a valid number';
    }

    if (!shoulderWidth.trim()) {
      newErrors.shoulderWidth = 'Shoulder Width is required';
    } else if (isNaN(shoulderWidth) || Number(shoulderWidth) <= 0) {
      newErrors.shoulderWidth = 'Must be a valid number';
    }

    if (!chestRound.trim()) {
      newErrors.chestRound = 'Chest Round is required';
    } else if (isNaN(chestRound) || Number(chestRound) <= 0) {
      newErrors.chestRound = 'Must be a valid number';
    }

    if (!coatWaist.trim()) {
      newErrors.coatWaist = 'Coat Waist is required';
    } else if (isNaN(coatWaist) || Number(coatWaist) <= 0) {
      newErrors.coatWaist = 'Must be a valid number';
    }

    if (!coatHip.trim()) {
      newErrors.coatHip = 'Coat Hip is required';
    } else if (isNaN(coatHip) || Number(coatHip) <= 0) {
      newErrors.coatHip = 'Must be a valid number';
    }

    if (!sleeveLength.trim()) {
      newErrors.sleeveLength = 'Sleeve Length is required';
    } else if (isNaN(sleeveLength) || Number(sleeveLength) <= 0) {
      newErrors.sleeveLength = 'Must be a valid number';
    }

    if (!neckSize.trim()) {
      newErrors.neckSize = 'Neck Size is required';
    } else if (isNaN(neckSize) || Number(neckSize) <= 0) {
      newErrors.neckSize = 'Must be a valid number';
    }

    // Validate Pant Sizing Metrics
    if (!pantWaist.trim()) {
      newErrors.pantWaist = 'Pant Waist is required';
    } else if (isNaN(pantWaist) || Number(pantWaist) <= 0) {
      newErrors.pantWaist = 'Must be a valid number';
    }

    if (!pantHip.trim()) {
      newErrors.pantHip = 'Pant Hip is required';
    } else if (isNaN(pantHip) || Number(pantHip) <= 0) {
      newErrors.pantHip = 'Must be a valid number';
    }

    if (!trouserLength.trim()) {
      newErrors.trouserLength = 'Trouser Length is required';
    } else if (isNaN(trouserLength) || Number(trouserLength) <= 0) {
      newErrors.trouserLength = 'Must be a valid number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(
        'Validation Error',
        'Please fill all measurements with valid numbers.',
        'error',
      );
      return;
    }

    setErrors({});

    const serializedDetails =
      `Suit Type: ${suitType}\nFit Type: ${fitType}\n` +
      `Coat Measurements: Length: ${coatLength} in, Shoulder: ${shoulderWidth} in, Chest: ${chestRound} in, Waist: ${coatWaist} in, Hip: ${coatHip} in, Sleeve: ${sleeveLength} in, Neck: ${neckSize} in\n` +
      `Pant Measurements: Waist: ${pantWaist} in, Hip: ${pantHip} in, Length: ${trouserLength} in, Rise: ${rise}, Leg: ${leg}`;

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
      suitType,
      fitType,
      measurements: {
        suitType,
        fitType,
        coatLength: `${coatLength} in`,
        shoulderWidth: `${shoulderWidth} in`,
        chestRound: `${chestRound} in`,
        coatWaist: `${coatWaist} in`,
        coatHip: `${coatHip} in`,
        sleeveLength: `${sleeveLength} in`,
        neckSize: `${neckSize} in`,
        pantWaist: `${pantWaist} in`,
        pantHip: `${pantHip} in`,
        panHip: `${pantHip} in`,
        trouserLength: `${trouserLength} in`,
        rise,
        leg,
      },
    };

    navigation.navigate('BookingConfirm', {
      bookingData,
      tailor,
      service,
    });
  };

  const renderRadioButton = (label, selected, onPress) => (
    <TouchableOpacity
      style={styles.radioRow}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <AppText
        style={[styles.radioLabel, selected && styles.radioLabelSelected]}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );

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
          {/* BASIC DETAILS */}
          <AppText style={styles.sectionHeader}>BASIC DETAILS</AppText>

          <AppText style={styles.subsectionHeader}>SUIT TYPE</AppText>
          {renderRadioButton(
            '2 Piece (Coat + Pant)',
            suitType === '2 Piece (Coat + Pant)',
            () => {
              setSuitType('2 Piece (Coat + Pant)');
              if (errors.suitType)
                setErrors(prev => ({ ...prev, suitType: null }));
            },
          )}
          {renderRadioButton(
            '3 Piece (Coat + Waistcoat + Pant)',
            suitType === '3 Piece (Coat + Waistcoat + Pant)',
            () => {
              setSuitType('3 Piece (Coat + Waistcoat + Pant)');
              if (errors.suitType)
                setErrors(prev => ({ ...prev, suitType: null }));
            },
          )}
          {errors.suitType && (
            <AppText style={styles.errorText}>{errors.suitType}</AppText>
          )}

          <AppText style={styles.subsectionHeader}>FIT TYPE</AppText>
          {renderRadioButton('Slim Fit', fitType === 'Slim Fit', () => {
            setFitType('Slim Fit');
            if (errors.fitType) setErrors(prev => ({ ...prev, fitType: null }));
          })}
          {renderRadioButton('Regular Fit', fitType === 'Regular Fit', () => {
            setFitType('Regular Fit');
            if (errors.fitType) setErrors(prev => ({ ...prev, fitType: null }));
          })}
          {renderRadioButton('Loose Fit', fitType === 'Loose Fit', () => {
            setFitType('Loose Fit');
            if (errors.fitType) setErrors(prev => ({ ...prev, fitType: null }));
          })}
          {errors.fitType && (
            <AppText style={styles.errorText}>{errors.fitType}</AppText>
          )}

          {/* COAT MEASUREMENTS */}
          <AppText style={styles.sectionHeader}>COAT MEASUREMENTS</AppText>
          <TextField
            placeholder="Coat Length"
            value={coatLength}
            onChangeText={setCoatLength}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.coatLength}
          />
          <TextField
            placeholder="Shoulder Width"
            value={shoulderWidth}
            onChangeText={setShoulderWidth}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.shoulderWidth}
          />
          <TextField
            placeholder="Chest Round"
            value={chestRound}
            onChangeText={setChestRound}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.chestRound}
          />
          <TextField
            placeholder="Coat Waist"
            value={coatWaist}
            onChangeText={setCoatWaist}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.coatWaist}
          />
          <TextField
            placeholder="Coat Hip"
            value={coatHip}
            onChangeText={setCoatHip}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.coatHip}
          />
          <TextField
            placeholder="Sleeve Length"
            value={sleeveLength}
            onChangeText={setSleeveLength}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.sleeveLength}
          />
          <TextField
            placeholder="Neck Size"
            value={neckSize}
            onChangeText={setNeckSize}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.neckSize}
          />

          {/* PANT MEASUREMENTS */}
          <AppText style={styles.sectionHeader}>PANT MEASUREMENTS</AppText>
          <TextField
            placeholder="Pant Waist"
            value={pantWaist}
            onChangeText={setPantWaist}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.pantWaist}
          />
          <TextField
            placeholder="Pant Hip"
            value={pantHip}
            onChangeText={setPantHip}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.pantHip}
          />
          <TextField
            placeholder="Trouser Length"
            value={trouserLength}
            onChangeText={setTrouserLength}
            keyboardType="numeric"
            containerStyle={inputContainerStyle}
            error={errors.trouserLength}
          />

          <AppText style={styles.subsectionHeader}>RISE</AppText>
          {renderRadioButton('Front Rise', rise === 'Front Rise', () => {
            setRise('Front Rise');
            if (errors.rise) setErrors(prev => ({ ...prev, rise: null }));
          })}
          {renderRadioButton('Back Rise', rise === 'Back Rise', () => {
            setRise('Back Rise');
            if (errors.rise) setErrors(prev => ({ ...prev, rise: null }));
          })}
          {errors.rise && (
            <AppText style={styles.errorText}>{errors.rise}</AppText>
          )}

          <AppText style={styles.subsectionHeader}>LEG</AppText>
          {renderRadioButton('Thigh Round', leg === 'Thigh Round', () => {
            setLeg('Thigh Round');
            if (errors.leg) setErrors(prev => ({ ...prev, leg: null }));
          })}
          {renderRadioButton('Knee Round', leg === 'Knee Round', () => {
            setLeg('Knee Round');
            if (errors.leg) setErrors(prev => ({ ...prev, leg: null }));
          })}
          {renderRadioButton('Bottom Opening', leg === 'Bottom Opening', () => {
            setLeg('Bottom Opening');
            if (errors.leg) setErrors(prev => ({ ...prev, leg: null }));
          })}
          {errors.leg && (
            <AppText style={styles.errorText}>{errors.leg}</AppText>
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
});

export default Measurement;
