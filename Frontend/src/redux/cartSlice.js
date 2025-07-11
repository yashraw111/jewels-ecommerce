import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Fetch all cart items for a user
export const fetchCart = createAsyncThunk("cart/fetch", async (userId) => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL_CART}/${userId}`);
  return res.data;
});

// ✅ Toggle cart add/remove
export const toggleCart = createAsyncThunk(
  "cart/toggle",
  async ({ userId, productId, size, material, quantity }, { dispatch }) => {
    await axios.post(`${import.meta.env.VITE_BASE_URL_CART}/toggle`, {
      userId,
      productId,
      size,
      material,
      quantity,
    });
    dispatch(fetchCart(userId));
  }
);

// ✅ Delete a specific cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteItem",
  async ({ cartItemId, userId }, { dispatch }) => {
    await axios.delete(`${import.meta.env.VITE_BASE_URL_CART}/${cartItemId}`);
    dispatch(fetchCart(userId));
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
