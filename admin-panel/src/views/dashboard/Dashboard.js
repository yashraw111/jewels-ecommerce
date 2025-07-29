import React, { useState, useEffect } from 'react'

import {
  CAvatar,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople } from '@coreui/icons'

// एक डिफ़ॉल्ट अवतार रखें, अगर यूज़र का अवतार मौजूद न हो
import defaultAvatar from 'src/assets/images/avatars/1.jpg'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'

const Dashboard = () => {
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 👇 अपने सर्वर का सही URL और PORT डालें
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/dashboard/main-data`)
        const result = await response.json()
        if (result.success) {
          setRecentUsers(result.data.recentUsers)
        }
      } catch (error) {
        console.error('Failed to fetch recent users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  // तारीख को फॉर्मेट करने के लिए फंक्शन
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <>
      <WidgetsDropdown className="mb-4" />

      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">Last 12 Months</div>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
      </CCard>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Recent Users</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Email</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Registered On</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {loading ? (
                    <CTableRow>
                      <CTableDataCell colSpan="4" className="text-center">
                        Loading...
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    recentUsers.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">
                          <CAvatar size="md" src={item.avatar || defaultAvatar} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.name}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div>{item.email}</div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold text-nowrap">{formatDate(item.createdAt)}</div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
