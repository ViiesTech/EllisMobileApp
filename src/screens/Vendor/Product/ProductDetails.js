import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../config/Colors';
import Fonts from '../../../config/Fonts';
import AppText from '../../../components/AppText';
import VendorHeader from '../../../components/VendorHeader';
import CustomImageViewer from '../../../components/CustomImageViewer';
import { useDeleteProductMutation } from '../../../Services/VendorServices';
import { showToast, showToastError } from '../../../components/Toast';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetProductReviewsQuery } from '../../../Services/UserServices';

const ProductDetails = ({ route, navigation }) => {
  const product = route.params?.product;
  console.log('product:-', product);
  const [deleteProductMutation, { isLoading: isDeleting }] =
    useDeleteProductMutation();

  const { data: reviewsDataResponse } = useGetProductReviewsQuery(product?.id, {
    skip: !product?.id,
  });
  const reviewsData = reviewsDataResponse?.data;

  const getProductImages = () => {
    const raw = product?.image_url || product?.image || product?.images;
    if (!raw) {
      return [
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=80',
      ];
    }

    if (Array.isArray(raw)) {
      return raw
        .map(img => (typeof img === 'string' ? img : img?.uri))
        .filter(Boolean);
    }

    if (typeof raw === 'string' && raw.trim() !== '') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed
            .map(img => (typeof img === 'string' ? img : img?.uri))
            .filter(Boolean);
        }
      } catch (e) {
        // Not a JSON array string
      }
      return [raw];
    }

    return [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=80',
    ];
  };

  const images = getProductImages();
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const priceVal = product?.price;
  const stockVal =
    product?.available_stock !== undefined
      ? product.available_stock
      : product?.stock || 0;
  const materialVal = product?.material || 'Standard Fabric';

  const formatColorValue = raw => {
    if (!raw) return 'Olive Green';
    if (Array.isArray(raw)) return raw.join(', ');
    if (typeof raw === 'string' && raw.trim() !== '') {
      if (raw.startsWith('[') && raw.endsWith(']')) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed.join(', ');
        } catch (e) {}
      }
      return raw;
    }
    return String(raw);
  };

  const colorVal = formatColorValue(product?.color);

  const isAvailable =
    stockVal === 'Yes' ||
    stockVal === 'yes' ||
    stockVal === true ||
    (typeof stockVal === 'number' && stockVal > 0) ||
    (typeof stockVal === 'string' && parseInt(stockVal, 10) > 0);

  const handleDelete = () => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteProductMutation(product.id).unwrap();
              if (response?.success) {
                showToast(
                  'Success',
                  response?.message || 'Product deleted successfully.',
                  'success',
                );
                navigation.goBack();
              } else {
                showToast(
                  'Error',
                  response?.message || 'Failed to delete product.',
                  'error',
                );
              }
            } catch (err) {
              console.log('deleteProduct error:-', err);
              showToastError('Error', err);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.safeAreaVendor}>
      <VendorHeader
        navigation={navigation}
        title="PRODUCT DETAILS"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainerVendor}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topInfoRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsViewerVisible(true)}
          >
            <Image
              source={{ uri: images[currentImageIndex] }}
              style={styles.productImgVendor}
            />
          </TouchableOpacity>

          <View style={styles.topInfoRight}>
            <AppText style={styles.productNameVendor}>{product.name}</AppText>
            <AppText style={styles.productPriceVendor}>${priceVal}</AppText>
            <AppText style={styles.productUnitVendor}>Per Unit</AppText>
          </View>
        </View>

        <View style={styles.detailsSection}>
          <AppText style={styles.detailSectionHeader}>Description</AppText>
          <AppText style={styles.detailSectionContent}>
            {product.description ||
              'No description available for this product.'}
          </AppText>

          <AppText style={styles.detailSectionHeader}>Category</AppText>
          <AppText style={styles.detailSectionContent}>
            {product.category}
          </AppText>

          <AppText style={styles.detailSectionHeader}>Stock</AppText>
          <AppText style={styles.detailSectionContent}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </AppText>

          <AppText style={styles.detailSectionHeader}>Color</AppText>
          <AppText style={styles.detailSectionContent}>{colorVal}</AppText>

          <AppText style={styles.detailSectionHeader}>Material</AppText>
          <AppText style={styles.detailSectionContent}>{materialVal}</AppText>

          {/* Reviews Section */}
          {reviewsData?.reviews && reviewsData.reviews.length > 0 && (
            <View style={styles.reviewsBlock}>
              <View style={styles.reviewsTitleRow}>
                <AppText style={styles.detailSectionHeaderReviews}>
                  Reviews ({reviewsData.total_reviews || 0})
                </AppText>
                {reviewsData.average_rating ? (
                  <View style={styles.avgRatingRow}>
                    <Ionicons name="star" size={14} color="#DBA83A" />
                    <AppText style={styles.avgRatingText}>
                      {' '}
                      {Number(reviewsData.average_rating).toFixed(1)}
                    </AppText>
                  </View>
                ) : null}
              </View>

              <View style={styles.reviewsList}>
                {reviewsData.reviews.map((rev, idx) => (
                  <View key={rev.id || idx} style={styles.reviewItemCard}>
                    <View style={styles.reviewerHeader}>
                      <Image
                        source={{
                          uri:
                            rev.user?.profile_image ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
                        }}
                        style={styles.reviewerAvatar}
                      />
                      <View style={styles.reviewerMeta}>
                        <AppText style={styles.reviewerName}>
                          {`${rev.user?.name || ''} ${
                            rev.user?.last_name || ''
                          }`.trim() || 'Customer'}
                        </AppText>
                        <View style={styles.reviewStarsRow}>
                          {[1, 2, 3, 4, 5].map(starNum => (
                            <Ionicons
                              key={starNum}
                              name={
                                starNum <= (rev.rating || 0)
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
                      {rev.created_at && (
                        <AppText style={styles.reviewDateText}>
                          {new Date(rev.created_at).toLocaleDateString(
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
                    {rev.comment ? (
                      <AppText style={styles.reviewCommentText}>
                        "{rev.comment}"
                      </AppText>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBtnContainerVendor}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          disabled={isDeleting}
          activeOpacity={0.8}
        >
          {isDeleting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <AppText style={styles.deleteButtonText}>Delete Product</AppText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('AddProduct', { product })}
          activeOpacity={0.8}
        >
          <AppText style={styles.editButtonText}>Edit Product</AppText>
        </TouchableOpacity>
      </View>

      <CustomImageViewer
        visible={isViewerVisible}
        images={images}
        imageIndex={currentImageIndex}
        onClose={() => setIsViewerVisible(false)}
        onImageIndexChange={index => setCurrentImageIndex(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaVendor: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainerVendor: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  productImgVendor: {
    width: 104,
    height: 104,
    borderRadius: 12,
    backgroundColor: Colors.textinputboxcolor,
  },
  topInfoRight: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
  },
  productNameVendor: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 6,
  },
  productPriceVendor: {
    fontSize: 28,
    fontFamily: Fonts.regular,
    color: '#000000',
    marginBottom: 2,
  },
  productUnitVendor: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
  },
  detailsSection: {
    marginTop: 8,
  },
  detailSectionHeader: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
  },
  detailSectionContent: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  bottomBtnContainerVendor: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    // backgroundColor: 'teal',
  },
  editButton: {
    height: 50,
    width: '48%',
    backgroundColor: '#DBA83A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  deleteButton: {
    height: 50,
    width: '48%',
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  reviewsBlock: {
    marginTop: 20,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 20,
  },
  reviewsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailSectionHeaderReviews: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '600',
  },
  avgRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF7EE',
    borderWidth: 1,
    borderColor: '#DBA83A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  avgRatingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DBA83A',
  },
  reviewsList: {
    marginTop: 8,
  },
  reviewItemCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
  },
  reviewerMeta: {
    flex: 1,
    marginLeft: 10,
  },
  reviewerName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDateText: {
    fontSize: 9,
    color: '#8A8A8F',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  reviewCommentText: {
    fontSize: 12,
    color: '#4b5563',
    fontStyle: 'italic',
    lineHeight: 18,
    paddingLeft: 38,
  },
});

export default ProductDetails;
