import axios from 'axios'
import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableRow } from '@coreui/react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteCate, ViewSubCateList } from '../SubCategory'
import { NavLink, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const ViewCategory = () => {
   const { SubCateList } = useSelector((state) => state.SubCategory)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(ViewSubCateList())
  }, [])
  // console.log(CateList)
  const redirect = useNavigate()

  async function trash(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        })
        dispatch(DeleteCate(id))
        // redirect('/base/viewCategory')
      }
    })
  }

  return (
    <>
      <h1>View Category</h1>
      <CTable className="table table-bordered ">
        <CTableRow className="">
          <CTableDataCell scope="col">SNO</CTableDataCell>
          <CTableDataCell scope="col">Category</CTableDataCell>
          <CTableDataCell scope="col">Sub Category</CTableDataCell>
          <CTableDataCell scope="col">Action</CTableDataCell>
        </CTableRow>
        <CTableBody>
          {SubCateList.length > 0 ? (
            SubCateList.map((ele, index) => {
              return (
                <>
                  <CTableRow className="">
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{ele.category?.cat_name}</CTableDataCell>
                    <CTableDataCell>{ele.subcategory}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        className="btn btn-danger"
                        onClick={() => {
                          trash(ele._id)
                        }}
                      >
                        <i class="fa-solid fa-trash"></i>
                      </CButton>
                      <NavLink to={`/UpdateSubCategory/${ele._id}`} className="ms-2 btn btn-success">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </NavLink>
                    </CTableDataCell>
                  </CTableRow>
                </>
              )
            })
          ) : (
            <p>loading .....</p>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default ViewCategory
