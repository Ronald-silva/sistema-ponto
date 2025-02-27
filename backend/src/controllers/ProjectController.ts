import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export class ProjectController {
  async index(request: Request, response: Response) {
    try {
      const projects = await prisma.project.findMany();
      return response.json(projects);
    } catch (error) {
      console.error('Erro ao listar projetos:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const project = await prisma.project.findUnique({
        where: { id }
      });

      if (!project) {
        return response.status(404).json({ error: 'Projeto não encontrado' });
      }

      return response.json(project);
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { 
        name, 
        description,
        companyId
      } = request.body;

      const project = await prisma.project.create({
        data: {
          name,
          description,
          companyId
        }
      });

      return response.status(201).json(project);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao criar projeto' });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name, description, companyId } = request.body;

      const project = await prisma.project.update({
        where: { id },
        data: {
          name,
          description,
          companyId
        }
      });

      return response.json(project);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao atualizar projeto' });
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      await prisma.project.delete({
        where: { id }
      });

      return response.status(204).send();
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao deletar projeto' });
    }
  }

  async addUser(request: Request, response: Response) {
    const { id } = request.params;
    const { userId } = request.body;

    try {
      const userProject = await prisma.userProject.create({
        data: {
          userId,
          projectId: id,
          assignedAt: new Date()
        }
      });

      return response.status(201).json(userProject);
    } catch (error) {
      console.error('Erro ao adicionar usuário ao projeto:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async removeUser(request: Request, response: Response) {
    const { id, userId } = request.params;

    try {
      await prisma.userProject.delete({
        where: {
          userId_projectId: {
            userId,
            projectId: id
          }
        }
      });

      return response.status(204).send();
    } catch (error) {
      console.error('Erro ao remover usuário do projeto:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
