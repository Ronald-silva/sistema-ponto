import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Clock } from '../../components/Clock'
import { PowerIcon } from '@heroicons/react/24/outline'

interface EmployeeLayoutProps {
  children: ReactNode
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[var(--gray-50)]">
      {/* Botão de sair */}
      <button
        onClick={() => {
          signOut()
          navigate('/login')
        }}
        className="fixed top-4 right-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <PowerIcon className="h-5 w-5" />
        <span>Sair</span>
      </button>

      <main>{children}</main>

      <Clock />
    </div>
  )
}
