import { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eyevyovjlxycqixkvxoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class AuthController {
  async login(request: Request, response: Response) {
    const { password } = request.body

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@example.com',
        password
      })

      if (error) {
        return response.status(401).json({ error: 'Credenciais inválidas' })
      }

      return response.json({
        user: {
          id: data.user.id,
          role: 'ADMIN'
        },
        token: data.session?.access_token
      })
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async loginEmployee(request: Request, response: Response) {
    const { cpf, projectId } = request.body

    if (!cpf || !projectId) {
      return response.status(400).json({ error: 'CPF e projeto são obrigatórios' })
    }

    try {
      // Buscar funcionário pelo CPF
      const { data: employee, error: employeeError } = await supabase
        .from('users')
        .select('id, name')
        .eq('cpf', cpf)
        .single()

      if (employeeError || !employee) {
        console.error('Erro ao buscar funcionário:', employeeError)
        return response.status(401).json({ error: 'Funcionário não encontrado' })
      }

      // Verificar se o funcionário está associado ao projeto
      const { data: projectUser, error: projectError } = await supabase
        .from('user_projects')
        .select('*')
        .eq('user_id', employee.id)
        .eq('project_id', projectId)
        .eq('active', true)
        .single()

      if (projectError || !projectUser) {
        console.error('Erro ao verificar projeto:', projectError)
        return response.status(401).json({ error: 'Funcionário não está associado a este projeto' })
      }

      return response.json({
        user: {
          id: employee.id,
          name: employee.name,
          role: 'EMPLOYEE'
        }
      })
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async register(request: Request, response: Response) {
    const { name, email, password, role = 'EMPLOYEE' } = request.body

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return response.status(400).json({ error: 'Erro ao criar conta' })
      }

      // Criar usuário no banco de dados
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            role,
          },
        ])
        .select()
        .single()

      if (userError) {
        return response.status(400).json({ error: 'Erro ao criar usuário' })
      }

      return response.status(201).json(user)
    } catch (error) {
      console.error('Erro ao registrar:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}
