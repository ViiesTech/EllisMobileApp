import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectProducts, selectCart } from '../../store/productSlice';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';

const Shop = ({ navigation }) => {
  const products = useSelector(selectProducts);
  const cart = useSelector(selectCart);

  const categories = ['All', 'Cotton', 'Wool', 'Silk Blend', 'Merino Wool'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const cartTotalItems = cart.reduce((acc, i) => acc + i.qty, 0);

  const filteredProducts = products.filter(prod => {
    if (selectedCategory === 'All') return true;
    if (!prod.material) return false;

    const mat = prod.material.toLowerCase();
    const cat = selectedCategory.toLowerCase();

    // Smart match for multi-word categories
    if (cat === 'silk blend') {
      return mat.includes('silk') || mat.includes('blend');
    }
    if (cat === 'merino wool') {
      return mat.includes('merino') || mat.includes('wool');
    }
    return mat.includes(cat);
  });

  return (
    <View style={styles.safeArea}>
      <VendorHeader navigation={navigation} title="SHOP" goBack={false} />

      {/* Horizontal Scrollable Categories */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryTab,
                  isActive && styles.categoryTabActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>
              No products found in this category.
            </AppText>
          </View>
        ) : (
          <View style={styles.grid}>
            {filteredProducts.map(prod => (
              <TouchableOpacity
                key={prod.id}
                style={styles.gridItem}
                onPress={() =>
                  navigation.navigate('ProductDetails', { product: prod })
                }
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: prod.image }}
                  style={styles.gridItemImage}
                  resizeMode="cover"
                />
                <AppText style={styles.gridItemName}>{prod.name}</AppText>
                <AppText style={styles.gridItemPrice}>${prod.price}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoriesWrapper: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    marginRight: 10,
  },
  categoryTabActive: {
    backgroundColor: '#DBA83A',
    borderColor: '#DBA83A',
  },
  categoryText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  categoryTextActive: {
    color: '#000000',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  gridItem: {
    width: '47%',
    marginBottom: 24,
    alignItems: 'center',
  },
  gridItemImage: {
    width: '100%',
    height: 200,
    borderRadius: 0,
    backgroundColor: '#F5F5F5',
  },
  gridItemName: {
    fontSize: 14,
    color: '#000000',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  gridItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 15,
    color: '#8A8A8F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  floatingCartBtn: {
    position: 'absolute',
    bottom: 24,
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
});

export default Shop;
