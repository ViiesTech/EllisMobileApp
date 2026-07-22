import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Routes from './src/navigation';
import Colors from './src/config/Colors';
import { store, persistor } from './src/store';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/Toast';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar hidden />
          <SafeAreaView
            edges={['top', 'bottom']}
            style={{ flex: 1, backgroundColor: Colors.white }}
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
