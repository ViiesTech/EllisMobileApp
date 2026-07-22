import { createSlice } from '@reduxjs/toolkit';

export const INITIAL_ORDERS = [
  {
    id: 'ord-8821',
    customerName: 'Sarah Jenkins',
    productName: 'Italian Navy Wool Suit Fabric',
    price: 180,
    date: '2026-07-20',
    status: 'Pending', // Pending | Shipped | Delivered
    address: '123 Main St, New York, NY',
  },
];

const initialState = {
  orders: INITIAL_ORDERS,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const newOrder = {
        id: `ord-${Date.now()}`,
        status: 'Pending',
        ...action.payload,
      };
      state.orders.unshift(newOrder);
    },
    updateOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.orders.find(o => o.id === id);
      if (order) {
        order.status = status;
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = orderSlice.actions;

export const selectOrders = state => state?.order?.orders || [];

export default orderSlice.reducer;
