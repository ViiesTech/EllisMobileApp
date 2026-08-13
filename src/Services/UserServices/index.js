import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const getTailors = params => {
  return {
    url: Endpoints.tailors,
    method: apiMethods.get,
    params,
  };
};

const getProducts = params => {
  return {
    url: Endpoints.getMyProducts,
    method: apiMethods.get,
    params,
  };
};

const userProducts = params => {
  return {
    url: Endpoints.userProducts,
    method: apiMethods.get,
    params,
  };
};

const userCategories = () => {
  return {
    url: Endpoints.userCategories,
    method: apiMethods.get,
  };
};

const placeOrder = body => {
  return {
    url: Endpoints.placeOrder,
    method: apiMethods.post,
    body,
  };
};

const checkoutTailorService = body => {
  return {
    url: Endpoints.checkoutTailorService,
    method: apiMethods.post,
    body,
  };
};

const getUserOrders = params => {
  return {
    url: Endpoints.getUserOrders,
    method: apiMethods.get,
    params,
  };
};

const userUpdateProfile = ({ id, body }) => {
  return {
    url: `${Endpoints.userUpdateProfile}/${id}`,
    method: apiMethods.post,
    body,
  };
};

export const UserServices = baseApi.injectEndpoints({
  endpoints: build => ({
    getTailors: build.query({
      query: getTailors,
      providesTags: ['Users'],
    }),
    getProducts: build.query({
      query: getProducts,
      providesTags: ['VendorProducts'],
    }),
    userCategories: build.query({
      query: userCategories,
      providesTags: ['UserCategories'],
    }),
    placeOrder: build.mutation({
      query: placeOrder,
      invalidatesTags: ['VendorOrders'],
    }),
    checkoutTailorService: build.mutation({
      query: checkoutTailorService,
      invalidatesTags: ['VendorOrders'],
    }),
    getUserOrders: build.query({
      query: getUserOrders,
      providesTags: ['VendorOrders'],
    }),
    userUpdateProfile: build.mutation({
      query: userUpdateProfile,
      invalidatesTags: ['Users'],
    }),
    userProducts: build.query({
      query: userProducts,
      providesTags: ['UserProducts'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetTailorsQuery,
  useLazyGetProductsQuery,
  useGetProductsQuery,
  useLazyUserCategoriesQuery,
  useUserCategoriesQuery,
  usePlaceOrderMutation,
  useCheckoutTailorServiceMutation,
  useGetUserOrdersQuery,
  useUserUpdateProfileMutation,
  useUserProductsQuery,
  useLazyUserProductsQuery,
} = UserServices;
