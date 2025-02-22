import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

interface Project {
  id: string
  name: string
  location: string
  start_date: string
  estimated_end_date: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  category: string
  company: string
  active: boolean
  created_at: string
  updated_at: string
}

interface CreateProjectData {
  name: string
  location: string
  start_date: string
  estimated_end_date?: string
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED' | 'CANCELLED'
  category: string
  company: string
  active?: boolean
}

export function useProjects() {
  const queryClient = useQueryClient()

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        console.log('Buscando projetos...')
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('active', true)
          .eq('status', 'ACTIVE')
          .order('name', { ascending: true })

        if (error) {
          console.error('Erro ao carregar projetos:', error)
          toast.error(`Erro ao carregar projetos: ${error.message}`)
          throw error
        }

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

      const { data: project, error } = await supabase
        .from('projects')
        .insert([
          {
            name: data.name,
            location: data.location,
            start_date: data.start_date,
            estimated_end_date: data.estimated_end_date,
            status: data.status,
            category: data.category,
            company: data.company,
            active: data.active ?? true
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar projeto:', error)
        toast.error(`Erro ao criar projeto: ${error.message}`)
        throw error
      }

      console.log('Projeto criado com sucesso:', JSON.stringify(project, null, 2))
      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projeto criado com sucesso!')
    }
  })

  const updateProject = useMutation({
    mutationFn: async ({ id, ...data }: CreateProjectData & { id: string }) => {
      console.log('Atualizando projeto com os dados:', JSON.stringify({ id, ...data }, null, 2))

      const { data: project, error } = await supabase
        .from('projects')
        .update({
          name: data.name,
          location: data.location,
          start_date: data.start_date,
          estimated_end_date: data.estimated_end_date,
          status: data.status,
          category: data.category,
          company: data.company,
          active: data.active
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar projeto:', error)
        toast.error(`Erro ao atualizar projeto: ${error.message}`)
        throw error
      }

      console.log('Projeto atualizado com sucesso:', JSON.stringify(project, null, 2))
      return project
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Projeto atualizado com sucesso!')
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
