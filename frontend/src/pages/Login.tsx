import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../hooks/useProjects'

export function Login() {
  const [userType, setUserType] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [projectId, setProjectId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const { projects, isLoading: loadingProjects, error: projectsError } = useProjects()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn({
        userType,
        password,
        email: userType === 'EMPLOYEE' ? email : undefined,
        projectId: userType === 'EMPLOYEE' ? projectId : undefined
      })
    } catch (error: any) {
      console.error('Erro no login:', error)
      setError(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-[360px] p-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
            <svg 
              className="w-8 h-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">Sistema de Ponto</h1>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Tipo de Usuário */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType('EMPLOYEE')}
                className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'EMPLOYEE'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Funcionário
              </button>
              <button
                type="button"
                onClick={() => setUserType('ADMIN')}
                className={`h-9 rounded-lg text-sm font-medium transition-colors ${
                  userType === 'ADMIN'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Administrador
              </button>
            </div>

            {/* Campos apenas para funcionários */}
            {userType === 'EMPLOYEE' && (
              <>
                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                    disabled={loading}
                    placeholder="Digite seu e-mail"
                  />
                </div>

                {/* Seleção de Obra */}
                <div className="space-y-2">
                  <label htmlFor="project" className="block text-sm font-medium text-gray-700">
                    Obra
                  </label>
                  <select
                    id="project"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full h-9 px-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                    disabled={loading || loadingProjects}
                  >
                    <option value="">Selecione uma obra</option>
                    {projects?.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.company}
                      </option>
                    ))}
                  </select>
                  {loadingProjects && (
                    <p className="text-sm text-gray-500">Carregando obras...</p>
                  )}
                  {projectsError && (
                    <p className="text-sm text-red-500">
                      Erro ao carregar obras: {projectsError.message}
                    </p>
                  )}
                  {!loadingProjects && !projectsError && projects?.length === 0 && (
                    <p className="text-sm text-gray-500">Nenhuma obra ativa encontrada</p>
                  )}
                </div>
              </>
            )}

            {/* Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {userType === 'ADMIN' ? 'Senha do Administrador' : 'Senha'}
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-9 px-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                required
                disabled={loading}
                placeholder={userType === 'ADMIN' ? 'Digite sua senha' : 'Digite sua senha'}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center bg-red-50 p-2 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (userType === 'EMPLOYEE' && (!email || !projectId))}
              className="h-9 w-full bg-primary text-white rounded-xl hover:bg-primary/90 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
