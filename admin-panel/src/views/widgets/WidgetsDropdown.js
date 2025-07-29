import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CSpinner,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

// --- Helper function to create chart gradients ---
const createChartGradient = (context, color) => {
  const chart = context.chart
  const { ctx, chartArea } = chart
  if (!chartArea) {
    // This case happens on initial chart load before dimensions are known.
    return null
  }
  const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
  gradient.addColorStop(0, `rgba(${color}, 0)`)
  gradient.addColorStop(0.8, `rgba(${color}, 0.2)`)
  gradient.addColorStop(1, `rgba(${color}, 0.5)`)
  return gradient
}

const WidgetsDropdown = (props) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 👇 अपने सर्वर का सही URL और PORT डालें
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/dashboard/stats`)
        const result = await response.json()
        if (result.success) {
          setStats(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const formatNumber = (num) => new Intl.NumberFormat('en-IN').format(num)
  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(num)

  if (loading) {
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" />
      </div>
    )
  }

  if (!stats) {
    return <p className="text-center">Could not load dashboard data.</p>
  }

  // --- Chart Data and Options ---
  const userChartOptions = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    elements: {
      line: { borderWidth: 2, tension: 0.4 },
      point: { radius: 0, hitRadius: 10, hoverRadius: 4 },
    },
  }

  const incomeChartOptions = { ...userChartOptions } // Same options

  const userChartData = {
    labels: ['Day 7', 'Day 6', 'Day 5', 'Day 4', 'Day 3', 'Day 2', 'Today'],
    datasets: [
      {
        label: 'Users per day',
        borderColor: 'rgba(255, 255, 255, .55)',
        // 👇 ग्रेडिएंट बनाने के लिए फंक्शन का उपयोग
        backgroundColor: (context) => createChartGradient(context, '159, 117, 242'),
        data: stats.users.chartData,
        fill: true,
      },
    ],
  }

  const incomeChartData = {
    labels: ['Day 7', 'Day 6', 'Day 5', 'Day 4', 'Day 3', 'Day 2', 'Today'],
    datasets: [
      {
        label: 'Income per day',
        borderColor: 'rgba(255, 255, 255, .55)',
        // 👇 ग्रेडिएंट बनाने के लिए फंक्शन का उपयोग
        backgroundColor: (context) => createChartGradient(context, '51, 153, 255'),
        data: stats.income.chartData,
        fill: true,
      },
    ],
  }

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          // 👇 आपके स्क्रीनशॉट से मिलता-जुलता कस्टम रंग
          style={{ backgroundColor: '#6633ff', color: 'white' }}
          value={
            <>
              {formatNumber(stats.users.total)}{' '}
              <span
                className="fs-6 fw-normal"
                style={{ color: stats.users.change >= 0 ? '#a3f2a3' : '#f8a9a9' }}
              >
                ({stats.users.change}% <CIcon icon={stats.users.change >= 0 ? cilArrowTop : cilArrowBottom} />)
              </span>
            </>
          }
          title="Users"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View Details</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={userChartData}
              options={userChartOptions}
            />
          }
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          // 👇 आपके स्क्रीनशॉट से मिलता-जुलता कस्टम रंग
          style={{ backgroundColor: '#007bff', color: 'white' }}
          value={
            <>
              {formatCurrency(stats.income.total)}{' '}
              <span
                className="fs-6 fw-normal"
                style={{ color: stats.income.change >= 0 ? '#a3f2a3' : '#f8a9a9' }}
              >
                ({stats.income.change}% <CIcon icon={stats.income.change >= 0 ? cilArrowTop : cilArrowBottom} />)
              </span>
            </>
          }
          title="Income (Delivered)"
          action={
            <CDropdown alignment="end">
              <CDropdownToggle color="transparent" caret={false} className="text-white p-0">
                <CIcon icon={cilOptions} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem>View Details</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          }
          chart={
            <CChartLine
              className="mt-3 mx-3"
              style={{ height: '70px' }}
              data={incomeChartData}
              options={incomeChartOptions}
            />
          }
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
