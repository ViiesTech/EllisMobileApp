import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authSlice';
import {
  useGetTailorBookingsQuery,
  useGetTailorDashboardQuery,
  useGetTailorNotificationsQuery,
} from '../../Services/TailorServices';
import { resolveImage } from '../../utils';
import moment from 'moment';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = (screenWidth - 40 - 36) / 4; // 40 for screen padding, 36 for 3 gaps of 12

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
    if (Array.isArray(item)) {
      if (item.length === 0) return 'No measurements provided.';
      return item
        .map(m => `${m.title}: ${m.value} ${m.unit || 'inches'}`)
        .join('\n');
    }
    if (!item) return 'No measurements provided.';
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
    measurementDetails: constructMeasurementDetails(
      b.measurements || b?.measurement,
    ),
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

const formatRevenue = rev => {
  const val = Number(rev) || 0;
  if (val >= 1000) {
    return `$${(val / 1000).toFixed(1)}K`;
  }
  return `$${val}`;
};

const TailorHome = ({ navigation }) => {
  const userProfile = useSelector(selectUser) || {};

  const { data, isLoading } = useGetTailorBookingsQuery({
    page: 1,
    per_page: 5,
    status: 'pending',
  });
  const { data: notificationsData } = useGetTailorNotificationsQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const { data: dashboardData } = useGetTailorDashboardQuery();
  const stats = dashboardData?.data || {};

  const bookingsData = data?.data || [];
  const newBookings = bookingsData.map(mapApiBookingToUi);

  const notificationsList = Array.isArray(notificationsData?.data)
    ? notificationsData.data
    : Array.isArray(notificationsData)
    ? notificationsData
    : [];

  const hasUnreadNotifications = notificationsList.some(item => {
    if (!item) return false;
    if (
      item.is_read === false ||
      item.is_read === 0 ||
      item.is_read === 'false' ||
      item.is_read === '0'
    ) {
      return true;
    }
    if (
      item.is_read === true ||
      item.is_read === 1 ||
      item.is_read === 'true' ||
      item.is_read === '1'
    ) {
      return false;
    }
    return item.read_at === null || item.status === 'unread';
  });

  return (
    <View style={styles.safeArea}>
      {/* Redesigned Home Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri:
                userProfile.profile_image ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.headerTextContainer}>
            <AppText style={styles.welcomeText}>Good Morning 👋</AppText>
            <AppText style={styles.tailorName}>
              {userProfile.name || 'Liam James'}
            </AppText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bellBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('TailorNotifications')}
        >
          <Feather name="bell" size={20} color="#000000" />
          {hasUnreadNotifications && <View style={styles.badgeDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 4 Gold Stat Cards */}
        <View style={styles.statsContainer}>
          {/* Card 1 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="file-text" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>
              {stats.pending_bookings ?? 0}
            </AppText>
            <AppText style={styles.statTitle}>New{'\n'}Bookings</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>12%</AppText>
            </View> */}
          </View>

          {/* Card 2 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="file-text" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>
              {(stats.accepted_bookings ?? 0) +
                (stats.in_progress_bookings ?? 0)}
            </AppText>
            <AppText style={styles.statTitle}>Active{'\n'}Bookings</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>16%</AppText>
            </View> */}
          </View>

          {/* Card 3 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="file-text" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>
              {stats.completed_bookings ?? 0}
            </AppText>
            <AppText style={styles.statTitle}>Completed{'\n'}Bookings</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>16%</AppText>
            </View> */}
          </View>

          {/* Card 4 */}
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <Feather name="dollar-sign" size={16} color={Colors.primary} />
            </View>
            <AppText style={styles.statVal}>
              {formatRevenue(stats.total_revenue)}
            </AppText>
            <AppText style={styles.statTitle}>Total{'\n'}Revenue</AppText>
            {/* <View style={styles.statGrowthBox}>
              <FontAwesome6
                name="arrow-up-long"
                size={8}
                color={Colors.black}
              />
              <AppText style={styles.statGrowth}>16%</AppText>
            </View> */}
          </View>
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>NEW BOOKINGS</AppText>
          <TouchableOpacity
            onPress={() => navigation.navigate('TailorBookingsTab')}
            activeOpacity={0.7}
          >
            <AppText style={styles.viewAllText}>View All</AppText>
          </TouchableOpacity>
        </View>

        {/* New Bookings Wrapper List Card */}
        <View style={styles.bookingsBox}>
          {isLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : newBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AppText style={styles.emptyText}>No new bookings found.</AppText>
            </View>
          ) : (
            newBookings.map((b, idx) => {
              const displayCount = newBookings.length;
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
                    <View style={styles.statusBadge}>
                      <AppText style={styles.statusBadgeText}>New</AppText>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    marginTop: Platform.OS == 'ios' ? 0 : 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F5F5F5',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 12,
    color: '#7C7C7C',
    marginBottom: 2,
  },
  tailorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.redDot,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 24,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 10,
    alignItems: 'flex-start',
    height: 125,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.borderColor,
    lineHeight: 12,
  },
  statGrowthBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statGrowth: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.black,
    marginLeft: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: 1.5,
    fontFamily: 'serif',
  },
  viewAllText: {
    fontSize: 12,
    color: '#5D5D5D',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  bookingsBox: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    overflow: 'hidden',
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
    backgroundColor: Colors.pendingBG,
    borderColor: Colors.pending,
    borderWidth: 0.5,
    borderRadius: 5,
    marginBottom: 4,
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
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    color: '#7C7C7C',
  },
});

export default TailorHome;
