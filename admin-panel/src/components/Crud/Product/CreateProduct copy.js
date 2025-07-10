import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Createpr } from '../UserSlice'
import { ViewCateList } from '../CategorySlice'
import swal from 'sweetalert';

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  const dispatch = useDispatch()
  const {CateList}= useSelector((state)=>state.Category)
  
  
  useEffect(() => {
    dispatch(ViewCateList())
  }, [dispatch])

  async function regist(data) {
 
    try {
      
      alert("Data submitted successfully!");
      reset();
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CForm novalidate className="form shadow text-center" onSubmit={handleSubmit(regist)}>
            <CCardHeader className="text-start">
              <strong className="fs-2">Create Product</strong>
            </CCardHeader>
            <CCardBody>
              <CFormSelect  aria-label="Default select example" {...register('CateGory')}>
                <option>Open this select menu</option>
                {CateList.map((ele) => {
                  console.log(ele)
                  return (
                    <>
                      <option value={ele.cat_name}>{ele.cat_name}</option>
                    </>
                  )
                })}
              </CFormSelect>
              <CFormInput
                type="text"
                size="sm"
                className="mt-3"
                placeholder="Enter  Product Name"
                {...register('name', { required: 'Product name is required' })}
              />
              {errors.name && <p className="text-danger">{errors.name.message}</p>}
              <br />
              <CFormInput
                type="number"
                size="sm"
                placeholder="Enter  Product Price"
                {...register('price', { required: 'Price is required' })}
              />
              {errors.price && <p className="text-danger">{errors.price.message}</p>}
              <br />
              <CFormTextarea
                size="sm"
                placeholder="Enter  Product Description"
                {...register('des', { required: 'Description is required' })}
              />
              {errors.des && <p className="text-danger">{errors.des.message}</p>}
              <br />
              <CFormInput type='file' {...register("image", { required: "Image is required" })}  />
              <CButton type="submit" className="btn btn-success text-center mt-2">
                Submit
              </CButton>
            </CCardBody>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default CreateProduct    