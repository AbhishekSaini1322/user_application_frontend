import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
  loginDisplay: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login actions
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
      state.loginDisplay = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },

    // Logout actions
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.loginDisplay = false;
    },

    // Token actions
    setAuthToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    // User actions
    setUser: (state, action) => {
      state.user = action.payload;
    },

    // UI actions
    setLoginDisplay: (state, action) => {
      state.loginDisplay = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Loading actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setAuthToken,
  setUser,
  setLoginDisplay,
  clearError,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer; 