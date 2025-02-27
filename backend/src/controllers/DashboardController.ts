import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class DashboardController {
  async index(request: Request, response: Response) {
    try {
      // Contagem de usuários ativos
      const activeUsersCount = await prisma.user.count({
        where: {
          active: true
        }
      });

      // Contagem de projetos
      const projectsCount = await prisma.project.count();

      // Contagem de registros de ponto
      const timeRecordsCount = await prisma.timeRecord.count();

      return response.json({
        activeUsers: activeUsersCount,
        projects: projectsCount,
        timeRecords: timeRecordsCount
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
