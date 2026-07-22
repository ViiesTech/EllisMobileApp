import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Modal } from 'react-native';
import Colors from '../../../config/Colors';
import TextField from '../../../components/TextField';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCart,
  removeFromCart,
  updateCartQty,
  clearCart,
} from '../../../store/productSlice';

const CartCheckout = ({ navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const [step, setStep] = useState('CART'); // CART | ADDRESS | PAYMENT
  const [address, setAddress] = useState('742 Evergreen Terrace, Springfield, NY 10001');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState('Alan Charles');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shipping;

  const handlePlaceOrder = () => {
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    dispatch(clearCart());
    navigation.navigate('Bookings');
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whitebackgroundcolor }}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppText style={styles.backText}>‹</AppText>
        </TouchableOpacity>
        <AppText style={styles.headerTitle}>CHECKOUT</AppText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Step Indicator */}
        <View style={styles.stepIndicator}>
          <TouchableOpacity
            style={[styles.stepItem, step === 'CART' && styles.stepItemActive]}
            onPress={() => setStep('CART')}
          >
            <AppText style={[styles.stepText, step === 'CART' && styles.stepTextActive]}>
              1. Cart ({cart.length})
            </AppText>
          </TouchableOpacity>
          <AppText style={styles.stepArrow}>›</AppText>
          <TouchableOpacity
            style={[styles.stepItem, step === 'ADDRESS' && styles.stepItemActive]}
            onPress={() => setStep('ADDRESS')}
          >
            <AppText style={[styles.stepText, step === 'ADDRESS' && styles.stepTextActive]}>
              2. Address
            </AppText>
          </TouchableOpacity>
          <AppText style={styles.stepArrow}>›</AppText>
          <TouchableOpacity
            style={[styles.stepItem, step === 'PAYMENT' && styles.stepItemActive]}
            onPress={() => setStep('PAYMENT')}
          >
            <AppText style={[styles.stepText, step === 'PAYMENT' && styles.stepTextActive]}>
              3. Payment
            </AppText>
          </TouchableOpacity>
        </View>

        {/* STEP 1: CART ITEMS */}
        {step === 'CART' && (
          <View style={styles.section}>
            {cart.length === 0 ? (
              <View style={styles.emptyCard}>
                <AppText style={styles.emptyIcon}>🛍️</AppText>
                <AppText style={styles.emptyTitle}>Your Cart is Empty</AppText>
                <AppText style={styles.emptySub}>Explore fabrics & suits to add items to your cart.</AppText>
              </View>
            ) : (
              cart.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.itemImg} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <AppText style={styles.itemName} numberOfLines={1}>
                      {item.name}
                    </AppText>
                    <AppText style={styles.itemCategory}>{item.category}</AppText>
                    <AppText style={styles.itemPrice}>${item.price}</AppText>

                    <View style={styles.qtyControls}>
                      <TouchableOpacity
                        style={styles.qtySubBtn}
                        onPress={() =>
                          dispatch(updateCartQty({ id: item.id, delta: -1 }))
                        }
                      >
                        <AppText style={styles.qtySubText}>-</AppText>
                      </TouchableOpacity>
                      <AppText style={styles.qtyVal}>{item.qty}</AppText>
                      <TouchableOpacity
                        style={styles.qtySubBtn}
                        onPress={() =>
                          dispatch(updateCartQty({ id: item.id, delta: 1 }))
                        }
                      >
                        <AppText style={styles.qtySubText}>+</AppText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ marginLeft: 'auto' }}
                        onPress={() => dispatch(removeFromCart(item.id))}
                      >
                        <AppText style={styles.removeText}>Remove</AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* STEP 2: SHIPPING ADDRESS */}
        {step === 'ADDRESS' && (
          <View style={styles.cardSection}>
            <AppText style={styles.cardHeader}>SHIPPING ADDRESS</AppText>
            <TextField
              label="Full Address"
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <TextField label="City / State" value="New York, NY" />
            <TextField label="Postal Code" value="10001" keyboardType="numeric" />
          </View>
        )}

        {/* STEP 3: PAYMENT METHOD */}
        {step === 'PAYMENT' && (
          <View style={styles.cardSection}>
            <AppText style={styles.cardHeader}>PAYMENT METHOD</AppText>

            {/* Credit Card Mock Visual */}
            <View style={styles.creditCardVisual}>
              <AppText style={styles.ccBrand}>ELLIS PLATINUM</AppText>
              <AppText style={styles.ccNum}>{cardNumber}</AppText>
              <View style={styles.ccRow}>
                <View>
                  <AppText style={styles.ccLabel}>CARD HOLDER</AppText>
                  <AppText style={styles.ccVal}>{cardHolder}</AppText>
                </View>
                <View>
                  <AppText style={styles.ccLabel}>EXPIRES</AppText>
                  <AppText style={styles.ccVal}>{expiry}</AppText>
                </View>
              </View>
            </View>

            <TextField
              label="Cardholder Name"
              value={cardHolder}
              onChangeText={setCardHolder}
            />
            <TextField
              label="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row' }}>
              <TextField
                label="Expiry Date"
                value={expiry}
                onChangeText={setExpiry}
                style={{ flex: 1, marginRight: 10 }}
              />
              <TextField
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                secureTextEntry
                style={{ flex: 1 }}
              />
            </View>
          </View>
        )}

        {/* Order Cost Summary */}
        <View style={styles.cardSection}>
          <AppText style={styles.cardHeader}>ORDER SUMMARY</AppText>
          <View style={styles.summaryRow}>
            <AppText style={styles.sumLabel}>Subtotal</AppText>
            <AppText style={styles.sumVal}>${subtotal}</AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText style={styles.sumLabel}>Shipping & Tailor Handling</AppText>
            <AppText style={styles.sumVal}>${shipping}</AppText>
          </View>
          <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: Colors.graybordercolor, paddingTop: 10, marginTop: 10 }]}>
            <AppText style={styles.grandLabel}>Total Amount</AppText>
            <AppText style={styles.grandVal}>${grandTotal}</AppText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Floating Action */}
      <View style={styles.bottomBar}>
        {step === 'CART' && (
          <CustomButton
            title={`Proceed to Address • $${grandTotal}`}
            onPress={() => setStep('ADDRESS')}
            disabled={cart.length === 0}
            style={{ flex: 1 }}
          />
        )}
        {step === 'ADDRESS' && (
          <CustomButton
            title="Proceed to Payment"
            onPress={() => setStep('PAYMENT')}
            style={{ flex: 1 }}
          />
        )}
        {step === 'PAYMENT' && (
          <CustomButton
            title={`Place Order • $${grandTotal}`}
            onPress={handlePlaceOrder}
            style={{ flex: 1 }}
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
              style={{ width: '100%', marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  topHeader: {
    height: 56,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  backBtn: {
    width: 32,
  },
  backText: {
    fontSize: 28,
    color: Colors.secondary,
    marginTop: -4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  stepItem: {
    paddingVertical: 4,
  },
  stepItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primaryDark,
  },
  stepText: {
    fontSize: 12,
    color: Colors.lightblack,
  },
  stepTextActive: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  stepArrow: {
    fontSize: 14,
    color: Colors.gray,
  },
  section: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  itemImg: {
    width: 70,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.textinputboxcolor,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondary,
  },
  itemCategory: {
    fontSize: 11,
    color: Colors.lightblack,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 4,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtySubBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textinputboxcolor,
  },
  qtySubText: {
    fontSize: 14,
    fontWeight: '700',
  },
  qtyVal: {
    fontSize: 13,
    fontWeight: '700',
    marginHorizontal: 10,
  },
  removeText: {
    fontSize: 12,
    color: Colors.red,
    fontWeight: '600',
  },
  cardSection: {
    margin: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
    marginBottom: 14,
  },
  creditCardVisual: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  ccBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 2,
  },
  ccNum: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 3,
    marginVertical: 14,
  },
  ccRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ccLabel: {
    fontSize: 8,
    color: Colors.gray,
    letterSpacing: 1,
  },
  ccVal: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '700',
    marginTop: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sumLabel: {
    fontSize: 13,
    color: Colors.lightblack,
  },
  sumVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
  },
  grandLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
  },
  grandVal: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.graybordercolor,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.lightblack,
    marginTop: 4,
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
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  successIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.greenBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkMark: {
    fontSize: 32,
    color: Colors.green,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 1,
  },
  successSub: {
    fontSize: 13,
    color: Colors.lightblack,
    textAlign: 'center',
    marginTop: 6,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 12,
  },
});

export default CartCheckout;
