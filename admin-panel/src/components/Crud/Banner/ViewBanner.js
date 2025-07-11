import axios from 'axios'
import {
  CButton,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
} from '@coreui/react'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { NavLink } from 'react-router-dom'

const ViewBanner = () => {
  const [banners, setBanners] = useState([])

  // ✅ Fetch All Banners
  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/banners`)
      setBanners(res.data)
    } catch (err) {
      console.error('Failed to fetch banners:', err)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  // ✅ Delete Banner
  const deleteBanner = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This banner will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/banners/${id}`)
          Swal.fire('Deleted!', 'Banner has been deleted.', 'success')
          fetchBanners()
        } catch (err) {
          console.error('Delete failed:', err)
          Swal.fire('Error!', 'Failed to delete banner.', 'error')
        }
      }
    })
  }

  return (
    <>
      <h1>📢 View Banners</h1>
      <CTable className="table table-bordered text-center align-middle">
        <CTableHead className="table-dark">
          <CTableRow>
            <CTableDataCell>SNO</CTableDataCell>
            <CTableDataCell>Title</CTableDataCell>
            <CTableDataCell>Image</CTableDataCell>
            <CTableDataCell>Action</CTableDataCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <CTableRow key={banner._id}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{banner.title}</CTableDataCell>
                <CTableDataCell>
                  <img
                    src={banner.banner_image}
                    alt={banner.title}
                    width="100"
                    height="60"
                    style={{ objectFit: 'cover', borderRadius: '6px' }}
                  />
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="danger"
                    onClick={() => deleteBanner(banner._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </CButton>

                  {/* Optional Update Button */}
                  {/* 
                  <NavLink
                    to={`/UpdateBanner/${banner._id}`}
                    className="ms-2 btn btn-success"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </NavLink> 
                  */}
                </CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan={4}>No banners found...</CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default ViewBanner
