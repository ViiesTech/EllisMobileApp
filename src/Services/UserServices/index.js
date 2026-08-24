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

const submitReview = body => {
  return {
    url: Endpoints.submitReview,
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

const getUserOrderDetails = id => {
  return {
    url: `${Endpoints.getUserOrders}/${id}`,
    method: apiMethods.get,
  };
};

const getUserBookings = params => {
  return {
    url: Endpoints.getUserBookings,
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

const getUserTailorServices = ({ tailorId, params }) => {
  return {
    url: `user/tailors/${tailorId}/services`,
    method: apiMethods.get,
    params,
  };
};

const getProductReviews = id => {
  return {
    url: `user/products/${id}/reviews`,
    method: apiMethods.get,
  };
};

const getUserNotifications = params => {
  return {
    url: Endpoints.userNotifications,
    method: apiMethods.get,
    params,
  };
};

const readNotifications = body => {
  return {
    url: Endpoints.readNotifications,
    method: apiMethods.post,
    body,
  };
};

const getUserBookingDetailsById = id => {
  return {
    url: `${Endpoints.getUserBookings}/${id}`,
    method: apiMethods.get,
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
    getUserBookings: build.query({
      query: getUserBookings,
      providesTags: ['UserBookings'],
    }),
    getUserTailorServices: build.query({
      query: getUserTailorServices,
      providesTags: ['TailorServices'],
    }),
    submitReview: build.mutation({
      query: submitReview,
      invalidatesTags: ['VendorOrders'],
    }),
    getUserOrderDetails: build.query({
      query: getUserOrderDetails,
      providesTags: ['VendorOrders'],
    }),
    getProductReviews: build.query({
      query: getProductReviews,
    }),
    getUserNotifications: build.query({
      query: getUserNotifications,
      providesTags: ['UserNotifications'],
    }),
    readNotifications: build.mutation({
      query: readNotifications,
      invalidatesTags: ['UserNotifications'],
    }),
    getUserBookingDetailsById: build.query({
      query: getUserBookingDetailsById,
      providesTags: ['UserBookings'],
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
  useGetUserBookingsQuery,
  useLazyGetUserBookingsQuery,
  useGetUserTailorServicesQuery,
  useLazyGetUserTailorServicesQuery,
  useSubmitReviewMutation,
  useGetUserOrderDetailsQuery,
  useGetProductReviewsQuery,
  useGetUserNotificationsQuery,
  useLazyGetUserNotificationsQuery,
  useReadNotificationsMutation,
  useGetUserBookingDetailsByIdQuery,
  useLazyGetUserBookingDetailsByIdQuery,
} = UserServices;
