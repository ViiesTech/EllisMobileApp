import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  tailors: [],
  services: [],
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    addBooking: (state, action) => {
      const newBooking = {
        id: `b${Date.now()}`,
        status: 'Pending',
        ...action.payload,
      };
      state.bookings.unshift(newBooking);
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find(b => b.id === id);
      if (booking) {
        booking.status = status;
      }
    },
    addService: (state, action) => {
      const newSvc = {
        id: `s_${Date.now()}`,
        ...action.payload,
      };
      state.services.unshift(newSvc);
    },
    updateService: (state, action) => {
      const { id, name, price, description } = action.payload;
      const svc = state.services.find(s => s.id === id);
      if (svc) {
        svc.name = name;
        svc.price = parseFloat(price) || 0;
        svc.description = description;
      }
    },
    deleteService: (state, action) => {
      const id = action.payload;
      state.services = state.services.filter(s => s.id !== id);
    },
  },
});

export const {
  addBooking,
  updateBookingStatus,
  addService,
  updateService,
  deleteService,
} = bookingSlice.actions;

export const selectBookings = state => state?.booking?.bookings || [];
export const selectTailors = state => state?.booking?.tailors || [];
export const selectServices = state => state?.booking?.services || [];

export default bookingSlice.reducer;
