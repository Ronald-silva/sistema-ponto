import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('@sistema-ponto:user')
    return storedUser ? JSON.parse(storedUser) : null
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Verificar sessão atual do Supabase apenas para funcionários
    if (user?.role === 'EMPLOYEE') {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session?.user) {
          // Se não há sessão no Supabase mas tem user no localStorage, fazer logout
          signOut()
        }
      })
    }
  }, [])

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

        if (password !== 'admin123') {
          throw new Error('Senha incorreta')
        }

        const adminUser = {
          id: 'd504a949-b481-40be-a675-1528388986aa2',
          role: 'ADMIN' as const,
          name: 'Administrador'
        }

        setUser(adminUser)
        localStorage.setItem('@sistema-ponto:user', JSON.stringify(adminUser))
        navigate('/employees')
      } else {
        if (!cpf) {
          throw new Error('CPF é obrigatório')
        }

        if (!projectId) {
          throw new Error('Selecione uma obra')
        }

        if (!companyId) {
          throw new Error('Selecione uma empresa')
        }

        // Buscar funcionário pelo CPF
        const { data: employee, error: employeeError } = await supabase
          .from('users')
          .select('*')
          .eq('cpf', cpf)
          .single()

        if (employeeError || !employee) {
          throw new Error('Funcionário não encontrado')
        }

        // Buscar dados da obra
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('name')
          .eq('id', projectId)
          .single()

        if (projectError || !project) {
          throw new Error('Obra não encontrada')
        }

        // Buscar nome da empresa
        const companies = [
          { id: '1', name: 'CDG Engenharia' },
          { id: '2', name: 'Urban Engenharia' },
          { id: '3', name: 'Consórcio Aquiraz PDD' },
          { id: '4', name: 'Consórcio BCL' },
          { id: '5', name: 'Consórcio BME' },
          { id: '6', name: 'Consórcio BBJ' }
        ]
        const company = companies.find(c => c.id === companyId)

        if (!company) {
          throw new Error('Empresa não encontrada')
        }

        const employeeUser = {
          id: employee.id,
          role: 'EMPLOYEE' as const,
          name: employee.name,
          cpf: employee.cpf,
          projectId,
          projectName: project.name,
          companyId,
          companyName: company.name
        }

        setUser(employeeUser)
        localStorage.setItem('@sistema-ponto:user', JSON.stringify(employeeUser))
        navigate('/time-entry')
      }
    } catch (error: any) {
      console.error('Erro no login:', error)
      throw new Error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setUser(null)
      localStorage.removeItem('@sistema-ponto:user')
      navigate('/sign-in')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}
