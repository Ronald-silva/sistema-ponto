import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../hooks/useProjects'

export function Login() {
  const [userType, setUserType] = useState<'ADMIN' | 'EMPLOYEE'>('EMPLOYEE')
  const [cpf, setCpf] = useState('')
  const [password, setPassword] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()
  const { companies: companiesList } = useAuth()
  const { data: projects = [], isLoading: isLoadingProjects } = useProjects(
    companyId,
  )

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signIn({ userType, cpf, password, companyId, projectId })
    } catch (error) {
      setError('Credenciais inválidas')
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-[360px] p-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="w-full">
            <SignIn
              userType={userType}
              setUserType={setUserType}
              cpf={cpf}
              setCpf={setCpf}
              password={password}
              setPassword={setPassword}
              companyId={companyId}
              setCompanyId={setCompanyId}
              projectId={projectId}
              setProjectId={setProjectId}
              error={error}
              isLoading={isLoading}
              isLoadingProjects={isLoadingProjects}
              companiesList={companiesList}
              projects={projects}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
