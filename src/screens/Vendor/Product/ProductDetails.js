import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../../../config/Colors';
import Fonts from '../../../config/Fonts';
import CustomButton from '../../../components/CustomButton';
import AppText from '../../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectProducts } from '../../../store/productSlice';
import { selectRole } from '../../../store/authSlice';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../../components/VendorHeader';

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
      price: 180,
      rating: 4.8,
      reviews: 42,
      stock: 15,
      material: 'Pure Wool',
      description: 'Premium 100% Super 130s Italian Wool.',
      image:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
    };

  const [selectedFit, setSelectedFit] = useState('Slim Fit');
  const [qty, setQty] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: qty }));
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 2000);
  };

  if (isVendor) {
    // Determine a smart color name based on product name
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
          {/* Top Info Card Row */}
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

          {/* Details Section */}
          <View style={styles.detailsSection}>
            {/* Description */}
            <AppText style={styles.detailSectionHeader}>Description</AppText>
            <AppText style={styles.detailSectionContent}>
              {product.description ||
                'No description available for this product.'}
            </AppText>

            {/* Category */}
            <AppText style={styles.detailSectionHeader}>Category</AppText>
            <AppText style={styles.detailSectionContent}>
              {product.category}
            </AppText>

            {/* Stock */}
            <AppText style={styles.detailSectionHeader}>Stock</AppText>
            <AppText style={styles.detailSectionContent}>
              {product.stock > 0 ? `Available` : 'Out of Stock'}
            </AppText>

            {/* Color */}
            <AppText style={styles.detailSectionHeader}>Color</AppText>
            <AppText style={styles.detailSectionContent}>{colorVal}</AppText>

            {/* Material */}
            <AppText style={styles.detailSectionHeader}>Material</AppText>
            <AppText style={styles.detailSectionContent}>
              {product.material || 'Standard Fabric'}
            </AppText>
          </View>
        </ScrollView>

        {/* Bottom Edit Product Button */}
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
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <AppText style={styles.backText}>‹</AppText>
        </TouchableOpacity>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <AppText style={styles.category}>
                {product.category.toUpperCase()}
              </AppText>
              <AppText style={styles.name}>{product.name}</AppText>
            </View>
            <AppText style={styles.price}>${product.price}</AppText>
          </View>

          <View style={styles.ratingRow}>
            <AppText style={styles.star}>★ {product.rating}</AppText>
            <AppText style={styles.reviews}>
              ({product.reviews} customer reviews)
            </AppText>
            <View style={styles.stockBadge}>
              <AppText style={styles.stockText}>
                In Stock ({product.stock})
              </AppText>
            </View>
          </View>

          <AppText style={styles.sectionHeader}>
            DESCRIPTION & SPECIFICATIONS
          </AppText>
          <AppText style={styles.desc}>{product.description}</AppText>

          <View style={styles.specRow}>
            <View style={styles.specBox}>
              <AppText style={styles.specLabel}>Material</AppText>
              <AppText style={styles.specVal}>{product.material}</AppText>
            </View>
            <View style={styles.specBox}>
              <AppText style={styles.specLabel}>Weave</AppText>
              <AppText style={styles.specVal}>Super 130s</AppText>
            </View>
            <View style={styles.specBox}>
              <AppText style={styles.specLabel}>Origin</AppText>
              <AppText style={styles.specVal}>Italy</AppText>
            </View>
          </View>

          <AppText style={styles.sectionHeader}>SELECT FIT CONTOUR</AppText>
          <View style={styles.fitRow}>
            {['Slim Fit', 'Custom Tailored', 'Regular Fit'].map(fit => (
              <TouchableOpacity
                key={fit}
                style={[
                  styles.fitChip,
                  selectedFit === fit && styles.fitChipSelected,
                ]}
                onPress={() => setSelectedFit(fit)}
              >
                <AppText
                  style={[
                    styles.fitText,
                    selectedFit === fit && styles.fitTextSelected,
                  ]}
                >
                  {fit}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          <AppText style={styles.sectionHeader}>QUANTITY</AppText>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty(Math.max(1, qty - 1))}
            >
              <AppText style={styles.qtyBtnText}>-</AppText>
            </TouchableOpacity>
            <AppText style={styles.qtyText}>{qty}</AppText>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQty(qty + 1)}
            >
              <AppText style={styles.qtyBtnText}>+</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <CustomButton
          title={
            addedAlert
              ? '✓ Added to Cart!'
              : `Add to Cart • $${product.price * qty}`
          }
          onPress={handleAddToCart}
          variant={addedAlert ? 'secondary' : 'primary'}
          style={{ flex: 1, marginRight: 10 }}
        />
        <CustomButton
          title="Buy Now"
          onPress={() => {
            addToCart(product, qty);
            navigation.navigate('CartCheckout');
          }}
          variant="outline"
          style={{ width: 110 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 320,
    backgroundColor: Colors.textinputboxcolor,
  },
  backBtn: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 26,
    color: Colors.secondary,
    marginTop: -4,
  },
  body: {
    padding: 20,
  },
  category: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginLeft: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  star: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.star,
    marginRight: 6,
  },
  reviews: {
    fontSize: 12,
    color: Colors.lightblack,
    marginRight: 10,
  },
  stockBadge: {
    backgroundColor: Colors.greenBG,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.green,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.lightblack,
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: Colors.black,
    lineHeight: 22,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  specBox: {
    flex: 1,
    backgroundColor: Colors.whitebackgroundcolor,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  specLabel: {
    fontSize: 10,
    color: Colors.lightblack,
  },
  specVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 2,
  },
  fitRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  fitChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    marginRight: 10,
    backgroundColor: Colors.textinputboxcolor,
  },
  fitChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  fitText: {
    fontSize: 13,
    color: Colors.secondary,
    fontWeight: '600',
  },
  fitTextSelected: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.textinputboxcolor,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.secondary,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    marginHorizontal: 16,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  /* Vendor Specific Styles */
  safeAreaVendor: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  backBtnVendor: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  vendorTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  vendorTitleText: {
    fontSize: 20,
    fontFamily: Fonts.regular,
    letterSpacing: 3,
    color: '#000000',
  },
  diamondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    width: 160,
  },
  diamondLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DEDEDE',
  },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
  },
  placeholderBtn: {
    width: 40,
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
