import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import Fonts from '../../config/Fonts';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCart } from '../../store/productSlice';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showToast } from '../../components/Toast';
import CustomImageViewer from '../../components/CustomImageViewer';
import {
  DoNotBleachIcon,
  DoNotTumbleDryIcon,
  DryCleanIcon,
  IronIcon,
} from '../../assets/svg';
import { useGetProductReviewsQuery } from '../../Services/UserServices';

const { width: screenWidth } = Dimensions.get('window');

const UserProductDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const product = route.params?.product;

  const { data: reviewsDataResponse } = useGetProductReviewsQuery(product?.id, {
    skip: !product?.id,
  });
  const reviewsData = reviewsDataResponse?.data;

  const getProductImages = () => {
    const rawImage = product.images;
    if (rawImage) {
      if (Array.isArray(rawImage)) {
        return rawImage.length > 0
          ? rawImage
          : [
              'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
            ];
      }
      if (typeof rawImage === 'string') {
        if (rawImage.trim().startsWith('[') && rawImage.trim().endsWith(']')) {
          try {
            const parsed = JSON.parse(rawImage);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          } catch (e) {}
        }
        return [
          rawImage,
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80',
        ];
      }
    }
    return [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80',
    ];
  };

  const images = getProductImages();
  const scrollViewRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const colorsList = useMemo(() => {
    const raw = product?.color;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string' && raw.trim() !== '') {
      if (raw.startsWith('[') && raw.endsWith(']')) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
      if (raw.includes(',')) {
        return raw
          .split(',')
          .map(c => c.trim())
          .filter(Boolean);
      }
      return [raw.trim()];
    }
    return [];
  }, [product?.color]);

  const [selectedColor, setSelectedColor] = useState(colorsList[0] || '');
  const [qty] = useState(1);
  const isInCart = cart.some(
    item =>
      item.productId === product.id && item.selectedColor === selectedColor,
  );
  const cartTotalItems = cart.length;

  const handleAddToCart = () => {
    if (colorsList.length > 0 && !selectedColor) {
      showToast('Required', 'Please select a color first.', 'error');
      return;
    }
    const rawImage = product.images;
    let singleImage = Array.isArray(rawImage) ? rawImage[0] : rawImage;
    if (
      typeof singleImage === 'string' &&
      singleImage.trim().startsWith('[') &&
      singleImage.trim().endsWith(']')
    ) {
      try {
        const parsed = JSON.parse(singleImage);
        if (Array.isArray(parsed)) {
          singleImage = parsed[0];
        }
      } catch (e) {}
    }
    const normalizedProduct = {
      ...product,
      price: product.price,
      selectedColor: selectedColor || 'Default',
      image:
        singleImage ||
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
    };
    dispatch(addToCart({ product: normalizedProduct, quantity: qty }));
    showToast('Success', 'Item added to cart successfully.', 'success');
  };

  const handleDotPress = index => {
    setCurrentImageIndex(index);
    scrollViewRef.current?.scrollTo({ x: index * screenWidth, animated: true });
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => {
              const contentOffset = e.nativeEvent.contentOffset;
              const viewSize = e.nativeEvent.layoutMeasurement;
              const pageNum = Math.floor(contentOffset.x / viewSize.width);
              setCurrentImageIndex(pageNum);
            }}
            style={styles.imageScrollView}
          >
            {images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.9}
                onPress={() => setIsViewerVisible(true)}
                style={[styles.imageTouch, { width: screenWidth }]}
              >
                <Image source={{ uri: img }} style={styles.image} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.zoomBtn}
            activeOpacity={0.8}
            onPress={() => setIsViewerVisible(true)}
          >
            <Feather name="maximize-2" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Diamond Pagination Indicators */}
        <View style={styles.diamondsRow}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDotPress(index)}
              style={[
                styles.diamondDot,
                currentImageIndex === index && styles.diamondDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.body}>
          {/* Title block */}
          <AppText style={styles.name}>{product.name.toUpperCase()}</AppText>
          <AppText style={styles.subtitle}>
            {product.category_name || product.category || 'Category'}
          </AppText>
          <AppText style={styles.priceText}>
            ${product?.price}{' '}
            {product?.price_per_meter ? 'Per Meter' : 'Per Unit'}
          </AppText>

          {/* Colors Selection Section */}
          {colorsList.length > 0 && (
            <View style={styles.colorSelectionSection}>
              <AppText style={styles.sectionHeader}>SELECT COLOR</AppText>
              <View style={styles.colorChipsRow}>
                {colorsList.map((col, idx) => {
                  const isSelected = selectedColor === col;
                  return (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.colorSelectChip,
                        isSelected && styles.colorSelectChipActive,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => setSelectedColor(col)}
                    >
                      <AppText
                        style={[
                          styles.colorSelectChipText,
                          isSelected && styles.colorSelectChipTextActive,
                        ]}
                      >
                        {col}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Description Section */}
          <View style={styles.infoBlock}>
            <AppText style={styles.sectionHeader}>DESCRIPTION</AppText>
            <AppText style={styles.sectionParagraph}>
              {product.description ||
                'No description available for this product.'}
            </AppText>
          </View>

          {/* Materials Section */}
          <View style={styles.infoBlock}>
            <AppText style={styles.sectionHeader}>MATERIALS</AppText>
            <AppText style={styles.sectionParagraph}>
              Crafted with high-quality {product.material || 'Cotton'}. We work
              with monitoring programmes to ensure compliance with safety,
              health and quality standards for our products.
            </AppText>
          </View>

          {/* Care Section */}
          <View style={styles.infoBlock}>
            <AppText style={styles.sectionHeader}>CARE</AppText>
            <AppText style={styles.sectionParagraph}>
              To keep your jackets and coats clean, you only need to freshen
              them up and go over them with a cloth or a clothes brush. If you
              need to dry clean a garment, look for a dry cleaner that uses
              technologies that are respectful of the environment.
            </AppText>

            {/* Laundry Care List */}
            <View style={styles.careList}>
              <View style={styles.careRow}>
                <DoNotBleachIcon />
                <AppText style={styles.careText}>Do not use bleach</AppText>
              </View>
              <View style={styles.careRow}>
                <DoNotTumbleDryIcon />
                <AppText style={styles.careText}>Do not tumble dry</AppText>
              </View>
              <View style={styles.careRow}>
                <DryCleanIcon />
                <AppText style={styles.careText}>
                  Dry clean with tetrachloroethylene
                </AppText>
              </View>
              <View style={styles.careRow}>
                <IronIcon />
                <AppText style={styles.careText}>
                  Iron at a maximum of 110°C/230°F
                </AppText>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          {reviewsData?.reviews && reviewsData.reviews.length > 0 && (
            <View style={styles.infoBlock}>
              <View style={styles.reviewsTitleRow}>
                <AppText style={styles.sectionHeader}>
                  REVIEWS ({reviewsData.total_reviews || 0})
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

          {/* Care / Shipping Policies Accordion Section */}
          {/* <View style={styles.infoBlock}>
            <AppText style={styles.sectionHeader}>CARE</AppText>
            <View style={styles.accordionContainer}>
              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  activeOpacity={0.7}
                  onPress={() => toggleSection('shipping')}
                >
                  <AppText style={styles.accordionTitle}>
                    Free Flat Rate Shipping
                  </AppText>
                  <Feather
                    name={
                      expandedSection === 'shipping'
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={18}
                    color="#8A8A8F"
                  />
                </TouchableOpacity>
                {expandedSection === 'shipping' && (
                  <View style={styles.accordionBody}>
                    <AppText style={styles.accordionBodyText}>
                      Estimated to be delivered on 09/11/2021 - 12/11/2021.
                    </AppText>
                  </View>
                )}
              </View>

              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  activeOpacity={0.7}
                  onPress={() => toggleSection('cod')}
                >
                  <AppText style={styles.accordionTitle}>COD Policy</AppText>
                  <Feather
                    name={
                      expandedSection === 'cod' ? 'chevron-up' : 'chevron-down'
                    }
                    size={18}
                    color="#8A8A8F"
                  />
                </TouchableOpacity>
                {expandedSection === 'cod' && (
                  <View style={styles.accordionBody}>
                    <AppText style={styles.accordionBodyText}>
                      Cash on Delivery is available for all fabric and readymade
                      orders within standard service zones.
                    </AppText>
                  </View>
                )}
              </View>

              <View style={styles.accordionItem}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  activeOpacity={0.7}
                  onPress={() => toggleSection('return')}
                >
                  <AppText style={styles.accordionTitle}>Return Policy</AppText>
                  <Feather
                    name={
                      expandedSection === 'return'
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    size={18}
                    color="#8A8A8F"
                  />
                </TouchableOpacity>
                {expandedSection === 'return' && (
                  <View style={styles.accordionBody}>
                    <AppText style={styles.accordionBodyText}>
                      14-day hassle-free return policy. Fabric must be uncut,
                      clean, and in original packaging for returns.
                    </AppText>
                  </View>
                )}
              </View>
            </View>
          </View> */}
        </View>
      </ScrollView>

      {/* Floating Cart Button (FAB) */}
      <TouchableOpacity
        style={styles.floatingCartBtn}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CartCheckout')}
      >
        <Feather name="shopping-bag" size={24} color={Colors.white} />
        {cartTotalItems > 0 && (
          <View style={styles.floatingCartBadge}>
            <AppText style={styles.floatingCartBadgeText}>
              {cartTotalItems}
            </AppText>
          </View>
        )}
      </TouchableOpacity>

      {/* Add To Cart Footer Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.addToCartBtn, isInCart && styles.disabledBtn]}
          activeOpacity={0.85}
          onPress={handleAddToCart}
          disabled={isInCart}
        >
          <View style={styles.flex1} />
          <AppText
            style={[styles.addToCartText, isInCart && styles.disabledBtnText]}
          >
            {isInCart ? 'Added in Cart' : 'Add to Cart'}
          </AppText>
          <View style={styles.arrowIconContainer}>
            <Feather
              name={isInCart ? 'check' : 'arrow-right'}
              size={20}
              color={isInCart ? '#9CA3AF' : '#000000'}
            />
          </View>
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
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  imageScrollView: {
    width: '100%',
    height: '100%',
  },
  imageTouch: {
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: '#fafafa',
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 24,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  zoomBtn: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 18,
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
  body: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 2.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8A8F',
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  colorLabel: {
    fontSize: 13,
    color: '#8A8A8F',
    marginRight: 16,
  },
  colorValue: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  colorDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: '#DBA83A',
    borderWidth: 1.5,
    transform: [{ scale: 1.25 }],
  },
  infoBlock: {
    marginTop: 28,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 10,
  },
  sectionParagraph: {
    fontSize: 13,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  careList: {
    marginTop: 16,
  },
  careRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  careText: {
    marginLeft: 14,
    fontSize: 13,
    color: '#4A4A4A',
  },
  accordionContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#EAEAEA',
  },
  accordionItem: {
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  accordionTitle: {
    fontSize: 13.5,
    color: '#000000',
  },
  accordionBody: {
    paddingBottom: 14,
    paddingHorizontal: 2,
  },
  accordionBodyText: {
    fontSize: 13,
    color: '#7C7C7C',
    lineHeight: 18,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 0,
  },
  addToCartBtn: {
    backgroundColor: '#DBA83A',
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  addToCartText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledBtn: {
    backgroundColor: '#F3F4F6',
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledBtnText: {
    color: '#9CA3AF',
  },
  colorDotBlack: {
    backgroundColor: '#000000',
  },
  colorDotCoral: {
    backgroundColor: '#E07C53',
  },
  colorDotGray: {
    backgroundColor: '#E5E4E2',
  },
  flex1: {
    flex: 1,
  },
  arrowIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  floatingCartBtn: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBA83A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 5,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  floatingCartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#000000',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DBA83A',
  },
  floatingCartBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  colorSelectionSection: {
    marginTop: 8,
    marginBottom: 20,
  },
  colorChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  colorSelectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1.2,
    borderColor: '#E5E7EB',
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelectChipActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  colorSelectChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    fontFamily: Fonts.regular,
  },
  colorSelectChipTextActive: {
    color: '#FFFFFF',
  },
  reviewsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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

export default UserProductDetails;
