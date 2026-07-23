import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import VendorHeader from '../../components/VendorHeader';
import { useSelector } from 'react-redux';
import { selectBookings } from '../../store/bookingSlice';
import Feather from 'react-native-vector-icons/Feather';

const TailorBookings = ({ navigation }) => {
  const bookings = useSelector(selectBookings);
  const [filter, setFilter] = useState('New');

  const filtered = bookings.filter((b) => {
    if (filter === 'New') return b.status === 'Pending';
    if (filter === 'Accepted') return b.status === 'Accepted';
    if (filter === 'In Progress') return b.status === 'In Progress';
    if (filter === 'Delivered') return b.status === 'Delivered' || b.status === 'Completed';
    return true;
  });

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="BOOKINGS"
        goBack={false}
        homeHeader={false}
        notification={false}
      />
      
      {/* Redesigned Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {['New', 'Accepted', 'In Progress', 'Delivered'].map((f) => {
            const isActive = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive,
                ]}
                onPress={() => setFilter(f)}
                activeOpacity={0.8}
              >
                <AppText style={styles.filterText}>{f}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Bookings Card List */}
        <View style={styles.listContainer}>
          {filtered.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No bookings found.</AppText>
            </View>
          ) : (
            filtered.map((b, idx) => {
              const displayCount = filtered.length;
              return (
                <TouchableOpacity
                  key={b.id}
                  style={[
                    styles.bookingRow,
                    idx < displayCount - 1 && styles.itemDivider,
                  ]}
                  onPress={() =>
                    navigation.navigate('TailorBookingDetails', { booking: b })
                  }
                  activeOpacity={0.7}
                >
                  <Image
                    source={
                      typeof b.image === 'string'
                        ? { uri: b.image }
                        : b.image || {
                            uri:
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                          }
                    }
                    style={styles.clientAvatar}
                  />

                  <View style={styles.bookingMidInfo}>
                    <AppText style={styles.clientName}>{b.customerName}</AppText>
                    <AppText style={styles.serviceText}>
                      Service: {b.serviceName}
                    </AppText>
                    <View style={styles.locationContainer}>
                      <Feather name="map-pin" size={10} color="#7C7C7C" />
                      <AppText style={styles.locationText}> {b.address}</AppText>
                    </View>
                  </View>

                  <View style={styles.bookingRightCol}>
                    <View
                      style={[
                        styles.statusBadge,
                        b.status === 'Pending' && styles.badgeNew,
                        b.status === 'Accepted' && styles.badgeAccepted,
                        b.status === 'In Progress' && styles.badgeProgress,
                        (b.status === 'Delivered' || b.status === 'Completed') &&
                          styles.badgeDelivered,
                      ]}
                    >
                      <AppText style={styles.statusBadgeText}>
                        {b.status === 'Pending' ? 'New' : b.status}
                      </AppText>
                    </View>
                    <AppText style={styles.timeText}>{b.time}</AppText>

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
  filterContainer: {
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  filterScroll: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
  },
  filterChipInactive: {
    backgroundColor: Colors.white,
    borderWidth: 1.2,
    borderColor: '#000000',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.2,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  listContainer: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    overflow: 'hidden',
    marginTop: 10,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.white,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  clientAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
  },
  bookingMidInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  serviceText: {
    fontSize: 11,
    color: '#7C7C7C',
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 11,
    color: '#7C7C7C',
  },
  bookingRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 4,
  },
  badgeNew: {
    backgroundColor: Colors.pendingBG,
    borderColor: Colors.pending,
  },
  badgeAccepted: {
    backgroundColor: Colors.confirmedBG,
    borderColor: Colors.confirmed,
  },
  badgeProgress: {
    backgroundColor: Colors.inProgressBG,
    borderColor: Colors.inProgress,
  },
  badgeDelivered: {
    backgroundColor: Colors.completedBG,
    borderColor: Colors.completed,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  timeText: {
    fontSize: 10,
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
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#7C7C7C',
  },
});

export default TailorBookings;
