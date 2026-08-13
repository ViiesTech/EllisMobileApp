import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { addBooking } from '../../store/bookingSlice';
import { showToast } from '../../components/Toast';
import VendorHeader from '../../components/VendorHeader';

const BookingConfirm = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { bookingData, tailor, service } = route.params || {};

  const handleConfirm = () => {
    navigation.navigate('BookingCheckout', {
      bookingData,
      tailor,
      service,
    });
  };

  const getServiceImage = () => {
    if (service?.image_url) return { uri: service.image_url };
    if (service?.image) {
      if (typeof service.image === 'string') return { uri: service.image };
      return service.image;
    }
    return {
      uri: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&auto=format&fit=crop&q=80',
    };
  };

  const price = service?.price;
  const serviceName = service?.name;

  return (
    <View style={styles.container}>
      <VendorHeader
        navigation={navigation}
        title="BOOKING CONFIRM"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <View style={styles.content}>
        {/* Style/Service Info Card */}
        <View style={styles.card}>
          <Image source={getServiceImage()} style={styles.serviceImage} />
          <View style={styles.cardInfo}>
            <AppText style={styles.styleLabel}>STYLE NAME</AppText>
            <AppText style={styles.serviceName}>
              {service?.name} - {service?.category}
            </AppText>
            <AppText style={styles.priceText}>${price}</AppText>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Delivery Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Feather
              name="truck"
              size={20}
              color="#000000"
              style={styles.infoIcon}
            />
            <AppText style={styles.infoLabel}>Delivery</AppText>
          </View>
          <AppText style={styles.infoValue}>Free</AppText>
        </View>

        <View style={styles.divider} />
      </View>

      {/* Absolute bottom booking bar */}
      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <AppText style={styles.totalLabel}>EST. TOTAL</AppText>
          <AppText style={styles.totalValue}>${price}</AppText>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.9}
          onPress={handleConfirm}
        >
          <AppText style={styles.bookBtnText}>Confirm Booking</AppText>
          <Feather
            name="arrow-right"
            size={20}
            color="#000000"
            style={styles.bookBtnArrow}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  serviceImage: {
    width: 90,
    height: 120,
    borderRadius: 6,
    backgroundColor: '#F9F9F9',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 18,
  },
  styleLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
    textTransform: 'uppercase',
  },
  serviceName: {
    fontSize: 14,
    color: '#5D5D5D',
    fontFamily: Fonts.regular,
    marginTop: 4,
  },
  priceText: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#000000',
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EAEAEA',
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000000',
    fontFamily: Fonts.regular,
  },
  infoValue: {
    fontSize: 14,
    color: '#8A8A8F',
    fontFamily: Fonts.regular,
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
});

export default BookingConfirm;
