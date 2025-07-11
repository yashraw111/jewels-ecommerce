import React, { useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ViewCateList, UpdateCate } from '../CategorySlice'

const UpdateCategory = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
  const { CateList } = useSelector((state) => state.Category)
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const selectedImage = watch('cat_image')

  useEffect(() => {
    dispatch(ViewCateList())
  }, [dispatch])

  const SingleCate = CateList.find((ele) => ele._id === id)

  useEffect(() => {
    if (SingleCate) {
      reset({
        cat_name: SingleCate.cat_name,
      })
    }
  }, [SingleCate])

  const UpdateCateg = async (data) => {
    await dispatch(UpdateCate({ id, data }))
    navigate('/base/viewCategory')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 shadow">
          <CForm className="form text-center" onSubmit={handleSubmit(UpdateCateg)}>
            <CCardHeader className="text-start bg-dark text-white">
              <strong className="fs-3">✏️ Update Category</strong>
            </CCardHeader>
            <CCardBody>
              <label className="mb-1">Category Name</label>
              <CFormInput
                type="text"
                size="lg"
                placeholder="Enter Product Category"
                {...register('cat_name', {
                  required: 'Category name is required',
                })}
              />
              <p className="text-danger">{errors.cat_name?.message}</p>

              <br />
              <label className="mb-1">Upload New Image (optional)</label>
              <CFormInput
                type="file"
                accept="image/*"
                {...register('cat_image')}
              />

              {/* Image Preview */}
              {selectedImage && selectedImage[0] ? (
                <div className="mt-3">
                  <img
                    src={URL.createObjectURL(selectedImage[0])}
                    alt="preview"
                    height={100}
                  />
                </div>
              ) : SingleCate?.cat_image ? (
                <div className="mt-3">
                  <img
                    src={SingleCate.cat_image}
                    alt="old"
                    height={100}
                  />
                </div>
              ) : null}

              <CButton type="submit" color="success" className="mt-4 px-4">
                Update
              </CButton>
            </CCardBody>
          </CForm>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default UpdateCategory
