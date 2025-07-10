import {
  CButton,
  CCol,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CRow,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Deletepr, ViewList } from '../ProductSlice'
import { NavLink } from 'react-router-dom'
import Swal from 'sweetalert2'

const ViewProductList = () => {
  const { ProductList } = useSelector((state) => state.product)
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(ViewList())
  }, [dispatch])

  const trash = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Your product has been deleted.', 'success')
        dispatch(Deletepr(id))
      }
    })
  }

  // 🔍 Filtered products based on search term
  const filteredProducts = ProductList?.filter((ele) =>
    ele?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <CRow>
      <CCol xs={12}>
        <h1>View Product List</h1>

        {/* 🔍 Search Input */}
        <CFormInput
          type="text"
          className="mb-3 w-50"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <CTable className="table table-bordered">
          <CTableRow>
            <CTableDataCell>S.NO</CTableDataCell>
            <CTableDataCell>Category</CTableDataCell>
            <CTableDataCell>Product Name</CTableDataCell>
            <CTableDataCell>Material</CTableDataCell>
            <CTableDataCell>Size</CTableDataCell>
            <CTableDataCell>Price</CTableDataCell>
            <CTableDataCell>Images</CTableDataCell>
            <CTableDataCell>Action</CTableDataCell>
          </CTableRow>
          <CTableBody>
            {filteredProducts?.length > 0 ? (
              filteredProducts.map((ele, index) => (
                <CTableRow key={ele._id}>
                  <CTableDataCell>{index + 1}</CTableDataCell>
                  <CTableDataCell>{ele?.category?.cat_name || 'N/A'}</CTableDataCell>
                  <CTableDataCell>{ele.productName}</CTableDataCell>
                  <CTableDataCell>{ele.material}</CTableDataCell>
                  <CTableDataCell>{ele.size}</CTableDataCell>
                  <CTableDataCell>₹ {ele.productPrice}</CTableDataCell>
                  <CTableDataCell>
                    {ele.images?.length > 0 ? (
                      <img
                        src={ele.images[0]}
                        alt="product"
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      'No Image'
                    )}
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton className="btn btn-danger" onClick={() => trash(ele._id)}>
                      <i className="fa-solid fa-trash"></i>
                    </CButton>
                    <NavLink
                      to={`/UpdateProduct/${ele._id}`}
                      className="ms-2 btn btn-success"
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </NavLink>
                  </CTableDataCell>
                </CTableRow>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="8" className="text-center">
                  No products found.
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </CCol>
    </CRow>
  )
}

export default ViewProductList
