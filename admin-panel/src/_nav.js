import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
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
  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavGroup,
    name: 'category',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Accordion',
      //   to: '/base/accordion',
      // },
      {
        component: CNavItem,
        name: 'AddCategory',
        to: '/base/category',
      },
      {
        component: CNavItem,
        name: 'View Category List',
        to: '/base/viewCategory',
      },
    ],
  },
  // {
  //   component: CNavGroup,
  //   name: 'CreateSubCategory',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     // {
  //     //   component: CNavItem,
  //     //   name: 'Accordion',
  //     //   to: '/base/accordion',
  //     // },
  //     {
  //       component: CNavItem,
  //       name: 'CreateSubCategory',
  //       to: '/base/CreateSubCategory',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'View Category List',
  //       to: '/base/ViewSubCategory  ',
  //     },
  //   ],
  // },
  {
    component: CNavGroup,
    name: 'product',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Accordion',
      //   to: '/base/accordion',
      // },
      {
        component: CNavItem,
        name: 'CreteProduct',
        to: '/base/create',
      },
      {
        component: CNavItem,
        name: 'View Product List',
        to: '/base/ViewList',
      },
   
    
    
    ],
  },
  {
    component: CNavGroup,
    name: 'Cart',
    to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      // {
      //   component: CNavItem,
      //   name: 'Accordion',
      //   to: '/base/accordion',
      // },
      {
        component: CNavItem,
        name: 'All Cart',
        to: '/base/allcart',
      },
    ],
  },
  // {
  //   component: CNavGroup,
  //   name: 'Buttons',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
     
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Forms',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Form Control',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Select',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: (
  //         <React.Fragment>
  //           {'Multi Select'}
  //           <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //         </React.Fragment>
  //       ),
  //       href: 'https://coreui.io/react/docs/forms/multi-select/',
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Checks & Radios',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Range',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: (
  //         <React.Fragment>
  //           {'Range Slider'}
  //           <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //         </React.Fragment>
  //       ),
  //       href: 'https://coreui.io/react/docs/forms/range-slider/',
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: (
  //         <React.Fragment>
  //           {'Rating'}
  //           <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //         </React.Fragment>
  //       ),
  //       href: 'https://coreui.io/react/docs/forms/rating/',
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Input Group',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Floating Labels',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: (
  //         <React.Fragment>
  //           {'Date Picker'}
  //           <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //         </React.Fragment>
  //       ),
  //       href: 'https://coreui.io/react/docs/forms/date-picker/',
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Date Range Picker',
  //       href: 'https://coreui.io/react/docs/forms/date-range-picker/',
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: (
  //         <React.Fragment>
  //           {'Time Picker'}
  //           <CIcon icon={cilExternalLink} size="sm" className="ms-2" />
  //         </React.Fragment>
  //       ),
  //       href: 'https://coreui.io/react/docs/forms/time-picker/',
  //       badge: {
  //         color: 'danger',
  //         text: 'PRO',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Validation',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  {
    component: CNavGroup,
    name: 'Pages',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Register',
        to: '/register',
      },
      {
        component: CNavItem,
        name: 'Error 404',
        to: '/404',
      },
      {
        component: CNavItem,
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },
]

export default _nav
