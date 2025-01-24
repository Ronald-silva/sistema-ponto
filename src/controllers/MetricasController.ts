import { Request, Response } from 'express';
import { prisma } from '../database';
import { startOfDay, endOfDay } from 'date-fns';

class MetricasController {
  async getDashboardMetrics(request: Request, response: Response) {
    try {
      // Total de usuários
      const totalUsers = await prisma.usuario.count();

      // Registros de hoje
      const recordsToday = await prisma.registroPonto.count({
        where: {
          created_at: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date())
          }
        }
      });

      // Total de horas extras
      const overtime = await prisma.horaExtra.aggregate({
        _sum: {
          quantidade: true
        }
      });

      // Horas extras pendentes
      const pendingOvertime = await prisma.horaExtra.count({
        where: {
          status: 'PENDENTE'
        }
      });

      return response.json({
        totalUsers,
        recordsToday,
        totalOvertime: overtime._sum.quantidade || 0,
        pendingOvertime
      });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar métricas do dashboard' });
    }
  }

  async getTimelineData(request: Request, response: Response) {
    try {
      // Registros de ponto
      const records = await prisma.registroPonto.findMany({
        orderBy: {
          created_at: 'desc'
        },
        take: 10,
        include: {
          usuario: true,
          obra: true
        }
      });

      // Horas extras
      const overtime = await prisma.horaExtra.findMany({
        orderBy: {
          created_at: 'desc'
        },
        take: 10,
        include: {
          usuario: true,
          obra: true
        }
      });

      return response.json({
        records,
        overtime
      });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar dados da timeline' });
    }
  }
}

export default new MetricasController(); 