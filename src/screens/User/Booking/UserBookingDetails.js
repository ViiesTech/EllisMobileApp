import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Colors from '../../../config/Colors';
import AppText from '../../../components/AppText';
import VendorHeader from '../../../components/VendorHeader';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSubmitReviewMutation, useGetUserBookingDetailsByIdQuery } from '../../../Services/UserServices';
import { showToast } from '../../../components/Toast';
import { resolveImage } from '../../../utils';
import moment from 'moment';

const UserBookingDetails = ({ route, navigation }) => {
  const routeBooking = route.params?.booking;
  const bookingId = route.params?.bookingId || routeBooking?.id;

  const { data: apiBookingResponse, isLoading: isBookingLoading } = useGetUserBookingDetailsByIdQuery(
    bookingId,
    { skip: !bookingId }
  );

  const [localBooking, setLocalBooking] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const [submitReviewApi, { isLoading: isSubmitting }] =
    useSubmitReviewMutation();

  const mapStatus = status => {
    if (!status) return 'Pending';
    const s = status.toLowerCase();
    if (s === 'pending') return 'Pending';
    if (s === 'accepted') return 'Accepted';
    if (s === 'in_progress' || s === 'in-progress') return 'In Progress';
    if (s === 'completed') return 'Completed';
    if (s === 'cancelled') return 'Cancelled';
    return status;
  };

  const constructMeasurementDetails = item => {
    if (Array.isArray(item)) {
      if (item.length === 0) return 'No measurements provided.';
      return item.map(m => `${m.title}: ${m.value} ${m.unit || 'inches'}`).join('\n');
    }
    if (!item) return 'No measurements provided.';
    return (
      `Suit Type: ${item.suit_type || '2 Piece'}\n` +
      `Fit Type: ${item.fit_type || 'Slim'}\n` +
      `Coat Measurements: Length: ${item.coat_length || 0} in, Shoulder: ${
        item.shoulder_width || 0
      } in, Chest: ${item.chest_round || 0} in, Waist: ${
        item.coat_waist || 0
      } in, Hip: ${item.coat_hip || 0} in, Sleeve: ${
        item.sleeves_length || 0
      } in\n` +
      `Pant Measurements: Waist: ${item.pant_waist || 0} in, Hip: ${
        item.pant_hip || 0
      } in, Length: ${item.pant_length || 0} in, Rise: ${
        item.rose || 'Regular'
      }, Leg: ${item.leg || 'Thigh Round'}`
    );
  };

  const constructShippingAddress = item => {
    return `${item.first_name || ''} ${item.last_name || ''}\n${
      item.address || ''
    }, ${item.city || ''} ${item.postal_code || ''}\nPhone: ${
      item.phone || ''
    }`;
  };

  const mapApiBookingToUi = b => {
    if (!b) return null;
    return {
      id: b.id,
      tailor_id: b.tailor_id || b.tailor?.id || b.tailor?.user_id,
      customerName: b.tailor?.business_name || b.tailor?.name || 'Tailor',
      image: b.tailor?.profile_image,
      address:
        `${b.tailor?.address || ''}, ${b.tailor?.city || ''}`.replace(
          /^,\s*|,\s*$/g,
          '',
        ) || 'New York, United States',
      serviceName: b.service?.name,
      serviceDescription: b.service?.description,
      serviceImage: b.service?.image_url || b.service?.image,
      price: b.total || '0.00',
      time: b.created_at ? moment(b.created_at).format('MM/DD/YYYY') : 'N/A',
      status: mapStatus(b.status),
      fabricDetails: b.notes || 'No extra fabric/design instructions provided.',
      measurementDetails: constructMeasurementDetails(b.measurements || b?.measurement),
      shippingAddress: constructShippingAddress(b),
      is_reviewed: b.is_reviewed,
      review: b.review,
    };
  };

  useEffect(() => {
    if (apiBookingResponse?.data) {
      setLocalBooking(mapApiBookingToUi(apiBookingResponse.data));
    } else if (routeBooking) {
      setLocalBooking(routeBooking);
    }
  }, [apiBookingResponse, routeBooking]);

  const getBadgeColors = status => {
    if (!status) return { bg: '#FEF3C7', text: '#D97706' };
    const s = status.toLowerCase();
    if (s === 'new' || s === 'pending') {
      return { bg: '#FEF3C7', text: '#D97706' };
    } else if (s === 'accepted') {
      return { bg: '#DBEAFE', text: '#155DFC' };
    } else if (
      s === 'in progress' ||
      s === 'in_progress' ||
      s === 'in-progress'
    ) {
      return { bg: '#E8FBCF', text: '#295C00' };
    } else {
      return { bg: '#DCFCE7', text: '#15803D' };
    }
  };

  const getStatusLabel = status => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'new' || s === 'pending') {
      return 'Pending';
    }
    if (s === 'in progress' || s === 'in_progress' || s === 'in-progress') {
      return 'In Progress';
    }
    if (s === 'completed') {
      return 'Completed';
    }
    return status;
  };

  const badgeColors = getBadgeColors(localBooking?.status || '');
  const isCompleted = localBooking?.status?.toLowerCase() === 'completed';
  const isReviewed = localBooking?.is_reviewed || !!localBooking?.review;

  const handleOpenReviewModal = () => {
    setRating(5);
    setReviewText('');
    setReviewModalVisible(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      showToast('Error', 'Please select a rating.', 'error');
      return;
    }
    try {
      const payload = {
        tailor_id: Number(localBooking.tailor_id || localBooking.tailor?.id),
        service_order_id: Number(localBooking.id),
        rating: Number(rating),
        comment: reviewText,
      };
      console.log('payload:', payload);
      await submitReviewApi(payload).unwrap();
      showToast(
        'Success',
        'Thank you for reviewing the tailor. Your review has been submitted successfully!',
        'success',
      );
      setLocalBooking(prev => ({
        ...prev,
        is_reviewed: true,
        review: {
          rating: Number(rating),
          comment: reviewText,
          created_at: new Date().toISOString(),
        },
      }));
      setReviewModalVisible(false);
    } catch (error) {
      console.log('Error submitting booking review:', error);
      showToast(
        'Error',
        error?.data?.message || 'Failed to submit review. Please try again.',
        'error',
      );
    }
  };

  if (!localBooking) {
    if (isBookingLoading) {
      return (
        <View style={styles.safeArea}>
          <VendorHeader
            navigation={navigation}
            title="BOOKING DETAILS"
            goBack={true}
          />
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Colors.primary || '#DBA83A'} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.safeArea}>
        <VendorHeader
          navigation={navigation}
          title="BOOKING DETAILS"
          goBack={true}
        />
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>Booking details not found.</AppText>
        </View>
      </View>
    );
  }

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
          <View style={styles.clientLeft}>
            <Image
              source={
                React.isValidElement(localBooking.image)
                  ? {
                      uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    }
                  : typeof localBooking.image === 'string'
                  ? { uri: localBooking.image }
                  : localBooking.image || {
                      uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                    }
              }
              style={styles.clientAvatar}
            />
            <View style={styles.clientInfo}>
              <AppText style={styles.clientName}>
                {localBooking.customerName}
              </AppText>
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={12} color="#7C7C7C" />
                <AppText style={styles.locationText}>
                  {' '}
                  {localBooking.address || 'Chicago, United States'}
                </AppText>
              </View>
            </View>
          </View>
          {localBooking.status && (
            <View
              style={[styles.statusBadge, { backgroundColor: badgeColors.bg }]}
            >
              <AppText
                style={[styles.statusBadgeText, { color: badgeColors.text }]}
              >
                {getStatusLabel(localBooking.status)}
              </AppText>
            </View>
          )}
        </View>

        {/* Details Sections */}
        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Service</AppText>
          <AppText style={styles.sectionBody}>
            {localBooking.serviceName || 'Suit Stitching'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>ADDITIONAL NOTES</AppText>
          <AppText style={styles.sectionBody}>
            {localBooking.fabricDetails ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Style</AppText>
          <Image
            source={{
              uri:
                localBooking.serviceImage ||
                'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=300&auto=format&fit=crop&q=80',
            }}
            style={styles.styleImage}
          />
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Measurement Details</AppText>
          <AppText style={styles.sectionBody}>
            {localBooking.measurementDetails ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
          </AppText>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionHeader}>Shipping Address</AppText>
          <AppText style={styles.sectionBody}>
            {localBooking.shippingAddress ||
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'}
          </AppText>
        </View>

        {isCompleted &&
          (isReviewed ? (
            <View style={[styles.section, styles.reviewSection]}>
              <AppText style={styles.sectionHeader}>Your Review</AppText>
              <View style={styles.reviewShowContainer}>
                <View style={styles.reviewShowHeader}>
                  <View style={styles.reviewStarsRow}>
                    {[1, 2, 3, 4, 5].map(starNum => (
                      <Ionicons
                        key={starNum}
                        name={
                          starNum <= (localBooking.review?.rating || 0)
                            ? 'star'
                            : 'star-outline'
                        }
                        size={12}
                        color="#DBA83A"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                  {localBooking.review?.created_at && (
                    <AppText style={styles.reviewDateText}>
                      {new Date(
                        localBooking.review.created_at,
                      ).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </AppText>
                  )}
                </View>
                {localBooking.review?.comment ? (
                  <AppText style={styles.reviewCommentText}>
                    "{localBooking.review.comment}"
                  </AppText>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.reviewButton}
                onPress={handleOpenReviewModal}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="star-outline"
                  size={14}
                  color="#DBA83A"
                  style={{ marginRight: 6 }}
                />
                <AppText style={styles.reviewButtonText}>
                  Write a Review
                </AppText>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      {/* Review Modal */}
      <Modal
        visible={reviewModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setReviewModalVisible(false)}
              activeOpacity={0.7}
            >
              <Feather name="x" size={20} color="#000000" />
            </TouchableOpacity>

            <AppText style={styles.modalTitle}>Write a Review</AppText>
            <AppText style={styles.modalSubtitle} numberOfLines={2}>
              {localBooking.serviceName || 'Service'}
            </AppText>

            {/* Stars Row */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(starNum => {
                const isFilled = starNum <= rating;
                return (
                  <TouchableOpacity
                    key={starNum}
                    onPress={() => setRating(starNum)}
                    activeOpacity={0.7}
                    style={styles.starTouch}
                  >
                    <Ionicons
                      name={isFilled ? 'star' : 'star-outline'}
                      size={32}
                      color={isFilled ? '#DBA83A' : '#EAEAEA'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Review Input */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Tell us about your experience with this tailor service..."
              placeholderTextColor="#8E8E93"
              multiline
              numberOfLines={4}
              value={reviewText}
              onChangeText={setReviewText}
              textAlignVertical="top"
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmitReview}
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <AppText style={styles.submitBtnText}>Submit Review</AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
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
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  clientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
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
  reviewSection: {
    marginTop: 10,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#FAF7EE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DBA83A',
    justifyContent: 'center',
    marginTop: 10,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DBA83A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#8A8A8F',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  starTouch: {
    marginHorizontal: 6,
  },
  reviewInput: {
    width: '100%',
    height: 100,
    borderColor: '#EAEAEA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 13,
    color: '#000000',
    backgroundColor: '#FBFBFB',
    marginBottom: 24,
  },
  submitBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#DBA83A',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reviewShowContainer: {
    marginTop: 4,
    padding: 12,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  reviewShowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDateText: {
    fontSize: 11,
    color: '#8A8A8F',
  },
  reviewCommentText: {
    fontSize: 12,
    color: '#444444',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  emptyText: {
    fontSize: 16,
    color: '#7C7C7C',
  },
});

export default UserBookingDetails;
