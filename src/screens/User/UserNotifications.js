import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Colors from '../../config/Colors';
import AppText from '../../components/AppText';
import VendorHeader from '../../components/VendorHeader';
import Feather from 'react-native-vector-icons/Feather';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Booking Confirmed',
    message:
      'Your custom suit fitting booking has been accepted by Liam James Tailor.',
    time: '2 hours ago',
    type: 'booking',
    isUnread: true,
  },
  {
    id: '2',
    title: 'Order Shipped',
    message:
      'Your ready-made wool blazer has been shipped. Tracking: EL-7839.',
    time: '5 hours ago',
    type: 'order',
    isUnread: true,
  },
  {
    id: '3',
    title: 'New Fabric Arrival',
    message:
      'Check out the new Italian silk fabrics available at Ellis Couture.',
    time: 'Yesterday',
    type: 'promo',
    isUnread: false,
  },
  {
    id: '4',
    title: 'Special Discount Offered',
    message: 'Enjoy 20% off on all premium alterations this weekend only!',
    time: '2 days ago',
    type: 'discount',
    isUnread: false,
  },
  {
    id: '5',
    title: 'Profile Updated',
    message: 'Your profile password was successfully changed.',
    time: '3 days ago',
    type: 'system',
    isUnread: false,
  },
];

import { useGetUserNotificationsQuery, useReadNotificationsMutation } from '../../Services/UserServices';

const UserNotifications = ({ navigation }) => {
  const { data: apiResponse, isFetching, refetch } = useGetUserNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [readNotifications] = useReadNotificationsMutation();

  const formatTime = createdAt => {
    if (!createdAt) return 'Just now';
    const diffMs = new Date() - new Date(createdAt);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const mapNotification = item => {
    if (!item) return null;
    return {
      id: String(item.id),
      title: item.title || 'Notification',
      message: item.message || item.body || item.text || '',
      time: formatTime(item.created_at),
      type: item.type || 'system',
      isUnread: item.read_at === null || !item.is_read || item.status === 'unread',
      data: item.data,
    };
  };

  const notifications = (apiResponse?.data || []).map(mapNotification).filter(Boolean);

  const onRefresh = () => {
    refetch();
  };

  const handleMarkAsRead = async item => {
    try {
      await readNotifications({ id: item.id, notification_id: item.id }).unwrap();
      const notificationData = item.data;
      const bookingId = notificationData?.booking_id || notificationData?.service_order_id;
      const orderId = notificationData?.order_id || notificationData?.orderId;
      
      if ((notificationData?.type === 'booking' || notificationData?.type === 'service_order') && bookingId) {
        navigation.navigate('UserBookingDetails', { bookingId: Number(bookingId) });
      } else if (notificationData?.type === 'order' && orderId) {
        navigation.navigate('UserOrderDetails', { order: { id: String(orderId) } });
      } else if (notificationData?.type === 'order' && bookingId) {
        navigation.navigate('UserBookingDetails', { bookingId: Number(bookingId) });
      }
    } catch (error) {
      console.log('Error marking notification as read:', error);
    }
  };

  const handleClearAll = async () => {
    try {
      await readNotifications({ all: true }).unwrap();
    } catch (error) {
      console.log('Error marking all notifications as read:', error);
    }
  };

  const getIcon = type => {
    switch (type) {
      case 'booking':
        return 'scissors';
      case 'order':
        return 'shopping-bag';
      case 'promo':
        return 'gift';
      case 'discount':
        return 'tag';
      default:
        return 'bell';
    }
  };

  const getIconBgColor = type => {
    switch (type) {
      case 'booking':
        return Colors.confirmedBG;
      case 'order':
        return Colors.inProgressBG;
      case 'promo':
        return Colors.pendingBG;
      case 'discount':
        return '#FFE5E5';
      default:
        return '#F5F5F5';
    }
  };

  const getIconColor = type => {
    switch (type) {
      case 'booking':
        return Colors.confirmed;
      case 'order':
        return Colors.inProgress;
      case 'promo':
        return Colors.pending;
      case 'discount':
        return Colors.red;
      default:
        return Colors.lightblack;
    }
  };

  return (
    <View style={styles.safeArea}>
      <VendorHeader
        navigation={navigation}
        title="NOTIFICATIONS"
        goBack={true}
      />

      {notifications.length > 0 && (
        <View style={styles.topActions}>
          <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
            <AppText style={styles.clearAllText}>Clear All</AppText>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="bell-off" size={48} color="#DEDEDE" />
            </View>
            <AppText style={styles.emptyTextHeader}>
              No notifications yet
            </AppText>
            <AppText style={styles.emptySubText}>
              We'll notify you when something important happens.
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationRow, item.isUnread && styles.unreadRow]}
            onPress={() => handleMarkAsRead(item)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: getIconBgColor(item.type) },
              ]}
            >
              <Feather
                name={getIcon(item.type)}
                size={20}
                color={getIconColor(item.type)}
              />
            </View>

            <View style={styles.contentCol}>
              <AppText style={styles.notificationTitle}>{item.title}</AppText>
              <AppText style={styles.notificationMsg}>{item.message}</AppText>
              <AppText style={styles.notificationTime}>{item.time}</AppText>
            </View>

            {item.isUnread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  clearAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unreadRow: {
    backgroundColor: '#FAF7EE',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: -12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contentCol: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  notificationMsg: {
    fontSize: 12,
    color: '#5D5D5D',
    lineHeight: 18,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 10,
    color: '#9E9E9E',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#F9F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTextHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

export default UserNotifications;
