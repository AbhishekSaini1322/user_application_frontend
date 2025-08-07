import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    // Get all items actions
    getItemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getItemsSuccess: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    getItemsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get single item actions
    getItemStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getItemSuccess: (state, action) => {
      state.currentItem = action.payload;
      state.loading = false;
      state.error = null;
    },
    getItemFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Create item actions
    createItemStart: (state) => {
      state.createLoading = true;
      state.error = null;
    },
    createItemSuccess: (state, action) => {
      state.items.push(action.payload);
      state.createLoading = false;
      state.error = null;
    },
    createItemFailure: (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
    },

    // Update item actions
    updateItemStart: (state) => {
      state.updateLoading = true;
      state.error = null;
    },
    updateItemSuccess: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      state.currentItem = action.payload;
      state.updateLoading = false;
      state.error = null;
    },
    updateItemFailure: (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    },

    // Delete item actions
    deleteItemStart: (state) => {
      state.deleteLoading = true;
      state.error = null;
    },
    deleteItemSuccess: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.currentItem = null;
      state.deleteLoading = false;
      state.error = null;
    },
    deleteItemFailure: (state, action) => {
      state.deleteLoading = false;
      state.error = action.payload;
    },

    // Clear current item
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },

    // Clear items data
    clearItemsData: (state) => {
      state.items = [];
      state.currentItem = null;
      state.loading = false;
      state.error = null;
      state.createLoading = false;
      state.updateLoading = false;
      state.deleteLoading = false;
    },

    // Clear error
    clearItemsError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getItemsStart,
  getItemsSuccess,
  getItemsFailure,
  getItemStart,
  getItemSuccess,
  getItemFailure,
  createItemStart,
  createItemSuccess,
  createItemFailure,
  updateItemStart,
  updateItemSuccess,
  updateItemFailure,
  deleteItemStart,
  deleteItemSuccess,
  deleteItemFailure,
  clearCurrentItem,
  clearItemsData,
  clearItemsError,
} = itemsSlice.actions;

export default itemsSlice.reducer; 