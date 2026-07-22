import { createSlice } from '@reduxjs/toolkit';

export const INITIAL_TAILORS = [
  {
    id: 't1',
    name: 'Master Savile Rows',
    tailorName: 'Alex Masterson',
    rating: 4.9,
    distance: '1.2 km',
    experience: '15 Years Experience',
    priceStarting: 120,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    specialties: ['Bespoke Suits', 'Alterations', 'Tuxedo Fitting'],
    bio: 'Crafting luxury tailored menswear with artisanal hand-stitching techniques passed down through generations.',
  },
  {
    id: 't2',
    name: 'Elite Cut Studio',
    tailorName: 'Marco Rossi',
    rating: 4.8,
    distance: '2.5 km',
    experience: '10 Years Experience',
    priceStarting: 90,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    specialties: ['Custom Shirts', 'Italian Slim Fit', 'Wedding Wear'],
    bio: 'Specialist in modern Italian silhouette cuts, door-step measurement visits and quick turnaround times.',
  },
];

export const INITIAL_SERVICES = [
  {
    id: 's1',
    name: 'Custom 2-Piece Suit Stitching',
    price: 180,
    time: '5-7 Days',
    description: 'Full bespoke measurement, canvas lining, two fittings included.',
  },
  {
    id: 's2',
    name: 'Dress Shirt Tailoring',
    price: 45,
    time: '2-3 Days',
    description: 'Custom collar, cuffs, and body contour fitting.',
  },
  {
    id: 's3',
    name: 'Trouser Hemming & Slimming',
    price: 25,
    time: '24 Hours',
    description: 'Precise waist adjustment, taper leg, and blind stitch cuff.',
  },
];

export const INITIAL_BOOKINGS = [
  {
    id: 'b101',
    serviceName: 'Custom 2-Piece Suit Stitching',
    tailorName: 'Master Savile Rows',
    date: '2026-07-25',
    time: '11:00 AM',
    price: 180,
    status: 'Pending', // Pending | In Progress | Completed | Rejected
    customerName: 'Alan Charles',
    phone: '+1 234 567 8900',
    address: '742 Evergreen Terrace, Springfield',
    measurements: {
      chest: '40 in',
      waist: '32 in',
      shoulder: '18 in',
      armLength: '25 in',
      neck: '15.5 in',
    },
  },
];

const initialState = {
  bookings: INITIAL_BOOKINGS,
  tailors: INITIAL_TAILORS,
  services: INITIAL_SERVICES,
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
  },
});

export const { addBooking, updateBookingStatus, addService } =
  bookingSlice.actions;

export const selectBookings = state => state?.booking?.bookings || [];
export const selectTailors = state => state?.booking?.tailors || [];
export const selectServices = state => state?.booking?.services || [];

export default bookingSlice.reducer;
