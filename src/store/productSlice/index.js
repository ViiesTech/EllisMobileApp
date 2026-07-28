import { createSlice } from '@reduxjs/toolkit';

export const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Fabric Name',
    category: 'Fabrics',
    price: 120,
    rating: 4.8,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
    description: 'Premium 100% Super 130s Italian Wool. Breathable, crease-resistant, ideal for bespoke tuxedos and business suits.',
    stock: 15,
    material: 'Cotton',
  },
  {
    id: 'p2',
    name: 'Fabric Name',
    category: 'Fabrics',
    price: 120,
    rating: 4.9,
    reviews: 88,
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=500&auto=format&fit=crop&q=80',
    description: 'Tailored fit executive suit crafted with precision padding, pick-stitching, and silk lining.',
    stock: 8,
    material: 'Cotton',
  },
  {
    id: 'p3',
    name: "Men's Pants",
    category: 'Trousers',
    price: 120,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80',
    description: '100% Giza Egyptian Cotton, 140/2 ply thread count. French cuffs and spread collar.',
    stock: 25,
    material: 'Cotton',
  },
  {
    id: 'p4',
    name: "Men's Shirt",
    category: 'Shirts',
    price: 120,
    rating: 4.6,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=80',
    description: 'Satin side stripe detail, adjustable side tabs, flat front design.',
    stock: 12,
    material: 'Cotton',
  },
  {
    id: 'p5',
    name: 'Fabric Name',
    category: 'Fabrics',
    price: 120,
    rating: 4.5,
    reviews: 14,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
    description: 'Premium light grey suiting cotton fabric with white pinstripes.',
    stock: 20,
    material: 'Cotton',
  },
  {
    id: 'p6',
    name: 'Fabric Name',
    category: 'Fabrics',
    price: 120,
    rating: 4.7,
    reviews: 33,
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=500&auto=format&fit=crop&q=80',
    description: 'Premium navy cotton fabric with textured micro weave.',
    stock: 18,
    material: 'Cotton',
  },
  {
    id: 'p7',
    name: 'Tweed Suiting Wool',
    category: 'Fabrics',
    price: 140,
    rating: 4.9,
    reviews: 25,
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=80',
    description: 'Heavier weight authentic tweed wool fabric for stylish winter coats and structured jackets.',
    stock: 10,
    material: 'Wool',
  },
  {
    id: 'p8',
    name: 'Mulberry Silk Blend',
    category: 'Fabrics',
    price: 160,
    rating: 4.8,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop&q=80',
    description: 'Exquisite silk and cotton weave offering a delicate shine and beautiful drape.',
    stock: 15,
    material: 'Silk Blend',
  },
  {
    id: 'p9',
    name: 'Italian Merino Wool',
    category: 'Fabrics',
    price: 180,
    rating: 4.9,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
    description: 'Superfine Merino Wool from Biella mills. Ultimate softness, breathability, and thermo-regulation.',
    stock: 8,
    material: 'Merino Wool',
  },
];

const initialState = {
  products: INITIAL_PRODUCTS,
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
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.qty += quantity;
      } else {
        state.cart.push({ ...product, qty: quantity });
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
