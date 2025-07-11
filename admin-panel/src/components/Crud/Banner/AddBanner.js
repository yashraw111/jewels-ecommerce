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
  CRow,
} from '@coreui/react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'

const AddBanner = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()
  const selectedImage = watch('banner_image')

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('banner_image', data.banner_image[0])
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/banners`, formData)
      if (res.data.success) {
        toast.success('✅ Banner Added Successfully!', { position: 'top-center' })
        reset()
      } else {
        toast.error('❌ Failed to add banner.', { position: 'top-center' })
      }
    } catch (err) {
      console.error('Banner Error:', err)
      toast.error('❌ Server error', { position: 'top-center' })
    }
  }

  return (
    <>
      <CRow>
        <CCol xs={12} md={12} lg={10} className="mx-auto">
          <CCard className="mb-4 border-dark shadow-lg bg-dark text-white">
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CCardHeader>
                <strong className="fs-4">📢 Create Banner</strong>
              </CCardHeader>
              <CCardBody>
                {/* Title */}
                <CFormLabel htmlFor="title">Banner Title</CFormLabel>
                <CFormInput
                  id="title"
                  placeholder="Enter Banner Title"
                  className="mb-2"
                  {...register('title', {
                    required: 'Banner title is required',
                  })}
                />
                <p className="text-danger mb-3">{errors.title?.message}</p>

                {/* Banner Image */}
                <CFormLabel htmlFor="banner_image">Upload Banner Image</CFormLabel>
                <CFormInput
                  type="file"
                  id="banner_image"
                  accept="image/*"
                  className="mb-2"
                  {...register('banner_image', {
                    required: 'Image is required',
                  })}
                />
                <p className="text-danger mb-3">{errors.banner_image?.message}</p>

                {/* Preview */}
                {selectedImage && selectedImage[0] && (
                  <div className="mb-3 text-center">
                    <img
                      src={URL.createObjectURL(selectedImage[0])}
                      alt="Preview"
                      style={{ maxHeight: '150px', borderRadius: '8px' }}
                    />
                  </div>
                )}

                <div className="text-center mt-4">
                  <CButton color="success" type="submit" className="px-4">
                    Submit
                  </CButton>
                </div>
              </CCardBody>
            </CForm>
          </CCard>
        </CCol>
      </CRow>

      <ToastContainer />
    </>
  )
}

export default AddBanner
