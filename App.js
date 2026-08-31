import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { initNotifications } from './src/config/Firebase';
import Routes from './src/navigation';
import Colors from './src/config/Colors';
import { store, persistor } from './src/store';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/Toast';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const App = () => {
  useEffect(() => {
    SystemNavigationBar.setImmersive('sticky');

    let unsubscribe = () => {};
    initNotifications().then(unsub => {
      unsubscribe = unsub;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar hidden />
          <SafeAreaView
            edges={['top', 'bottom']}
            style={{
              flex: 1,
              backgroundColor:
                Platform.OS === 'ios' ? Colors.primary : Colors.white,
            }}
          >
            <Routes />
            <Toast config={toastConfig} />
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
