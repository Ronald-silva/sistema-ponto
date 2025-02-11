import { Routes, Route, Navigate } from 'react-router-dom'
import { SignIn } from './pages/SignIn'
import { Dashboard } from './pages/Dashboard'
import { TimeRecord } from './pages/TimeRecord'
import { Projects } from './pages/Projects'
import { Employees } from './pages/Employees'
import { useAuth } from './contexts/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<'ADMIN' | 'EMPLOYEE'>
}

function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/sign-in" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'EMPLOYEE') {
      return <Navigate to="/time-record" />
    }
    return <Navigate to="/dashboard" />
  }

  return <>{children}</>
}

export function Router() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />

      <Route
        path="/"
        element={
          user ? (
            <PrivateRoute>
              {user.role === 'ADMIN' ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/time-record" />
              )}
            </PrivateRoute>
          ) : (
            <Navigate to="/sign-in" />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/time-record"
        element={
          <PrivateRoute allowedRoles={['EMPLOYEE']}>
            <TimeRecord />
          </PrivateRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <Projects />
          </PrivateRoute>
        }
      />

      <Route
        path="/employees"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <Employees />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
