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
} = TailorService;
