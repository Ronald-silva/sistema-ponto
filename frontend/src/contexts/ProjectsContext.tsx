import { createContext, useContext } from 'react'
import { api } from '../lib/api'
import { useQuery } from '@tanstack/react-query'

interface Project {
  id: string
  name: string
  company: string
  active: boolean
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
}

interface ProjectsContextData {
  data: Project[]
  isLoading: boolean
  error: Error | null
}

const ProjectsContext = createContext({} as ProjectsContextData)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects/active')
      return response.data
    }
  })

  return (
    <ProjectsContext.Provider
      value={{
        data: data || [],
        isLoading,
        error: error as Error | null
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)

  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider')
  }

  return context
} 