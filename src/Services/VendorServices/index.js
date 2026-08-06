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
  }),
  overrideExisting: true,
});

export const {
  useAddProductMutation,
  useGetMyProductsQuery,
  useLazyGetMyProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = VendorService;
