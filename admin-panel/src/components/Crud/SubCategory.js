import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  SubCateList: [],
}

export const CreateCate = createAsyncThunk('Category/CreateCate', async (data) => {
  const res = await axios.post(`${import.meta.env.VITE_BASE_URL_SUB_CAT}/`, data)
  // console.log(res)
  // const newCate = {
  //   id: res.data.id,
  //   ...data,
  // }
  return data
})

export const ViewSubCateList = createAsyncThunk('Category/ViewSubCateList', async () => {
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL_SUB_CAT}/`)
  // console.log(res)

  return res.data
})

export const DeleteCate = createAsyncThunk('Category/DeleteCate', async (id) => {
  await axios.delete(`${import.meta.env.VITE_BASE_URL_SUB_CAT}/${id}`)
  return id
})

export const UpdateCate = createAsyncThunk('Category/UpdateCate', async (data) => {
  // const { _id } = data
  console.log(data)
 
})
const CategorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateCate.fulfilled, (state, action) => {
        state.SubCateList.push(action.payload)
       
      })
      .addCase(ViewSubCateList.fulfilled, (state, action) => {
        state.SubCateList = action.payload
        // console.log( "sbjs",state.CateList)
      })
      .addCase(DeleteCate.fulfilled, (state, action) => {
        const id = action.payload
        const filterData = state.SubCateList.filter((ele) => {
          return ele._id != id
        })
        state.SubCateList = filterData
      })
      .addCase(UpdateCate.fulfilled, (state, action) => {
        const { id } = action.payload
        const Index_num = state.SubCateList.findIndex((ele) => {
          return ele._id == id
        })
        if (Index_num != -1) {
          state.SubCateList[Index_num] = action.payload
        }
      })
  },
})

export default CategorySlice.reducer
