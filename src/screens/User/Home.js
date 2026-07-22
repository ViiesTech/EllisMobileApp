import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import Colors from '../../config/Colors';
import { ProductCard } from '../../components/ProductCard';
import AppText from '../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { selectProducts, selectCart, addToCart } from '../../store/productSlice';
import { selectTailors } from '../../store/bookingSlice';

const CATEGORIES = ['All', 'Suits', 'Fabrics', 'Shirts', 'Trousers'];

const Home = ({ navigation }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const tailors = useSelector(selectTailors);
  const cart = useSelector(selectCart);
  const [selectedCat, setSelectedCat] = useState('All');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartTotalItems = cart.reduce((acc, i) => acc + i.qty, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTextCol}>
          <AppText style={styles.bannerSub}>BESPOKE APPAREL</AppText>
          <AppText style={styles.bannerTitle}>Custom Fit & Premium Fabrics</AppText>
          <TouchableOpacity
            style={styles.bannerBtn}
            onPress={() => navigation.navigate('SelectedLandscaper', { tailor: tailors[0] })}
          >
            <AppText style={styles.bannerBtnText}>Book Doorstep Tailor ›</AppText>
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&auto=format&fit=crop&q=80' }}
          style={styles.bannerImg}
        />
      </View>

      {/* Search & Cart Header */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <AppText style={styles.searchIcon}>🔍</AppText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search suits, fabrics, shirts..."
            placeholderTextColor={Colors.gray}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.cartIconBtn} onPress={() => navigation.navigate('Cart')}>
          <AppText style={styles.cartIcon}>🛍️</AppText>
          {cartTotalItems > 0 && (
            <View style={styles.cartBadge}>
              <AppText style={styles.cartBadgeText}>{cartTotalItems}</AppText>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Categories Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCat === cat && styles.catChipActive]}
            onPress={() => setSelectedCat(cat)}
          >
            <AppText
              style={[
                styles.catText,
                selectedCat === cat && styles.catTextActive,
              ]}
            >
              {cat}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Section 1: Featured Products Grid */}
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>Featured Collections</AppText>
        <AppText style={styles.sectionCount}>{filteredProducts.length} items</AppText>
      </View>

      <View style={styles.grid}>
        {filteredProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onPress={(p) => navigation.navigate('ProductDetails', { product: p })}
            onAddToCart={(p) => dispatch(addToCart({ product: p, quantity: 1 }))}
          />
        ))}
      </View>

      {/* Section 2: Recommended Tailors Banner */}
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>Master Tailors Near You</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      >
        {tailors.map((tailor) => (
          <TouchableOpacity
            key={tailor.id}
            style={styles.tailorMiniCard}
            onPress={() => navigation.navigate('SelectedLandscaper', { tailor })}
          >
            <Image source={{ uri: tailor.image }} style={styles.tailorMiniImg} />
            <AppText style={styles.tailorMiniName} numberOfLines={1}>
              {tailor.name}
            </AppText>
            <AppText style={styles.tailorMiniSub}>{tailor.experience}</AppText>
            <View style={styles.tailorMiniPriceRow}>
              <AppText style={styles.tailorMiniPrice}>From ${tailor.priceStarting}</AppText>
              <AppText style={styles.tailorMiniRating}>★ {tailor.rating}</AppText>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  banner: {
    backgroundColor: Colors.secondary,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  bannerSub: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 4,
    lineHeight: 24,
  },
  bannerBtn: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  bannerImg: {
    width: 90,
    height: 100,
    borderRadius: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondary,
  },
  cartIconBtn: {
    width: 44,
    height: 44,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  cartIcon: {
    fontSize: 18,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primaryDark,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
  },
  catScroll: {
    marginTop: 16,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  catChipActive: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  catText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
  },
  catTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.secondary,
  },
  sectionCount: {
    fontSize: 12,
    color: Colors.lightblack,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  tailorMiniCard: {
    width: 140,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  tailorMiniImg: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 6,
  },
  tailorMiniName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  tailorMiniSub: {
    fontSize: 11,
    color: Colors.lightblack,
    marginTop: 2,
  },
  tailorMiniPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  tailorMiniPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  tailorMiniRating: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.star,
  },
});

export default Home;
