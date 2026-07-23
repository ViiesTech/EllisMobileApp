import React from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { useSelector } from 'react-redux';
import { selectOrders } from '../../store/orderSlice';
import VendorHeader from '../../components/VendorHeader';

const UserOrders = ({ navigation }) => {
  const orders = useSelector(selectOrders);

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="MY ORDERS"
        goBack={false}
        homeHeader={false}
        notification={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No orders placed yet.</AppText>
            </View>
          ) : (
            orders.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <AppText style={styles.productName} numberOfLines={1}>
                    {item.productName}
                  </AppText>
                  <View style={styles.badgeActive}>
                    <AppText style={styles.badgeText}>{item.status}</AppText>
                  </View>
                </View>

                <View style={styles.metaRow}>
                  <AppText style={styles.meta}>
                    Order ID: {item.id} • {item.date}
                  </AppText>
                  <AppText style={styles.price}>${item.price}</AppText>
                </View>

                <AppText style={styles.addressText}>
                  Shipping to: {item.address}
                </AppText>
              </View>
            ))
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
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  list: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 15,
    color: '#8A8A8F',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
    flex: 1,
    marginRight: 10,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  badgeActive: {
    backgroundColor: Colors.greenBG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.green,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  meta: {
    fontSize: 12,
    color: Colors.lightblack,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  addressText: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 8,
  },
});

export default UserOrders;
