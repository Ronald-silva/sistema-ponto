import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns'

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      // Total de funcionários ativos
      const totalFuncionarios = await prisma.usuario.count({
        where: {
          status: 'ATIVO'
        }
      })

      // Obras em andamento
      const obrasAtivas = await prisma.obra.count({
        where: {
          status: 'ATIVA'
        }
      })

      // Horas extras do mês
      const registrosMes = await prisma.registroPonto.findMany({
        where: {
          dataHora: {
            gte: startOfMonth(new Date()),
            lte: endOfMonth(new Date())
          }
        }
      })

      const horasExtrasMes = registrosMes.reduce((total, registro) => 
        total + (registro.horasExtras || 0), 0)

      // Registros de hoje
      const registrosHoje = await prisma.registroPonto.count({
        where: {
          dataHora: {
            gte: startOfDay(new Date()),
            lte: endOfDay(new Date())
          }
        }
      })

      // Últimos registros
      const ultimosRegistros = await prisma.registroPonto.findMany({
        take: 10,
        orderBy: {
          dataHora: 'desc'
        },
        include: {
          usuario: true
        }
      })

      return res.json({
        stats: {
          totalFuncionarios,
          obrasAtivas,
          horasExtrasMes,
          registrosHoje
        },
        ultimosRegistros
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return res.status(500).json({ error: 'Erro ao buscar estatísticas' })
    }
  }
} 