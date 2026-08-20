import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Colors from '../../../config/Colors';
import Feather from 'react-native-vector-icons/Feather';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCart,
  removeFromCart,
  updateCartQty,
  clearCart,
} from '../../../store/productSlice';
import { showToast } from '../../../components/Toast';
import { usePlaceOrderMutation } from '../../../Services/UserServices';

const MasterCardLogo = () => (
  <View style={styles.mcLogoContainer}>
    <View style={[styles.mcCircle, styles.mcCircleRed]} />
    <View style={[styles.mcCircle, styles.mcCircleOrange]} />
  </View>
);

const CartCheckout = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  // step options: 'CART' | 'CHECKOUT' | 'ADD_ADDRESS' | 'ADD_PAYMENT'
  const [step, setStep] = useState('CART');
  const [shippingMethod, setShippingMethod] = useState('PICKUP'); // 'PICKUP' | 'DELIVERY'
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const [placeOrderMutation, { isLoading: isPlacingOrder }] =
    usePlaceOrderMutation();

  // Address form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');

  // Active saved address
  const [savedAddress, setSavedAddress] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  });

  // Card form states
  const [cardName, setCardName] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardExpMonth, setCardExpMonth] = useState('');
  const [cardExpYear, setCardExpYear] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // Active saved card
  const [savedCard, setSavedCard] = useState({
    name: '',
    number: '',
    expMonth: '',
    expYear: '',
    cvv: '',
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = shippingMethod === 'PICKUP' ? 0 : 15;
  const grandTotal = subtotal + shipping;

  const handleBackPress = () => {
    if (step === 'CART') {
      navigation.goBack();
    } else if (step === 'CHECKOUT') {
      setStep('CART');
    } else if (step === 'ADD_ADDRESS' || step === 'ADD_PAYMENT') {
      setStep('CHECKOUT');
    }
  };

  const handleSaveAddress = () => {
    if (!firstName.trim()) {
      showToast('Validation Error', 'First name is required.', 'error');
      return;
    }
    if (!lastName.trim()) {
      showToast('Validation Error', 'Last name is required.', 'error');
      return;
    }
    if (!streetAddress.trim()) {
      showToast('Validation Error', 'Street address is required.', 'error');
      return;
    }
    if (!city.trim()) {
      showToast('Validation Error', 'City is required.', 'error');
      return;
    }
    if (!stateCode.trim()) {
      showToast('Validation Error', 'State/Province is required.', 'error');
      return;
    }
    if (!zipCode.trim()) {
      showToast('Validation Error', 'Zip code is required.', 'error');
      return;
    }
    const cleanZip = zipCode.replace(/\s+/g, '');
    if (!/^\d{3,10}$/.test(cleanZip)) {
      showToast(
        'Validation Error',
        'Please enter a valid zip code (digits only).',
        'error',
      );
      return;
    }
    if (!phone.trim()) {
      showToast('Validation Error', 'Phone number is required.', 'error');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 7) {
      showToast(
        'Validation Error',
        'Please enter a valid phone number (at least 7 digits).',
        'error',
      );
      return;
    }

    setSavedAddress({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: streetAddress.trim(),
      city: city.trim(),
      state: stateCode.trim(),
      zip: zipCode.trim(),
      phone: phone.trim(),
    });
    setStep('CHECKOUT');
    showToast('Success', 'Address updated successfully.', 'success');
  };

  const handleSaveCard = () => {
    if (!cardName.trim()) {
      showToast('Validation Error', 'Cardholder name is required.', 'error');
      return;
    }
    if (!cardNo.trim()) {
      showToast('Validation Error', 'Card number is required.', 'error');
      return;
    }
    const cleanCardNo = cardNo.replace(/[\s-]/g, '');
    if (!/^\d{13,19}$/.test(cleanCardNo)) {
      showToast(
        'Validation Error',
        'Please enter a valid card number (13-19 digits).',
        'error',
      );
      return;
    }
    if (!cardExpMonth.trim()) {
      showToast('Validation Error', 'Expiry month is required.', 'error');
      return;
    }
    const monthVal = parseInt(cardExpMonth, 10);
    if (isNaN(monthVal) || monthVal < 1 || monthVal > 12) {
      showToast(
        'Validation Error',
        'Expiry month must be between 01 and 12.',
        'error',
      );
      return;
    }
    if (!cardExpYear.trim()) {
      showToast('Validation Error', 'Expiry year is required.', 'error');
      return;
    }
    const cleanYear = cardExpYear.replace(/\D/g, '');
    if (cleanYear.length !== 2 && cleanYear.length !== 4) {
      showToast(
        'Validation Error',
        'Expiry year must be 2 or 4 digits (e.g. 27 or 2027).',
        'error',
      );
      return;
    }
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    let fullExpYear = parseInt(cleanYear, 10);
    if (cleanYear.length === 2) {
      fullExpYear += 2000;
    }
    if (
      fullExpYear < currentYear ||
      (fullExpYear === currentYear && monthVal < currentMonth)
    ) {
      showToast('Validation Error', 'This card has already expired.', 'error');
      return;
    }
    if (!cardCVV.trim()) {
      showToast('Validation Error', 'CVV is required.', 'error');
      return;
    }
    const cleanCVV = cardCVV.replace(/\D/g, '');
    if (cleanCVV.length < 3 || cleanCVV.length > 4) {
      showToast('Validation Error', 'CVV must be 3 or 4 digits.', 'error');
      return;
    }

    setSavedCard({
      name: cardName.trim(),
      number: cardNo.trim(),
      expMonth: cardExpMonth.trim(),
      expYear: cardExpYear.trim(),
      cvv: cardCVV.trim(),
    });
    setStep('CHECKOUT');
    showToast('Success', 'Card details updated successfully.', 'success');
  };

  const handlePlaceOrder = async () => {
    if (!savedAddress?.address) {
      showToast('Required', 'Please add a shipping address first.', 'error');
      return;
    }
    if (!savedCard?.number) {
      showToast('Required', 'Please select a payment method first.', 'error');
      return;
    }

    try {
      const payload = {
        products: cart.map(item => ({
          product_id: Number(item.productId || item.id),
          quantity: item.qty,
          color: item.selectedColor || 'Default',
        })),
        shipping_address: savedAddress.address,
        city: savedAddress.city,
        state: savedAddress.state,
        zip_code: savedAddress.zip,
        phone_number: savedAddress.phone,
        shipping_method: shippingMethod === 'PICKUP' ? 'Pickup' : 'Standard',
        payment_method: 'Cash on Delivery',
      };

      const response = await placeOrderMutation(payload).unwrap();
      if (response?.success) {
        const orderId = response?.data?.order?.id;
        setPlacedOrderId(orderId);
        dispatch(clearCart());
        setShowSuccess(true);
        showToast(
          'Success',
          response?.message || 'Order placed successfully.',
          'success',
        );
      } else {
        showToast(
          'Error',
          response?.message || 'Failed to place order.',
          'error',
        );
      }
    } catch (err) {
      console.log('Error placing order:', err);
      showToast(
        'Error',
        err?.data?.message || err?.message || 'Network error occurred.',
        'error',
      );
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    dispatch(clearCart());
    navigation.navigate('Main', { screen: 'UserOrders' });
  };

  const formatCardNumber = num => {
    const clean = num.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = clean.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return clean;
    }
  };

  const getHeaderTitle = () => {
    switch (step) {
      case 'ADD_ADDRESS':
        return 'ADD SHIPPING ADDRESS';
      case 'ADD_PAYMENT':
        return 'PAYMENT METHOD';
      default:
        return 'CHECKOUT';
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.mainContainer}>
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={24} color="#000000" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <AppText style={styles.headerTitle}>{getHeaderTitle()}</AppText>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <View style={styles.diamond} />
              <View style={styles.dividerLine} />
            </View>
          </View>
          <View style={styles.headerRightSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* STEP 1: CART VIEW (IMAGE 1) */}
          {step === 'CART' && (
            <View style={styles.section}>
              {cart.length === 0 ? (
                <View style={styles.emptyCard}>
                  <AppText style={styles.emptyIcon}>🛍️</AppText>
                  <AppText style={styles.emptyTitle}>
                    Your Cart is Empty
                  </AppText>
                  <AppText style={styles.emptySub}>
                    Explore fabrics & suits to add items to your cart.
                  </AppText>
                </View>
              ) : (
                <>
                  {cart.map(item => (
                    <View key={item.id} style={styles.cartItem}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImg}
                      />
                      <View style={styles.cartItemTextContainer}>
                        <AppText style={styles.itemName} numberOfLines={1}>
                          {item.name.toUpperCase()}
                        </AppText>
                        <AppText style={styles.itemCategory}>
                          {item.description || 'Lorem Ipsum Dummy'}
                        </AppText>
                        {item.selectedColor && (
                          <AppText style={styles.itemColorDisplay}>
                            Color: {item.selectedColor}
                          </AppText>
                        )}

                        <View style={styles.qtyControls}>
                          <TouchableOpacity
                            style={[
                              styles.qtySubBtn,
                              item.qty <= 1 && styles.qtySubBtnDisabled,
                            ]}
                            onPress={() =>
                              dispatch(
                                updateCartQty({ id: item.id, delta: -1 }),
                              )
                            }
                            disabled={item.qty <= 1}
                            activeOpacity={0.7}
                          >
                            <AppText
                              style={[
                                styles.qtySubText,
                                item.qty <= 1 && styles.qtySubTextDisabled,
                              ]}
                            >
                              -
                            </AppText>
                          </TouchableOpacity>
                          <AppText style={styles.qtyVal}>{item.qty}</AppText>
                          <TouchableOpacity
                            style={styles.qtySubBtn}
                            onPress={() =>
                              dispatch(updateCartQty({ id: item.id, delta: 1 }))
                            }
                            activeOpacity={0.7}
                          >
                            <AppText style={styles.qtySubText}>+</AppText>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.trashIconContainer}
                            onPress={() => dispatch(removeFromCart(item.id))}
                            activeOpacity={0.7}
                          >
                            <Feather
                              name="trash-2"
                              size={18}
                              color={Colors.red}
                            />
                          </TouchableOpacity>
                        </View>

                        <AppText style={styles.itemPrice}>
                          ${item.price}
                        </AppText>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {/* STEP 2: CHECKOUT DETAILED SUMMARY VIEW (IMAGE 2 & IMAGE 4) */}
          {step === 'CHECKOUT' && (
            <View style={styles.section}>
              {/* SHIPPING ADDRESS SECTION */}
              <AppText style={styles.sectionHeader}>SHIPPING ADDRESS</AppText>
              {savedAddress?.address ? (
                <TouchableOpacity
                  style={styles.addressDisplayCard}
                  onPress={() => setStep('ADD_ADDRESS')}
                  activeOpacity={0.8}
                >
                  <View style={styles.flex1}>
                    <AppText style={styles.addressName}>
                      {savedAddress.firstName} {savedAddress.lastName}
                    </AppText>
                    <AppText style={styles.addressText}>
                      {savedAddress.address}
                    </AppText>
                    <AppText style={styles.addressText}>
                      {savedAddress.city} {savedAddress.state}{' '}
                      {savedAddress.zip}
                    </AppText>
                    <AppText style={styles.addressText}>
                      {savedAddress.phone}
                    </AppText>
                  </View>
                  <Feather name="chevron-right" size={20} color="#8A8A8F" />
                </TouchableOpacity>
              ) : null}

              {/* Add Address Pill Button (Image 2) */}
              <TouchableOpacity
                style={styles.addAddressPill}
                onPress={() => setStep('ADD_ADDRESS')}
                activeOpacity={0.8}
              >
                <AppText style={styles.addAddressPillText}>
                  Add shipping address
                </AppText>
                <Feather name="plus" size={18} color="#000000" />
              </TouchableOpacity>

              {/* SHIPPING METHOD SECTION */}
              <AppText style={styles.sectionHeader}>SHIPPING METHOD</AppText>
              <TouchableOpacity
                style={styles.shippingMethodCard}
                onPress={() =>
                  setShippingMethod(prev =>
                    prev === 'PICKUP' ? 'DELIVERY' : 'PICKUP',
                  )
                }
                activeOpacity={0.8}
              >
                <AppText style={styles.shippingMethodText}>
                  {shippingMethod === 'PICKUP'
                    ? 'Pickup at store'
                    : 'Home Delivery'}
                </AppText>
                <View style={styles.shippingMethodPriceRow}>
                  <AppText style={styles.shippingMethodPrice}>
                    {shippingMethod === 'PICKUP' ? 'FREE' : '$15.00'}
                  </AppText>
                  <Feather
                    name="chevron-down"
                    size={16}
                    color="#8A8A8F"
                    style={styles.chevronDown}
                  />
                </View>
              </TouchableOpacity>

              {/* PAYMENT METHOD SECTION */}
              <AppText style={styles.sectionHeader}>PAYMENT METHOD</AppText>
              {savedCard ? (
                <TouchableOpacity
                  style={styles.paymentCardDisplay}
                  onPress={() => setStep('ADD_PAYMENT')}
                  activeOpacity={0.8}
                >
                  <MasterCardLogo />
                  <AppText style={styles.paymentCardText}>
                    Master Card ending ••••{savedCard.number.slice(-2)}
                  </AppText>
                  <Feather
                    name="chevron-right"
                    size={20}
                    color="#8A8A8F"
                    style={styles.chevronRightAligned}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.shippingMethodCard}
                  onPress={() => setStep('ADD_PAYMENT')}
                  activeOpacity={0.8}
                >
                  <AppText style={styles.shippingMethodText}>
                    select payment method
                  </AppText>
                  <Feather name="chevron-down" size={16} color="#8A8A8F" />
                </TouchableOpacity>
              )}

              {/* PRODUCT SUMMARY (IMAGE 4) */}
              {cart.length > 0 && (
                <View style={styles.productSummaryList}>
                  {cart.map(item => (
                    <View
                      key={`summary-${item.id}`}
                      style={styles.cartItemSummary}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.itemImgSummary}
                      />
                      <View style={styles.cartItemTextContainer}>
                        <AppText style={styles.itemNameSummary}>
                          {item.name.toUpperCase()}
                        </AppText>
                        <AppText style={styles.itemCategorySummary}>
                          {item.description || 'Lorem Ipsum Dummy'}
                        </AppText>
                        {item.selectedColor && (
                          <AppText style={styles.itemColorDisplaySummary}>
                            Color: {item.selectedColor}
                          </AppText>
                        )}
                        <View style={styles.qtyRowSummary}>
                          <TouchableOpacity
                            style={[
                              styles.qtySubBtn,
                              item.qty <= 1 && styles.qtySubBtnDisabled,
                            ]}
                            onPress={() =>
                              dispatch(
                                updateCartQty({ id: item.id, delta: -1 }),
                              )
                            }
                            disabled={item.qty <= 1}
                            activeOpacity={0.7}
                          >
                            <AppText
                              style={[
                                styles.qtySubText,
                                item.qty <= 1 && styles.qtySubTextDisabled,
                              ]}
                            >
                              -
                            </AppText>
                          </TouchableOpacity>
                          <AppText style={styles.qtyVal}>{item.qty}</AppText>
                          <TouchableOpacity
                            style={styles.qtySubBtn}
                            onPress={() =>
                              dispatch(updateCartQty({ id: item.id, delta: 1 }))
                            }
                            activeOpacity={0.7}
                          >
                            <AppText style={styles.qtySubText}>+</AppText>
                          </TouchableOpacity>
                        </View>
                        <AppText style={styles.itemPriceSummary}>
                          ${item.price}
                        </AppText>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* STEP 3: ADD SHIPPING ADDRESS VIEW (IMAGE 3) */}
          {step === 'ADD_ADDRESS' && (
            <View style={styles.formSection}>
              <View style={styles.rowFields}>
                <View style={[styles.flex1, styles.marginRight12]}>
                  <TextInput
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    placeholderTextColor="#A3A3A3"
                    style={styles.minimalInput}
                  />
                </View>
                <View style={styles.flex1}>
                  <TextInput
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    placeholderTextColor="#A3A3A3"
                    style={styles.minimalInput}
                  />
                </View>
              </View>

              <TextInput
                value={streetAddress}
                onChangeText={setStreetAddress}
                placeholder="Address"
                placeholderTextColor="#A3A3A3"
                style={styles.minimalInput}
              />

              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="City"
                placeholderTextColor="#A3A3A3"
                style={styles.minimalInput}
              />

              <View style={styles.rowFields}>
                <View style={[styles.flex1, styles.marginRight12]}>
                  <TextInput
                    value={stateCode}
                    onChangeText={setStateCode}
                    placeholder="State"
                    placeholderTextColor="#A3A3A3"
                    style={styles.minimalInput}
                  />
                </View>
                <View style={styles.flex1}>
                  <TextInput
                    value={zipCode}
                    onChangeText={setZipCode}
                    placeholder="ZIP code"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    style={styles.minimalInput}
                  />
                </View>
              </View>

              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor="#A3A3A3"
                keyboardType="phone-pad"
                style={styles.minimalInput}
              />
            </View>
          )}

          {/* STEP 4: ADD PAYMENT VIEW (IMAGE 5) */}
          {step === 'ADD_PAYMENT' && (
            <View style={styles.formSection}>
              {/* Premium Credit Card Display Visual */}
              <View style={styles.premiumCC}>
                <View style={styles.ccTopRow}>
                  <View style={styles.ccChip} />
                  <MasterCardLogo />
                </View>
                <AppText style={styles.ccCardNumber}>
                  {cardNo ? formatCardNumber(cardNo) : '•••• •••• •••• ••••'}
                </AppText>
                <View style={styles.ccBottomRow}>
                  <View>
                    <AppText style={styles.ccLabel}>Card Holder</AppText>
                    <AppText style={styles.ccValue}>
                      {cardName ? cardName.toUpperCase() : 'ALEX CHARLIE'}
                    </AppText>
                  </View>
                  <View style={styles.ccExpiresCol}>
                    <AppText style={styles.ccLabel}>Expires</AppText>
                    <AppText style={styles.ccValue}>
                      {cardExpMonth || '00'}/{cardExpYear || '00'}
                    </AppText>
                  </View>
                </View>
              </View>

              {/* Diamond Page Indicators */}
              <View style={styles.diamondsRow}>
                <View style={styles.diamondDot} />
                <View style={[styles.diamondDot, styles.diamondDotActive]} />
                <View style={styles.diamondDot} />
              </View>

              {/* Card Inputs */}
              <TextInput
                value={cardName}
                onChangeText={setCardName}
                placeholder="Name On Card"
                placeholderTextColor="#A3A3A3"
                style={styles.minimalInput}
              />

              <TextInput
                value={cardNo}
                onChangeText={val => setCardNo(formatCardNumber(val))}
                placeholder="Card Number"
                placeholderTextColor="#A3A3A3"
                keyboardType="numeric"
                maxLength={19}
                style={styles.minimalInput}
              />

              <View style={styles.rowFields}>
                <View style={[styles.flex1, styles.marginRight12]}>
                  <TextInput
                    value={cardExpMonth}
                    onChangeText={setCardExpMonth}
                    placeholder="Exp Month"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    maxLength={2}
                    style={styles.minimalInput}
                  />
                </View>
                <View style={styles.flex1}>
                  <TextInput
                    value={cardExpYear}
                    onChangeText={setCardExpYear}
                    placeholder="Exp Year"
                    placeholderTextColor="#A3A3A3"
                    keyboardType="numeric"
                    maxLength={2}
                    style={styles.minimalInput}
                  />
                </View>
              </View>

              <TextInput
                value={cardCVV}
                onChangeText={setCardCVV}
                placeholder="CVV"
                placeholderTextColor="#A3A3A3"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                style={styles.minimalInput}
              />
            </View>
          )}
        </ScrollView>

        {/* Persistent Bottom Bar with Golden Chevron Buttons */}
        <View style={styles.bottomBar}>
          {/* Cost Estimation Row (Image 1/2/4) */}
          {(step === 'CART' || step === 'CHECKOUT') && cart.length > 0 && (
            <View style={styles.costEstimationRow}>
              <AppText style={styles.estTotalLabel}>EST. TOTAL</AppText>
              <AppText style={styles.estTotalPrice}>${grandTotal}</AppText>
            </View>
          )}

          {step === 'CART' && (
            <CustomButton
              title="Checkout"
              onPress={() => setStep('CHECKOUT')}
              disabled={cart.length === 0}
              hasArrow={true}
            />
          )}
          {step === 'CHECKOUT' && (
            <CustomButton
              title="Place Order"
              onPress={handlePlaceOrder}
              disabled={cart.length === 0 || !savedAddress || !savedCard}
              loading={isPlacingOrder}
              hasArrow={true}
            />
          )}
          {step === 'ADD_ADDRESS' && (
            <CustomButton
              title="Add Now"
              onPress={handleSaveAddress}
              hasArrow={true}
            />
          )}
          {step === 'ADD_PAYMENT' && (
            <CustomButton
              title="Add Card"
              onPress={handleSaveCard}
              hasArrow={true}
            />
          )}
        </View>

        {/* Payment Success Modal */}
        <Modal visible={showSuccess} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalCard}>
              <View style={styles.successIconBox}>
                <AppText style={styles.checkMark}>✓</AppText>
              </View>
              <AppText style={styles.successTitle}>PAYMENT SUCCESS</AppText>
              <AppText style={styles.successSub}>
                Your bespoke order #ORD-{placedOrderId || '8891'} has been
                confirmed.
              </AppText>
              {/* <AppText style={styles.successAmount}>${grandTotal}</AppText> */}

              <CustomButton
                title="Track My Order"
                onPress={handleSuccessClose}
                style={styles.trackOrderBtn}
                hasArrow={false}
              />
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 40,
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    marginTop: 8,
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
  scrollContentContainer: {
    paddingBottom: 110,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  formSection: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.lightblack,
    marginTop: 6,
    textAlign: 'center',
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    alignItems: 'center',
  },
  itemImg: {
    width: 100,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    resizeMode: 'cover',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  itemCategory: {
    fontSize: 12,
    color: '#8A8A8F',
    marginTop: 4,
    lineHeight: 16,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginTop: 10,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  qtySubBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtySubText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8A8A8F',
  },
  qtySubBtnDisabled: {
    borderColor: '#EAEAEA',
    backgroundColor: '#FAFAFA',
    opacity: 0.5,
  },
  qtySubTextDisabled: {
    color: '#D1D1D6',
  },
  qtyVal: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 14,
    color: '#000000',
  },
  deliveryRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  deliveryIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryLabel: {
    marginLeft: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  deliveryValue: {
    marginLeft: 'auto',
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  costEstimationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    width: '100%',
  },
  estTotalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 2,
  },
  estTotalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 10,
  },
  addressDisplayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    paddingBottom: 14,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  addressText: {
    fontSize: 13,
    color: '#8A8A8F',
    lineHeight: 18,
  },
  addAddressPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  addAddressPillText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '400',
  },
  shippingMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 20,
  },
  shippingMethodText: {
    fontSize: 13,
    color: '#000000',
  },
  shippingMethodPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  paymentCardDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    height: 52,
    borderRadius: 26,
    paddingHorizontal: 20,
  },
  paymentCardText: {
    fontSize: 13,
    color: '#000000',
    marginLeft: 12,
  },
  mcLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 28,
  },
  mcCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    opacity: 0.9,
  },
  cartItemSummary: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    alignItems: 'center',
  },
  itemImgSummary: {
    width: 80,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    resizeMode: 'cover',
  },
  itemNameSummary: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  itemCategorySummary: {
    fontSize: 11,
    color: '#8A8A8F',
    marginTop: 2,
  },
  itemPriceSummary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
  },
  qtyRowSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  minimalInput: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
    fontSize: 14,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 24,
    paddingVertical: 8,
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  marginRight12: {
    marginRight: 12,
  },
  premiumCC: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    padding: 24,
    height: 180,
    width: '100%',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginBottom: 16,
  },
  ccTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ccChip: {
    width: 35,
    height: 25,
    borderRadius: 4,
    backgroundColor: '#C5A059',
    opacity: 0.8,
  },
  ccCardNumber: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 2,
    marginVertical: 12,
  },
  ccBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ccLabel: {
    fontSize: 9,
    color: '#8A8A8F',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  ccValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  diamondsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  diamondDot: {
    width: 6,
    height: 6,
    borderWidth: 1.2,
    borderColor: '#C7C7CC',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
  },
  diamondDotActive: {
    borderColor: '#DBA83A',
    backgroundColor: '#DBA83A',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  successIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkMark: {
    fontSize: 32,
    color: '#28A745',
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  successSub: {
    fontSize: 13,
    color: '#5D5D5D',
    textAlign: 'center',
    marginTop: 6,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9E7D3B',
    marginTop: 12,
  },
  cartItemTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  trashIconContainer: {
    marginLeft: 'auto',
  },
  mcCircleRed: {
    backgroundColor: '#EB001B',
  },
  mcCircleOrange: {
    backgroundColor: '#F79E1B',
    marginLeft: -8,
  },
  shippingMethodPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronDown: {
    marginLeft: 8,
  },
  chevronRightAligned: {
    marginLeft: 'auto',
  },
  productSummaryList: {
    marginTop: 24,
  },
  ccExpiresCol: {
    alignItems: 'flex-end',
  },
  trackOrderBtn: {
    width: '100%',
    marginTop: 20,
  },
  itemColorDisplay: {
    fontSize: 12,
    color: '#000000',
    fontWeight: '600',
    marginTop: 4,
  },
  itemColorDisplaySummary: {
    fontSize: 11,
    color: '#000000',
    fontWeight: '600',
    marginTop: 2,
  },
});

export default CartCheckout;
