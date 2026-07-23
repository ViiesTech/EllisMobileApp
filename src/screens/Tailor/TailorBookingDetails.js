import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import VendorHeader from '../../components/VendorHeader';
import { useDispatch } from 'react-redux';
import { updateBookingStatus } from '../../store/bookingSlice';
import Feather from 'react-native-vector-icons/Feather';

const TailorBookingDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { booking } = route.params || {};

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <AppText style={styles.errorText}>No booking details available.</AppText>
      </View>
    );
  }

  const handleStatusChange = (status) => {
    dispatch(updateBookingStatus({ id: booking.id, status }));
    Alert.alert('Status Updated', `Booking has been marked as ${status}.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="BOOKING DETAILS"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Client Card Section */}
        <View style={styles.clientCard}>
          <Image
            source={
              typeof booking.image === 'string'
                ? { uri: booking.image }
                : booking.image || {
                    uri:
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  }
            }
            style={styles.clientAvatar}
          />
          <View style={styles.clientInfo}>
            <AppText style={styles.clientName}>{booking.customerName}</AppText>
            <View style={styles.locationContainer}>
              <Feather name="map-pin" size={12} color="#7C7C7C" />
              <AppText style={styles.locationText}> {booking.address || 'Chicago, United States'}</AppText>
            </View>
          </View>
        </View>

        {/* Details Sections */}
        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Service</AppText>
          <AppText style={styles.sectionBody}>
            {booking.serviceName || 'Suit Stitching'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Fabric Details</AppText>
          <AppText style={styles.sectionBody}>
            {booking.fabricDetails ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Style</AppText>
          <Image
            source={{
              uri:
                booking.styleImage ||
                'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&auto=format&fit=crop&q=80',
            }}
            style={styles.styleImage}
          />
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Measurement Details</AppText>
          <AppText style={styles.sectionBody}>
            {booking.measurementDetails ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Shipping Address</AppText>
          <AppText style={styles.sectionBody}>
            {booking.shippingAddress ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
          </AppText>
        </View>
      </ScrollView>

      {/* Action Buttons at Bottom */}
      <View style={styles.actionContainer}>
        {booking.status === 'Pending' && (
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.acceptBtn]}
              onPress={() => handleStatusChange('Accepted')}
              activeOpacity={0.8}
            >
              <AppText style={styles.acceptBtnText}>Accept</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.rejectBtn]}
              onPress={() => handleStatusChange('Rejected')}
              activeOpacity={0.8}
            >
              <AppText style={styles.rejectBtnText}>Reject</AppText>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === 'Accepted' && (
          <TouchableOpacity
            style={[styles.btn, styles.fullWidthBtn, styles.acceptBtn]}
            onPress={() => handleStatusChange('In Progress')}
            activeOpacity={0.8}
          >
            <AppText style={styles.acceptBtnText}>Start Work</AppText>
          </TouchableOpacity>
        )}

        {booking.status === 'In Progress' && (
          <TouchableOpacity
            style={[styles.btn, styles.fullWidthBtn, styles.acceptBtn]}
            onPress={() => handleStatusChange('Delivered')}
            activeOpacity={0.8}
          >
            <AppText style={styles.acceptBtnText}>Deliver Booking</AppText>
          </TouchableOpacity>
        )}

        {booking.status === 'Delivered' && (
          <View style={[styles.btn, styles.fullWidthBtn, styles.disabledBtn]}>
            <AppText style={styles.disabledBtnText}>Completed & Delivered</AppText>
          </View>
        )}

        {booking.status === 'Rejected' && (
          <View style={[styles.btn, styles.fullWidthBtn, styles.disabledBtn]}>
            <AppText style={styles.disabledBtnText}>Booking Rejected</AppText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 110, // Ensure content doesn't cover button area
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7C7C7C',
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  clientAvatar: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  clientInfo: {
    marginLeft: 16,
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  styleImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginTop: 4,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 0,
    elevation: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidthBtn: {
    width: '100%',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  acceptBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#000000',
    marginLeft: 6,
  },
  rejectBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  disabledBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  disabledBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
  },
});

export default TailorBookingDetails;
