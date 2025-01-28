import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../pages/Login'
import { RegistroPonto } from '../pages/RegistroPonto'
import { Dashboard } from '../pages/Dashboard'
import { LoginAdmin } from '../pages/LoginAdmin'
import { useAuth } from '../contexts/AuthContext'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/" />
  }

  return <>{children}</>
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/registro" element={<PrivateRoute><RegistroPonto /></PrivateRoute>} />
    </Routes>
  )
} 