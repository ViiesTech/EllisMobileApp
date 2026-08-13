import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectCart } from '../../store/productSlice';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';
import {
  useLazyUserProductsQuery,
  useUserCategoriesQuery,
} from '../../Services/UserServices';

const Shop = ({ navigation }) => {
  const cart = useSelector(selectCart);
  const cartTotalItems = cart.length;

  // Dynamic Categories Fetch
  const { data: categoriesData } = useUserCategoriesQuery();
  const categoriesList = categoriesData?.data || [];
  const categories = ['All', ...categoriesList.map(cat => cat.name)];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [productsList, setProductsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [triggerGetProducts, { isFetching }] = useLazyUserProductsQuery();

  const fetchProductsList = async (
    pageNumber,
    isRefresh = false,
    categoryName = selectedCategory,
  ) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const categoryFilter = categoryName === 'All' ? undefined : categoryName;
      const res = await triggerGetProducts({
        page: pageNumber,
        limit: 10,
        category: categoryFilter,
      }).unwrap();

      const newProducts = res?.data || [];

      if (newProducts.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isRefresh) {
        setProductsList(newProducts);
        setPage(1);
      } else {
        setProductsList(prev => [...prev, ...newProducts]);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log('Error fetching products:', err);
      setHasMore(false);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setHasMore(true);
    fetchProductsList(1, true, selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const onRefresh = () => {
    setHasMore(true);
    fetchProductsList(1, true, selectedCategory);
  };

  const onLoadMore = () => {
    if (!loadingMore && !isFetching && hasMore) {
      fetchProductsList(page + 1, false, selectedCategory);
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#DBA83A" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isFetching) return null;
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name="shopping-bag"
          size={48}
          color="#DEDEDE"
          style={styles.emptyIcon}
        />
        <AppText style={styles.emptyText}>
          No products found in this category.
        </AppText>
      </View>
    );
  };

  if (isFetching && productsList.length === 0 && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <VendorHeader navigation={navigation} title="SHOP" goBack={false} />
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#DBA83A" />
        </View>
      </View>
    );
  }

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

      {/* Products Grid using FlatList for Pagination */}
      <FlatList
        data={productsList}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const price = item.price_per_meter || item.price || '0.00';
          const rawImage = item.image_url || item.image;
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
          const imageUrl =
            singleImage ||
            'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';
          return (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() =>
                navigation.navigate('ProductDetails', { product: item })
              }
              activeOpacity={0.9}
            >
              <Image
                source={{
                  uri: imageUrl,
                }}
                style={styles.gridItemImage}
                resizeMode="cover"
              />
              <AppText style={styles.gridItemName} numberOfLines={1}>
                {item.name}
              </AppText>
              <AppText style={styles.gridItemPrice}>${price}</AppText>
            </TouchableOpacity>
          );
        }}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#DBA83A']}
            tintColor="#DBA83A"
          />
        }
      />

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
  categoriesWrapper: {
    marginVertical: 14,
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
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 100,
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
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#8A8A8F',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
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
