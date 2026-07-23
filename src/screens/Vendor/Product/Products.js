import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../../config/Colors';
import Fonts from '../../../config/Fonts';
import AppText from '../../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { selectProducts } from '../../../store/productSlice';
import VendorHeader from '../../../components/VendorHeader';

const Products = ({ navigation }) => {
  const products = useSelector(selectProducts);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="PRODUCTS"
        goBack={handleBack}
        homeHeader={false}
        notification={false}
      />

      {/* Product List */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {products.map(prod => (
          <TouchableOpacity
            key={prod.id}
            style={styles.productCard}
            onPress={() =>
              navigation.navigate('ProductDetails', { product: prod })
            }
            activeOpacity={0.9}
          >
            <Image source={{ uri: prod.image }} style={styles.productImage} />

            <View style={styles.productInfo}>
              <AppText style={styles.productName} numberOfLines={1}>
                {prod.name}
              </AppText>
              <AppText style={styles.productDesc} numberOfLines={3}>
                {prod.description || 'No description available.'}
              </AppText>
            </View>

            <View style={styles.priceContainer}>
              <AppText style={styles.priceText}>${prod.price}</AppText>
              <AppText style={styles.priceUnit}>Per Meter</AppText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Add Product Button */}
      <View style={styles.bottomBtnContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddProduct')}
          activeOpacity={0.8}
        >
          <AppText style={styles.addButtonText}>Add New Product</AppText>
          <Feather
            name="arrow-right"
            size={20}
            color="#000000"
            style={styles.arrowIcon}
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  placeholderBtn: {
    width: 40,
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 22,
    fontFamily: Fonts.regular,
    letterSpacing: 4,
    color: '#000000',
  },
  diamondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    width: 140,
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100, // Space for bottom floating button
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  productImage: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: Colors.textinputboxcolor,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
    lineHeight: 15,
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 70,
  },
  priceText: {
    fontSize: 24,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  priceUnit: {
    fontSize: 9,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
    marginTop: 2,
  },
  bottomBtnContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  addButton: {
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
  addButtonText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
});

export default Products;
