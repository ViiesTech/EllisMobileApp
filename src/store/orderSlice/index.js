import { createSlice } from '@reduxjs/toolkit';

export const INITIAL_ORDERS = [
  {
    id: 'ord-34567',
    customerName: 'Liam James',
    productName: 'Italian Navy Wool Suit Fabric',
    price: 560,
    itemsInfo: '3 Items - $560',
    date: '2026-07-22',
    status: 'New',
    time: '10 mins ago',
    image:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&auto=format&fit=crop&q=80',
    address: '123 Main St, New York, NY',
  },
  {
    id: 'ord-34568',
    customerName: 'Sarah Jenkins',
    productName: 'Charcoal Executive 2-Piece Suit',
    price: 350,
    itemsInfo: '1 Item - $350',
    date: '2026-07-22',
    status: 'Processing',
    time: '1 hour ago',
    image:
      'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=80',
    address: '456 Broadway, New York, NY',
  },
  {
    id: 'ord-34569',
    customerName: 'Andrew Ainsly',
    productName: 'Egyptian Cotton White Dress Shirt',
    price: 180,
    itemsInfo: '2 Items - $180',
    date: '2026-07-22',
    status: 'Pending',
    time: '2 hours ago',
    image:
      'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&auto=format&fit=crop&q=80',
    address: '789 Fashion Ave, New York, NY',
  },
  {
    id: 'ord-34570',
    customerName: 'Emma Watson',
    productName: 'Classic Cashmere Beige Trenchcoat',
    price: 850,
    itemsInfo: '1 Item - $850',
    date: '2026-07-22',
    status: 'Shipped',
    time: '4 hours ago',
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=80',
    address: '246 Regent St, New York, NY',
  },
  {
    id: 'ord-34571',
    customerName: 'Sophia Loren',
    productName: 'Evening Silk Velvet Gown',
    price: 1200,
    itemsInfo: '1 Item - $1200',
    date: '2026-07-21',
    status: 'Pending',
    time: '1 day ago',
    image:
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&auto=format&fit=crop&q=80',
    address: '777 Beverly Hills, Los Angeles, CA',
  },
  {
    id: 'ord-34572',
    customerName: 'Michael B.',
    productName: 'Tailored Tuxedo Trousers',
    price: 240,
    itemsInfo: '2 Items - $240',
    date: '2026-07-21',
    status: 'Processing',
    time: '2 days ago',
    image:
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=500&auto=format&fit=crop&q=80',
    address: '101 Tuxedo Pl, New York, NY',
  },
  {
    id: 'ord-34573',
    customerName: 'John Doe',
    productName: 'Slim Fit Denim Jacket',
    price: 120,
    itemsInfo: '1 Item - $120',
    date: '2026-07-20',
    status: 'Delivered',
    time: '3 days ago',
    image:
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=80',
    address: '102 Denim Way, Brooklyn, NY',
  },
  {
    id: 'ord-34574',
    customerName: 'Olivia Wilde',
    productName: 'Double-Breasted Gold Button Blazer',
    price: 450,
    itemsInfo: '1 Item - $450',
    date: '2026-07-19',
    status: 'Delivered',
    time: '5 days ago',
    image:
      'https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=500&auto=format&fit=crop&q=80',
    address: '555 Hollywood Blvd, Los Angeles, CA',
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
        status: 'New',
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
