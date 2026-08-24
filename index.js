import { AppRegistry } from 'react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

const messaging = getMessaging();

// Register background handler for Firebase
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Register background handler for Notifee
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('Notifee background event received:', type);
});

AppRegistry.registerComponent(appName, () => App);
