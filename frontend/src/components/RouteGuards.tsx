import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface RouteGuardProps {
}

export function PrivateRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/sign-in" replace />
}

export function PublicRoute() {
  const { user } = useAuth()
  return !user ? <Outlet /> : <Navigate to="/dashboard" replace />
}
