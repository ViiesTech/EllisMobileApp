import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { addBooking } from '../../store/bookingSlice';
import { selectUser } from '../../store/authSlice';
import { showToast } from '../../components/Toast';
import { useCheckoutTailorServiceMutation } from '../../Services/UserServices';

const parseMeasurement = (value, fallback) => {
  if (value === null || value === undefined) return fallback;
  const numStr = value.toString().replace(/[^0-9.]/g, '');
  const num = Number(numStr);
  return isNaN(num) || numStr === '' ? fallback : num;
};

const BookingCheckout = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser) || {};
  const { bookingData, tailor, service } = route.params || {};

  const [checkoutTailorService, { isLoading }] =
    useCheckoutTailorServiceMutation();

  // Step state: 'checkout' | 'addAddress' | 'addCard'
  const [step, setStep] = useState('checkout');

  // console.log('bookingData:-', bookingData);
  // console.log('tailor:-', tailor);
  // console.log('service:-', service);

  // Address State (prefilled defaults matching Mockup 1)
  const [addressInfo, setAddressInfo] = useState({
    firstName: userProfile?.name || 'User',
    lastName: userProfile?.last_name || '#1',
    address: bookingData?.address || '742 Evergreen Terrace, Springfield',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
    phone: bookingData?.phone || '+1 234 567 8900',
  });

  // Saved Card State (Starts prefilled for seamless testing/mock flow)
  const [savedCard, setSavedCard] = useState({
    holder:
      [userProfile?.name, userProfile?.last_name].filter(Boolean).join(' ') ||
      bookingData?.customerName ||
      'User #1',
    number: '1234567812345678',
    expMonth: '12',
    expYear: '30',
    expiry: '12/30',
    cvv: '123',
  });

  const formatCardNumber = num => {
    if (!num) return '';
    const cleaned = num.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  // Add Address Input States
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Add Card Input States
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newExpMonth, setNewExpMonth] = useState('');
  const [newExpYear, setNewExpYear] = useState('');
  const [newCvv, setNewCvv] = useState('');

  // Shipping Method state ('Pickup' | 'Standard')
  const [shippingMethod, setShippingMethod] = useState('Pickup');

  // Sizing Price Details
  const basePrice = Number(service?.price || bookingData?.price) || 240;
  const shippingCost = shippingMethod === 'Pickup' ? 0 : 15;
  const price = (basePrice + shippingCost).toFixed(2);

  // Form Validations
  const [addressErrors, setAddressErrors] = useState({});
  const [cardErrors, setCardErrors] = useState({});

  const handleAddAddress = () => {
    const errors = {};
    if (!newFirstName.trim()) errors.firstName = 'Required';
    if (!newLastName.trim()) errors.lastName = 'Required';
    if (!newAddress.trim()) errors.address = 'Required';
    if (!newCity.trim()) errors.city = 'Required';
    if (!newState.trim()) errors.state = 'Required';
    if (!newZip.trim()) errors.zip = 'Required';
    if (!newPhone.trim()) errors.phone = 'Required';

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      showToast('Error', 'Please fill all address fields.', 'error');
      return;
    }

    setAddressErrors({});
    setAddressInfo({
      firstName: newFirstName,
      lastName: newLastName,
      address: newAddress,
      city: newCity,
      state: newState,
      zip: newZip,
      phone: newPhone,
    });
    setStep('checkout');
    showToast('Success', 'Shipping address updated.', 'success');
  };

  const handleAddCard = () => {
    const errors = {};
    if (!newCardHolder.trim()) errors.holder = 'Required';
    if (!newCardNumber.trim() || newCardNumber.length < 16)
      errors.number = 'Invalid card number';
    if (!newExpMonth.trim() || isNaN(newExpMonth)) errors.expMonth = 'Invalid';
    if (!newExpYear.trim() || isNaN(newExpYear)) errors.expYear = 'Invalid';
    if (!newCvv.trim() || newCvv.length < 3) errors.cvv = 'Invalid';

    if (Object.keys(errors).length > 0) {
      setCardErrors(errors);
      showToast('Error', 'Please verify all card fields.', 'error');
      return;
    }

    setCardErrors({});
    const newCard = {
      holder: newCardHolder,
      number: newCardNumber,
      expMonth: newExpMonth,
      expYear: newExpYear,
      expiry: `${newExpMonth}/${newExpYear}`,
      cvv: newCvv,
    };
    setSavedCard(newCard);
    setStep('checkout');
    showToast('Success', 'Card added successfully.', 'success');
  };

  const handlePlaceBooking = async () => {
    if (!addressInfo.address) {
      showToast('Error', 'Please add a shipping address.', 'error');
      return;
    }
    if (!savedCard) {
      showToast('Error', 'Please select or add a payment method.', 'error');
      return;
    }

    const suitTypeRaw = String(
      bookingData?.measurements?.suitType || bookingData?.suitType || '2 Piece',
    );
    const suit_type = suitTypeRaw.split(' (')[0] || '2 Piece';

    const fitTypeRaw = String(
      bookingData?.measurements?.fitType || bookingData?.fitType || 'Slim',
    );
    const fit_type = fitTypeRaw.replace(' Fit', '');

    const payload = {
      tailor_id: Number(tailor?.id),
      service_id: Number(service?.id),
      suit_type,
      fit_type,
      coat_length: parseMeasurement(bookingData?.measurements?.coatLength, 30),
      shoulder_width: parseMeasurement(
        bookingData?.measurements?.shoulderWidth,
        18,
      ),
      chest_round: parseMeasurement(bookingData?.measurements?.chestRound, 40),
      coat_waist: parseMeasurement(bookingData?.measurements?.coatWaist, 36),
      coat_hip: parseMeasurement(bookingData?.measurements?.coatHip, 40),
      sleeves_length: parseMeasurement(
        bookingData?.measurements?.sleeveLength,
        25,
      ),
      pant_waist: parseMeasurement(bookingData?.measurements?.pantWaist, 34),
      pant_hip: parseMeasurement(
        bookingData?.measurements?.pantHip || bookingData?.measurements?.panHip,
        40,
      ),
      pant_length: parseMeasurement(
        bookingData?.measurements?.trouserLength,
        42,
      ),
      rise: bookingData?.measurements?.rise || bookingData?.rise || 'Regular',
      leg: bookingData?.measurements?.leg || bookingData?.leg || 'Straight',
      city: addressInfo.city || 'Springfield',
      postal_code: addressInfo.zip || '62704',
      country: 'United States',
      shipping_method: shippingMethod === 'Pickup' ? 'Pickup' : 'Standard',
      shipping_cost: shippingCost,
      billing_same_as_shipping: true,
      billing_first_name: addressInfo.firstName || 'User',
      billing_last_name: addressInfo.lastName || 'Jhon',
      billing_address: addressInfo.address || 'ABC test address',
      billing_city: addressInfo.city || 'New York',
      billing_postal_code: addressInfo.zip || '0900',
      billing_country: 'United States',
      notes: 'Please deliver carefully.',
    };

    console.log('payload', payload);

    try {
      const response = await checkoutTailorService(payload).unwrap();
      if (response?.success) {
        // Redux store booking sync update
        dispatch(
          addBooking({
            ...bookingData,
            shippingAddress: `${addressInfo.firstName} ${addressInfo.lastName}\n${addressInfo.address}, ${addressInfo.city} ${addressInfo.state} ${addressInfo.zip}\nPhone: ${addressInfo.phone}`,
            paymentMethod: `MasterCard ending in ${savedCard.number.slice(-4)}`,
          }),
        );
        showToast(
          'Success',
          response.message || 'Booking placed successfully!',
          'success',
        );
        navigation.navigate('Main', { screen: 'Bookings' });
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to place booking.',
          'error',
        );
      }
    } catch (error) {
      showToast(
        'Error',
        error?.data?.message || 'Server error occurred.',
        'error',
      );
    }
  };

  // Step 1: Main Checkout View
  if (step === 'checkout') {
    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <AppText style={styles.headerTitle}>CHECKOUT</AppText>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.diamond} />
              <View style={styles.dividerLine} />
            </View>
          </View>
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* SHIPPING ADDRESS */}
          <AppText style={styles.sectionHeader}>SHIPPING ADRESS</AppText>
          {addressInfo.address ? (
            <TouchableOpacity
              style={styles.addressCard}
              activeOpacity={0.8}
              onPress={() => {
                setNewFirstName(addressInfo.firstName);
                setNewLastName(addressInfo.lastName);
                setNewAddress(addressInfo.address);
                setNewCity(addressInfo.city);
                setNewState(addressInfo.state);
                setNewZip(addressInfo.zip);
                setNewPhone(addressInfo.phone);
                setStep('addAddress');
              }}
            >
              <View style={styles.addressDetails}>
                <AppText style={styles.clientName}>
                  {addressInfo.firstName} {addressInfo.lastName}
                </AppText>
                <AppText style={styles.addressText}>
                  {addressInfo.address}
                </AppText>
                <AppText style={styles.addressText}>
                  {addressInfo.city} {addressInfo.state} {addressInfo.zip}
                </AppText>
                <AppText style={styles.addressPhone}>
                  {addressInfo.phone}
                </AppText>
              </View>
              <Feather name="chevron-right" size={20} color="#8A8A8F" />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={styles.addAddressBtn}
            activeOpacity={0.8}
            onPress={() => {
              setNewFirstName('');
              setNewLastName('');
              setNewAddress('');
              setNewCity('');
              setNewState('');
              setNewZip('');
              setNewPhone('');
              setStep('addAddress');
            }}
          >
            <AppText style={styles.addAddressBtnText}>
              Add shipping adress
            </AppText>
            <Feather name="plus" size={18} color="#000000" />
          </TouchableOpacity>

          {/* SHIPPING METHOD */}
          <AppText style={styles.sectionHeader}>SHIPPING METHOD</AppText>
          <TouchableOpacity
            style={styles.dropdownCard}
            activeOpacity={0.8}
            onPress={() =>
              setShippingMethod(prev =>
                prev === 'Pickup' ? 'Standard' : 'Pickup',
              )
            }
          >
            <AppText style={styles.dropdownTextLeft}>
              {shippingMethod === 'Pickup'
                ? 'Pickup at store'
                : 'Standard Delivery'}
            </AppText>
            <View style={styles.dropdownRight}>
              <AppText style={styles.dropdownTextRight}>
                {shippingMethod === 'Pickup' ? 'FREE' : '$15.00'}
              </AppText>
              <Feather
                name="chevron-down"
                size={18}
                color="#8A8A8F"
                style={styles.dropdownIcon}
              />
            </View>
          </TouchableOpacity>

          {/* PAYMENT METHOD */}
          <AppText style={styles.sectionHeader}>PAYMENT METHOD</AppText>
          <TouchableOpacity
            style={styles.dropdownCard}
            activeOpacity={0.8}
            onPress={() => {
              if (savedCard) {
                setNewCardHolder(savedCard.holder);
                setNewCardNumber(savedCard.number);
                setNewExpMonth(savedCard.expMonth);
                setNewExpYear(savedCard.expYear);
                setNewCvv(savedCard.cvv);
              } else {
                setNewCardHolder('');
                setNewCardNumber('');
                setNewExpMonth('');
                setNewExpYear('');
                setNewCvv('');
              }
              setStep('addCard');
            }}
          >
            <AppText style={styles.dropdownTextLeft}>
              {savedCard
                ? `MasterCard ending in ${savedCard.number.slice(-4)}`
                : 'select payment method'}
            </AppText>
            <Feather name="chevron-down" size={18} color="#8A8A8F" />
          </TouchableOpacity>
        </ScrollView>

        {/* Absolute bottom Place Booking bar */}
        <View style={styles.bottomBar}>
          <View style={styles.totalRow}>
            <AppText style={styles.totalLabel}>EST. TOTAL</AppText>
            <AppText style={styles.totalValue}>${price}</AppText>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, isLoading && { opacity: 0.7 }]}
            activeOpacity={0.9}
            onPress={handlePlaceBooking}
            disabled={isLoading}
          >
            <AppText style={styles.bookBtnText}>
              {isLoading ? 'Placing Booking...' : 'Place Booking'}
            </AppText>
            {!isLoading && (
              <Feather
                name="arrow-right"
                size={20}
                color="#000000"
                style={styles.bookBtnArrow}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Step 2: Add Shipping Address
  if (step === 'addAddress') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setStep('checkout')}
          >
            <Feather name="arrow-left" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <AppText style={styles.headerTitle}>ADD SHIPPING ADDRESS</AppText>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.diamond} />
              <View style={styles.dividerLine} />
            </View>
          </View>
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <TextInput
                style={[
                  styles.inputUnderline,
                  addressErrors.firstName && styles.inputErrorBorder,
                ]}
                placeholder="First name"
                placeholderTextColor="#A3A3A3"
                value={newFirstName}
                onChangeText={setNewFirstName}
              />
              {addressErrors.firstName && (
                <AppText style={styles.formErrorText}>
                  {addressErrors.firstName}
                </AppText>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={[
                  styles.inputUnderline,
                  addressErrors.lastName && styles.inputErrorBorder,
                ]}
                placeholder="Last name"
                placeholderTextColor="#A3A3A3"
                value={newLastName}
                onChangeText={setNewLastName}
              />
              {addressErrors.lastName && (
                <AppText style={styles.formErrorText}>
                  {addressErrors.lastName}
                </AppText>
              )}
            </View>
          </View>

          <TextInput
            style={[
              styles.inputUnderline,
              { marginTop: 18 },
              addressErrors.address && styles.inputErrorBorder,
            ]}
            placeholder="Adress"
            placeholderTextColor="#A3A3A3"
            value={newAddress}
            onChangeText={setNewAddress}
          />
          {addressErrors.address && (
            <AppText style={styles.formErrorText}>
              {addressErrors.address}
            </AppText>
          )}

          <TextInput
            style={[
              styles.inputUnderline,
              { marginTop: 18 },
              addressErrors.city && styles.inputErrorBorder,
            ]}
            placeholder="City"
            placeholderTextColor="#A3A3A3"
            value={newCity}
            onChangeText={setNewCity}
          />
          {addressErrors.city && (
            <AppText style={styles.formErrorText}>{addressErrors.city}</AppText>
          )}

          <View style={[styles.formRow, { marginTop: 18 }]}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <TextInput
                style={[
                  styles.inputUnderline,
                  addressErrors.state && styles.inputErrorBorder,
                ]}
                placeholder="State"
                placeholderTextColor="#A3A3A3"
                value={newState}
                onChangeText={setNewState}
              />
              {addressErrors.state && (
                <AppText style={styles.formErrorText}>
                  {addressErrors.state}
                </AppText>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={[
                  styles.inputUnderline,
                  addressErrors.zip && styles.inputErrorBorder,
                ]}
                placeholder="ZIP code"
                placeholderTextColor="#A3A3A3"
                value={newZip}
                onChangeText={setNewZip}
                keyboardType="numeric"
              />
              {addressErrors.zip && (
                <AppText style={styles.formErrorText}>
                  {addressErrors.zip}
                </AppText>
              )}
            </View>
          </View>

          <TextInput
            style={[
              styles.inputUnderline,
              { marginTop: 18 },
              addressErrors.phone && styles.inputErrorBorder,
            ]}
            placeholder="Phone number"
            placeholderTextColor="#A3A3A3"
            value={newPhone}
            onChangeText={setNewPhone}
            keyboardType="phone-pad"
          />
          {addressErrors.phone && (
            <AppText style={styles.formErrorText}>
              {addressErrors.phone}
            </AppText>
          )}

          <TouchableOpacity
            style={[styles.goldBtn, { marginTop: 40 }]}
            onPress={handleAddAddress}
            activeOpacity={0.9}
          >
            <AppText style={styles.goldBtnText}>Add Now</AppText>
            <Feather
              name="arrow-right"
              size={20}
              color="#000000"
              style={styles.goldBtnArrow}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // Step 3: Add Card / Payment Method
  if (step === 'addCard') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setStep('checkout')}
          >
            <Feather name="arrow-left" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <AppText style={styles.headerTitle}>PAYMENT METHOD</AppText>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.diamond} />
              <View style={styles.dividerLine} />
            </View>
          </View>
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Card Preview (Single Card matching mockup) */}
          <View style={styles.cardContainer}>
            <View style={[styles.cardItem, { backgroundColor: '#1A1A1A' }]}>
              {/* MasterCard logo overlapping circles */}
              <View style={styles.cardHeaderRow}>
                <View style={styles.mcLogoContainer}>
                  <View style={styles.mcCircleRed} />
                  <View style={styles.mcCircleOrange} />
                </View>
              </View>
              <View style={styles.cardBodyRow}>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.cardHolderLabel}>CARD HOLDER</AppText>
                  <AppText style={styles.cardHolderName}>
                    {newCardHolder || ''}
                  </AppText>
                </View>
                <View style={{ marginRight: 6 }}>
                  <AppText style={styles.cardExpiryLabel}>EXPIRES</AppText>
                  <AppText style={styles.cardExpiryDate}>
                    {newExpMonth || newExpYear
                      ? `${newExpMonth}/${newExpYear}`
                      : ''}
                  </AppText>
                </View>
              </View>
              <AppText style={styles.cardItemNumber}>
                {formatCardNumber(newCardNumber) || ''}
              </AppText>
            </View>
          </View>

          {/* Single Dots Indicator */}
          <View style={styles.dotsRow}>
            <View
              style={[
                styles.dotDiamond,
                {
                  backgroundColor: '#DBA83A',
                  borderColor: '#DBA83A',
                },
              ]}
            />
          </View>

          {/* Form */}
          <TextInput
            style={[
              styles.inputUnderline,
              { marginTop: 12 },
              cardErrors.holder && styles.inputErrorBorder,
            ]}
            placeholder="Name On Card"
            placeholderTextColor="#A3A3A3"
            value={newCardHolder}
            onChangeText={setNewCardHolder}
          />
          {cardErrors.holder && (
            <AppText style={styles.formErrorText}>{cardErrors.holder}</AppText>
          )}

          <TextInput
            style={[
              styles.inputUnderline,
              { marginTop: 18 },
              cardErrors.number && styles.inputErrorBorder,
            ]}
            placeholder="Card Number"
            placeholderTextColor="#A3A3A3"
            value={newCardNumber}
            onChangeText={setNewCardNumber}
            keyboardType="numeric"
            maxLength={16}
          />
          {cardErrors.number && (
            <AppText style={styles.formErrorText}>{cardErrors.number}</AppText>
          )}

          <View style={[styles.formRow, { marginTop: 18 }]}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <TextInput
                style={[
                  styles.inputUnderline,
                  cardErrors.expMonth && styles.inputErrorBorder,
                ]}
                placeholder="Exp Month"
                placeholderTextColor="#A3A3A3"
                value={newExpMonth}
                onChangeText={setNewExpMonth}
                keyboardType="numeric"
                maxLength={2}
              />
              {cardErrors.expMonth && (
                <AppText style={styles.formErrorText}>
                  {cardErrors.expMonth}
                </AppText>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                style={[
                  styles.inputUnderline,
                  cardErrors.expYear && styles.inputErrorBorder,
                ]}
                placeholder="Exp Date"
                placeholderTextColor="#A3A3A3"
                value={newExpYear}
                onChangeText={setNewExpYear}
                keyboardType="numeric"
                maxLength={2}
              />
              {cardErrors.expYear && (
                <AppText style={styles.formErrorText}>
                  {cardErrors.expYear}
                </AppText>
              )}
            </View>
          </View>

          <TextInput
            style={[
              styles.inputUnderline,
              { marginTop: 18 },
              cardErrors.cvv && styles.inputErrorBorder,
            ]}
            placeholder="CVV"
            placeholderTextColor="#A3A3A3"
            value={newCvv}
            onChangeText={setNewCvv}
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
          />
          {cardErrors.cvv && (
            <AppText style={styles.formErrorText}>{cardErrors.cvv}</AppText>
          )}

          <TouchableOpacity
            style={[styles.goldBtn, { marginTop: 40 }]}
            onPress={handleAddCard}
            activeOpacity={0.9}
          >
            <AppText style={styles.goldBtnText}>Add Card</AppText>
            <Feather
              name="arrow-right"
              size={20}
              color="#000000"
              style={styles.goldBtnArrow}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
    marginTop: 30,
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
    textTransform: 'uppercase',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingRight: 6,
  },
  addressDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: Fonts.bold,
  },
  addressText: {
    fontSize: 13,
    color: '#5D5D5D',
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
  addressPhone: {
    fontSize: 13,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
  addAddressBtn: {
    backgroundColor: '#F8F9FD',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8EDF9',
    marginTop: 12,
  },
  addAddressBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  dropdownCard: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#F8F9FD',
    borderWidth: 1,
    borderColor: '#E8EDF9',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dropdownTextLeft: {
    fontSize: 14,
    color: '#000000',
    fontFamily: Fonts.regular,
  },
  dropdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTextRight: {
    fontSize: 13,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
    marginRight: 6,
  },
  dropdownIcon: {
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 13,
    letterSpacing: 2,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
  },
  totalValue: {
    fontSize: 17,
    fontFamily: Fonts.bold,
    color: '#000000',
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
  formRow: {
    flexDirection: 'row',
  },
  inputUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
    height: 44,
    fontSize: 14,
    color: '#000000',
    fontFamily: Fonts.regular,
    paddingVertical: 4,
  },
  inputErrorBorder: {
    borderBottomColor: '#FF3B30',
  },
  formErrorText: {
    fontSize: 11,
    color: '#FF3B30',
    marginTop: 2,
  },
  goldBtn: {
    backgroundColor: '#DBA83A',
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  goldBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  goldBtnArrow: {
    position: 'absolute',
    right: 18,
  },
  cardsSliderContainer: {
    paddingRight: 20,
    marginBottom: 8,
  },
  cardContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  cardItem: {
    width: 280,
    height: 165,
    borderRadius: 12,
    padding: 20,
    marginRight: 16,
    position: 'relative',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  mcLogoContainer: {
    flexDirection: 'row',
    position: 'relative',
    width: 32,
    height: 20,
  },
  mcCircleRed: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EB001B',
    position: 'absolute',
    left: 0,
  },
  mcCircleOrange: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F79E1B',
    position: 'absolute',
    right: 0,
    opacity: 0.85,
  },
  cardBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cardHolderLabel: {
    fontSize: 9,
    color: '#A3A3A3',
    textTransform: 'uppercase',
  },
  cardHolderName: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  cardExpiryLabel: {
    fontSize: 9,
    color: '#A3A3A3',
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  cardExpiryDate: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
    fontFamily: Fonts.regular,
    marginTop: 2,
    textAlign: 'right',
  },
  cardItemNumber: {
    fontSize: 15,
    color: '#FFFFFF',
    letterSpacing: 2,
    marginTop: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  dotDiamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 5,
  },
});

export default BookingCheckout;
