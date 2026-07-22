import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../../config/Colors';
import AppText from '../../../components/AppText';
import { useSelector } from 'react-redux';
import { selectBookings } from '../../../store/bookingSlice';
import { selectOrders } from '../../../store/orderSlice';

const UserBookings = () => {
  const bookings = useSelector(selectBookings);
  const orders = useSelector(selectOrders);
  const [activeTab, setActiveTab] = useState('BOOKINGS');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>My Appointments & Orders</AppText>
        <AppText style={styles.sub}>Track your bespoke fitting appointments and fabric orders</AppText>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'BOOKINGS' && styles.tabActive]}
            onPress={() => setActiveTab('BOOKINGS')}
          >
            <AppText style={[styles.tabText, activeTab === 'BOOKINGS' && styles.tabTextActive]}>
              Tailor Appointments ({bookings.length})
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ORDERS' && styles.tabActive]}
            onPress={() => setActiveTab('ORDERS')}
          >
            <AppText style={[styles.tabText, activeTab === 'ORDERS' && styles.tabTextActive]}>
              Fabric Orders ({orders.length})
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.list}>
        {activeTab === 'BOOKINGS' &&
          bookings.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <AppText style={styles.serviceName}>{item.serviceName}</AppText>
                <View style={[styles.badge, item.status === 'Pending' ? styles.badgePending : styles.badgeActive]}>
                  <AppText style={styles.badgeText}>{item.status}</AppText>
                </View>
              </View>
              <AppText style={styles.tailorName}>Tailor: {item.tailorName}</AppText>

              <View style={styles.metaRow}>
                <AppText style={styles.meta}>📅 {item.date} at {item.time}</AppText>
                <AppText style={styles.price}>${item.price}</AppText>
              </View>

              <View style={styles.measurementsBox}>
                <AppText style={styles.mTitle}>MEASUREMENTS SUBMITTED:</AppText>
                <AppText style={styles.mText}>
                  Chest: {item.measurements?.chest || '40 in'} | Waist: {item.measurements?.waist || '32 in'} | Shoulder: {item.measurements?.shoulder || '18 in'}
                </AppText>
              </View>
            </View>
          ))}

        {activeTab === 'ORDERS' &&
          orders.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <AppText style={styles.serviceName}>{item.productName}</AppText>
                <View style={styles.badgeActive}>
                  <AppText style={styles.badgeText}>{item.status}</AppText>
                </View>
              </View>

              <View style={styles.metaRow}>
                <AppText style={styles.meta}>Order ID: {item.id} • {item.date}</AppText>
                <AppText style={styles.price}>${item.price}</AppText>
              </View>

              <AppText style={styles.addressText}>Shipping to: {item.address}</AppText>
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
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.textinputboxcolor,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.white,
    elevation: 1,
  },
  tabText: {
    fontSize: 12,
    color: Colors.lightblack,
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.secondary,
    fontWeight: '700',
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
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.secondary,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgePending: {
    backgroundColor: Colors.pendingBG,
  },
  badgeActive: {
    backgroundColor: Colors.greenBG,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  tailorName: {
    fontSize: 13,
    color: Colors.lightblack,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  meta: {
    fontSize: 12,
    color: Colors.black,
    fontWeight: '600',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  measurementsBox: {
    marginTop: 12,
    backgroundColor: Colors.whitebackgroundcolor,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
  },
  mTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: 1,
  },
  mText: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 2,
  },
  addressText: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 8,
  },
});

export default UserBookings;
