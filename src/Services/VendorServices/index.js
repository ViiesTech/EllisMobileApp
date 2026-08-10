import { baseApi, apiMethods } from '../api';
import { Endpoints } from '../../config/Endpoints';

const addProduct = body => {
  console.log('addProduct_body:-', body);
  return {
    url: Endpoints.addProduct,
    method: apiMethods.post,
    body,
  };
};

const getMyProducts = params => {
  return {
    url: Endpoints.getMyProducts,
    method: apiMethods.get,
    params,
  };
};

const deleteProduct = id => {
  return {
    url: `${Endpoints.getMyProducts}/${id}`,
    method: apiMethods.delete,
  };
};

const updateProduct = ({ id, body }) => {
  console.log('updateProduct_body:-', body);
  return {
    url: `${Endpoints.getMyProducts}/${id}/update`,
    method: apiMethods.post,
    body,
  };
};

const getVendorOrders = params => {
  return {
    url: Endpoints.vendorOrders,
    method: apiMethods.get,
    params,
  };
};

const updateVendorOrderStatus = ({ id, status }) => {
  return {
    url: `${Endpoints.vendorOrders}/${id}/status`,
    method: apiMethods.post,
    body: { status },
  };
};

const getVendorCategories = () => {
  return {
    url: Endpoints.getVendorCategories,
    method: apiMethods.get,
  };
};

export const VendorService = baseApi.injectEndpoints({
  endpoints: build => ({
    addProduct: build.mutation({
      query: addProduct,
      invalidatesTags: ['VendorProducts'],
    }),
    getMyProducts: build.query({
      query: getMyProducts,
      providesTags: ['VendorProducts'],
    }),
    deleteProduct: build.mutation({
      query: deleteProduct,
      invalidatesTags: ['VendorProducts'],
    }),
    updateProduct: build.mutation({
      query: updateProduct,
      invalidatesTags: ['VendorProducts'],
    }),
    getVendorDashboard: build.query({
      query: () => ({
        url: Endpoints.vendorDashboard,
        method: apiMethods.get,
      }),
      providesTags: ['VendorProducts'],
    }),
    getVendorOrders: build.query({
      query: getVendorOrders,
      providesTags: ['VendorOrders'],
    }),
    updateVendorOrderStatus: build.mutation({
      query: updateVendorOrderStatus,
      invalidatesTags: ['VendorOrders'],
    }),
    getVendorCategories: build.query({
      query: getVendorCategories,
      providesTags: ['VendorCategories'],
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddProductMutation,
  useGetMyProductsQuery,
  useLazyGetMyProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetVendorDashboardQuery,
  useGetVendorOrdersQuery,
  useUpdateVendorOrderStatusMutation,
  useGetVendorCategoriesQuery,
  useLazyGetVendorCategoriesQuery,
} = VendorService;
