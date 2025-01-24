import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

const prisma = new PrismaClient();

export class MetricasController {
  async getDashboardMetrics(request: Request, response: Response) {
    try {
      // Total de usuários
      const totalUsers = await prisma.usuario.count({
        where: { ativo: true }
      });

      // Registros de ponto hoje
      const recordsToday = await prisma.registroPonto.count({
        where: {
          data_hora: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date())
          }
        }
      });

      // Total de horas extras
      const overtime = await prisma.horaExtra.aggregate({
        _sum: {
          quantidade: true,
          valor_total: true
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
        totalOvertimeValue: overtime._sum.valor_total || 0,
        pendingOvertime
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return response.status(500).json({ error: 'Erro ao buscar métricas do dashboard' });
    }
  }

  async getChartData(request: Request, response: Response) {
    try {
      // Registros de ponto dos últimos 7 dias
      const records = await prisma.registroPonto.findMany({
        where: {
          data_hora: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          data_hora: true,
          tipo: true
        },
        orderBy: {
          data_hora: 'asc'
        }
      });

      // Horas extras dos últimos 7 dias
      const overtime = await prisma.horaExtra.findMany({
        where: {
          data: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          data: true,
          quantidade: true,
          valor_total: true
        },
        orderBy: {
          data: 'asc'
        }
      });

      return response.json({
        records,
        overtime
      });
    } catch (error) {
      console.error('Erro ao buscar dados dos gráficos:', error);
      return response.status(500).json({ error: 'Erro ao buscar dados dos gráficos' });
    }
  }

  async listarUltimosRegistros(_req: Request, res: Response) {
    try {
      const registros = await prisma.registroPonto.findMany({
        take: 10,
        orderBy: {
          data_hora: 'desc'
        },
        include: {
          usuario: true
        }
      });

      const horasExtras = await prisma.horaExtra.findMany({
        where: {
          status: 'PENDENTE'
        },
        take: 10,
        orderBy: {
          data: 'desc'
        },
        include: {
          usuario: true
        }
      });

      return res.json({
        registros,
        horasExtras
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return res.status(500).json({ error: 'Erro ao buscar métricas' });
    }
  }
} 