import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import VendorHeader from '../../components/VendorHeader';
import { useUpdateTailorBookingStatusMutation } from '../../Services/TailorServices';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TailorBookingDetails = ({ route, navigation }) => {
  const { booking } = route.params || {};
  const [updateStatus, { isLoading }] = useUpdateTailorBookingStatusMutation();
  const [activeAction, setActiveAction] = useState(null);

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <AppText style={styles.errorText}>
          No booking details available.
        </AppText>
      </View>
    );
  }

  const handleStatusChange = async (status, actionName) => {
    setActiveAction(actionName);
    const mapUiStatusToBackend = s => {
      if (s === 'Pending') return 'pending';
      if (s === 'Accepted') return 'accepted';
      if (s === 'In Progress') return 'in_progress';
      if (s === 'Delivered' || s === 'Completed') return 'completed';
      if (s === 'Rejected' || s === 'Cancelled') return 'cancelled';
      return s.toLowerCase();
    };

    try {
      const response = await updateStatus({
        id: booking.id,
        status: mapUiStatusToBackend(status),
      }).unwrap();

      if (response?.success) {
        Alert.alert('Status Updated', `Booking has been marked as ${status}.`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', response?.message || 'Failed to update status.');
      }
    } catch (err) {
      Alert.alert('Error', err?.data?.message || 'Server error occurred.');
    } finally {
      setActiveAction(null);
    }
  };

  console.log('booking', booking);
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
                    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                  }
            }
            style={styles.clientAvatar}
          />
          <View style={styles.clientInfo}>
            <AppText style={styles.clientName}>{booking.customerName}</AppText>
            <View style={styles.locationContainer}>
              <Feather
                name="map-pin"
                size={12}
                color="#7C7C7C"
                style={{ marginTop: 2 }}
              />
              <AppText style={styles.locationText}>
                {' '}
                {booking.address || 'N/A'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Details Sections */}
        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Service</AppText>
          <AppText style={styles.sectionBody}>
            {booking.serviceName || 'N/A'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Service Description</AppText>
          <AppText style={styles.sectionBody}>
            {booking.serviceDescription ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Style</AppText>
          <Image
            source={{
              uri:
                booking.serviceImage ||
                'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&auto=format&fit=crop&q=80',
            }}
            style={styles.styleImage}
          />
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Measurement Details</AppText>
          <AppText style={styles.sectionBody}>
            {booking.measurementDetails || 'N/A'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Shipping Address</AppText>
          <AppText style={styles.sectionBody}>
            {booking.shippingAddress || 'N/A'}
          </AppText>
        </View>

        {booking.review && (
          <View style={[styles.section, styles.reviewSection]}>
            <AppText style={styles.sectionHeader}>Customer Review</AppText>
            <View style={styles.reviewShowContainer}>
              <View style={styles.reviewerHeader}>
                <Image
                  source={{
                    uri:
                      booking.review.user?.profile_image ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
                  }}
                  style={styles.reviewerAvatar}
                />
                <View style={styles.reviewerMeta}>
                  <AppText style={styles.reviewerName}>
                    {`${booking.review.user?.name || ''} ${
                      booking.review.user?.last_name || ''
                    }`.trim() || 'Customer'}
                  </AppText>
                  <View style={styles.reviewStarsRow}>
                    {[1, 2, 3, 4, 5].map(starNum => (
                      <Ionicons
                        key={starNum}
                        name={
                          starNum <= (booking.review?.rating || 0)
                            ? 'star'
                            : 'star-outline'
                        }
                        size={10}
                        color="#DBA83A"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                </View>
                {booking.review?.created_at && (
                  <AppText style={styles.reviewDateText}>
                    {new Date(booking.review.created_at).toLocaleDateString(
                      'en-US',
                      {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      },
                    )}
                  </AppText>
                )}
              </View>
              {booking.review?.comment ? (
                <AppText style={styles.reviewCommentText}>
                  "{booking.review.comment}"
                </AppText>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons at Bottom */}
      <View style={styles.actionContainer}>
        {booking.status === 'Pending' && (
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.acceptBtn,
                isLoading && { opacity: 0.7 },
              ]}
              onPress={() => handleStatusChange('Accepted', 'accept')}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading && activeAction === 'accept' ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <AppText style={styles.acceptBtnText}>Accept</AppText>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                styles.rejectBtn,
                isLoading && { opacity: 0.7 },
              ]}
              onPress={() => handleStatusChange('Cancelled', 'reject')}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading && activeAction === 'reject' ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <AppText style={styles.rejectBtnText}>Reject</AppText>
              )}
            </TouchableOpacity>
          </View>
        )}

        {booking.status === 'Accepted' && (
          <TouchableOpacity
            style={[
              styles.btn,
              styles.fullWidthBtn,
              styles.acceptBtn,
              isLoading && { opacity: 0.7 },
            ]}
            onPress={() => handleStatusChange('In Progress', 'start')}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading && activeAction === 'start' ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <AppText style={styles.acceptBtnText}>Start Work</AppText>
            )}
          </TouchableOpacity>
        )}

        {booking.status === 'In Progress' && (
          <TouchableOpacity
            style={[
              styles.btn,
              styles.fullWidthBtn,
              styles.acceptBtn,
              isLoading && { opacity: 0.7 },
            ]}
            onPress={() => handleStatusChange('Completed', 'deliver')}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading && activeAction === 'deliver' ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <AppText style={styles.acceptBtnText}>Deliver Booking</AppText>
            )}
          </TouchableOpacity>
        )}

        {(booking.status === 'Delivered' || booking.status === 'Completed') && (
          <View style={[styles.btn, styles.fullWidthBtn, styles.disabledBtn]}>
            <AppText style={styles.disabledBtnText}>
              Completed & Delivered
            </AppText>
          </View>
        )}

        {(booking.status === 'Rejected' || booking.status === 'Cancelled') && (
          <View style={[styles.btn, styles.fullWidthBtn, styles.disabledBtn]}>
            <AppText style={styles.disabledBtnText}>
              Booking Rejected / Cancelled
            </AppText>
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
    alignItems: 'flex-start',
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
  reviewSection: {
    marginTop: 10,
  },
  reviewShowContainer: {
    marginTop: 4,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  reviewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  reviewerMeta: {
    flex: 1,
    marginLeft: 10,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDateText: {
    fontSize: 10,
    color: '#8A8A8F',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  reviewCommentText: {
    fontSize: 12,
    color: '#444444',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default TailorBookingDetails;
