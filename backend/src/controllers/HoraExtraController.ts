import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';

const prisma = new PrismaClient();

export class HoraExtraController {
  async index(req: Request, res: Response) {
    try {
      const horasExtras = await prisma.horaExtra.findMany({
        include: {
          usuario: true
        },
        orderBy: {
          data: 'desc'
        }
      });

      return res.json(horasExtras);
    } catch (error) {
      console.error('Erro ao listar horas extras:', error);
      return res.status(500).json({ error: 'Erro ao listar horas extras' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const horaExtra = await prisma.horaExtra.findUnique({
        where: { id: Number(id) },
        include: {
          usuario: true
        }
      });

      if (!horaExtra) {
        return res.status(404).json({ error: 'Hora extra não encontrada' });
      }

      return res.json(horaExtra);
    } catch (error) {
      console.error('Erro ao buscar hora extra:', error);
      return res.status(500).json({ error: 'Erro ao buscar hora extra' });
    }
  }

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { quantidade, valor_hora, data, percentual } = req.body;
      const { id: usuario_id } = req.user;

      const valor_total = Number(quantidade) * Number(valor_hora) * (1 + Number(percentual) / 100);

      const horaExtra = await prisma.horaExtra.create({
        data: {
          quantidade: Number(quantidade),
          valor_hora: Number(valor_hora),
          data: new Date(data),
          status: 'PENDENTE',
          usuario_id: Number(usuario_id),
          percentual: Number(percentual),
          valor_total
        }
      });

      return res.status(201).json(horaExtra);
    } catch (error) {
      console.error('Erro ao criar hora extra:', error);
      return res.status(500).json({ error: 'Erro ao criar hora extra' });
    }
  }

  async aprovar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const horaExtra = await prisma.horaExtra.update({
        where: { id: Number(id) },
        data: {
          status: 'APROVADA'
        }
      });

      return res.json(horaExtra);
    } catch (error) {
      console.error('Erro ao aprovar hora extra:', error);
      return res.status(500).json({ error: 'Erro ao aprovar hora extra' });
    }
  }

  async rejeitar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const horaExtra = await prisma.horaExtra.update({
        where: { id: Number(id) },
        data: {
          status: 'REJEITADA'
        }
      });

      return res.json(horaExtra);
    } catch (error) {
      console.error('Erro ao rejeitar hora extra:', error);
      return res.status(500).json({ error: 'Erro ao rejeitar hora extra' });
    }
  }

  async listarPorUsuario(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: usuario_id } = req.user;

      const horasExtras = await prisma.horaExtra.findMany({
        where: { usuario_id: Number(usuario_id) },
        orderBy: {
          data: 'desc'
        }
      });

      return res.json(horasExtras);
    } catch (error) {
      console.error('Erro ao listar horas extras:', error);
      return res.status(500).json({ error: 'Erro ao listar horas extras' });
    }
  }

  async getMetricas(req: Request, res: Response) {
    try {
      const horasExtras = await prisma.horaExtra.findMany({
        include: {
          usuario: true
        }
      });

      const totalHoras = horasExtras.reduce((total, hora) => total + hora.quantidade, 0);
      const totalValor = horasExtras.reduce((total, hora) => total + hora.valor_total, 0);
      const usuariosUnicos = new Set(horasExtras.map(h => h.usuario_id)).size;

      const horasPorStatus = {
        PENDENTE: horasExtras.filter(h => h.status === 'PENDENTE').length,
        APROVADA: horasExtras.filter(h => h.status === 'APROVADA').length,
        REJEITADA: horasExtras.filter(h => h.status === 'REJEITADA').length
      };

      return res.json({
        totalHoras,
        totalValor,
        usuariosUnicos,
        horasPorStatus
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return res.status(500).json({ error: 'Erro ao buscar métricas das horas extras' });
    }
  }
} 