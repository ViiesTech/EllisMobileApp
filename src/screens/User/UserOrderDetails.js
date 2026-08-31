import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useSubmitReviewMutation,
  useGetUserOrderDetailsQuery,
} from '../../Services/UserServices';
import { showToast } from '../../components/Toast';

const UserOrderDetails = ({ route, navigation }) => {
  const { order } = route.params;
  console.log('order:-', order);
  const displayOrderId = String(order.id).replace('ord-', '');

  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [items, setItems] = useState(order.items || []);

  const { data: orderDetailsData, isFetching } = useGetUserOrderDetailsQuery(
    displayOrderId,
    {
      skip: !displayOrderId,
    },
  );

  const [submitReviewApi, { isLoading: isSubmitting }] =
    useSubmitReviewMutation();

  const apiOrder = orderDetailsData?.data?.order;

  const resolveProductImage = rawImage => {
    if (!rawImage) {
      return 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';
    }

    let imageUrlStr = '';
    if (Array.isArray(rawImage)) {
      imageUrlStr = rawImage[0] || '';
    } else if (typeof rawImage === 'string') {
      imageUrlStr = rawImage;
    }

    imageUrlStr = imageUrlStr.trim();
    if (imageUrlStr.startsWith('[') && imageUrlStr.endsWith(']')) {
      try {
        const parsed = JSON.parse(imageUrlStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrlStr = parsed[0];
        }
      } catch (e) {}
    }

    if (!imageUrlStr || typeof imageUrlStr !== 'string') {
      return 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';
    }

    return imageUrlStr;
  };

  const mapApiOrderToUi = apiO => {
    if (!apiO) return null;
    const rawItems = apiO.items || [];
    const firstItem = rawItems[0] || {};
    const rawImage =
      firstItem?.product?.images || firstItem?.product?.image_url;
    const itemImage = resolveProductImage(rawImage);

    const itemsCount = rawItems.length;
    const itemsInfoStr = `${itemsCount} Item${
      itemsCount > 1 ? 's' : ''
    } - ${rawItems.map(it => it.product?.name || it.name).join(', ')}`;

    const vendorFullName = apiO.vendor?.user
      ? `${apiO.vendor.user.name} ${apiO.vendor.user.last_name || ''}`.trim()
      : 'Bespoke Vendor';

    const mappedItems = rawItems.map(it => ({
      ...it,
      name: it.product?.name || it.name || 'Product',
      price: it.price || it.product?.price || '0.00',
    }));

    return {
      ...apiO,
      id: `ord-${apiO.id}`,
      image: itemImage,
      vendorName: vendorFullName,
      customerName: vendorFullName,
      itemsInfo: itemsInfoStr,
      price: apiO.total || apiO.subtotal || '0.00',
      productName:
        rawItems.map(it => it.product?.name || it.name).join(', ') ||
        'Bespoke Order',
      items: mappedItems,
    };
  };

  const mappedApiOrder = apiOrder ? mapApiOrderToUi(apiOrder) : null;

  // Sync state if backend data updates
  useEffect(() => {
    if (mappedApiOrder?.items) {
      setItems(mappedApiOrder.items);
    }
  }, [apiOrder]);

  const currentOrder = mappedApiOrder
    ? {
        ...order,
        ...mappedApiOrder,
        items: mappedApiOrder.items || [],
        vendor: mappedApiOrder.vendor || order.vendor,
      }
    : order;

  if (isFetching && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary || '#DBA83A'} />
      </View>
    );
  }

  const itemsCountText = currentOrder.itemsInfo
    ? currentOrder.itemsInfo.split(' - ')[0]
    : `${items.length} Item${items.length > 1 ? 's' : ''}`;

  const vendorName = currentOrder.vendor?.user
    ? `${currentOrder.vendor.user.name} ${
        currentOrder.vendor.user.last_name || ''
      }`.trim()
    : currentOrder.customerName === 'Liam James'
    ? 'Andrew Ainsly'
    : currentOrder.customerName;

  const isPickup = currentOrder.shipping_method?.toLowerCase() === 'pickup';

  const getBadgeColors = status => {
    if (!status) return { bg: '#FEF3C7', text: '#D97706' };
    const s = status.toLowerCase();
    if (s === 'new' || s === 'pending') {
      return { bg: '#FEF3C7', text: '#D97706' };
    } else if (s === 'processing') {
      return { bg: '#DBEAFE', text: '#155DFC' };
    } else if (s === 'shipped') {
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
    if (s === 'delivered') {
      return 'Completed';
    }
    return status;
  };

  const badgeColors = getBadgeColors(currentOrder.status);
  const isCompleted =
    currentOrder.status?.toLowerCase() === 'delivered' ||
    currentOrder.status?.toLowerCase() === 'completed';

  const handleOpenReviewModal = item => {
    setSelectedItem(item);
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
        product_id: Number(selectedItem.product_id),
        order_id: Number(order.order_id || displayOrderId || order.id),
        rating: Number(rating),
        comment: reviewText,
      };
      console.log('Submitting review with payload:', payload);
      await submitReviewApi(payload).unwrap();
      showToast(
        'Success',
        `Thank you for reviewing "${
          selectedItem?.name || 'Item'
        }". Your review has been submitted successfully!`,
        'success',
      );
      setItems(prevItems =>
        prevItems.map(it => {
          const itProductId = Number(
            it.product_id || it.product?.id || it.productId || it.id,
          );
          const selProductId = Number(
            selectedItem.product_id ||
              selectedItem.product?.id ||
              selectedItem.productId ||
              selectedItem.id,
          );
          if (itProductId === selProductId) {
            return {
              ...it,
              is_reviewed: true,
              review: {
                rating: Number(rating),
                comment: reviewText,
                created_at: new Date().toISOString(),
              },
            };
          }
          return it;
        }),
      );
      setReviewModalVisible(false);
      setSelectedItem(null);
    } catch (error) {
      console.log('Error submitting review:', error);
      showToast(
        'Error',
        error?.data?.message || 'Failed to submit review. Please try again.',
        'error',
      );
    }
  };

  return (
    <View style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <AppText style={styles.headerTitle}>ORDER DETAILS</AppText>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.diamond} />
            <View style={styles.dividerLine} />
          </View>
        </View>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header Summary Card */}
        <View style={styles.summaryCard}>
          <Image
            source={{ uri: currentOrder.image }}
            style={styles.summaryImg}
          />
          <View style={styles.summaryTextContainer}>
            <View style={styles.orderRowHeader}>
              <AppText style={styles.orderIdText}>
                Order #{displayOrderId}
              </AppText>
              {currentOrder.status && (
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: badgeColors.bg },
                  ]}
                >
                  <AppText
                    style={[
                      styles.statusBadgeText,
                      { color: badgeColors.text },
                    ]}
                  >
                    {getStatusLabel(currentOrder.status)}
                  </AppText>
                </View>
              )}
            </View>
            <AppText style={styles.priceText}>${currentOrder.price}</AppText>
            <AppText style={styles.itemsText}>{itemsCountText}</AppText>
          </View>
        </View>

        {/* Detailed Description Fields */}
        <View style={styles.detailsBlock}>
          <AppText style={styles.detailLabel}>Ordered Items</AppText>
          <View style={styles.itemsContainer}>
            {(items || []).map((item, idx) => (
              <View key={idx} style={styles.itemRowWrapper}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfoCol}>
                    <AppText style={styles.itemNameText}>
                      {item.name || 'Item'}
                    </AppText>
                    {item.color && (
                      <AppText style={styles.itemColorText}>
                        Color: {item.color}
                      </AppText>
                    )}
                  </View>
                  <AppText style={styles.itemQtyText}>
                    x{item.quantity || 1}
                  </AppText>
                </View>
                {isCompleted &&
                  (item.is_reviewed ? (
                    <View style={styles.reviewShowContainer}>
                      <View style={styles.reviewShowHeader}>
                        <View style={styles.reviewStarsRow}>
                          {[1, 2, 3, 4, 5].map(starNum => (
                            <Ionicons
                              key={starNum}
                              name={
                                starNum <= (item.review?.rating || 0)
                                  ? 'star'
                                  : 'star-outline'
                              }
                              size={12}
                              color="#DBA83A"
                              style={{ marginRight: 2 }}
                            />
                          ))}
                        </View>
                        {item.review?.created_at && (
                          <AppText style={styles.reviewDateText}>
                            {new Date(
                              item.review.created_at,
                            ).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </AppText>
                        )}
                      </View>
                      {item.review?.comment ? (
                        <AppText style={styles.reviewCommentText}>
                          "{item.review.comment}"
                        </AppText>
                      ) : null}
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.reviewButton}
                      onPress={() => handleOpenReviewModal(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="star-outline"
                        size={12}
                        color="#DBA83A"
                        style={{ marginRight: 4 }}
                      />
                      <AppText style={styles.reviewButtonText}>
                        Write a Review
                      </AppText>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </View>

          <AppText style={styles.detailLabel}>Vendor Name</AppText>
          <AppText style={styles.detailValue}>{vendorName}</AppText>

          {isPickup ? (
            <>
              <AppText style={styles.detailLabel}>Store Address</AppText>
              <AppText style={styles.detailValue}>
                {currentOrder.vendor?.address || 'N/A'}
                {currentOrder.vendor?.city
                  ? `, ${currentOrder.vendor.city}`
                  : ''}
              </AppText>
            </>
          ) : (
            <>
              <AppText style={styles.detailLabel}>Delivery Time</AppText>
              <AppText style={styles.detailValue}>4 to 5 working days</AppText>
            </>
          )}
        </View>
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
              {selectedItem?.name || 'Item'}
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
              placeholder="Tell us about your experience with this item..."
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
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: Platform.OS === 'ios' ? 0 : 40,
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
  contentContainer: {
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  summaryImg: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    resizeMode: 'cover',
  },
  summaryTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  orderRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  priceText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginTop: 6,
  },
  itemsText: {
    fontSize: 12,
    color: '#8A8A8F',
    marginTop: 4,
  },
  detailsBlock: {
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 13,
    color: '#8A8A8F',
    marginBottom: 26,
    lineHeight: 18,
  },
  itemsContainer: {
    marginBottom: 26,
  },
  itemRowWrapper: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EAEAEA',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#FAF7EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#DBA83A',
  },
  reviewButtonText: {
    fontSize: 10,
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
  itemNameText: {
    fontSize: 13,
    color: '#8A8A8F',
  },
  itemQtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 10,
  },
  itemInfoCol: {
    flex: 1,
  },
  itemColorText: {
    fontSize: 11,
    color: '#8A8A8F',
    marginTop: 2,
  },
  reviewShowContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  reviewShowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDateText: {
    fontSize: 10,
    color: '#8A8A8F',
  },
  reviewCommentText: {
    fontSize: 11,
    color: '#444444',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default UserOrderDetails;
