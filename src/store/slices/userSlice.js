import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Get user profile actions
    getUserProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getUserProfileSuccess: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    getUserProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update user profile actions
    updateUserProfileStart: (state) => {
      state.updateLoading = true;
      state.error = null;
    },
    updateUserProfileSuccess: (state, action) => {
      state.profile = action.payload;
      state.updateLoading = false;
      state.error = null;
    },
    updateUserProfileFailure: (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    },

    // Clear user data
    clearUserData: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.updateLoading = false;
    },

    // Clear error
    clearUserError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getUserProfileStart,
  getUserProfileSuccess,
  getUserProfileFailure,
  updateUserProfileStart,
  updateUserProfileSuccess,
  updateUserProfileFailure,
  clearUserData,
  clearUserError,
} = userSlice.actions;

export default userSlice.reducer; 