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
import { useDispatch, useSelector } from 'react-redux'
import { CreateCate, ViewCateList } from '../CategorySlice'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AddCategory = () => {
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm()

const selectedImage = watch('cat_image')

  const { CateList } = useSelector((state) => state.Category)
  console.log(CateList)
console.log(CateList)
  useEffect(() => {
    dispatch(ViewCateList())
  }, [dispatch])

const onSubmit = async (data) => {
  const isExist = CateList?.data?.some(
    (cat) => cat.cat_name.toLowerCase() === data.cat_name.toLowerCase()
  );

  if (isExist) {
    toast.error('Category already exists!', {
      position: 'top-center',
      autoClose: 3000,
    });
    reset();
    return;
  }

  try {
    const formData = new FormData();
    formData.append('cat_name', data.cat_name);
   formData.append('cat_image', data.cat_image[0]);  // ✅ key name must match multer


    await dispatch(CreateCate(formData));

    toast.success('Category added successfully!', {
      position: 'top-center',
      autoClose: 3000,
    });
    reset();
  } catch (err) {
    console.error('Error:', err);
    toast.error('Something went wrong!', {
      position: 'top-center',
      autoClose: 3000,
    });
  }
};


  return (
    <>
      <CRow>
        <CCol xs={12} md={12} lg={12} className="mx-auto">
          <CCard className="mb-4 border-dark shadow-lg bg-dark text-white">
            <CForm onSubmit={handleSubmit(onSubmit)}>
              <CCardHeader>
                <strong className="fs-4">📝 Create Product Category</strong>
              </CCardHeader>
              <CCardBody>
                {/* Category Name */}
                <CFormLabel htmlFor="cat_name">Category Name</CFormLabel>
                <CFormInput
                  id="cat_name"
                  placeholder="Enter Product Category"
                  className="mb-2"
                  {...register('cat_name', {
                    required: 'Category name is required',
                  })}
                />
                <p className="text-danger mb-3">{errors.cat_name?.message}</p>

                {/* Image Upload */}
                <CFormLabel htmlFor="image">Upload Category Image</CFormLabel>
                <CFormInput
                  type="file"
                  id="cat_image"
                  className="mb-2"
                  accept="image/*"
                  {...register('cat_image', {
                    required: 'Image is required',
                  })}
                />
                <p className="text-danger mb-3">{errors.image?.message}</p>

                {/* Image Preview */}
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

export default AddCategory
