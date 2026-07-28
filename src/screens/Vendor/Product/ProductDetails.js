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
import AppText from '../../../components/AppText';
import { useSelector } from 'react-redux';
import { selectProducts } from '../../../store/productSlice';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../../components/VendorHeader';
import CustomImageViewer from '../../../components/CustomImageViewer';

const ProductDetails = ({ route, navigation }) => {
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

  const getProductImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    // Mock multiple images for demo purpose if none exist
    if (product.category === 'Fabrics') {
      return [
        product.image,
        'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
      ];
    }
    return [
      product.image,
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80',
    ];
  };

  const images = getProductImages();
  const [isViewerVisible, setIsViewerVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

      <CustomImageViewer
        visible={isViewerVisible}
        images={images}
        imageIndex={currentImageIndex}
        onClose={() => setIsViewerVisible(false)}
        onImageIndexChange={(index) => setCurrentImageIndex(index)}
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
