import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  description?: string
  location: string
  start_date: string
  estimated_end_date: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  category: string
  company: string
  active: boolean
  created_at: string
  updated_at: string
  overtimeRules: {
    type: string
    multiplier: number
    description: string
  }[]
}

interface CreateProjectData {
  name: string
  description?: string
  location: string
  start_date: string
  estimated_end_date?: string
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  category: string
  company: string
  active?: boolean
  overtimeRules: {
    type: string
    multiplier: number
    description: string
  }[]
}

export function useProjects() {
  const queryClient = useQueryClient()

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        console.log('Buscando projetos...')
        const response = await api.get('/projects')
        const data = response.data

        if (!data) {
          console.log('Nenhum projeto encontrado')
          return []
        }

        // Log para debug
        console.log('Projetos encontrados:', JSON.stringify(data, null, 2))
        return data
      } catch (error) {
        console.error('Erro ao buscar projetos:', error)
        throw error
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5 // 5 minutos
  })

  const createProject = useMutation({
    mutationFn: async (data: CreateProjectData) => {
      console.log('Criando projeto com os dados:', JSON.stringify(data, null, 2))

      const response = await api.post('/projects', data)
      const project = response.data

      console.log('Projeto criado com sucesso:', JSON.stringify(project, null, 2))
      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projeto criado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao criar projeto:', error)
      toast.error(error.response?.data?.error || 'Erro ao criar projeto')
    }
  })

  const updateProject = useMutation({
    mutationFn: async ({ id, ...data }: CreateProjectData & { id: string }) => {
      console.log('Atualizando projeto com os dados:', JSON.stringify({ id, ...data }, null, 2))

      const response = await api.put(`/projects/${id}`, data)
      const project = response.data

      console.log('Projeto atualizado com sucesso:', JSON.stringify(project, null, 2))
      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projeto atualizado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar projeto:', error)
      toast.error(error.response?.data?.error || 'Erro ao atualizar projeto')
    }
  })

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject
  }
}
