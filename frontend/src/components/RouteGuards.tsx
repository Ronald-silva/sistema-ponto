import { Navigate } from 'react-router-dom'

interface RouteGuardProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: RouteGuardProps) {
  const token = localStorage.getItem('sb-eyevyovjlxycqixkvxoz-auth-token')
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export function PublicRoute({ children }: RouteGuardProps) {
  const token = localStorage.getItem('sb-eyevyovjlxycqixkvxoz-auth-token')
  return !token ? <>{children}</> : <Navigate to="/dashboard" replace />
}
