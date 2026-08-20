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
    title: 'New Order Received',
    message:
      'You received a new order (#9810) for 2x Premium Cashmere Wool Fabrics.',
    time: '30 mins ago',
    type: 'order',
    isUnread: true,
  },
  {
    id: '2',
    title: 'Payout Processed',
    message:
      'Your monthly payout of $1,250.00 has been sent to your bank account.',
    time: '5 hours ago',
    type: 'payout',
    isUnread: true,
  },
  {
    id: '3',
    title: 'Product Approved',
    message:
      'Your new "Italian Silk Blend Fabric" has been approved and is now active.',
    time: 'Yesterday',
    type: 'product',
    isUnread: false,
  },
  {
    id: '4',
    title: 'Inventory Alert',
    message:
      "Low stock alert: 'Navy Blue Blazer Wool' has only 2 items remaining.",
    time: '2 days ago',
    type: 'inventory',
    isUnread: false,
  },
];

const VendorNotifications = ({ navigation }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getIcon = type => {
    switch (type) {
      case 'order':
        return 'shopping-bag';
      case 'payout':
        return 'dollar-sign';
      case 'product':
        return 'check-circle';
      case 'inventory':
        return 'alert-triangle';
      default:
        return 'bell';
    }
  };

  const getIconBgColor = type => {
    switch (type) {
      case 'order':
        return Colors.confirmedBG;
      case 'payout':
        return Colors.inProgressBG;
      case 'product':
        return Colors.completedBG;
      case 'inventory':
        return '#FFE5E5';
      default:
        return '#F5F5F5';
    }
  };

  const getIconColor = type => {
    switch (type) {
      case 'order':
        return Colors.confirmed;
      case 'payout':
        return Colors.inProgress;
      case 'product':
        return Colors.completed;
      case 'inventory':
        return Colors.red;
      default:
        return Colors.lightblack;
    }
  };

  const handleMarkAsRead = id => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isUnread: false } : item)),
    );
  };

  const handleClearAll = () => {
    setNotifications([]);
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
            refreshing={refreshing}
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
              We'll notify you when you receive new product orders, payouts or low stock alerts.
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notificationRow, item.isUnread && styles.unreadRow]}
            onPress={() => handleMarkAsRead(item.id)}
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

export default VendorNotifications;
