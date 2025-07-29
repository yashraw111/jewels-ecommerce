import React from 'react'
import OrderReturn from './components/Crud/cart/OrderReturn.jsx'
import DeliveredOrderList from './components/Crud/cart/DeliveredOrderList.jsx'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// 👇 नया पेज इम्पोर्ट करें
const SupportQueries = React.lazy(() => import('./components/Crud/support/SupportQueries.js'))

// Base
const CreateProduct = React.lazy(() => import('./components/Crud/Product/CreateProduct.js'))
const createBanner = React.lazy(() => import('./components/Crud/Banner/AddBanner.js'))
const ViewBanner = React.lazy(() => import('./components/Crud/Banner/ViewBanner.js'))
const allReviews = React.lazy(() => import('./components/Crud/Reviews/AdminAllReviews.jsx'))
const ContactList = React.lazy(() => import('./components/Crud/Contact/ContactList.jsx'))

const ViewProductList = React.lazy(() => import('./components/Crud/Product/ViewProductList'))
const UpdateProject = React.lazy(() => import('./components/Crud/Product/UpdateProject.js'))
const AddCategory = React.lazy(() => import('./components/Crud/Category/AddCategory'))
const ViewCategory = React.lazy(() => import('./components/Crud/Category/ViewCategory'))
const UpdateCategory = React.lazy(() => import('./components/Crud/Category/UpdateCategory.js'))

const CreateSubCategory = React.lazy(
  () => import('./components/Crud/SubCategory/CreateSubCategory.js'),
)
const ViewSubCategory = React.lazy(() => import('./components/Crud/SubCategory/ViewSubCategory.js'))
const UpdateSubCategory = React.lazy(
  () => import('./components/Crud/SubCategory/UpdateSubCategory.js'),
)
const AllCart = React.lazy(
  () => import('./components/Crud/cart/AllCart.jsx'),
)

// ... बाकी के इम्पोर्ट्स ...

const routes = [
  { path: '/', exact: true, name: 'Home' },

  // 👇 नया रूट जोड़ें
  { path: '/base/queries', name: 'Support Queries', element: SupportQueries },

  { path: '/base/create', exact: true, name: 'CreateProject', element: CreateProduct },
  { path: '/base/createBanner', exact: true, name: 'createBanner', element: createBanner },
  { path: '/base/ViewBanner', exact: true, name: 'ViewBanner', element: ViewBanner },
  { path: '/base/allReviews', exact: true, name: 'ViewBanner', element: allReviews },
  { path: '/base/ContactList', exact: true, name: 'ViewBanner', element: ContactList },

  { path: '/base/ViewList', exact: true, name: 'CreateProject', element: ViewProductList },
  { path: '/UpdateProduct/:id', exact: true, name: 'UpdateProject', element: UpdateProject },
  { path: '/UpdateCategory/:id', exact: true, name: 'UpdateCategory', element: UpdateCategory },

  { path: '/base/category', exact: true, name: 'AddCategory', element: AddCategory },
  { path: '/base/viewCategory', exact: true, name: 'viewCategory', element: ViewCategory },

  { path: '/base/ViewSubCategory', exact: true, name: 'ViewSubCategory', element: ViewSubCategory },
  { path: '/base/allcart', exact: true, name: 'ViewSubCategory', element: AllCart },
  { path: '/base/returnOrder', exact: true, name: 'ViewSubCategory', element: OrderReturn },
  { path: '/base/DeliveredOrderList', exact: true, name: 'ViewSubCategory', element: DeliveredOrderList },
  {
    path: '/base/CreateSubCategory',
    exact: true,
    name: 'CreateSubCategory',
    element: CreateSubCategory,
  },
  {
    path: '/UpdateSubCategory/:id',
    exact: true,
    name: 'UpdateSubCategory',
    element: UpdateSubCategory,
  },

  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  
  // ... बाकी के सारे रूट्स ...
]

export default routes
