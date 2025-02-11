import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

export type Role = 
  | 'PEDREIRO'
  | 'SERVENTE'
  | 'MESTRE_DE_OBRAS'
  | 'CARPINTEIRO'
  | 'ARMADOR'
  | 'ELETRICISTA'
  | 'ENCANADOR'
  | 'PINTOR'
  | 'AZULEJISTA'
  | 'ENGENHEIRO'
  | 'ARQUITETO'
  | 'ALMOXARIFE'
  | 'ADMINISTRATIVO'
  | 'ADMIN'

interface Employee {
  id: string
  name: string
  cpf: string
  role: Role
  active: boolean
  salary?: number
  birth_date?: string
  admission_date?: string
}

interface CreateEmployeeData {
  name: string
  cpf: string
  role: Role
  salary?: number
  birth_date?: string
  admission_date?: string
  active?: boolean
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function useEmployees() {
  const queryClient = useQueryClient()

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('active', true)
        .order('id', { ascending: false })

      if (error) {
        console.error('Erro ao carregar funcionários:', error)
        throw new Error(`Erro ao carregar funcionários: ${error.message}`)
      }

      return data
    }
  })

  const createEmployee = useMutation({
    mutationFn: async (data: CreateEmployeeData) => {
      // Primeiro verifica se já existe um usuário com este CPF
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('cpf', data.cpf)
        .single()

      if (existingUser) {
        throw new Error('Já existe um funcionário cadastrado com este CPF')
      }

      // Cria o registro na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            name: data.name,
            cpf: data.cpf,
            role: data.role,
            active: data.active ?? true,
            salary: data.salary,
            birth_date: data.birth_date,
            admission_date: data.admission_date
          }
        ])
        .select()
        .single()

      if (userError) {
        console.error('Erro ao criar funcionário:', userError)
        throw new Error(`Erro ao criar funcionário: ${userError.message}`)
      }

      return userData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    }
  })

  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...data }: CreateEmployeeData & { id: string }) => {
      // Verifica se já existe outro usuário com este CPF
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('cpf', data.cpf)
        .neq('id', id)
        .single()

      if (existingUser) {
        throw new Error('Já existe outro funcionário cadastrado com este CPF')
      }

      // Atualiza o registro na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .update({
          name: data.name,
          cpf: data.cpf,
          role: data.role,
          active: data.active,
          salary: data.salary,
          birth_date: data.birth_date,
          admission_date: data.admission_date
        })
        .eq('id', id)
        .select()
        .single()

      if (userError) {
        console.error('Erro ao atualizar funcionário:', userError)
        throw new Error(`Erro ao atualizar funcionário: ${userError.message}`)
      }

      return userData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
    }
  })

  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      // Não deleta realmente, apenas marca como inativo
      const { error } = await supabase
        .from('users')
        .update({ active: false })
        .eq('id', id)

      if (error) {
        console.error('Erro ao excluir funcionário:', error)
        throw new Error(`Erro ao excluir funcionário: ${error.message}`)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] })
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
