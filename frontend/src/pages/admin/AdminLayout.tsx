import { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ClockIcon } from '@heroicons/react/24/outline'
import { Clock } from '../../components/Clock'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClockIcon className="h-6 w-6 text-[var(--primary)]" />
            <span className="text-lg font-semibold text-gray-900">Sistema de Ponto</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-[var(--primary)]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/employees"
              className={`text-sm font-medium transition-colors ${
                isActive('/employees')
                  ? 'text-[var(--primary)]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Funcionários
            </Link>

            <Link
              to="/projects"
              className={`text-sm font-medium transition-colors ${
                isActive('/projects')
                  ? 'text-[var(--primary)]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Obras
            </Link>

            <button
              onClick={() => {
                signOut()
                navigate('/login')
              }}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>Sair</span>
            </button>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <Clock />
    </div>
  )
}
