import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../../config/Colors';
import Fonts from '../../config/Fonts';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { updateOrderStatus, selectOrders } from '../../store/orderSlice';
import VendorHeader from '../../components/VendorHeader';
import { useUpdateVendorOrderStatusMutation, useGetSingleVendorOrderQuery } from '../../Services/VendorServices';

const VendorOrderDetails = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const routeOrder = route.params?.order;
  const routeOrderId = route.params?.orderId || routeOrder?.id;
  const orders = useSelector(selectOrders);
  const [updatingAction, setUpdatingAction] = useState(null);
  const [updateOrderStatusApi] = useUpdateVendorOrderStatusMutation();

  const { data: apiOrderResponse, isLoading: isOrderLoading } = useGetSingleVendorOrderQuery(
    routeOrderId,
    { skip: !routeOrderId }
  );

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
    };
  };

  // Look up order dynamically from Redux store to reflect real-time updates
  const reduxOrder = orders.find(o => String(o.id) === String(routeOrderId));
  const fetchedOrder = apiOrderResponse?.data ? mapApiOrderToUi(apiOrderResponse.data) : null;
  const order = reduxOrder || fetchedOrder || routeOrder;

  if (!order) {
    if (isOrderLoading) {
      return (
        <View style={styles.safeArea}>
          <VendorHeader
            navigation={navigation}
            title="ORDER DETAILS"
            goBack={true}
            homeHeader={false}
            notification={false}
          />
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        </View>
      );
    }
    return (
      <View style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <AppText style={styles.emptyText}>Order not found.</AppText>
        </View>
      </View>
    );
  }

  const handleUpdateStatus = async (newStatus, actionName) => {
    if (updatingAction) return;
    setUpdatingAction(actionName);
    try {
      await updateOrderStatusApi({
        id: order.id,
        status: newStatus.toLowerCase(),
      }).unwrap();
      dispatch(updateOrderStatus({ id: order.id, status: newStatus }));
      navigation.goBack();
    } catch (error) {
      console.log('Error updating order status:', error);
    } finally {
      setUpdatingAction(null);
    }
  };

  // const handleAccept = () => handleUpdateStatus('Processing', 'accept');
  // const handleReject = () => handleUpdateStatus('Rejected', 'reject');
  const handleProcess = () => handleUpdateStatus('Processing', 'processing');
  const handleShip = () => handleUpdateStatus('Shipped', 'ship');
  const handleDeliver = () => handleUpdateStatus('Delivered', 'deliver');

  const formattedId = order.id.startsWith('ord-')
    ? order.id.replace('ord-', '#')
    : `#${order.id}`;

  console.log('order:->', order);
  console.log('routeOrder:->', routeOrder);
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
        {(order.status === 'New' ||
          order.status === 'Pending' ||
          order.status?.toLowerCase() === 'pending') && (
          <TouchableOpacity
            style={styles.fullWidthBtn}
            onPress={handleProcess}
            activeOpacity={0.8}
            disabled={!!updatingAction}
          >
            {updatingAction === 'processing' ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <>
                <AppText style={styles.fullWidthBtnText}>Processing</AppText>
                <Feather
                  name="arrow-right"
                  size={20}
                  color="#000000"
                  style={styles.arrowIcon}
                />
              </>
            )}
          </TouchableOpacity>
        )}

        {order.status === 'Processing' && (
          <TouchableOpacity
            style={styles.fullWidthBtn}
            onPress={handleShip}
            activeOpacity={0.8}
            disabled={!!updatingAction}
          >
            {updatingAction === 'ship' ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <>
                <AppText style={styles.fullWidthBtnText}>Ship Order</AppText>
                <Feather
                  name="arrow-right"
                  size={20}
                  color="#000000"
                  style={styles.arrowIcon}
                />
              </>
            )}
          </TouchableOpacity>
        )}

        {order.status === 'Shipped' && (
          <TouchableOpacity
            style={styles.fullWidthBtn}
            onPress={handleDeliver}
            activeOpacity={0.8}
            disabled={!!updatingAction}
          >
            {updatingAction === 'deliver' ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <>
                <AppText style={styles.fullWidthBtnText}>
                  Mark Delivered
                </AppText>
                <Feather
                  name="arrow-right"
                  size={20}
                  color="#000000"
                  style={styles.arrowIcon}
                />
              </>
            )}
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
