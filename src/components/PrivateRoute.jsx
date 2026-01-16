import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute() {
  const { user, isTokenValid } = useAuth()
  const location = useLocation()

  // Check if user is authenticated and has valid token
  if (!user || !isTokenValid()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
