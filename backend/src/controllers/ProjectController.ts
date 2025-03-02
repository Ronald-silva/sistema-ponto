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

  async getActiveProjects(request: Request, response: Response) {
    try {
      console.log('Iniciando busca de projetos...');
      
      // Buscar todos os projetos ativos
      const projects = await prisma.project.findMany({
        where: {
          active: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          companyId: true,
          category: true,
          location: true,
          start_date: true,
          estimated_end_date: true,
          active: true
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      console.log('Projetos encontrados:', JSON.stringify(projects, null, 2));
      console.log('Total de projetos:', projects.length);
      
      return response.json(projects);
    } catch (error) {
      console.error('Erro detalhado ao listar projetos:', error);
      console.error('Stack:', error instanceof Error ? error.stack : '');
      return response.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : String(error)
      });
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
        location,
        company,
        start_date,
        estimated_end_date,
        status,
        category,
        active,
        overtimeRules
      } = request.body;

      // Criar o projeto com todos os campos
      const project = await prisma.project.create({
        data: {
          name,
          description: description || '',
          companyId: company,
          active: active !== undefined ? active : true,
          status: status || 'Em Andamento',
          category: category || 'CONSTRUCTION',
          location: location || '',
          start_date: start_date ? new Date(start_date) : new Date(),
          estimated_end_date: estimated_end_date ? new Date(estimated_end_date) : null
        }
      });

      return response.status(201).json(project);
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return response.status(500).json({ 
        error: 'Erro ao criar projeto',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { name, description, companyId, active, status } = request.body;

      // Verifica se o projeto existe
      const existingProject = await prisma.project.findUnique({
        where: { id }
      });

      if (!existingProject) {
        return response.status(404).json({ error: 'Projeto não encontrado' });
      }

      const project = await prisma.project.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(companyId && { companyId }),
          ...(typeof active === 'boolean' && { active }),
          ...(status && { status })
        }
      });

      return response.json(project);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return response.status(500).json({ 
        error: 'Erro ao atualizar projeto',
        details: error instanceof Error ? error.message : String(error)
      });
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
