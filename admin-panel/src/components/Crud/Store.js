import { configureStore } from "@reduxjs/toolkit";
import PrSlice from "./ProductSlice";
import CateSlice from "./CategorySlice";
import SubCateSlice from './SubCategory'
import cartItem from './CartSlice'

const Store = configureStore({
    reducer:{
        product:PrSlice,
        Category:CateSlice,
        SubCategory:SubCateSlice,
        cartItems:cartItem
    }
})

export default Store