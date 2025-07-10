import React from 'react'
import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const isAuth = localStorage.getItem('admin')
  return isAuth ? <Navigate to="/dashboard" replace /> : children
}

export default PublicRoute
