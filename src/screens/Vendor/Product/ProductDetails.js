import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Colors from '../../../config/Colors';
import Fonts from '../../../config/Fonts';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectProducts } from '../../../store/productSlice';
import { selectRole } from '../../../store/authSlice';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../../components/VendorHeader';
import Svg, { Polygon, Line, Rect, Circle, Path } from 'react-native-svg';

// Custom SVG Laundry Care Icons to match premium design mockup
const DoNotBleachIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Polygon
      points="12,3 22,21 2,21"
      stroke="#8A8A8F"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Line x1="7" y1="11" x2="17" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
    <Line x1="17" y1="11" x2="7" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
  </Svg>
);

const DoNotTumbleDryIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      stroke="#8A8A8F"
      strokeWidth="2"
    />
    <Circle cx="12" cy="12" r="6" stroke="#8A8A8F" strokeWidth="1.5" />
    <Line x1="5" y1="5" x2="19" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
    <Line x1="19" y1="5" x2="5" y2="19" stroke="#8A8A8F" strokeWidth="1.5" />
  </Svg>
);

const DryCleanIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke="#8A8A8F" strokeWidth="2" />
    <Path d="M7 17 H17" stroke="#8A8A8F" strokeWidth="1.5" />
  </Svg>
);

const IronIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 17 H21 L19 11 C18 9 16 8 14 8 H7 C5 8 4 9 3 11 Z"
      stroke="#8A8A8F"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path
      d="M7 8 V5 H15 V8"
      stroke="#8A8A8F"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Circle cx="8" cy="13" r="1" fill="#8A8A8F" />
  </Svg>
);

const ProductDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const role = useSelector(selectRole);
  const isVendor = role === 'VENDOR';

  const products = useSelector(selectProducts);
  const routeProduct = route.params?.product;
  const product = products.find(p => p.id === routeProduct?.id) ||
    routeProduct || {
      name: 'Italian Navy Wool Suit Fabric',
      category: 'Fabrics',
      price: 120,
      rating: 4.8,
      reviews: 42,
      stock: 15,
      material: 'Pure Wool',
      description: 'Premium 100% Super 130s Italian Wool.',
      image:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
    };

  const [qty] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);
  const [selectedColor, setSelectedColor] = useState('black');
  const [expandedSection, setExpandedSection] = useState('shipping');

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2000);
  };

  const toggleSection = section => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  if (isVendor) {
    let colorVal = 'Olive Green';
    const lowerName = product.name.toLowerCase();
    if (lowerName.includes('navy')) colorVal = 'Navy Blue';
    else if (lowerName.includes('charcoal')) colorVal = 'Charcoal';
    else if (lowerName.includes('white')) colorVal = 'White';
    else if (lowerName.includes('black')) colorVal = 'Midnight Black';
    else if (lowerName.includes('grey') || lowerName.includes('gray'))
      colorVal = 'Slate Gray';

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
            <Image
              source={{ uri: product.image }}
              style={styles.productImgVendor}
            />

            <View style={styles.topInfoRight}>
              <AppText style={styles.productNameVendor}>{product.name}</AppText>
              <AppText style={styles.productPriceVendor}>
                ${product.price}
              </AppText>
              <AppText style={styles.productUnitVendor}>Per Meter</AppText>
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
              {product.stock > 0 ? `Available` : 'Out of Stock'}
            </AppText>

            <AppText style={styles.detailSectionHeader}>Color</AppText>
            <AppText style={styles.detailSectionContent}>{colorVal}</AppText>

            <AppText style={styles.detailSectionHeader}>Material</AppText>
            <AppText style={styles.detailSectionContent}>
              {product.material || 'Standard Fabric'}
            </AppText>
          </View>
        </ScrollView>

        <View style={styles.bottomBtnContainerVendor}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('AddProduct', { product })}
            activeOpacity={0.8}
          >
            <AppText style={styles.editButtonText}>Edit Product</AppText>
            <Feather
              name="arrow-right"
              size={20}
              color="#000000"
              style={styles.arrowIconVendor}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.image} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.zoomBtn} activeOpacity={0.8}>
            <Feather name="maximize-2" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Diamond Pagination Indicators */}
        <View style={styles.diamondsRow}>
          <View style={[styles.diamondDot, styles.diamondDotActive]} />
          <View style={styles.diamondDot} />
          <View style={styles.diamondDot} />
          <View style={styles.diamondDot} />
          <View style={styles.diamondDot} />
        </View>

        <View style={styles.body}>
          {/* Title block */}
          <AppText style={styles.name}>{product.name.toUpperCase()}</AppText>
          <AppText style={styles.subtitle}>Lorem Ipsum Dummy</AppText>
          <AppText style={styles.priceText}>
            ${product.price}{' '}
            {product.category === 'Fabrics' ? 'Per Meter' : 'Per Unit'}
          </AppText>

          {/* Colors Selection Row */}
          <View style={styles.colorRow}>
            <AppText style={styles.colorLabel}>Color</AppText>
            <View style={styles.colorDots}>
              <TouchableOpacity
                style={[
                  styles.colorDot,
                  styles.colorDotBlack,
                  selectedColor === 'black' && styles.colorDotSelected,
                ]}
                onPress={() => setSelectedColor('black')}
              />
              <TouchableOpacity
                style={[
                  styles.colorDot,
                  styles.colorDotCoral,
                  selectedColor === 'coral' && styles.colorDotSelected,
                ]}
                onPress={() => setSelectedColor('coral')}
              />
              <TouchableOpacity
                style={[
                  styles.colorDot,
                  styles.colorDotGray,
                  selectedColor === 'gray' && styles.colorDotSelected,
                ]}
                onPress={() => setSelectedColor('gray')}
              />
            </View>
          </View>

          {/* Materials Section */}
          <View style={styles.infoBlock}>
            <AppText style={styles.sectionHeader}>MATERIALS</AppText>
            <AppText style={styles.sectionParagraph}>
              We work with monitoring programmes to ensure compliance with
              safety, health and quality standards for our products.
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

          {/* Care / Shipping Policies Accordion Section */}
          <View style={styles.infoBlock}>
            <AppText style={styles.sectionHeader}>CARE</AppText>
            <View style={styles.accordionContainer}>
              {/* Shipping Row */}
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

              {/* COD Row */}
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

              {/* Return Row */}
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
          </View>
        </View>
      </ScrollView>

      {/* Add To Cart Footer Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          activeOpacity={0.85}
          onPress={handleAddToCart}
        >
          <View style={styles.flex1} />
          <AppText style={styles.addToCartText}>
            {addedAlert ? '✓ Added to Cart' : 'Add to Cart'}
          </AppText>
          <View style={styles.arrowIconContainer}>
            <Feather name="arrow-right" size={20} color="#000000" />
          </View>
        </TouchableOpacity>
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
    paddingBottom: 110,
  },
  imageContainer: {
    width: '100%',
    height: 380,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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

  /* Vendor Specific Styles */
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
    backgroundColor: 'transparent',
  },
  editButton: {
    height: 54,
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
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  arrowIconVendor: {
    position: 'absolute',
    right: 20,
  },
});

export default ProductDetails;
