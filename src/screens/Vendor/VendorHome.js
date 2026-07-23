import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { selectProducts } from '../../store/productSlice';
import { selectOrders } from '../../store/orderSlice';
import VendorHeader from '../../components/VendorHeader';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 40 - 36) / 4; // 40 for screen padding, 36 for 3 gaps of 12

const VendorHome = ({ navigation }) => {
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);

  const getStatusBadge = status => {
    switch (status) {
      case 'New':
      case 'Pending':
        return { bg: '#F9EFCF', border: '#DBA83A', text: '#000000' };
      case 'Processing':
        return { bg: '#DBEAFE', border: '#155DFC', text: '#155DFC' };
      case 'Shipped':
        return { bg: '#E8FBCF', border: '#295C00', text: '#295C00' };
      case 'Delivered':
        return { bg: '#DCFCE7', border: '#15803D', text: '#15803D' };
      default:
        return { bg: '#F3F4F6', border: '#9CA3AF', text: '#4B5563' };
    }
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        homeHeader={true}
        notification={true}
        goBack={false}
      />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 4 Gold Stat Cards */}
        <View style={styles.statsContainer}>
          {/* Card 1 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="file-text" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>24</AppText>
            <AppText style={styles.statTitle}>Total{'\n'}Orders</AppText>
            <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>12%</AppText>
            </View>
          </View>

          {/* Card 2 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="shopping-bag" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>{products?.length || 16}</AppText>
            <AppText style={styles.statTitle}>Active{'\n'}Products</AppText>
            <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>8%</AppText>
            </View>
          </View>

          {/* Card 3 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="clock" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>{orders?.length || 7}</AppText>
            <AppText style={styles.statTitle}>Pending{'\n'}Orders</AppText>
            <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>16%</AppText>
            </View>
          </View>

          {/* Card 4 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="dollar-sign" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>
              $
              {totalRevenue > 0
                ? `${(totalRevenue / 1000).toFixed(1)}K`
                : '1.5K'}
            </AppText>
            <AppText style={styles.statTitle}>Total{'\n'}Revenue</AppText>
            <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>16%</AppText>
            </View>
          </View>
        </View>

        {/* Recent Orders Header */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>RECENT ORDERS</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate('VendorOrders')}
            activeOpacity={0.7}
          >
            <AppText style={styles.viewAllText}>View All</AppText>
          </TouchableOpacity>
        </View>

        {/* Recent Orders List Card */}
        <View style={styles.ordersBox}>
          {orders.slice(0, 5).map((ord, idx) => {
            const formattedId = ord.id.startsWith('ord-')
              ? ord.id.replace('ord-', '#')
              : `#${ord.id}`;
            const displayCount = orders.slice(0, 5).length;
            const badgeColors = getStatusBadge(ord.status);
            return (
              <TouchableOpacity
                key={ord.id}
                style={[
                  styles.orderItemRow,
                  idx < displayCount - 1 && styles.itemDivider,
                ]}
                onPress={() =>
                  navigation.navigate('VendorOrderDetails', { order: ord })
                }
                activeOpacity={0.7}
              >
                <Image
                  source={{
                    uri:
                      ord.image ||
                      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
                  }}
                  style={styles.orderImg}
                />

                <View style={styles.orderMidInfo}>
                  <AppText style={styles.orderNum}>Order {formattedId}</AppText>
                  <AppText style={styles.customerName}>
                    {ord.customerName}
                  </AppText>
                  <AppText style={styles.itemsSub}>
                    {ord.itemsInfo || `1 Item - $${ord.price}`}
                  </AppText>
                </View>

                <View style={styles.orderRightCol}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: badgeColors.bg,
                        borderColor: badgeColors.border,
                      },
                    ]}
                  >
                    <AppText
                      style={[
                        styles.statusBadgeText,
                        { color: badgeColors.text },
                      ]}
                    >
                      {ord.status}
                    </AppText>
                  </View>
                  <AppText style={styles.timeText}>
                    {ord.time || '1 hour ago'}
                  </AppText>

                  <View style={styles.arrowCircle}>
                    <Feather name="chevron-right" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },

  /* Metric Cards */
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    height: 135,
    width: CARD_WIDTH,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statVal: {
    fontSize: 22,
    fontFamily: 'serif',
    color: '#000000',
    marginTop: 4,
  },
  statTitle: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 13,
  },
  statGrowthBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statGrowth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
    paddingLeft: 2,
  },

  /* Recent Orders Section */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#000000',
    letterSpacing: 0.5,
  },
  viewAllText: {
    fontSize: 13,
    color: '#000000',
    textDecorationLine: 'underline',
  },
  ordersBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    paddingHorizontal: 14,
    marginBottom: 24,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderImg: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#Fafafa',
  },
  orderMidInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  orderNum: {
    fontSize: 13,
    fontFamily: 'serif',
    color: '#000000',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  itemsSub: {
    fontSize: 11,
    color: '#7C7C7C',
  },
  orderRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    backgroundColor: '#F9EFCF',
    borderWidth: 1,
    borderColor: '#DBA83A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  timeText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 6,
  },
  arrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    marginTop: 4,
  },
});

export default VendorHome;
