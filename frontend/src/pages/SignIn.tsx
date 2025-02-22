import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Logo } from '../components/Logo'
import { toast } from 'sonner'
import { api } from '../lib/api'

type UserType = 'ADMIN' | 'EMPLOYEE'

interface Project {
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState<Project[]>([])

  const { signIn } = useAuth()

  useEffect(() => {
    async function loadProjects() {
      try {
        console.log('Iniciando carregamento dos projetos...')
        console.log('URL da API:', api.defaults.baseURL)
        
        const response = await api.get('/projects/active')
        console.log('Resposta da API:', response.data)
        
        if (!response.data || response.data.length === 0) {
          console.log('Nenhum projeto ativo encontrado')
          setProjects([])
          return
        }

        setProjects(response.data)
      } catch (error: any) {
        console.error('Erro detalhado ao carregar projetos:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL
          }
        })
        
        // Tenta fazer uma requisição simples para testar a conectividade
        try {
          console.log('Testando conectividade com o backend...')
          const testResponse = await fetch(api.defaults.baseURL + '/projects/active')
          console.log('Teste de conectividade:', {
            ok: testResponse.ok,
            status: testResponse.status
          })
        } catch (testError) {
          console.error('Erro no teste de conectividade:', testError)
        }
      }
    }

    loadProjects()
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

        if (!companyId) {
          toast.error('Selecione uma empresa')
          return
        }

        if (!projectId) {
          toast.error('Selecione uma obra')
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
      console.error('Erro no login:', err)
      setError(err.response?.data?.error || err.message || 'Erro ao fazer login')
      toast.error(err.response?.data?.error || err.message || 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 md:p-0"
      style={{
        backgroundImage: 'url("/construction-tools.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="flex min-h-screen items-center justify-center relative">
        <div className="w-full max-w-[400px] overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] md:w-[400px]">
          {/* Header */}
          <div className="border-b border-[--border] bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2.5 text-white backdrop-blur-sm">
                <Logo className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-semibold text-[--text]">
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
            <div className="flex gap-2 rounded-lg border border-[--border] bg-white p-1.5">
              <button
                onClick={() => setUserType('ADMIN')}
                className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-base transition-all ${
                  userType === 'ADMIN'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-[--text-secondary] hover:bg-blue-50'
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
                className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-lg text-base transition-all ${
                  userType === 'EMPLOYEE'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-[--text-secondary] hover:bg-blue-50'
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
            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="h-11 bg-white"
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
                      className="h-11 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[--text-secondary]">
                      Empresa
                    </label>
                    <div className="relative">
                      <select
                        value={companyId}
                        onChange={e => setCompanyId(e.target.value)}
                        disabled={isLoading}
                        className="h-10 w-full appearance-none rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-[--text] shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione uma empresa</option>
                        {companies.map(company => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[--text-secondary]">
                      Obra
                    </label>
                    <div className="relative">
                      <select
                        value={projectId}
                        onChange={e => setProjectId(e.target.value)}
                        disabled={isLoading}
                        className="h-10 w-full appearance-none rounded-lg border border-[--border] bg-white px-3 py-2 text-sm text-[--text] shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-25 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Selecione uma obra</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="h-11 w-full bg-blue-500 text-base hover:bg-blue-600 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? 'Carregando...' : 'Entrar no Sistema'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
