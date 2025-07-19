import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
import { useForm, useFieldArray } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { UpdateProduct, ViewList } from '../ProductSlice'
import { ViewCateList } from '../CategorySlice'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UpdateProject = () => {
  const { id } = useParams()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm({ mode: 'onTouched' })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'sizes',
  })

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL']
  const { ProductList } = useSelector((state) => state.product)
  const { CateList } = useSelector((state) => state.Category)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const dispatch = useDispatch()
  const redirect = useNavigate()

  const singleProduct = ProductList.find((ele) => ele._id === id)

  useEffect(() => {
    dispatch(ViewList())
    dispatch(ViewCateList())
  }, [dispatch])

 useEffect(() => {
  if (singleProduct && CateList.length > 0) {
    const matchedCategory = CateList.find(
      (cat) => cat._id === singleProduct.category
    )

    if (matchedCategory) {
      setValue('category', matchedCategory._id)
      setSelectedCategoryId(matchedCategory._id)
    } else {
      setValue('category', '') // fallback if not matched
    }

    reset({
      ...singleProduct,
      material: singleProduct.material || '',
    })

    if (singleProduct.sizes && singleProduct.sizes.length > 0) {
      replace(singleProduct.sizes)
    } else {
      replace([{ size: '', quantity: 0 }])
    }
  }
}, [singleProduct, CateList, reset, setValue, replace])

  const Update = async (data) => {
    try {
      const formData = new FormData()

      if (data.images && data.images.length > 0) {
        for (let i = 0; i < data.images.length; i++) {
          formData.append('images', data.images[i])
        }
      } else if (singleProduct.images && singleProduct.images.length > 0) {
        singleProduct.images.forEach((image) => {
          formData.append('existingImages', image)
        })
      }

      formData.append('_id', singleProduct._id)
      formData.append('productName', data.productName)
      formData.append('category', data.category)
      formData.append('WithoutDiscountPrice', data.WithoutDiscountPrice)
      formData.append('productPrice', data.productPrice)
      formData.append('material', data.material)
      formData.append('rate', data.rate)
      formData.append('description', data.description)
      formData.append('alreadySold', data.alreadySold)
      formData.append('discount', data.discount)
      formData.append('sizesData', JSON.stringify(data.sizes))

      await dispatch(UpdateProduct({ formData, _id: singleProduct._id }))

      toast.success('Product updated successfully!', {
        position: 'top-center',
        autoClose: 3000,
      })
      redirect('/base/ViewList')
    } catch (error) {
      console.error('Error updating product:', error)
      toast.error('Failed to update product')
    }
  }

  return (
    <>
      <CRow className="justify-content-center">
        <CCol xs={12} md={8} lg={6}>
          <CCard className="mb-4 shadow-lg">
            <CCardHeader className="text-center bg-dark text-white py-3">
              <strong className="fs-3">Update Product</strong>
            </CCardHeader>
            <CCardBody>
              <CForm className="p-3" onSubmit={handleSubmit(Update)}>
                {/* Category */}
                <CFormLabel className="fw-bold">Category</CFormLabel>
                <CFormSelect
                  className="mb-3"
                  {...register('category', { required: 'Category is required' })}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {CateList.map((ele, index) => (
                    <option key={index} value={ele._id}>
                      {ele.cat_name}
                    </option>
                  ))}
                </CFormSelect>
                {errors.category && <p className="text-danger">{errors.category.message}</p>}

                {/* Product Name */}
                <CFormLabel className="fw-bold">Product Name</CFormLabel>
                <CFormInput
                  type="text"
                  className="mb-3"
                  placeholder="Enter Product Name"
                  {...register('productName', {
                    required: 'Product name is required',
                    minLength: { value: 3, message: 'Minimum 3 characters required' },
                  })}
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
                {errors.material && <p className="text-danger">{errors.material.message}</p>}

                {/* Sizes & Quantities */}
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
                      {...register(`sizes[${index}].quantity`, {
                        required: 'Quantity is required',
                        min: 0,
                      })}
                      defaultValue={item.quantity}
                    />
                    <CButton color="danger" className="ms-2" onClick={() => remove(index)}>
                      Remove
                    </CButton>
                  </div>
                ))}
                <CButton
                  type="button"
                  color="info"
                  className="mb-3"
                  onClick={() => append({ size: '', quantity: 0 })}
                >
                  Add Size
                </CButton>

                {/* Product Price */}
                <CFormLabel className="fw-bold">Product Price</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  placeholder="Enter Product Price"
                  {...register('productPrice', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be positive' },
                  })}
                />
                {errors.productPrice && <p className="text-danger">{errors.productPrice.message}</p>}

                {/* Without Discount Price */}
                <CFormLabel className="fw-bold">Without Discount Price</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  placeholder="Enter Without Discount Price"
                  {...register('WithoutDiscountPrice', {
                    required: 'Price is required',
                    min: { value: 1, message: 'Price must be positive' },
                  })}
                />
                {errors.WithoutDiscountPrice && (
                  <p className="text-danger">{errors.WithoutDiscountPrice.message}</p>
                )}

                {/* Rate */}
                <CFormLabel className="fw-bold">Rate</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  placeholder="Enter Rate (1-5)"
                  {...register('rate', {
                    required: 'Rate is required',
                    min: { value: 1, message: 'Minimum 1' },
                    max: { value: 5, message: 'Maximum 5' },
                  })}
                />
                {errors.rate && <p className="text-danger">{errors.rate.message}</p>}

                {/* Description */}
                <CFormLabel className="fw-bold">Description</CFormLabel>
                <CFormTextarea
                  className="mb-3"
                  placeholder="Enter Description"
                  {...register('description', {
                    required: 'Description is required',
                    minLength: { value: 10, message: 'Minimum 10 characters required' },
                  })}
                />
                {errors.description && <p className="text-danger">{errors.description.message}</p>}

                {/* Already Sold */}
                <CFormLabel className="fw-bold">Already Sold</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  placeholder="Enter Already Sold Quantity"
                  {...register('alreadySold', {
                    required: 'Enter sold quantity',
                    min: { value: 0, message: 'Cannot be negative' },
                  })}
                />
                {errors.alreadySold && <p className="text-danger">{errors.alreadySold.message}</p>}

                {/* Discount */}
                <CFormLabel className="fw-bold">Discount (%)</CFormLabel>
                <CFormInput
                  type="number"
                  className="mb-3"
                  placeholder="Enter Discount Percentage"
                  {...register('discount', {
                    required: 'Discount is required',
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: 100, message: 'Max 100%' },
                  })}
                />
                {errors.discount && <p className="text-danger">{errors.discount.message}</p>}

                {/* Product Images */}
                <CFormLabel className="fw-bold">Product Images</CFormLabel>
                <CFormInput type="file" className="mb-3" multiple {...register('images')} />

                {/* Submit Button */}
                <div className="text-center">
                  <CButton type="submit" color="success" className="px-4 py-2 fw-bold">
                    Update Product
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

export default UpdateProject
