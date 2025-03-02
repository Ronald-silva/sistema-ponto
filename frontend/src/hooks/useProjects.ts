import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  description?: string
  companyId: string
  status: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface CreateProjectData {
  name: string
  description?: string
  companyId: string
  status?: string
  active?: boolean
}

export function useProjects() {
  const queryClient = useQueryClient()

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        console.log('Buscando projetos...')
        const response = await api.get('/projects/active')
        const data = response.data

        if (!data) {
          console.log('Nenhum projeto encontrado')
          return []
        }

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
      const response = await api.post('/projects', { ...data, active: true })
      console.log('Projeto criado com sucesso:', JSON.stringify(response.data, null, 2))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projeto criado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao criar projeto:', error)
      toast.error('Erro ao criar projeto')
    }
  })

  const updateProject = useMutation({
    mutationFn: async ({ id, ...data }: CreateProjectData & { id: string }) => {
      console.log('Atualizando projeto com os dados:', JSON.stringify({ id, ...data }, null, 2))
      const response = await api.put(`/projects/${id}`, data)
      console.log('Projeto atualizado com sucesso:', JSON.stringify(response.data, null, 2))
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projeto atualizado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar projeto:', error)
      toast.error('Erro ao atualizar projeto')
    }
  })

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo projeto:', id)
      const response = await api.put(`/projects/${id}`, { active: false })
      console.log('Projeto excluído com sucesso')
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projeto excluído com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao excluir projeto:', error)
      toast.error('Erro ao excluir projeto')
    }
  })

  return {
    projects,
    isLoading,
    error,
    createProject,
    updateProject,
    deleteProject
  }
}
