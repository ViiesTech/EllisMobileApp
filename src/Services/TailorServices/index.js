import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const getTailorCategories = () => {
  return {
    url: Endpoints.getTailorCategories,
    method: apiMethods.get,
  };
};

const getTailorServices = () => {
  return {
    url: Endpoints.getTailorServices,
    method: apiMethods.get,
  };
};

const getTailors = params => {
  return {
    url: Endpoints.tailors,
    method: apiMethods.get,
    params,
  };
};

const createTailorService = body => {
  return {
    url: `${Endpoints.getTailorServices}/create`,
    method: apiMethods.post,
    body,
  };
};

const updateTailorService = ({ id, body }) => {
  return {
    url: `${Endpoints.getTailorServices}/${id}/update`,
    method: apiMethods.post,
    body,
  };
};

const deleteTailorService = id => {
  return {
    url: `${Endpoints.getTailorServices}/${id}`,
    method: apiMethods.delete,
  };
};

const getTailorBookings = params => {
  return {
    url: Endpoints.tailorOrders,
    method: apiMethods.get,
    params,
  };
};

const getTailorDashboard = () => {
  return {
    url: 'tailor/dashboard',
    method: apiMethods.get,
  };
};

const updateTailorBookingStatus = ({ id, status }) => {
  return {
    url: `${Endpoints.tailorOrders}/${id}/status`,
    method: apiMethods.post,
    body: { status },
  };
};

export const TailorService = baseApi.injectEndpoints({
  endpoints: build => ({
    getTailorCategories: build.query({
      query: getTailorCategories,
      providesTags: ['TailorCategories'],
    }),
    getTailorServices: build.query({
      query: getTailorServices,
      providesTags: ['TailorServices'],
    }),
    getTailors: build.query({
      query: getTailors,
      providesTags: ['Tailors'],
    }),
    createTailorService: build.mutation({
      query: createTailorService,
      invalidatesTags: ['TailorServices'],
    }),
    updateTailorService: build.mutation({
      query: updateTailorService,
      invalidatesTags: ['TailorServices'],
    }),
    deleteTailorService: build.mutation({
      query: deleteTailorService,
      invalidatesTags: ['TailorServices'],
    }),
    getTailorBookings: build.query({
      query: getTailorBookings,
      providesTags: ['TailorBookings'],
    }),
    getTailorDashboard: build.query({
      query: getTailorDashboard,
      providesTags: ['TailorBookings'],
    }),
    updateTailorBookingStatus: build.mutation({
      query: updateTailorBookingStatus,
      invalidatesTags: ['TailorBookings'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetTailorCategoriesQuery,
  useLazyGetTailorCategoriesQuery,
  useGetTailorServicesQuery,
  useLazyGetTailorServicesQuery,
  useCreateTailorServiceMutation,
  useUpdateTailorServiceMutation,
  useDeleteTailorServiceMutation,
  useGetTailorsQuery,
  useLazyGetTailorsQuery,
  useGetTailorBookingsQuery,
  useLazyGetTailorBookingsQuery,
  useGetTailorDashboardQuery,
  useLazyGetTailorDashboardQuery,
  useUpdateTailorBookingStatusMutation,
} = TailorService;
