import { Request, Response } from 'express'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eyevyovjlxycqixkvxoz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5ZXZ5b3ZqbHh5Y3FpeGt2eG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDUxOTgsImV4cCI6MjA1NDI4MTE5OH0.TK0CCZ0f6QxiS8TPsowqI4p7GhdTn6hObN86XYqDt94'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export class ProjectController {
  async index(request: Request, response: Response) {
    const { userId } = request.query;

    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return response.status(400).json({ error: 'Erro ao listar projetos' })
      }

      if (userId) {
        const filteredProjects = projects.filter(project => project.users.some(user => user.userId === userId))
        return response.json(filteredProjects)
      }

      return response.json(projects)
    } catch (error) {
      console.error('Erro ao listar projetos:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return response.status(400).json({ error: 'Erro ao buscar projeto' })
      }

      if (!project) {
        return response.status(404).json({ error: 'Projeto não encontrado' })
      }

      return response.json(project)
    } catch (error) {
      console.error('Erro ao buscar projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async create(request: Request, response: Response) {
    const { name, description, startDate, endDate, active = true } = request.body

    try {
      const { data: project, error } = await supabase
        .from('projects')
        .insert([
          {
            name,
            description,
            start_date: startDate,
            end_date: endDate,
            active
          }
        ])
        .select()
        .single()

      if (error) {
        return response.status(400).json({ error: 'Erro ao criar projeto' })
      }

      return response.status(201).json(project)
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params
    const { name, description, startDate, endDate, active } = request.body

    try {
      const { data: project, error } = await supabase
        .from('projects')
        .update({
          name,
          description,
          start_date: startDate,
          end_date: endDate,
          active
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return response.status(400).json({ error: 'Erro ao atualizar projeto' })
      }

      return response.json(project)
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) {
        return response.status(400).json({ error: 'Erro ao excluir projeto' })
      }

      return response.status(204).send()
    } catch (error) {
      console.error('Erro ao excluir projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async addUser(request: Request, response: Response) {
    const { id } = request.params
    const { userId } = request.body
    const adminId = request.user!.id

    try {
      const { data: userProject, error } = await supabase
        .from('usersOnProjects')
        .insert([
          {
            userId,
            projectId: id,
            assignedBy: adminId
          }
        ])
        .select()
        .single()

      if (error) {
        return response.status(400).json({ error: 'Erro ao adicionar usuário ao projeto' })
      }

      return response.status(201).json(userProject)
    } catch (error) {
      console.error('Erro ao adicionar usuário ao projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async removeUser(request: Request, response: Response) {
    const { id, userId } = request.params

    try {
      const { error } = await supabase
        .from('usersOnProjects')
        .delete()
        .eq('userId', userId)
        .eq('projectId', id)

      if (error) {
        return response.status(400).json({ error: 'Erro ao remover usuário do projeto' })
      }

      return response.status(204).send()
    } catch (error) {
      console.error('Erro ao remover usuário do projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}
