import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { selectOrders, updateOrderStatus } from '../../store/orderSlice';

const VendorOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Customer Orders</AppText>
        <AppText style={styles.sub}>Manage store orders, shipping & fulfillments</AppText>
      </View>

      <View style={styles.list}>
        {orders.map((ord) => (
          <View key={ord.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <AppText style={styles.ordId}>{ord.id}</AppText>
              <View style={[styles.badge, ord.status === 'Delivered' ? styles.badgeSuccess : styles.badgePending]}>
                <AppText style={styles.badgeText}>{ord.status}</AppText>
              </View>
            </View>

            <AppText style={styles.prodName}>{ord.productName}</AppText>
            <AppText style={styles.customer}>Customer: {ord.customerName}</AppText>
            <AppText style={styles.address}>Shipping: {ord.address}</AppText>

            <View style={styles.footer}>
              <AppText style={styles.price}>${ord.price}</AppText>

              {ord.status === 'Pending' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.shipBtn}
                    onPress={() =>
                      dispatch(updateOrderStatus({ id: ord.id, status: 'Shipped' }))
                    }
                  >
                    <AppText style={styles.shipBtnText}>Ship Order</AppText>
                  </TouchableOpacity>
                </View>
              )}

              {ord.status === 'Shipped' && (
                <TouchableOpacity
                  style={styles.deliverBtn}
                  onPress={() =>
                    dispatch(updateOrderStatus({ id: ord.id, status: 'Delivered' }))
                  }
                >
                  <AppText style={styles.deliverBtnText}>Mark Delivered</AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whitebackgroundcolor,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.graybordercolor,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondary,
  },
  sub: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 2,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ordId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.secondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePending: {
    backgroundColor: Colors.pendingBG,
  },
  badgeSuccess: {
    backgroundColor: Colors.greenBG,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  prodName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 6,
  },
  customer: {
    fontSize: 13,
    color: Colors.black,
    marginTop: 4,
  },
  address: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.graybordercolor,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.secondary,
  },
  actionRow: {
    flexDirection: 'row',
  },
  shipBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  shipBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  deliverBtn: {
    backgroundColor: Colors.green,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deliverBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default VendorOrders;
