// slice/CartSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};
export const fetchAllCarts = createAsyncThunk(
  'cart/fetchAllCarts',
  async () => {
    const res = await axios.get('http://localhost:8000/api/cart/allCart');
    return res.data;
  }
);
export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async (cartId) => {
    await axios.delete(`http://localhost:8000/api/cart/delete/${cartId}`);
    return cartId;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCarts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchAllCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
      });
  },
});

export default cartSlice.reducer;
