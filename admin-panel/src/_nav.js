import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPuzzle,
  cilPlus,
  cilList,
  cilImage,
  cilStar,
  cilCart,
  cilClipboard,
  cilCommentSquare, // 👈 नया आइकन इम्पोर्ट करें
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // Dashboard
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },

  // Product Management Section
  {
    component: CNavTitle,
    name: 'Product Management',
  },
  {
    component: CNavGroup,
    name: 'Category',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Category',
        to: '/base/category',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'View Category List',
        to: '/base/viewCategory',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Product',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Create Product',
        to: '/base/create',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'View Product List',
        to: '/base/ViewList',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
    ],
  },

  // Marketing Section
  {
    component: CNavTitle,
    name: 'Marketing',
  },
  {
    component: CNavGroup,
    name: 'Banner',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Banner',
        to: '/base/createBanner',
        icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'View Banner',
        to: '/base/ViewBanner',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
    ],
  },

  // Customer Interaction Section
  {
    component: CNavTitle,
    name: 'Customer Interaction',
  },
  {
    component: CNavGroup,
    name: 'Reviews',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Reviews',
        to: '/base/allReviews',
        icon: <CIcon icon={cilList} customClassName="nav-icon" />,
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Message List',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Contact Messages',
        to: '/base/ContactList',
        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      },
    ],
  },
  // 👇 नया Support Queries सेक्शन
  {
    component: CNavItem,
    name: 'Support Queries',
    to: '/base/queries', // 👈 सही लिंक
    icon: <CIcon icon={cilCommentSquare} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Orders',
        to: '/base/allcart',
        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Return Order',
        to: '/base/returnOrder',
        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'DeliveredOrderList',
        to: '/base/DeliveredOrderList',
        icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav
