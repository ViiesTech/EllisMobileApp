import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Colors from '../../../config/Colors';
import AppText from '../../../components/AppText';
import VendorHeader from '../../../components/VendorHeader';
import { useLazyGetUserBookingsQuery } from '../../../Services/UserServices';
import Feather from 'react-native-vector-icons/Feather';
import moment from 'moment';

const mapApiBookingToUi = b => {
  const mapStatus = status => {
    if (!status) return 'Pending';
    const s = status.toLowerCase();
    if (s === 'pending') return 'Pending';
    if (s === 'accepted') return 'Accepted';
    if (s === 'in_progress' || s === 'in-progress') return 'In Progress';
    if (s === 'completed') return 'Completed';
    if (s === 'cancelled') return 'Cancelled';
    return status;
  };

  const constructMeasurementDetails = item => {
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
      }, Leg: ${item.leg || 'Thigh Round'}`
    );
  };

  const constructShippingAddress = item => {
    return `${item.first_name || ''} ${item.last_name || ''}\n${
      item.address || ''
    }, ${item.city || ''} ${item.postal_code || ''}\nPhone: ${
      item.phone || ''
    }`;
  };

  return {
    id: b.id,
    customerName: b.tailor?.business_name || b.tailor?.name || 'Tailor',
    image: b.tailor?.profile_image,
    address:
      `${b.tailor?.address || ''}, ${b.tailor?.city || ''}`.replace(
        /^,\s*|,\s*$/g,
        '',
      ) || 'New York, United States',
    serviceName: b.service?.name,
    serviceDescription: b.service?.description,
    serviceImage: b.service?.image,
    price: b.total || '0.00',
    time: b.created_at ? moment(b.created_at).format('MM/DD/YYYY') : 'N/A',
    status: mapStatus(b.status),
    fabricDetails: b.notes || 'No extra fabric/design instructions provided.',
    measurementDetails: constructMeasurementDetails(b?.measurement),
    shippingAddress: constructShippingAddress(b),
  };
};

const UserBookings = ({ navigation }) => {
  const [filter, setFilter] = useState('All');
  const [bookingsList, setBookingsList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [triggerGetUserBookings, { isFetching }] =
    useLazyGetUserBookingsQuery();

  const getBackendStatus = uiFilter => {
    switch (uiFilter) {
      case 'All':
        return undefined;
      case 'Pending':
        return 'pending';
      case 'Accepted':
        return 'accepted';
      case 'In Progress':
        return 'in_progress';
      case 'Completed':
        return 'completed';
      case 'Cancelled':
        return 'cancelled';
      default:
        return undefined;
    }
  };

  const fetchBookingsList = async (
    pageNumber,
    isRefresh = false,
    currentFilter = filter,
  ) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const statusParam = getBackendStatus(currentFilter);
      const res = await triggerGetUserBookings({
        page: pageNumber,
        per_page: 10,
        status: statusParam,
      }).unwrap();

      const rawBookings = res?.data || [];
      const newBookings = rawBookings.map(mapApiBookingToUi);

      if (rawBookings.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (isRefresh) {
        setBookingsList(newBookings);
        setPage(1);
      } else {
        setBookingsList(prev => [...prev, ...newBookings]);
        setPage(pageNumber);
      }
    } catch (err) {
      console.log('Error fetching user bookings:', err);
      setHasMore(false);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setBookingsList([]); // Clear previous tab's list so it immediately shows loading state
    setHasMore(true);
    fetchBookingsList(1, true, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const onRefresh = () => {
    setHasMore(true);
    fetchBookingsList(1, true, filter);
  };

  const onLoadMore = () => {
    if (!loadingMore && !isFetching && hasMore && bookingsList.length > 0) {
      fetchBookingsList(page + 1, false, filter);
    }
  };

  const renderEmpty = () => {
    if (isFetching && bookingsList.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <AppText style={styles.emptyText}>No bookings found.</AppText>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader navigation={navigation} title="BOOKINGS" goBack={false} />

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            'All',
            'Pending',
            'Accepted',
            'In Progress',
            'Completed',
            'Cancelled',
          ].map(f => {
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
                <AppText
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {f}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={bookingsList}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing && !isFetching && page === 1}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        renderItem={({ item: b, index }) => {
          const displayCount = bookingsList.length;
          const isFirst = index === 0;
          const isLast = index === displayCount - 1;
          const containerStyle = [
            styles.bookingRowContainer,
            displayCount === 1
              ? styles.bookingRowSingle
              : isFirst
              ? styles.bookingRowFirst
              : isLast
              ? styles.bookingRowLast
              : null,
          ];

          return (
            <View style={containerStyle}>
              <TouchableOpacity
                style={[
                  styles.bookingRow,
                  index < displayCount - 1 && styles.itemDivider,
                ]}
                onPress={() =>
                  navigation.navigate('UserBookingDetails', { booking: b })
                }
                activeOpacity={0.7}
              >
                <Image
                  source={
                    typeof b.image === 'string' && b.image.trim() !== ''
                      ? { uri: b.image }
                      : {
                          uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
                      b.status === 'Completed' && styles.badgeDelivered,
                      b.status === 'Cancelled' && styles.badgeCancelled,
                    ]}
                  >
                    <AppText style={styles.statusBadgeText}>{b.status}</AppText>
                  </View>
                  <AppText style={styles.timeText}>{b.time}</AppText>

                  <View style={styles.arrowCircle}>
                    <Feather name="chevron-right" size={12} color="#FFFFFF" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
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
  filterTextActive: {
    color: '#000000',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bookingRowContainer: {
    backgroundColor: Colors.white,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E2E2',
    overflow: 'hidden',
  },
  bookingRowFirst: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderTopWidth: 1,
    marginTop: 10,
  },
  bookingRowLast: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  bookingRowSingle: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
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
  badgeCancelled: {
    backgroundColor: '#FFE5E5',
    borderColor: '#FF4D4D',
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default UserBookings;
