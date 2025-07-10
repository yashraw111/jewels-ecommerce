import axios from 'axios'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
} from '@coreui/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DeleteCate, ViewCateList } from '../CategorySlice'
import { NavLink, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

const ViewCategory = () => {
  const { CateList } = useSelector((state) => state.Category)
  const dispatch = useDispatch()
  const redirect = useNavigate()

  console.log(CateList)
  useEffect(() => {
    dispatch(ViewCateList())
  }, [])

  const data = CateList

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
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
        dispatch(DeleteCate(id))
      }
    })
  }

  return (
    <>
      <h1>📁 View Categories</h1>
      <CTable className="table table-bordered text-center align-middle">
        <CTableHead className="table-dark">
          <CTableRow>
            <CTableDataCell scope="col">SNO</CTableDataCell>
            <CTableDataCell scope="col">Category</CTableDataCell>
            <CTableDataCell scope="col">Image</CTableDataCell>
            <CTableDataCell scope="col">Action</CTableDataCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {data?.length > 0 ? (
            data.map((ele, index) => (
              <CTableRow key={ele._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{ele.cat_name}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={ele.cat_image}
                    alt={ele.cat_name}
                    width="80"
                    height="60"
                    style={{ objectFit: 'cover', borderRadius: '5px' }}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    className="btn btn-danger"
                    onClick={() => trash(ele._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </CButton>
                  <NavLink
                    to={`/UpdateCategory/${ele._id}`}
                    className="ms-2 btn btn-success"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </NavLink>
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={4}>Loading...</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default ViewCategory
