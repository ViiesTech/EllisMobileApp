import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { updateOrderStatus, selectOrders } from '../../store/orderSlice';
import VendorHeader from '../../components/VendorHeader';

const VendorOrderDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const routeOrder = route.params?.order;
  const orders = useSelector(selectOrders);

  // Look up order dynamically from Redux store to reflect real-time updates
  const order = orders.find(o => o.id === routeOrder?.id) || routeOrder;

  if (!order) {
    return (
      <View style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>Order not found.</AppText>
        </View>
      </View>
    );
  }

  const handleAccept = () => {
    dispatch(updateOrderStatus({ id: order.id, status: 'Processing' }));
    navigation.goBack();
  };

  const handleReject = () => {
    dispatch(updateOrderStatus({ id: order.id, status: 'Rejected' }));
    navigation.goBack();
  };

  const handleShip = () => {
    dispatch(updateOrderStatus({ id: order.id, status: 'Shipped' }));
    navigation.goBack();
  };

  const handleDeliver = () => {
    dispatch(updateOrderStatus({ id: order.id, status: 'Delivered' }));
    navigation.goBack();
  };

  const formattedId = order.id.startsWith('ord-')
    ? order.id.replace('ord-', '#')
    : `#${order.id}`;

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="ORDER DETAILS"
        goBack={true}
        homeHeader={false}
        notification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Info Section */}
        <View style={styles.topInfoRow}>
          <Image
            source={{
              uri:
                order.image ||
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
            }}
            style={styles.productImg}
          />

          <View style={styles.topInfoRight}>
            <AppText style={styles.orderNum}>Order {formattedId}</AppText>
            <AppText style={styles.orderPrice}>${order.price}</AppText>
            <AppText style={styles.orderItems}>
              {order.itemsInfo
                ? order.itemsInfo.split('-')[0].trim()
                : '1 Item'}
            </AppText>
          </View>
        </View>

        {/* Detailed Attribute Section */}
        <View style={styles.detailsSection}>
          {/* Product Name */}
          <AppText style={styles.sectionLabel}>Product Name</AppText>
          <AppText style={styles.sectionContent}>{order.productName}</AppText>

          {/* Customer Name */}
          <AppText style={styles.sectionLabel}>Customer Name</AppText>
          <AppText style={styles.sectionContent}>{order.customerName}</AppText>

          {/* Shipping Address */}
          <AppText style={styles.sectionLabel}>Shipping Address</AppText>
          <AppText style={styles.sectionContent}>
            {order.address || 'No shipping address provided.'}
          </AppText>
        </View>
      </ScrollView>

      {/* Dynamic Action Buttons at the Bottom */}
      <View style={styles.bottomButtonsContainer}>
        {(order.status === 'New' || order.status === 'Pending') && (
          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={handleAccept}
              activeOpacity={0.8}
            >
              <AppText style={styles.acceptBtnText}>Accept</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={handleReject}
              activeOpacity={0.8}
            >
              <AppText style={styles.rejectBtnText}>Reject</AppText>
            </TouchableOpacity>
          </View>
        )}

        {order.status === 'Processing' && (
          <TouchableOpacity
            style={styles.fullWidthBtn}
            onPress={handleShip}
            activeOpacity={0.8}
          >
            <AppText style={styles.fullWidthBtnText}>Ship Order</AppText>
            <Feather
              name="arrow-right"
              size={20}
              color="#000000"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}

        {order.status === 'Shipped' && (
          <TouchableOpacity
            style={styles.fullWidthBtn}
            onPress={handleDeliver}
            activeOpacity={0.8}
          >
            <AppText style={styles.fullWidthBtnText}>Mark Delivered</AppText>
            <Feather
              name="arrow-right"
              size={20}
              color="#000000"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}

        {order.status === 'Delivered' && (
          <View style={styles.statusBannerDelivered}>
            <Feather name="check-circle" size={18} color="#15803D" />
            <AppText style={styles.statusBannerTextDelivered}>
              Order Completed & Delivered
            </AppText>
          </View>
        )}

        {order.status === 'Rejected' && (
          <View style={styles.statusBannerRejected}>
            <Feather name="x-circle" size={18} color="#EB2022" />
            <AppText style={styles.statusBannerTextRejected}>
              Order Rejected
            </AppText>
          </View>
        )}
      </View>
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
    fontSize: 20,
    fontFamily: Fonts.regular,
    letterSpacing: 3,
    color: '#000000',
  },
  diamondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    width: 160,
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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },
  productImg: {
    width: 104,
    height: 104,
    borderRadius: 12,
    backgroundColor: Colors.textinputboxcolor,
  },
  topInfoRight: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
  },
  orderNum: {
    fontSize: 18,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 6,
  },
  orderPrice: {
    fontSize: 28,
    fontFamily: Fonts.regular,
    color: '#000000',
    marginBottom: 2,
  },
  orderItems: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
  },
  detailsSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#000000',
    fontWeight: '600',
    marginTop: 18,
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
  },
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  acceptBtn: {
    flex: 1,
    height: 54,
    backgroundColor: '#DBA83A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  acceptBtnText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectBtnText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  fullWidthBtn: {
    height: 54,
    backgroundColor: '#DBA83A',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidthBtnText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: '#000000',
    fontWeight: '700',
  },
  arrowIcon: {
    position: 'absolute',
    right: 20,
  },
  statusBannerDelivered: {
    height: 54,
    backgroundColor: '#DCFCE7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#15803D',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusBannerTextDelivered: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#15803D',
    fontWeight: '700',
  },
  statusBannerRejected: {
    height: 54,
    backgroundColor: '#FFE2E2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EB2022',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statusBannerTextRejected: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#EB2022',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: '#7C7C7C',
  },
});

export default VendorOrderDetails;
