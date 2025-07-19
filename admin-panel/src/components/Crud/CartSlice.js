// src/OrderSlice.js (or src/slices/OrderSlice.js)
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  updateStatusLoading: false, // For specific status update loading
  updateStatusError: null,    // For specific status update error
};

// Async Thunk to fetch all orders (for admin)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/orders`); // Adjust URL if needed
      return res.data.orders; // Assuming your API returns { success: true, orders: [...] }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Async Thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/orders/status/${orderId}`, { status });
      return res.data.order; // Assuming your API returns { success: true, order: updatedOrder }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetchAllOrders handlers ---
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch orders";
      })
      // --- updateOrderStatus handlers ---
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        // Find the updated order and replace it in the state
        const updatedOrder = action.payload;
        state.orders = state.orders.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload || "Failed to update order status";
      });
  },
});

export default orderSlice.reducer;