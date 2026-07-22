import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import CustomButton from '../../components/CustomButton';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { selectProducts } from '../../store/productSlice';
import { selectOrders } from '../../store/orderSlice';
import { selectUser } from '../../store/authSlice';

const RECENT_ORDERS_DATA = [
  {
    id: '1',
    orderNum: '#34567',
    customer: 'Liam James',
    itemsInfo: '3 Items - $560',
    status: 'New',
    time: '45 mins ago',
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '2',
    orderNum: '#34567',
    customer: 'Liam James',
    itemsInfo: '3 Items - $560',
    status: 'Processing',
    time: '2 hours ago',
    image:
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '3',
    orderNum: '#34567',
    customer: 'Liam James',
    itemsInfo: '3 Items - $560',
    status: 'New',
    time: '45 mins ago',
    image:
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '4',
    orderNum: '#34567',
    customer: 'Liam James',
    itemsInfo: '3 Items - $560',
    status: 'New',
    time: '45 mins ago',
    image:
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: '5',
    orderNum: '#34567',
    customer: 'Liam James',
    itemsInfo: '3 Items - $560',
    status: 'New',
    time: '45 mins ago',
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
  },
];

const VendorHome = ({ navigation }) => {
  const products = useSelector(selectProducts);
  const orders = useSelector(selectOrders);
  const userProfile = useSelector(selectUser) || {};

  const totalRevenue = orders.reduce((sum, o) => sum + o.price, 0);

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.userRow}>
            <Image
              source={{
                uri:
                  userProfile.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              }}
              style={styles.userAvatar}
            />
            <View style={styles.userInfo}>
              <AppText style={styles.greetingText}>Good Morning 👋</AppText>
              <AppText style={styles.userName}>
                {userProfile.name || 'Alex Charlie'}
              </AppText>
            </View>
          </View>

          {/* Notification Button */}
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
            <Feather name="bell" size={20} color="#000000" />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
        </View>

        {/* 4 Gold Stat Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScrollContainer}
        >
          {/* Card 1 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="file-text" size={16} color="#000000" />
            </View>
            <AppText style={styles.statVal}>24</AppText>
            <AppText style={styles.statTitle}>Total{'\n'}Orders</AppText>
            <AppText style={styles.statGrowth}>↑ 12%</AppText>
          </View>

          {/* Card 2 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="shopping-bag" size={16} color="#000000" />
            </View>
            <AppText style={styles.statVal}>
              {products?.length || 16}
            </AppText>
            <AppText style={styles.statTitle}>Active{'\n'}Products</AppText>
            <AppText style={styles.statGrowth}>↑ 8%</AppText>
          </View>

          {/* Card 3 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="clock" size={16} color="#000000" />
            </View>
            <AppText style={styles.statVal}>{orders?.length || 7}</AppText>
            <AppText style={styles.statTitle}>Pending{'\n'}Orders</AppText>
            <AppText style={styles.statGrowth}>↑ 16%</AppText>
          </View>

          {/* Card 4 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="dollar-sign" size={16} color="#000000" />
            </View>
            <AppText style={styles.statVal}>
              ${totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(1)}K` : '1.5K'}
            </AppText>
            <AppText style={styles.statTitle}>Total{'\n'}Revenue</AppText>
            <AppText style={styles.statGrowth}>↑ 16%</AppText>
          </View>
        </ScrollView>

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
          {RECENT_ORDERS_DATA.map((ord, idx) => (
            <TouchableOpacity
              key={ord.id}
              style={[
                styles.orderItemRow,
                idx < RECENT_ORDERS_DATA.length - 1 && styles.itemDivider,
              ]}
              onPress={() => navigation.navigate('VendorOrders')}
              activeOpacity={0.7}
            >
              <Image source={{ uri: ord.image }} style={styles.orderImg} />

              <View style={styles.orderMidInfo}>
                <AppText style={styles.orderNum}>Order {ord.orderNum}</AppText>
                <AppText style={styles.customerName}>{ord.customer}</AppText>
                <AppText style={styles.itemsSub}>{ord.itemsInfo}</AppText>
              </View>

              <View style={styles.orderRightCol}>
                <View style={styles.statusBadge}>
                  <AppText style={styles.statusBadgeText}>
                    {ord.status}
                  </AppText>
                </View>
                <AppText style={styles.timeText}>{ord.time}</AppText>

                <View style={styles.arrowCircle}>
                  <Feather name="chevron-right" size={16} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Product Button */}
        <View style={styles.btnContainer}>
          <CustomButton
            title="Add New Product"
            onPress={() => navigation.navigate('AddProduct')}
          />
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#DBA83A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4D',
  },

  /* Metric Cards */
  statsScrollContainer: {
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: 96,
    height: 140,
    backgroundColor: '#DBA83A',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
  statGrowth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
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
