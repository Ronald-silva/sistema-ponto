import { Routes, Route, Navigate } from 'react-router-dom'
import { SignIn } from './pages/SignIn'
import { Dashboard } from './pages/Dashboard'
import { TimeRecord } from './pages/TimeRecord'
import { Projects } from './pages/Projects'
import { ProjectForm } from './pages/ProjectForm'
import { Employees } from './pages/Employees'
import { useAuth } from './contexts/AuthContext'

interface PrivateRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<'ADMIN' | 'EMPLOYEE'>
}

function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { user, loading } = useAuth()

  // Aguardar a verificação da autenticação
  if (loading) {
    return null // ou um componente de loading
  }

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
  const { user, loading } = useAuth()

  // Aguardar a verificação da autenticação
  if (loading) {
    return null // ou um componente de loading
  }

  return (
    <Routes>
      <Route 
        path="/sign-in" 
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/time-record'} />
          ) : (
            <SignIn />
          )
        } 
      />

      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === 'ADMIN' ? '/dashboard' : '/time-record'} />
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
        path="/projects/new"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <ProjectForm />
          </PrivateRoute>
        }
      />

      <Route
        path="/projects/:id/edit"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <ProjectForm />
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
