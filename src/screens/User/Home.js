import React from 'react';
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
import { selectUser } from '../../store/authSlice';
import Feather from 'react-native-vector-icons/Feather';
import { AppImages } from '../../assets/images/AppImages';

const Home = ({ navigation }) => {
  const products = useSelector(selectProducts);
  const cart = useSelector(selectCart);
  const userProfile = useSelector(selectUser) || {};

  const cartTotalItems = cart.reduce((acc, i) => acc + i.qty, 0);

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header row */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri:
                  userProfile.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.headerAvatar}
            />
            <View style={styles.headerTextCol}>
              <AppText style={styles.headerGreeting}>Good Morning 👋</AppText>
              <AppText style={styles.headerName}>
                {userProfile.name || 'Alex Charlie'}
              </AppText>
            </View>
          </View>
          <TouchableOpacity style={styles.headerBellBtn} activeOpacity={0.7}>
            <Feather name="bell" size={22} color="#000000" />
            <View style={styles.bellBadgeDot} />
          </TouchableOpacity>
        </View>

        {/* Tailoring Service Banner */}
        <TouchableOpacity
          style={styles.bannerCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Tailors')}
        >
          <Image
            source={AppImages.exploreTailors}
            style={styles.bannerBgImg}
            resizeMode="cover"
          />
          <View style={styles.bannerContent}>
            <AppText style={styles.bannerTitleText}>
              Tailoring{'\n'}Service
            </AppText>
            <TouchableOpacity
              style={styles.bannerExploreBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Tailors')}
            >
              <AppText style={styles.bannerExploreText}>Explore</AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* N E W   A R R I V A L Section */}
        <View style={styles.newArrivalSection}>
          <AppText style={styles.newArrivalText}>N E W A R R I V A L</AppText>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.diamond} />
            <View style={styles.dividerLine} />
          </View>
        </View>

        {/* Grid Products */}
        <View style={styles.grid}>
          {products.map(prod => (
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
              />
              <AppText style={styles.gridItemName}>{prod.name}</AppText>
              <AppText style={styles.gridItemPrice}>${prod.price}</AppText>
            </TouchableOpacity>
          ))}
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
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
  },
  headerTextCol: {
    marginLeft: 12,
  },
  headerGreeting: {
    fontSize: 13,
    color: '#8A8A8F',
    fontWeight: '400',
  },
  headerName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    marginTop: 2,
  },
  headerBellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: Colors.primary,
  },
  bellBadgeDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.redDot,
  },
  bannerCard: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#DBA83A',
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  bannerBgImg: {
    position: 'absolute',
    right: 0,
    width: '100%',
    height: '100%',
  },
  bannerContent: {
    position: 'absolute',
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    width: '45%',
    zIndex: 2,
  },
  bannerTitleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    lineHeight: 30,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  bannerExploreBtn: {
    marginTop: 14,
    backgroundColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerExploreText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  newArrivalSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
  },
  newArrivalText: {
    fontSize: 18,
    letterSpacing: 4,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '400',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
    marginTop: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  diamond: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderColor: '#DBA83A',
    backgroundColor: Colors.white,
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 30,
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

export default Home;
