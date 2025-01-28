import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export class RegistroPontoController {
  async registrar(req: Request, res: Response) {
    try {
      const { tipo, foto } = req.body
      const usuarioId = req.usuario.id
      console.log('Registrando ponto:', { tipo, usuarioId })

      const registro = await prisma.registroPonto.create({
        data: {
          tipo,
          foto,
          usuarioId
        }
      })
      
      console.log('Registro criado:', registro)
      return res.json(registro)
    } catch (error) {
      console.error('Erro ao registrar:', error)
      return res.status(500).json({ error: 'Erro ao registrar ponto' })
    }
  }

  async listarHistorico(req: Request, res: Response) {
    try {
      const usuarioId = req.usuario.id
      const registros = await prisma.registroPonto.findMany({
        where: {
          usuarioId,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // últimos 30 dias
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return res.json(registros)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Erro ao listar histórico' })
    }
  }
} 