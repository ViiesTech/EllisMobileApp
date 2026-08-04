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

export const VendorService = baseApi.injectEndpoints({
  endpoints: build => ({
    addProduct: build.mutation({
      query: addProduct,
    }),
    getMyProducts: build.query({
      query: getMyProducts,
    }),
  }),
  overrideExisting: true,
});

export const {
  useAddProductMutation,
  useGetMyProductsQuery,
  useLazyGetMyProductsQuery,
} = VendorService;
