import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  cart: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const newProd = {
        id: `p_${Date.now()}`,
        rating: 5.0,
        reviews: 1,
        ...action.payload,
      };
      state.products.unshift(newProd);
    },
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const cartItemId = `${product.id}_${product.selectedColor || 'default'}`;
      const existing = state.cart.find(item => item.id === cartItemId);
      if (existing) {
        existing.qty += quantity;
      } else {
        state.cart.push({
          ...product,
          productId: product.id,
          id: cartItemId,
          qty: quantity,
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    updateCartQty: (state, action) => {
      const { id, delta } = action.payload;
      const item = state.cart.find(i => i.id === id);
      if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
          state.cart = state.cart.filter(i => i.id !== id);
        }
      }
    },
    clearCart: state => {
      state.cart = [];
    },
    editProduct: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.products.findIndex(p => p.id === id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updates };
      }
    },
  },
});

export const {
  addProduct,
  addToCart,
  removeFromCart,
  updateCartQty,
  clearCart,
  editProduct,
} = productSlice.actions;

export const selectProducts = state => state?.product?.products || [];
export const selectCart = state => state?.product?.cart || [];

export default productSlice.reducer;
