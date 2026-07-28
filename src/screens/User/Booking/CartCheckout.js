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

  // Address form states (Pre-filled with mockup data for demo)
  const [firstName, setFirstName] = useState('Alex');
  const [lastName, setLastName] = useState('Charlie');
  const [streetAddress, setStreetAddress] = useState(
    '606-3727 Ullamcorper. Street',
  );
  const [city, setCity] = useState('Roseville');
  const [stateCode, setStateCode] = useState('NH');
  const [zipCode, setZipCode] = useState('11523');
  const [phone, setPhone] = useState('(786) 713-8616');

  // Active saved address
  const [savedAddress, setSavedAddress] = useState({
    firstName: 'Alex',
    lastName: 'Charlie',
    address: '606-3727 Ullamcorper. Street',
    city: 'Roseville',
    state: 'NH',
    zip: '11523',
    phone: '(786) 713-8616',
  });

  // Card form states (Pre-filled with mockup data for demo)
  const [cardName, setCardName] = useState('Alex Charlie');
  const [cardNo, setCardNo] = useState('2365 3654 2365 3698');
  const [cardExpMonth, setCardExpMonth] = useState('03');
  const [cardExpYear, setCardExpYear] = useState('25');
  const [cardCVV, setCardCVV] = useState('999');

  // Active saved card
  const [savedCard, setSavedCard] = useState({
    name: 'Alex Charlie',
    number: '2365 3654 2365 3698',
    expMonth: '03',
    expYear: '25',
    cvv: '999',
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
    if (
      !firstName ||
      !lastName ||
      !streetAddress ||
      !city ||
      !stateCode ||
      !zipCode ||
      !phone
    ) {
      showToast('Error', 'Please fill all address fields.', 'error');
      return;
    }
    setSavedAddress({
      firstName,
      lastName,
      address: streetAddress,
      city,
      state: stateCode,
      zip: zipCode,
      phone,
    });
    setStep('CHECKOUT');
    showToast('Success', 'Address updated successfully.', 'success');
  };

  const handleSaveCard = () => {
    if (!cardName || !cardNo || !cardExpMonth || !cardExpYear || !cardCVV) {
      showToast('Error', 'Please fill all card fields.', 'error');
      return;
    }
    setSavedCard({
      name: cardName,
      number: cardNo,
      expMonth: cardExpMonth,
      expYear: cardExpYear,
      cvv: cardCVV,
    });
    setStep('CHECKOUT');
    showToast('Success', 'Card details updated successfully.', 'success');
  };

  const handlePlaceOrder = () => {
    if (!savedAddress) {
      showToast('Required', 'Please add a shipping address first.', 'error');
      return;
    }
    if (!savedCard) {
      showToast('Required', 'Please select a payment method first.', 'error');
      return;
    }
    setShowSuccess(true);
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
                <AppText style={styles.emptyTitle}>Your Cart is Empty</AppText>
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

                      <View style={styles.qtyControls}>
                        <TouchableOpacity
                          style={[
                            styles.qtySubBtn,
                            item.qty <= 1 && styles.qtySubBtnDisabled,
                          ]}
                          onPress={() =>
                            dispatch(updateCartQty({ id: item.id, delta: -1 }))
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

                      <AppText style={styles.itemPrice}>${item.price}</AppText>
                    </View>
                  </View>
                ))}

                {/* Delivery Option Row (Image 1) */}
                <View style={styles.deliveryRowContainer}>
                  <View style={styles.deliveryIconBox}>
                    <Feather name="package" size={20} color="#000000" />
                  </View>
                  <AppText style={styles.deliveryLabel}>Delivery</AppText>
                  <AppText style={styles.deliveryValue}>Free</AppText>
                </View>
              </>
            )}
          </View>
        )}

        {/* STEP 2: CHECKOUT DETAILED SUMMARY VIEW (IMAGE 2 & IMAGE 4) */}
        {step === 'CHECKOUT' && (
          <View style={styles.section}>
            {/* SHIPPING ADDRESS SECTION */}
            <AppText style={styles.sectionHeader}>SHIPPING ADDRESS</AppText>
            {savedAddress ? (
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
                    {savedAddress.city} {savedAddress.state} {savedAddress.zip}
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
                      <View style={styles.qtyRowSummary}>
                        <TouchableOpacity
                          style={[
                            styles.qtySubBtn,
                            item.qty <= 1 && styles.qtySubBtnDisabled,
                          ]}
                          onPress={() =>
                            dispatch(updateCartQty({ id: item.id, delta: -1 }))
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
                  placeholder="Exp Date"
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
              Your bespoke order #ORD-8891 has been confirmed.
            </AppText>
            <AppText style={styles.successAmount}>${grandTotal}</AppText>

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
});

export default CartCheckout;
