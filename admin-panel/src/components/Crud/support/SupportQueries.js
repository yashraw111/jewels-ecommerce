import React, { useState, useEffect } from 'react'
import {
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
  CSpinner,
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react'

const SupportQueries = () => {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchQueries = async () => {
    try {
      setLoading(true);
      // 👇 अपने सर्वर का सही URL यहाँ डालें
      const response = await fetch('http://localhost:8000/api/support/queries')
      const result = await response.json()
      if (result.success) {
        setQueries(result.queries)
      } else {
        throw new Error(result.message || 'Failed to fetch queries');
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueries()
  }, [])

  const handleStatusChange = async (queryId, status) => {
    try {
        // 👇 अपने सर्वर का सही URL यहाँ डालें
        const response = await fetch(`http://localhost:8080/api/support/queries/${queryId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        
        // लिस्ट को रिफ्रेश करें
        fetchQueries();

    } catch (err) {
        alert("Failed to update status: " + err.message);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'New':
        return 'danger'
      case 'In Progress':
        return 'warning'
      case 'Resolved':
        return 'success'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Customer Support Queries</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <div className="text-center"><CSpinner color="primary" /></div>}
            {error && <p className="text-danger text-center">Error: {error}</p>}
            {!loading && !error && (
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Mobile</CTableHeaderCell>
                    <CTableHeaderCell>Query Type</CTableHeaderCell>
                    <CTableHeaderCell>Message</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {queries.map((item) => (
                    <CTableRow key={item._id}>
                      <CTableDataCell>{formatDate(item.createdAt)}</CTableDataCell>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>{item.mobile}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{item.queryType}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell style={{ maxWidth: '300px' }}>{item.message}</CTableDataCell>
                      <CTableDataCell>
                        <CDropdown>
                            <CDropdownToggle color={getStatusBadgeColor(item.status)} size="sm" style={{ color: 'white' }}>
                                {item.status}
                            </CDropdownToggle>
                            <CDropdownMenu>
                                <CDropdownItem onClick={() => handleStatusChange(item._id, 'New')}>New</CDropdownItem>
                                <CDropdownItem onClick={() => handleStatusChange(item._id, 'In Progress')}>In Progress</CDropdownItem>
                                <CDropdownItem onClick={() => handleStatusChange(item._id, 'Resolved')}>Resolved</CDropdownItem>
                            </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default SupportQueries
