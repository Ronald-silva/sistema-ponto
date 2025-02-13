import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export class ProjectController {
  async index(request: Request, response: Response) {
    const { userId } = request.query;

    try {
      const projects = await prisma.project.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })

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
    const { id } = request.params

    try {
      const project = await prisma.project.findUnique({
        where: { id }
      })

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
      const project = await prisma.project.create({
        data: {
          name,
          description,
          startDate,
          endDate,
          active
        }
      })

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
      const project = await prisma.project.update({
        where: { id },
        data: {
          name,
          description,
          startDate,
          endDate,
          active
        }
      })

      return response.json(project)
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params

    try {
      await prisma.project.delete({
        where: { id }
      })

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
      const userProject = await prisma.usersOnProjects.create({
        data: {
          userId,
          projectId: id,
          assignedBy: adminId
        }
      })

      return response.status(201).json(userProject)
    } catch (error) {
      console.error('Erro ao adicionar usuário ao projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async removeUser(request: Request, response: Response) {
    const { id, userId } = request.params

    try {
      await prisma.usersOnProjects.delete({
        where: {
          userId,
          projectId: id
        }
      })

      return response.status(204).send()
    } catch (error) {
      console.error('Erro ao remover usuário do projeto:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async active(request: Request, response: Response) {
    try {
      const projects = await prisma.project.findMany({
        where: {
          active: true
        },
        select: {
          id: true,
          name: true
        },
        orderBy: {
          name: 'asc'
        }
      })

      return response.json(projects)
    } catch (error) {
      console.error('Erro ao listar projetos ativos:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}
