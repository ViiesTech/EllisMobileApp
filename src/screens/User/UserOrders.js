import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectOrders } from '../../store/orderSlice';
import Feather from 'react-native-vector-icons/Feather';
import VendorHeader from '../../components/VendorHeader';

const UserOrders = ({ navigation }) => {
  const orders = useSelector(selectOrders);
  const [activeTab, setActiveTab] = useState('New');

  const tabs = ['New', 'Processing', 'Shipped', 'Delivered'];

  const getFilteredOrders = () => {
    return orders.filter(order => {
      const status = order.status.toLowerCase();
      if (activeTab === 'New') {
        return status === 'new' || status === 'pending';
      }
      return status === activeTab.toLowerCase();
    });
  };

  const filteredOrders = getFilteredOrders();

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
      >
        {filteredOrders.length === 0 ? (
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
                      <AppText style={styles.customerName}>
                        {item.customerName}
                      </AppText>
                      <AppText style={styles.itemsCount}>
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
                          {item.status}
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
  customerName: {
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
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
});

export default UserOrders;
