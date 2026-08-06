import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  businessProfile: null,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setBusinessProfile: (state, action) => {
      state.businessProfile = action.payload;
    },
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

export const {
  setUser,
  setUserProfile,
  setToken,
  setRole,
  setClearStore,
  setBusinessProfile,
} = authSlice.actions;

export const selectUser = state => state?.auth?.user;
export const selectToken = state => state?.auth?.token;
export const selectRole = state => state?.auth?.role;
export const selectBusinessProfile = state => state?.auth?.businessProfile;

export default authSlice.reducer;
