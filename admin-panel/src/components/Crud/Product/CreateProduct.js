import React, { useEffect } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { ViewCateList } from '../CategorySlice'
import { Createpr } from '../ProductSlice'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onTouched' })

  const dispatch = useDispatch()
  const { CateList } = useSelector((state) => state.Category)

  useEffect(() => {
    dispatch(ViewCateList())
  }, [dispatch])

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i])
      }
      formData.append('CateGory', data.CateGory)
      formData.append('productName', data.productName)
      formData.append('material', data.material)
      formData.append('size', data.size)
      formData.append('WithoutDiscountPrice', data.WithoutDiscountPrice)
      formData.append('productPrice', data.productPrice)
      formData.append('rate', data.rate)
      formData.append('description', data.description)
      formData.append('alreadySold', data.alreadySold)
      formData.append('available', data.available)
      formData.append('discount', data.discount)

      await dispatch(Createpr(formData))

      toast.success('Product added successfully!', {
        position: 'top-center',
        autoClose: 3000,
      })

      reset()
    } catch (err) {
      console.error('Product submit error:', err)
      toast.error('Failed to submit product')
    }
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol xs={12} md={8} lg={6}>
          <CCard className="mb-4 shadow-lg">
            <CCardHeader className="text-center bg-dark text-white py-3">
              <strong className="fs-3">Create Product</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="p-3" onSubmit={handleSubmit(onSubmit)}>
                {/* Category */}
                <CFormLabel className="fw-bold">Category</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  {...register('CateGory', { required: 'Category is required' })}
                >
                  <option value="">Select Category</option>
                  {CateList?.map((ele, index) => (
                    <option key={index} value={ele._id}>{ele.cat_name}</option>
                  ))}
                </CFormSelect>
                {errors.CateGory && <p className="text-danger">{errors.CateGory.message}</p>}

                {/* Product Name */}
                <CFormLabel className="fw-bold">Product Name</CFormLabel>
                <CFormInput
                  className="mb-3"
                  placeholder="Enter product name"
                  {...register('productName', { required: 'Required' })}
                />
                {errors.productName && <p className="text-danger">{errors.productName.message}</p>}

                {/* Material */}
                <CFormLabel className="fw-bold">Material</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  {...register('material', { required: 'Material is required' })}
                >
                  <option value="">Select Material</option>
                  <option value="18k Gold">18k Gold</option>
                  <option value="22k Gold">22k Gold</option>
                  <option value="Rose Gold">Rose Gold</option>
                </CFormSelect>

                {/* Size */}
                <CFormLabel className="fw-bold">Size</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  {...register('size', { required: 'Size is required' })}
                >
                  <option value="">Select Size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </CFormSelect>

                {/* Pricing */}
                <CFormLabel className="fw-bold">Product Price</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  {...register('productPrice', { required: 'Price is required' })}
                />

                <CFormLabel className="fw-bold">Without Discount Price</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  {...register('WithoutDiscountPrice', { required: 'Required field' })}
                />

                {/* Rating */}
                <CFormLabel className="fw-bold">Rate</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  {...register('rate', { required: 'Rate is required', min: 1, max: 5 })}
                />

                {/* Description */}
                <CFormLabel className="fw-bold">Description</CFormLabel>
                <CFormTextarea
                  className="mb-3"
                  {...register('description', { required: 'Description is required' })}
                />

                {/* Quantities */}
                <CFormLabel className="fw-bold">Already Sold</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  {...register('alreadySold', { required: 'Required' })}
                />

                <CFormLabel className="fw-bold">Available Quantity</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  {...register('available', { required: 'Required' })}
                />

                {/* Discount */}
                <CFormLabel className="fw-bold">Discount (%)</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  {...register('discount', { required: 'Required' })}
                />

                {/* Multiple Image Upload */}
                <CFormLabel className="fw-bold">Product Images</CFormLabel>
                <CFormInput
                  type="file"
                  className="mb-3"
                  multiple
                  {...register('images', { required: 'Images are required' })}
                />
                {errors.images && <p className="text-danger">{errors.images.message}</p>}

                <div className="text-center">
                  <CButton type="submit" color="success" className="px-4 py-2 fw-bold">
                    Submit Product
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <ToastContainer />
    </>
  )
}

export default CreateProduct