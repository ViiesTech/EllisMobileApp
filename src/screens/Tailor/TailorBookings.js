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
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import VendorHeader from '../../components/VendorHeader';
import { useGetTailorBookingsQuery } from '../../Services/TailorServices';
import Feather from 'react-native-vector-icons/Feather';
import ApiConstants from '../../Constants/Api.constants';
import { resolveImage } from '../../utils';
import moment from 'moment';

const mapApiBookingToUi = b => {
  const mapStatus = status => {
    if (!status) return 'Pending';
    const s = status.toLowerCase();
    if (s === 'pending') return 'Pending';
    if (s === 'accepted') return 'Accepted';
    if (s === 'in_progress' || s === 'in-progress') return 'In Progress';
    if (s === 'delivered') return 'Delivered';
    if (s === 'completed') return 'Completed';
    if (s === 'rejected') return 'Rejected';
    return status;
  };

  const constructMeasurementDetails = item => {
    console.log('item:-', item);
    return (
      `Suit Type: ${item.suit_type || '2 Piece'}\n` +
      `Fit Type: ${item.fit_type || 'Slim'}\n` +
      `Coat Measurements: Length: ${item.coat_length || 0} in, Shoulder: ${
        item.shoulder_width || 0
      } in, Chest: ${item.chest_round || 0} in, Waist: ${
        item.coat_waist || 0
      } in, Hip: ${item.coat_hip || 0} in, Sleeve: ${
        item.sleeves_length || 0
      } in\n` +
      `Pant Measurements: Waist: ${item.pant_waist || 0} in, Hip: ${
        item.pant_hip || 0
      } in, Length: ${item.pant_length || 0} in, Rise: ${
        item.rise || 'Regular'
      }, Leg: ${item.leg || 'Straight'}`
    );
  };

  return {
    id: b.id,
    customerName: `${b.user?.name} ${b.user?.last_name}` || 'Customer',
    phone: b.phone,
    address:
      `${b.address || ''}, ${b.city || ''}, ${b.country || ''}`.replace(
        /^,\s*|,\s*$/g,
        '',
      ) || 'Springfield, United States',
    shippingAddress: `${b.first_name || ''} ${b.last_name || ''}\n${
      b.billing_address || b.address || ''
    }, ${b.billing_city || b.city || ''} ${
      b.billing_postal_code || b.postal_code || ''
    }\nPhone: ${b.phone || ''}`,
    image: resolveImage(b.user?.user_profile_image),
    serviceName: b.service?.name,
    serviceDescription: b.service?.description,
    serviceImage: b.service?.image_url,
    price: b.total || b.service_price || '0.00',
    time: b.created_at ? moment(b.created_at).format('MM/DD/YYYY') : 'N/A',
    status: mapStatus(b.status),
    measurementDetails: constructMeasurementDetails(b?.measurement),
    // Extra fields
    suitType: b?.measurement?.suit_type,
    fitType: b?.measurement?.fit_type,
    coatLength: b?.measurement?.coat_length,
    shoulderWidth: b?.measurement?.shoulder_width,
    chestRound: b?.measurement?.chest_round,
    coatWaist: b?.measurement?.coat_waist,
    coatHip: b?.measurement?.coat_hip,
    sleeveLength: b?.measurement?.sleeve_length,
    pantWaist: b?.measurement?.pant_waist,
    pantHip: b?.measurement?.pant_hip,
    trouserLength: b?.measurement?.trouser_length,
    rise: b?.measurement?.rise,
    leg: b?.measurement?.leg,
  };
};

const TailorBookings = ({ navigation }) => {
  const [filter, setFilter] = useState('New');

  const getBackendStatus = uiFilter => {
    switch (uiFilter) {
      case 'New':
        return 'pending';
      case 'Accepted':
        return 'accepted';
      case 'In Progress':
        return 'in_progress';
      case 'Delivered':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const { data, isLoading, refetch, isFetching } = useGetTailorBookingsQuery({
    page: 1,
    per_page: 100,
    status: getBackendStatus(filter),
  });

  const bookingsData = data?.data || [];
  const filtered = bookingsData.map(mapApiBookingToUi);

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
          {['New', 'Accepted', 'In Progress', 'Delivered'].map(f => {
            const isActive = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterChip,
                  isActive
                    ? styles.filterChipActive
                    : styles.filterChipInactive,
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
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Bookings Card List */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : filtered.length === 0 ? (
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
                            uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                          }
                    }
                    style={styles.clientAvatar}
                  />

                  <View style={styles.bookingMidInfo}>
                    <AppText style={styles.clientName}>
                      {b.customerName}
                    </AppText>
                    <AppText style={styles.serviceText}>
                      Service: {b.serviceName}
                    </AppText>
                    <View style={styles.locationContainer}>
                      <Feather name="map-pin" size={10} color="#7C7C7C" />
                      <AppText style={styles.locationText}>
                        {' '}
                        {b.address}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.bookingRightCol}>
                    <View
                      style={[
                        styles.statusBadge,
                        b.status === 'Pending' && styles.badgeNew,
                        b.status === 'Accepted' && styles.badgeAccepted,
                        b.status === 'In Progress' && styles.badgeProgress,
                        (b.status === 'Delivered' ||
                          b.status === 'Completed') &&
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
