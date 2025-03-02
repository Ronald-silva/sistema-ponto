import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { api } from '../lib/api'

export type Role = string

interface Employee {
  id: string
  name: string
  cpf: string
  role: string
  active: boolean
  salary?: number
  birth_date?: string
  admission_date?: string
}

interface CreateEmployeeData {
  name: string
  cpf: string
  role: string
  salary?: number
  birth_date?: string
  admission_date?: string
  active?: boolean
}

export function useEmployees() {
  const queryClient = useQueryClient()

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    }
  })

  const createEmployee = useMutation({
    mutationFn: async (data: CreateEmployeeData) => {
      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, ''),
        salary: typeof data.salary === 'string' 
          ? Number(data.salary.replace(/[^\d.,]/g, '').replace(',', '.'))
          : data.salary,
        active: data.active ?? true
      }

      const response = await api.post('/users', formattedData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Funcionário cadastrado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao criar funcionário:', error)
      toast.error(error.response?.data?.message || 'Erro ao criar funcionário')
    }
  })

  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...data }: Employee) => {
      const formattedData = {
        ...data,
        salary: typeof data.salary === 'string' 
          ? Number(data.salary.replace(/[^\d.,]/g, '').replace(',', '.'))
          : data.salary
      }

      const response = await api.put(`/users/${id}`, formattedData)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Funcionário atualizado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar funcionário:', error)
      toast.error(error.response?.data?.message || 'Erro ao atualizar funcionário')
    }
  })

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
      toast.success('Funcionário excluído com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao excluir funcionário:', error)
      toast.error(error.response?.data?.message || 'Erro ao excluir funcionário')
    }
  })

  return {
    employees,
    isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee
  }
}
