import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {
  useGetVendorDashboardQuery,
  useGetVendorOrdersQuery,
  useGetVendorNotificationsQuery,
} from '../../Services/VendorServices';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 40 - 36) / 4; // 40 for screen padding, 36 for 3 gaps of 12

const VendorHome = ({ navigation }) => {
  const { data: dashboardResponse } = useGetVendorDashboardQuery();
  const dashboardData = dashboardResponse?.data;

  const { data: ordersResponse, isFetching } = useGetVendorOrdersQuery({});
  const apiOrders = ordersResponse?.data || [];

  const { data: notificationsData } = useGetVendorNotificationsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const notificationsList = Array.isArray(notificationsData?.data)
    ? notificationsData.data
    : Array.isArray(notificationsData)
    ? notificationsData
    : [];

  const hasUnreadNotifications = notificationsList.some(item => {
    if (!item) return false;
    if (
      item.is_read === false ||
      item.is_read === 0 ||
      item.is_read === 'false' ||
      item.is_read === '0'
    ) {
      return true;
    }
    if (
      item.is_read === true ||
      item.is_read === 1 ||
      item.is_read === 'true' ||
      item.is_read === '1'
    ) {
      return false;
    }
    return item.read_at === null || item.status === 'unread';
  });

  const formatTime = createdAt => {
    if (!createdAt) return '1 hour ago';
    const diffMs = new Date() - new Date(createdAt);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const mapApiOrderToUi = apiOrder => {
    if (!apiOrder) return null;
    const idStr = String(apiOrder.id);
    let uiStatus = 'Pending';
    if (apiOrder.status) {
      uiStatus =
        apiOrder.status.charAt(0).toUpperCase() + apiOrder.status.slice(1);
    }
    const firstItem = apiOrder.items?.[0];
    const productName = firstItem?.product_name || 'Product';
    const productImage =
      firstItem?.product?.image ||
      firstItem?.product_image ||
      firstItem?.image ||
      null;
    const itemsCount = apiOrder.items?.length || 1;
    const itemsInfo = `${itemsCount} Item${itemsCount > 1 ? 's' : ''} - $${
      apiOrder.total
    }`;

    const customerName = apiOrder.user
      ? [apiOrder.user.name, apiOrder.user.last_name]
          .filter(Boolean)
          .join(' ')
          .trim() || 'Customer'
      : 'Customer';

    return {
      id: idStr,
      status: uiStatus,
      price: Number(apiOrder.total),
      itemsInfo,
      productName,
      customerName,
      address: [
        apiOrder.shipping_address,
        apiOrder.city,
        apiOrder.state,
        apiOrder.zip_code,
      ]
        .filter(Boolean)
        .join(', '),
      image: productImage,
      time: formatTime(apiOrder.created_at),
      created_at: formatTime(apiOrder.created_at),
    };
  };

  const orders = apiOrders.map(mapApiOrderToUi).filter(Boolean);

  const totalOrdersVal = dashboardData?.total_orders ?? '0';
  const activeProductsVal = dashboardData?.active_products ?? '0';
  const pendingOrdersVal = dashboardData?.pending_orders ?? '0';
  const revenueVal = dashboardData?.total_revenue || 0;
  const displayRevenue =
    revenueVal >= 1000
      ? `${(revenueVal / 1000).toFixed(1)}K`
      : String(revenueVal);

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

  console.log('dashboardResponse:-', dashboardResponse);
  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        homeHeader={true}
        notification={() => navigation.navigate('VendorNotifications')}
        showBadge={hasUnreadNotifications}
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
            <AppText style={styles.statVal}>{totalOrdersVal}</AppText>
            <AppText style={styles.statTitle}>Total{'\n'}Orders</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>12%</AppText>
            </View> */}
          </View>

          {/* Card 2 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="shopping-bag" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>{activeProductsVal}</AppText>
            <AppText style={styles.statTitle}>Active{'\n'}Products</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>8%</AppText>
            </View> */}
          </View>

          {/* Card 3 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="clock" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>{pendingOrdersVal}</AppText>
            <AppText style={styles.statTitle}>Pending{'\n'}Orders</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>16%</AppText>
            </View> */}
          </View>

          {/* Card 4 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="dollar-sign" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>${displayRevenue}</AppText>
            <AppText style={styles.statTitle}>Total{'\n'}Revenue</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>16%</AppText>
            </View> */}
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
          {isFetching ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#DBA83A" />
            </View>
          ) : orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No recent orders</AppText>
            </View>
          ) : (
            orders.slice(0, 5).map((ord, idx) => {
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
                    <AppText style={styles.orderNum}>
                      Order {formattedId}
                    </AppText>
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
            })
          )}
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
  loaderContainer: {
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#7C7C7C',
  },
});

export default VendorHome;
