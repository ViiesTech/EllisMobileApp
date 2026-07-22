import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import { useDispatch, useSelector } from 'react-redux';
import { selectBookings, updateBookingStatus } from '../../store/bookingSlice';

const TailorHome = ({ navigation }) => {
  const dispatch = useDispatch();
  const bookings = useSelector(selectBookings);
  const [filter, setFilter] = useState('ALL');

  const filtered = bookings.filter((b) => {
    if (filter === 'PENDING') return b.status === 'Pending';
    if (filter === 'IN_PROGRESS') return b.status === 'In Progress';
    if (filter === 'COMPLETED') return b.status === 'Completed';
    return true;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Tailoring Bookings</AppText>
        <AppText style={styles.sub}>Manage doorstep measurement & fitting appointments</AppText>

        <View style={styles.filterRow}>
          {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <AppText
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f.replace('_', ' ')}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.list}>
        {filtered.map((b) => (
          <View key={b.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <AppText style={styles.svcName}>{b.serviceName}</AppText>
              <View style={[styles.badge, b.status === 'Pending' ? styles.badgePending : styles.badgeActive]}>
                <AppText style={styles.badgeText}>{b.status}</AppText>
              </View>
            </View>

            <AppText style={styles.customerName}>Client: {b.customerName}</AppText>
            <AppText style={styles.phone}>Phone: {b.phone}</AppText>
            <AppText style={styles.address}>📍 {b.address}</AppText>

            <View style={styles.metaRow}>
              <AppText style={styles.dateTime}>📅 {b.date} at {b.time}</AppText>
              <AppText style={styles.price}>${b.price}</AppText>
            </View>

            {/* Customer Sizing Measurements Box */}
            <View style={styles.measurementsCard}>
              <AppText style={styles.mTitle}>CLIENT MEASUREMENTS:</AppText>
              <View style={styles.mGrid}>
                <AppText style={styles.mItem}>Chest: {b.measurements?.chest || '40 in'}</AppText>
                <AppText style={styles.mItem}>Waist: {b.measurements?.waist || '32 in'}</AppText>
                <AppText style={styles.mItem}>Shoulder: {b.measurements?.shoulder || '18 in'}</AppText>
                <AppText style={styles.mItem}>Arm: {b.measurements?.armLength || '25 in'}</AppText>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
              {b.status === 'Pending' && (
                <>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() =>
                      dispatch(
                        updateBookingStatus({ id: b.id, status: 'In Progress' })
                      )
                    }
                  >
                    <AppText style={styles.acceptText}>Accept Booking</AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() =>
                      dispatch(
                        updateBookingStatus({ id: b.id, status: 'Rejected' })
                      )
                    }
                  >
                    <AppText style={styles.rejectText}>Decline</AppText>
                  </TouchableOpacity>
                </>
              )}

              {b.status === 'In Progress' && (
                <TouchableOpacity
                  style={styles.completeBtn}
                  onPress={() =>
                    dispatch(
                      updateBookingStatus({ id: b.id, status: 'Completed' })
                    )
                  }
                >
                  <AppText style={styles.completeText}>Mark Fitting Completed</AppText>
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
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.textinputboxcolor,
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.secondary,
  },
  filterText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.lightblack,
  },
  filterTextActive: {
    color: Colors.white,
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
  svcName: {
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
  customerName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 6,
  },
  phone: {
    fontSize: 12,
    color: Colors.black,
    marginTop: 2,
  },
  address: {
    fontSize: 12,
    color: Colors.lightblack,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  dateTime: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  measurementsCard: {
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
    marginBottom: 4,
  },
  mGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mItem: {
    fontSize: 11,
    color: Colors.secondary,
    width: '50%',
    marginBottom: 2,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginRight: 8,
  },
  acceptText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  rejectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.textinputboxcolor,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.graybordercolor,
    alignItems: 'center',
  },
  rejectText: {
    fontSize: 12,
    color: Colors.red,
    fontWeight: '600',
  },
  completeBtn: {
    flex: 1,
    backgroundColor: Colors.green,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  completeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default TailorHome;
