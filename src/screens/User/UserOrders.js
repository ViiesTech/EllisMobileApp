import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';
import { useGetUserOrdersQuery } from '../../Services/UserServices';

const UserOrders = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Pending');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const tabs = ['Pending', 'Processing', 'Shipped', 'Completed'];

  const statusParam =
    activeTab === 'Pending'
      ? 'pending'
      : activeTab === 'Completed'
      ? 'delivered'
      : activeTab.toLowerCase();
  const {
    data: ordersData,
    isFetching,
    refetch,
  } = useGetUserOrdersQuery({
    status: statusParam,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const formatOrderTime = dateStr => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return 'Recently';
    }
  };

  const resolveProductImage = rawImage => {
    if (!rawImage) {
      return 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';
    }

    let imageUrlStr = '';
    if (Array.isArray(rawImage)) {
      imageUrlStr = rawImage[0] || '';
    } else if (typeof rawImage === 'string') {
      imageUrlStr = rawImage;
    }

    imageUrlStr = imageUrlStr.trim();
    if (imageUrlStr.startsWith('[') && imageUrlStr.endsWith(']')) {
      try {
        const parsed = JSON.parse(imageUrlStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          imageUrlStr = parsed[0];
        }
      } catch (e) {}
    }

    if (!imageUrlStr || typeof imageUrlStr !== 'string') {
      return 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80';
    }

    return imageUrlStr;
  };

  const mapApiOrder = apiOrder => {
    const items = apiOrder.items || [];
    const firstItem = items[0] || {};
    const rawImage = firstItem?.product?.images;
    const itemImage = resolveProductImage(rawImage);

    const itemsCount = items.length;
    const itemsInfoStr = `${itemsCount} Item${
      itemsCount > 1 ? 's' : ''
    } - ${items.map(it => it.name).join(', ')}`;

    const vendorFullName = apiOrder.vendor?.user
      ? `${apiOrder.vendor.user.name} ${
          apiOrder.vendor.user.last_name || ''
        }`.trim()
      : 'Bespoke Vendor';

    return {
      ...apiOrder,
      id: `ord-${apiOrder.id}`,
      image: itemImage,
      vendorName: vendorFullName,
      customerName: vendorFullName,
      itemsInfo: itemsInfoStr,
      price: apiOrder.total || apiOrder.subtotal || '0.00',
      productName: items.map(it => it.name).join(', ') || 'Bespoke Order',
      time: formatOrderTime(apiOrder.created_at),
    };
  };

  const rawOrders = ordersData?.data?.orders || [];
  const filteredOrders = rawOrders.map(mapApiOrder);

  const getBadgeColors = status => {
    const s = status.toLowerCase();
    if (s === 'new' || s === 'pending') {
      return { bg: '#FEF3C7', text: '#D97706' };
    } else if (s === 'processing') {
      return { bg: '#DBEAFE', text: '#155DFC' };
    } else if (s === 'shipped') {
      return { bg: '#E8FBCF', text: '#295C00' };
    } else {
      return { bg: '#DCFCE7', text: '#15803D' };
    }
  };

  const getStatusLabel = status => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'new' || s === 'pending') {
      return 'Pending';
    }
    if (s === 'delivered') {
      return 'Completed';
    }
    return status;
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader navigation={navigation} title="ORDERS" goBack={false} />

      {/* Tabs Row */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContent}
        >
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[
                    styles.tabButtonText,
                    isActive && styles.tabButtonTextActive,
                  ]}
                >
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#DBA83A']}
            tintColor="#DBA83A"
          />
        }
      >
        {isFetching && filteredOrders.length === 0 ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#DBA83A" />
          </View>
        ) : filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <AppText style={styles.emptyText}>
              No orders in {activeTab}.
            </AppText>
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {filteredOrders.map((item, index) => {
              const badgeColors = getBadgeColors(item.status);
              const displayOrderId = item.id.replace('ord-', '');
              return (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.orderRow}
                    onPress={() =>
                      navigation.navigate('UserOrderDetails', { order: item })
                    }
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={styles.orderImg}
                    />

                    <View style={styles.orderInfo}>
                      <AppText style={styles.orderTitle}>
                        Order #{displayOrderId}
                      </AppText>
                      <AppText style={styles.vendorName}>
                        {item.vendorName}
                      </AppText>
                      <AppText style={styles.itemsCount} numberOfLines={1}>
                        {item.itemsInfo}
                      </AppText>
                    </View>

                    <View style={styles.rightContainer}>
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: badgeColors.bg },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.statusBadgeText,
                            { color: badgeColors.text },
                          ]}
                        >
                          {getStatusLabel(item.status)}
                        </AppText>
                      </View>
                      <AppText style={styles.timeAgo}>{item.time}</AppText>
                    </View>

                    <View style={styles.arrowCircle}>
                      <Feather name="chevron-right" size={14} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                  {index < filteredOrders.length - 1 && (
                    <View style={styles.rowDivider} />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabsWrapper: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tabsScrollContent: {
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: '#000000',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  tabButtonActive: {
    backgroundColor: '#DBA83A',
    borderColor: '#DBA83A',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#000000',
  },
  tabButtonTextActive: {
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#8A8A8F',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    paddingHorizontal: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  orderImg: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    resizeMode: 'cover',
  },
  orderInfo: {
    flex: 1,
    marginLeft: 14,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  vendorName: {
    fontSize: 12,
    color: '#5D5D5D',
    marginTop: 4,
  },
  itemsCount: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 2,
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  timeAgo: {
    fontSize: 11,
    color: '#8E8E93',
    marginTop: 6,
  },
  arrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  loaderContainer: {
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserOrders;
