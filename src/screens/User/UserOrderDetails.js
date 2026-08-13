import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';

const UserOrderDetails = ({ route, navigation }) => {
  const { order } = route.params;

  const displayOrderId = order.id.replace('ord-', '');
  const itemsCountText = order.itemsInfo
    ? order.itemsInfo.split(' - ')[0]
    : '1 Item';
  const vendorName =
    order.customerName === 'Liam James' ? 'Andrew Ainsly' : order.customerName;
  const isPickup = order.shipping_method?.toLowerCase() === 'pickup';

  return (
    <View style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={24} color="#000000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <AppText style={styles.headerTitle}>ORDER DETAILS</AppText>
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <View style={styles.diamond} />
            <View style={styles.dividerLine} />
          </View>
        </View>
        <View style={styles.headerRightSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Header Summary Card */}
        <View style={styles.summaryCard}>
          <Image source={{ uri: order.image }} style={styles.summaryImg} />
          <View style={styles.summaryTextContainer}>
            <AppText style={styles.orderIdText}>
              Order #{displayOrderId}
            </AppText>
            <AppText style={styles.priceText}>${order.price}</AppText>
            <AppText style={styles.itemsText}>{itemsCountText}</AppText>
          </View>
        </View>

        {/* Detailed Description Fields */}
        <View style={styles.detailsBlock}>
          <AppText style={styles.detailLabel}>Ordered Items</AppText>
          <View style={styles.itemsContainer}>
            {(order.items || []).map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <AppText style={styles.itemNameText}>
                  {item.name || 'Item'}
                </AppText>
                <AppText style={styles.itemQtyText}>
                  x{item.quantity || 1}
                </AppText>
              </View>
            ))}
          </View>

          <AppText style={styles.detailLabel}>Vendor Name</AppText>
          <AppText style={styles.detailValue}>{vendorName}</AppText>

          {isPickup ? (
            <>
              <AppText style={styles.detailLabel}>Store Address</AppText>
              <AppText style={styles.detailValue}>
                {order.vendor?.address || 'N/A'}
                {order.vendor?.city ? `, ${order.vendor.city}` : ''}
              </AppText>
            </>
          ) : (
            <>
              <AppText style={styles.detailLabel}>Delivery Time</AppText>
              <AppText style={styles.detailValue}>4 to 5 Days</AppText>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 40,
    marginBottom: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    letterSpacing: 4,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontWeight: '400',
    textAlign: 'center',
  },
  headerRightSpacer: {
    width: 44,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 140,
    marginTop: 8,
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
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginHorizontal: 8,
  },
  contentContainer: {
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  summaryImg: {
    width: 110,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    resizeMode: 'cover',
  },
  summaryTextContainer: {
    flex: 1,
    marginLeft: 20,
  },
  orderIdText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  priceText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginTop: 6,
  },
  itemsText: {
    fontSize: 12,
    color: '#8A8A8F',
    marginTop: 4,
  },
  detailsBlock: {
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 13,
    color: '#8A8A8F',
    marginBottom: 26,
    lineHeight: 18,
  },
  itemsContainer: {
    marginBottom: 26,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EAEAEA',
  },
  itemNameText: {
    fontSize: 13,
    color: '#8A8A8F',
    flex: 1,
  },
  itemQtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 10,
  },
});

export default UserOrderDetails;
