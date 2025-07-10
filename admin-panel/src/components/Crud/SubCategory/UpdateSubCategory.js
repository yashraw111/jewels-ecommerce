import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import { ViewCateList } from '../CategorySlice'
import { ViewSubCateList } from '../SubCategory'
import { CreateCate } from '../SubCategory'
import { useParams } from 'react-router-dom'

const UpdateSubCategory = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const dispatch = useDispatch()
  const { id } = useParams()
  const { CateList } = useSelector((state) => state.Category)
  const { SubCateList } = useSelector((state) => state.SubCategory)
  console.log(SubCateList)
  console.log('subCat', CateList)
  const singleSubCat = CateList.map((ele) => {
    
  })
  useEffect(() => {
    dispatch(ViewCateList())
    dispatch(ViewSubCateList())
  }, [dispatch])
  async function UpdateSubCategory(data) {
    try {
      dispatch(CreateCate(data))
      toast.success('Category added successfully!', {
        position: 'top-center',
        autoClose: 3000,
      })
      reset()
      // Show();
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CForm className="form shadow text-center" onSubmit={handleSubmit(UpdateSubCategory)}>
              <CCardHeader className="text-start">
                <strong className="fs-2"> update Sub Category</strong>
              </CCardHeader>
              <CCardBody>
                <CFormSelect {...register('category')}>
                  <option value="">Select Category</option>
                  {CateList.map((item, index) => (
                    <option key={index} value={item?._id}>
                      {item?.cat_name}
                    </option>
                  ))}
                </CFormSelect>
                <CFormInput
                  type="text"
                  size="lg"
                  placeholder="Enter Product Category"
                  {...register('subcategory', {
                    required: {
                      value: true,
                      message: 'Category is required',
                    },
                  })}
                />
                {<p className="text-danger">{errors.category?.message}</p>}
                {/* {errorMsg && <p className="text-danger">{errorMsg}</p>} */}
                <br />
                {/* <CFormInput type='file' {...register("img")} ></CFormInput> */}

                <CButton type="submit" className="btn btn-success text-center mt-2">
                  Submit
                </CButton>
              </CCardBody>
            </CForm>
          </CCard>
        </CCol>
      </CRow>
      <ToastContainer />
    </>
  )
}

export default UpdateSubCategory
