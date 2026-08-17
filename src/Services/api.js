import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import ApiConstants from '../Constants/Api.constants';
import { createMMKV } from 'react-native-mmkv';
import { setClearStore } from '../store/authSlice';

const storage = createMMKV();

// Custom axios-based baseQuery for RTK Query
// Using axios instead of fetchBaseQuery because RN 0.86 new architecture's
// fetch API goes through C++ layer and ignores OkHttpClientFactory SSL overrides.
// Axios uses XMLHttpRequest which correctly handles SSL on Android.
const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async (args, api) => {
    const { url, method, body, params } = args;
    const { getState, dispatch } = api;

    try {
      let token = null;
      try {
        const state = getState();
        token = state?.auth?.token;
      } catch (e) {
        console.log('getState error:', e);
      }

      const reqHeaders = {
        Accept: 'application/json',
      };

      if (token) {
        reqHeaders['Authorization'] = `Bearer ${token}`;
      }

      if (body instanceof FormData) {
        reqHeaders['Content-Type'] = 'multipart/form-data';
      } else if (body) {
        reqHeaders['Content-Type'] = 'application/json';
      }

      const fullUrl = (baseUrl || '') + (url || '');
      // console.log('API Request:-', method || 'GET', fullUrl, body);

      const response = await axios.request({
        url: fullUrl,
        method: (method || 'GET').toLowerCase(),
        data: body,
        params: params,
        headers: reqHeaders,
      });

      console.log('API Response Success:-', response.data);
      return { data: response.data };
    } catch (axiosError) {
      console.log(
        'Axios Error Catch:-',
        axiosError?.response?.status,
        axiosError?.response?.data || axiosError?.message,
      );

      // Handle 401 - auto logout
      if (axiosError.response?.status === 401) {
        try {
          storage.delete('appleAuth');
          dispatch(setClearStore());
        } catch (e) {
          console.log('Logout error:', e);
        }
      }

      const errorData = axiosError.response?.data;
      const errorMessage =
        errorData?.message || axiosError.message || 'Network error occurred';

      return {
        error: {
          status: axiosError.response?.status || 'FETCH_ERROR',
          data: errorData || axiosError.message,
          message: errorMessage,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl: ApiConstants.baseUrl }),
  tagTypes: [
    'VendorProducts',
    'VendorOrders',
    'VendorCategories',
    'TailorCategories',
    'TailorServices',
    'Tailors',
    'UserCategories',
    'Users',
    'TailorBookings',
    'UserProducts',
    'UserBookings',
  ],
  endpoints: () => ({}),
});

export const apiMethods = {
  get: 'GET',
  post: 'POST',
  patch: 'PATCH',
  put: 'PUT',
  delete: 'DELETE',
};
