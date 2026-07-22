import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createMMKV } from 'react-native-mmkv';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import authReducer from './authSlice';
import productReducer from './productSlice';
import bookingReducer from './bookingSlice';
import orderReducer from './orderSlice';

// Setup MMKV Storage Instance
const storage = createMMKV();

export const reduxStorage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve(true);
  },
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  booking: bookingReducer,
  order: orderReducer,
});

// Persist Configuration
const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: ['auth', 'product', 'booking', 'order'],
  stateReconciler: autoMergeLevel2,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: false,
    }),
});

const persistor = persistStore(store);

setupListeners(store.dispatch);

export { persistor, store };
