import { createSlice } from '@reduxjs/toolkit';
import { AppImages } from '../../assets/images/AppImages';

export const INITIAL_TAILORS = [
  {
    id: 't1',
    name: 'Master Savile Rows',
    tailorName: 'Alex Masterson',
    rating: 4.9,
    distance: '1.2 km',
    experience: '15 Years Experience',
    priceStarting: 120,
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
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
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    specialties: ['Custom Shirts', 'Italian Slim Fit', 'Wedding Wear'],
    bio: 'Specialist in modern Italian silhouette cuts, door-step measurement visits and quick turnaround times.',
  },
];

export const INITIAL_SERVICES = [
  {
    id: 's1',
    name: 'Suit Stitching',
    image: AppImages.placeholder,
    price: 120,
    time: '5-7 Days',
    description: 'Lorem ipsum simply dummy',
  },
  {
    id: 's2',
    name: 'Alteration',
    image: AppImages.placeholder,
    price: 30,
    time: '24 Hours',
    description: 'Lorem ipsum simply dummy',
  },
  {
    id: 's3',
    name: 'Tuxedo Stitching',
    image: AppImages.placeholder,
    price: 150,
    time: '3-5 Days',
    description: 'Lorem ipsum simply dummy',
  },
];

export const INITIAL_BOOKINGS = [
  {
    id: 'b1',
    serviceName: 'Suit Stitching',
    tailorName: 'Liam James',
    date: '2026-07-25',
    time: '45 mins ago',
    price: 180,
    status: 'Pending',
    customerName: 'Alex Charlie',
    phone: '+1 234 567 8900',
    address: 'Chicago, United States',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    measurements: {
      chest: '40 in',
      waist: '32 in',
      shoulder: '18 in',
      armLength: '25 in',
    },
  },
  {
    id: 'b2',
    serviceName: 'Suit Stitching',
    tailorName: 'Liam James',
    date: '2026-07-25',
    time: '45 mins ago',
    price: 180,
    status: 'Pending',
    customerName: 'John Smith',
    phone: '+1 987 654 3210',
    address: 'Chicago, United States',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    measurements: {
      chest: '42 in',
      waist: '34 in',
      shoulder: '19 in',
      armLength: '26 in',
    },
  },
  {
    id: 'b3',
    serviceName: 'Suit Stitching',
    tailorName: 'Liam James',
    date: '2026-07-25',
    time: '45 mins ago',
    price: 180,
    status: 'Pending',
    customerName: 'Richard',
    phone: '+1 555 123 4567',
    address: 'Chicago, United States',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    measurements: {
      chest: '44 in',
      waist: '36 in',
      shoulder: '20 in',
      armLength: '27 in',
    },
  },
  {
    id: 'b4',
    serviceName: 'Suit Stitching',
    tailorName: 'Liam James',
    date: '2026-07-25',
    time: '45 mins ago',
    price: 180,
    status: 'Pending',
    customerName: 'Alex Charlie',
    phone: '+1 234 567 8900',
    address: 'Chicago, United States',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    measurements: {
      chest: '40 in',
      waist: '32 in',
      shoulder: '18 in',
      armLength: '25 in',
    },
  },
  {
    id: 'b5',
    serviceName: 'Suit Stitching',
    tailorName: 'Liam James',
    date: '2026-07-25',
    time: '45 mins ago',
    price: 180,
    status: 'Pending',
    customerName: 'John Smith',
    phone: '+1 987 654 3210',
    address: 'Chicago, United States',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    measurements: {
      chest: '42 in',
      waist: '34 in',
      shoulder: '19 in',
      armLength: '26 in',
    },
  },
  {
    id: 'b6',
    serviceName: 'Suit Stitching',
    tailorName: 'Liam James',
    date: '2026-07-25',
    time: '45 mins ago',
    price: 180,
    status: 'Pending',
    customerName: 'Richard',
    phone: '+1 555 123 4567',
    address: 'Chicago, United States',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    measurements: {
      chest: '44 in',
      waist: '36 in',
      shoulder: '20 in',
      armLength: '27 in',
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
