import { createContext, useContext, useState, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

interface User {
  id: string
  role: 'ADMIN' | 'EMPLOYEE'
  name: string
  cpf?: string
  projectId?: string
  projectName?: string
  companyId?: string
  companyName?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (credentials: { 
    userType: 'ADMIN' | 'EMPLOYEE'
    password?: string
    cpf?: string
    projectId?: string
    companyId?: string
  }) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const signIn = async ({ userType, password, cpf, projectId, companyId }: { 
    userType: 'ADMIN' | 'EMPLOYEE'
    password?: string
    cpf?: string
    projectId?: string
    companyId?: string
  }) => {
    try {
      setLoading(true)

      if (userType === 'ADMIN') {
        if (!password) {
          throw new Error('Senha é obrigatória')
        }

        // Fazer a requisição de login para o backend
        const response = await api.post('/auth/login', {
          password
        })

        const { token, user: adminUser } = response.data
        
        localStorage.setItem('@sistema-ponto:token', token)
        localStorage.setItem('@sistema-ponto:user', JSON.stringify(adminUser))
        
        setUser(adminUser)
        navigate('/dashboard')

        return
      }

      if (!cpf) {
        throw new Error('CPF é obrigatório')
      }

      if (!projectId) {
        throw new Error('Selecione uma obra')
      }

      if (!companyId) {
        throw new Error('Selecione uma empresa')
      }

      // Fazer a requisição de login para o backend
      const response = await api.post('/auth/employee', {
        cpf,
        projectId,
        companyId
      })

      const { user: employeeUser, token } = response.data

      localStorage.setItem('@sistema-ponto:token', token)
      localStorage.setItem('@sistema-ponto:user', JSON.stringify(employeeUser))

      setUser(employeeUser)
      navigate('/time-entry')
    } catch (err: any) {
      console.error('Erro no login:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    localStorage.removeItem('@sistema-ponto:token')
    localStorage.removeItem('@sistema-ponto:user')
    setUser(null)
    navigate('/sign-in')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
