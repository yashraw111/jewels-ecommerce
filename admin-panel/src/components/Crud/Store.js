// Store.js
import { configureStore } from "@reduxjs/toolkit"
import PrSlice from "./ProductSlice"
import CateSlice from "./CategorySlice"
import SubCateSlice from './SubCategory'
import cartItem from './CartSlice'
import orderSlice from './OrderSlice'
import contactReducer from './ContactSlice'
import sidebarReducer from './sidebarSlice' // 👈 new import

const Store = configureStore({
  reducer: {
    product: PrSlice,
    contacts: contactReducer,
    Category: CateSlice,
    SubCategory: SubCateSlice,
    cartItems: cartItem,
    orders: orderSlice,
    sidebar: sidebarReducer, // 👈 add sidebar reducer
  },
})

export default Store
