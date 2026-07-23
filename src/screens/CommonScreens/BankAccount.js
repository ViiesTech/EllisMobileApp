import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import CustomButton from '../../components/CustomButton';
import VendorHeader from '../../components/VendorHeader';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';

const BankAccount = ({ navigation }) => {
  const userProfile = useSelector(selectUser) || {};

  const formatCardNumber = (num) => {
    if (!num) return '2365 3654 2365 3698';
    const cleaned = num.replace(/\s+/g, '');
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const cardHolder = userProfile.bankHolderName || userProfile.name || 'Alex Charlie';
  const cardNumber = formatCardNumber(userProfile.bankAccount || '2365365423653698');
  const expiryDate = userProfile.bankExpiry || '07/26';

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="BANK ACCOUNT"
        goBack={true}
        homeHeader={false}
        notification={false}
      />
      
      <View style={styles.container}>
        {/* Card Mockup Visual */}
        <View style={styles.cardContainer}>
          {/* Mastercard circles (Red & Orange overlapping) */}
          <View style={styles.mastercardContainer}>
            <View style={[styles.cardCircle, styles.circleRed]} />
            <View style={[styles.cardCircle, styles.circleOrange]} />
          </View>

          {/* Card Holder & Expiry Row */}
          <View style={styles.cardDetailsRow}>
            <View style={styles.cardInfoGroup}>
              <AppText style={styles.cardLabelText}>Card Holder</AppText>
              <AppText style={styles.cardValueText}>{cardHolder}</AppText>
            </View>
            <View style={[styles.cardInfoGroup, styles.alignRight]}>
              <AppText style={styles.cardLabelText}>Expires</AppText>
              <AppText style={styles.cardValueText}>{expiryDate}</AppText>
            </View>
          </View>

          {/* Card Account Number */}
          <AppText style={styles.cardNumberText}>{cardNumber}</AppText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Add New Account"
          onPress={() => navigation.navigate('AddBankAccount')}
          hasArrow={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  cardContainer: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 24,
    height: 190,
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  mastercardContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    height: 32,
    width: 50,
    position: 'relative',
    marginTop: -4,
  },
  cardCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
  },
  circleRed: {
    backgroundColor: '#EB001B',
    left: 0,
    zIndex: 1,
  },
  circleOrange: {
    backgroundColor: '#F79E1B',
    left: 16,
    opacity: 0.9,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  cardInfoGroup: {
    flex: 1,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  cardLabelText: {
    color: '#8E8E93',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  cardValueText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  cardNumberText: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 2,
    marginTop: 12,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
});

export default BankAccount;
