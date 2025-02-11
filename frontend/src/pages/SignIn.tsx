import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Logo } from '../components/Logo'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://eyevyovjlxycqixkvxoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94'
)

type UserType = 'ADMIN' | 'EMPLOYEE'

interface Project {
  id: string
  name: string
}

interface Company {
  id: string
  name: string
}

const companies = [
  { id: '1', name: 'CDG Engenharia' },
  { id: '2', name: 'Urban Engenharia' },
  { id: '3', name: 'Consórcio Aquiraz PDD' },
  { id: '4', name: 'Consórcio BCL' },
  { id: '5', name: 'Consórcio BME' },
  { id: '6', name: 'Consórcio BBJ' }
]

export function SignIn() {
  const [userType, setUserType] = useState<UserType>('ADMIN')
  const [password, setPassword] = useState('')
  const [cpf, setCpf] = useState('')
  const [projectId, setProjectId] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [projects, setProjects] = useState<Project[]>([])
  const [companiesList, setCompaniesList] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProjects, setIsLoadingProjects] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()

  const { data: projectsData, isLoading: isLoadingProjectsQuery } = useQuery<Project[]>({
    queryKey: ['projects', 'active'],
    queryFn: async () => {
      console.log('Buscando projetos...')
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .eq('active', true)
        .order('name')

      if (error) {
        console.error('Erro ao buscar projetos:', error)
        throw error
      }
      console.log('Projetos encontrados:', data)
      return data || []
    },
    enabled: userType === 'EMPLOYEE'
  })

  useEffect(() => {
    console.log('Projects Data:', projectsData)
    console.log('Is Loading Projects Query:', isLoadingProjectsQuery)
    setProjects(projectsData || [])
    setIsLoadingProjects(isLoadingProjectsQuery)
  }, [projectsData, isLoadingProjectsQuery])

  useEffect(() => {
    setCompaniesList(companies)
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    try {
      setIsLoading(true)

      if (userType === 'ADMIN' && !password) {
        toast.error('Senha é obrigatória')
        return
      }

      if (userType === 'EMPLOYEE') {
        if (!cpf) {
          toast.error('CPF é obrigatório')
          return
        }
        if (!projectId) {
          toast.error('Selecione uma obra')
          return
        }
        if (!companyId) {
          toast.error('Selecione uma empresa')
          return
        }
      }

      await signIn({
        userType,
        password: userType === 'ADMIN' ? password : undefined,
        cpf: userType === 'EMPLOYEE' ? cpf : undefined,
        projectId: userType === 'EMPLOYEE' ? projectId : undefined,
        companyId: userType === 'EMPLOYEE' ? companyId : undefined
      })
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex min-h-screen items-center justify-center bg-[--background]">
      <div className="w-[360px] overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)]">
        {/* Header */}
        <div className="border-b border-[--border] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[--primary] p-2 text-white">
              <Logo className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-[--text]">
                Sistema de Ponto
              </span>
              <span className="text-sm text-[--text-secondary]">
                Controle profissional de horas
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* User Type Selector */}
          <div className="flex gap-2 rounded-lg border border-[--border] p-1">
            <button
              onClick={() => setUserType('ADMIN')}
              className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg transition-all ${
                userType === 'ADMIN'
                  ? 'bg-[--primary] text-white shadow-sm'
                  : 'text-[--text-secondary] hover:bg-[--background]'
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium">Admin</span>
            </button>

            <button
              onClick={() => setUserType('EMPLOYEE')}
              className={`flex h-9 flex-1 items-center justify-center gap-2 rounded-lg transition-all ${
                userType === 'EMPLOYEE'
                  ? 'bg-[--primary] text-white shadow-sm'
                  : 'text-[--text-secondary] hover:bg-[--background]'
              }`}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-medium">Funcionário</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === 'ADMIN' ? (
              <div className="space-y-2">
                <label className="text-sm font-medium text-[--text-secondary]">
                  Senha de Administrador
                </label>
                <Input
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    CPF do Funcionário
                  </label>
                  <Input
                    type="text"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    disabled={isLoading}
                    maxLength={11}
                    placeholder="Digite seu CPF"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Empresa
                  </label>
                  <select
                    value={companyId}
                    onChange={e => setCompanyId(e.target.value)}
                    disabled={isLoading}
                    className="h-9 w-full rounded-lg border border-[--border] bg-white px-3 text-[--text] shadow-sm transition-colors focus:border-[--primary] focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione uma empresa</option>
                    {companiesList.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[--text-secondary]">
                    Obra
                  </label>
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    disabled={isLoading || isLoadingProjects}
                    className="h-9 w-full rounded-lg border border-[--border] bg-white px-3 text-[--text] shadow-sm transition-colors focus:border-[--primary] focus:outline-none focus:ring-2 focus:ring-[--primary] focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione uma obra</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingProjects && (
                    <p className="text-sm text-[--text-secondary]">Carregando obras...</p>
                  )}
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : 'Entrar no Sistema'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
