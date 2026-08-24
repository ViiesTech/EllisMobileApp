import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  AuthorizationStatus,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';
import {Platform, PermissionsAndroid} from 'react-native';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import { navigationRef } from '../navigation';

// Note: Firebase is auto-initialized from google-services.json (Android) / GoogleService-Info.plist (iOS)
// No need to call firebase.initializeApp() manually

import { store } from '../store';

function navigateSafely(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    setTimeout(() => {
      navigateSafely(name, params);
    }, 500);
  }
}

export function handleNotificationClick(remoteMessage) {
  if (!remoteMessage) return;
  console.log('DEBUG - handleNotificationClick called with:', JSON.stringify(remoteMessage, null, 2));
  
  const data = remoteMessage.data || {};
  const type = data.type;
  const orderId = data.order_id || data.orderId;
  const bookingId = data.booking_id || data.bookingId;
  const productId = data.product_id || data.productId;

  const authState = store.getState().auth;
  const role = authState?.role;
  const token = authState?.token;

  console.log('DEBUG - Extracted data:', { type, orderId, bookingId, productId });
  console.log('DEBUG - User state:', { role, loggedIn: !!token });

  if (!token) {
    console.log('DEBUG - User not logged in, skipping redirection');
    return;
  }

  if (type === 'order' && orderId) {
    if (role === 'VENDOR') {
      console.log('DEBUG - Redirecting VENDOR to VendorOrderDetails with ID:', Number(orderId));
      navigateSafely('VendorOrderDetails', { orderId: Number(orderId) });
    } else {
      console.log('DEBUG - Redirecting USER to UserOrderDetails with ID:', String(orderId));
      navigateSafely('UserOrderDetails', { order: { id: String(orderId) } });
    }
  } else if (type === 'booking' && bookingId) {
    if (role === 'TAILOR') {
      console.log('DEBUG - Redirecting TAILOR to TailorBookingDetails with ID:', Number(bookingId));
      navigateSafely('TailorBookingDetails', { bookingId: Number(bookingId) });
    } else {
      console.log('DEBUG - Redirecting USER to UserBookingDetails with ID:', Number(bookingId));
      navigateSafely('UserBookingDetails', { bookingId: Number(bookingId) });
    }
  } else if (type === 'review') {
    if (bookingId && role === 'TAILOR') {
      console.log('DEBUG - Redirecting TAILOR to TailorBookingDetails (Review) with ID:', Number(bookingId));
      navigateSafely('TailorBookingDetails', { bookingId: Number(bookingId) });
    } else if (productId && role === 'VENDOR') {
      console.log('DEBUG - Redirecting VENDOR to ProductDetails (Review) with ID:', Number(productId));
      navigateSafely('ProductDetails', { productId: Number(productId) });
    }
  } else {
    console.log('DEBUG - Redirection type not handled:', type);
  }
}

export async function requestUserPermission() {
  try {
    if (Platform.OS === 'android') {
      // Request Android notification permission (Android 13+)
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission denied');
          return false;
        }
      }
    }

    const messaging = getMessaging();
    // Request Firebase messaging permission using modular API
    const authStatus = await requestPermission(messaging);
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    return enabled;
  } catch (error) {
    console.log('Error requesting permission:', error);
    return false;
  }
}

// -------------------- FCM Token --------------------
export async function getFcmToken() {
  try {
    // Request permission first
    const hasPermission = await requestUserPermission();
    if (!hasPermission) {
      console.log('FCM permission not granted');
      return null;
    }

    const messaging = getMessaging();
    // Get FCM token using modular API
    const fcmToken = await getToken(messaging);
    console.log('FCM Token retrieved:', fcmToken);

    if (fcmToken) {
      return fcmToken;
    } else {
      console.log('No FCM token available');
      return null;
    }
  } catch (error) {
    console.log('Error getting FCM token:', error);
    return null;
  }
}

// -------------------- Initialize Notifications --------------------
export async function initNotifications() {
  try {
    // Request permission
    await requestUserPermission();

    // Create default channel for Android (required for Notifee)
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }

    const messaging = getMessaging();
    // Foreground messaging listener using modular API
    const unsubscribeFCM = onMessage(messaging, async remoteMessage => {
      console.log('DEBUG - Foreground FCM Message received:', JSON.stringify(remoteMessage, null, 2));

      // Display local notification using Notifee and pass data payload
      console.log('DEBUG - Displaying Notifee with data:', JSON.stringify(remoteMessage.data, null, 2));
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'Notification',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
        },
      });
    });

    // Foreground Notifee click listener
    const unsubscribeNotifee = notifee.onForegroundEvent(event => {
      console.log('DEBUG - Notifee onForegroundEvent triggered with type:', event.type);
      if (event.type === EventType.PRESS) {
        console.log('DEBUG - Notifee PRESS event detail:', JSON.stringify(event.detail, null, 2));
        const notification = event.detail.notification;
        if (notification?.data) {
          handleNotificationClick({ data: notification.data });
        } else {
          console.log('DEBUG - No notification data found in PRESS event');
        }
      }
    });

    // Background/App opened by notification click listener (FCM)
    const unsubscribeOpenedApp = onNotificationOpenedApp(messaging, remoteMessage => {
      console.log('DEBUG - FCM Notification caused app to open from background:', JSON.stringify(remoteMessage, null, 2));
      handleNotificationClick(remoteMessage);
    });

    // Quit state check (FCM)
    getInitialNotification(messaging).then(remoteMessage => {
      if (remoteMessage) {
        console.log('DEBUG - FCM Notification caused app to open from quit state:', JSON.stringify(remoteMessage, null, 2));
        handleNotificationClick(remoteMessage);
      }
    });

    // Quit state check (Notifee)
    notifee.getInitialNotification().then(initialNotification => {
      if (initialNotification) {
        console.log('DEBUG - Notifee Notification caused app to open from quit state:', JSON.stringify(initialNotification, null, 2));
        if (initialNotification.notification?.data) {
          handleNotificationClick({ data: initialNotification.notification.data });
        }
      }
    });

    return () => {
      unsubscribeFCM();
      unsubscribeNotifee();
      unsubscribeOpenedApp();
    };
  } catch (error) {
    console.log('Error initializing notifications:', error);
    return () => {};
  }
}


