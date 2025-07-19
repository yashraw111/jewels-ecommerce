import React, { useEffect, useState } from 'react' // Import useState
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
import { useForm, useFieldArray } from 'react-hook-form' // Import useFieldArray
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
  } = useForm({ mode: 'onTouched' });

  // Define sizes available
  const availableSizes = ["XS", "S", "M", "L", "XL"];

  // Use useFieldArray for dynamic size and quantity inputs
  const { fields, append, remove } = useFieldArray({
    control: useForm({ mode: 'onTouched' }).control, // This needs to be passed correctly from useForm
    name: "sizes",
  });

  // Initialize form with existing sizes if any, or add an empty one
  useEffect(() => {
    // If you're editing, you'd populate `fields` with existing product sizes
    // For creation, you can optionally add a default empty size row
    if (fields.length === 0) {
      append({ size: '', quantity: 0 });
    }
  }, []);

  const dispatch = useDispatch()
  const { CateList } = useSelector((state) => state.Category)

  useEffect(() => {
    dispatch(ViewCateList())
  }, [dispatch])

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (let i = 0; i < data.images.length; i++) {
        formData.append('images', data.images[i])
      }
      formData.append('CateGory', data.CateGory)
      formData.append('productName', data.productName)
      formData.append('material', data.material)
      // Removed individual size and available
      formData.append('WithoutDiscountPrice', data.WithoutDiscountPrice)
      formData.append('productPrice', data.productPrice)
      formData.append('rate', data.rate)
      formData.append('description', data.description)
      formData.append('alreadySold', data.alreadySold)
      formData.append('discount', data.discount)

      // Append sizes data as a JSON string
      formData.append('sizesData', JSON.stringify(data.sizes));


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

                {/* Dynamic Size and Quantity Inputs */}
                <CFormLabel className="fw-bold">Sizes & Quantities</CFormLabel>
                {fields.map((item, index) => (
                  <div key={item.id} className="d-flex align-items-center mb-3">
                    <CFormSelect
                      className="me-2"
                      {...register(`sizes[${index}].size`, { required: 'Size is required' })}
                      defaultValue={item.size}
                    >
                      <option value="">Select Size</option>
                      {availableSizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </CFormSelect>
                    <CFormInput
                      type="number"
                      placeholder="Quantity"
                      {...register(`sizes[${index}].quantity`, { required: 'Quantity is required', min: 0 })}
                      defaultValue={item.quantity}
                    />
                    <CButton color="danger" className="ms-2" onClick={() => remove(index)}>
                      Remove
                    </CButton>
                  </div>
                ))}
                <CButton type="button" color="info" className="mb-3" onClick={() => append({ size: '', quantity: 0 })}>
                  Add Size
                </CButton>
                {errors.sizes && <p className="text-danger">Please ensure all size and quantity fields are filled.</p>}


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

                {/* Removed available quantity input as it's now per size */}
                {/* <CFormLabel className="fw-bold">Available Quantity</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  {...register('available', { required: 'Required' })}
                /> */}

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