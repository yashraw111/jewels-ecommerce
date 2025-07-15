import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

// GET all orders (admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/orders`);
    return res.data.orders;
  }
);

// UPDATE order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }) => {
    const res = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/orders/status/${orderId}`, { status });
    return res.data.order;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default orderSlice.reducer;
