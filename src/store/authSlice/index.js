import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    name: 'Alan Charles',
    email: 'alan.charles@example.com',
    phone: '+1 234 567 8900',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    businessName: 'Ellis Couture Studio',
    accountStatus: 'Approved',
  },
  token: null,
  role: 'USER',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserProfile: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setClearStore: () => {
      return initialState;
    },
  },
});

export const { setUser, setUserProfile, setToken, setRole, setClearStore } =
  authSlice.actions;

export const selectUser = state => state?.auth?.user;
export const selectToken = state => state?.auth?.token;
export const selectRole = state => state?.auth?.role;

export default authSlice.reducer;
