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

const ProductDetails = ({ route, navigation }) => {
  const product = route.params?.product;
  console.log('product:-', product);
  const [deleteProductMutation, { isLoading: isDeleting }] =
    useDeleteProductMutation();

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

  const priceVal = product?.price_per_meter || product?.price || '0';
  const stockVal =
    product?.available_stock !== undefined
      ? product.available_stock
      : product?.stock || 0;
  const materialVal = product?.material || 'Standard Fabric';
  const colorVal = product?.color || 'Olive Green';

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
            {isAvailable ? 'Available' : 'Out of Stock'}
          </AppText>

          <AppText style={styles.detailSectionHeader}>Color</AppText>
          <AppText style={styles.detailSectionContent}>{colorVal}</AppText>

          <AppText style={styles.detailSectionHeader}>Material</AppText>
          <AppText style={styles.detailSectionContent}>{materialVal}</AppText>
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
});

export default ProductDetails;
