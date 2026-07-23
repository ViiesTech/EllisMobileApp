import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { selectOrders } from '../../store/orderSlice';
import VendorHeader from '../../components/VendorHeader';

const STATUS_TABS = ['New', 'Processing', 'Shipped', 'Delivered'];

const VendorOrders = ({ navigation }) => {
  const orders = useSelector(selectOrders);
  const [activeTab, setActiveTab] = useState('New');

  const filteredOrders = orders.filter((o) => {
    const status = o.status.toLowerCase();
    const tab = activeTab.toLowerCase();
    if (tab === 'new') {
      return status === 'new' || status === 'pending';
    }
    return status === tab;
  });

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
        title="ORDERS"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      {/* Tabs Row */}
      <View style={styles.tabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {STATUS_TABS.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}
              >
                <AppText
                  style={[styles.tabText, isActive && styles.tabTextActive]}
                >
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List Container */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          <View style={styles.ordersBox}>
            {filteredOrders.map((ord, index) => {
              const badgeColors = getStatusBadge(ord.status);
              const formattedId = ord.id.startsWith('ord-')
                ? ord.id.replace('ord-', '#')
                : `#${ord.id}`;

              return (
                <TouchableOpacity
                  key={ord.id}
                  style={[
                    styles.orderRow,
                    index < filteredOrders.length - 1 && styles.rowDivider,
                  ]}
                  onPress={() =>
                    navigation.navigate('VendorOrderDetails', { order: ord })
                  }
                  activeOpacity={0.8}
                >
                  <Image
                    source={{
                      uri:
                        ord.image ||
                        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
                    }}
                    style={styles.orderImage}
                  />

                  <View style={styles.orderMidCol}>
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
                      <Feather name="chevron-right" size={14} color="#FFFFFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="file-text" size={48} color="#DEDEDE" />
            <AppText style={styles.emptyText}>No orders in {activeTab}</AppText>
          </View>
        )}
      </ScrollView>
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
  tabsContainer: {
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },
  tabsScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tabChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: Colors.white,
  },
  tabChipActive: {
    backgroundColor: '#DBA83A',
    borderColor: '#DBA83A',
  },
  tabText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#000000',
  },
  tabTextActive: {
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  ordersBox: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    paddingHorizontal: 16,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: Colors.textinputboxcolor,
  },
  orderMidCol: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  orderNum: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '700',
    marginBottom: 2,
  },
  itemsSub: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
  },
  orderRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
  },
});

export default VendorOrders;
