import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';

const prisma = new PrismaClient();

export class RegistroPontoController {
  async registrar(req: AuthenticatedRequest, res: Response) {
    try {
      const { tipo, tipo_dia, valor_hora, percentual, valor_total, foto_url } = req.body;
      const { id: usuario_id } = req.user;

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(usuario_id) }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (!usuario.obra_atual_id) {
        return res.status(400).json({ error: 'Usuário não possui obra atual definida' });
      }

      const registro = await prisma.registroPonto.create({
        data: {
          tipo,
          tipo_dia,
          valor_hora: Number(valor_hora),
          percentual: Number(percentual),
          valor_total: Number(valor_total),
          foto_url,
          usuario_id: Number(usuario_id),
          obra_id: usuario.obra_atual_id
        }
      });

      return res.status(201).json(registro);
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      return res.status(500).json({ error: 'Erro ao registrar ponto' });
    }
  }

  async listarPorUsuario(req: AuthenticatedRequest, res: Response) {
    try {
      const { id: usuario_id } = req.user;

      const registros = await prisma.registroPonto.findMany({
        where: { usuario_id: Number(usuario_id) },
        include: {
          obra: true
        },
        orderBy: {
          data_hora: 'desc'
        }
      });

      return res.json(registros);
    } catch (error) {
      console.error('Erro ao listar registros:', error);
      return res.status(500).json({ error: 'Erro ao listar registros de ponto' });
    }
  }

  async listarPorObra(req: Request, res: Response) {
    try {
      const { obra_id } = req.params;

      const registros = await prisma.registroPonto.findMany({
        where: { obra_id: Number(obra_id) },
        include: {
          usuario: true
        },
        orderBy: {
          data_hora: 'desc'
        }
      });

      return res.json(registros);
    } catch (error) {
      console.error('Erro ao listar registros:', error);
      return res.status(500).json({ error: 'Erro ao listar registros de ponto' });
    }
  }

  async getMetricas(req: Request, res: Response) {
    try {
      const { obra_id } = req.params;

      const registros = await prisma.registroPonto.findMany({
        where: { obra_id: Number(obra_id) },
        include: {
          usuario: true
        }
      });

      const registrosPorDia = registros.reduce((acc: Record<string, number>, registro) => {
        const data = new Date(registro.data_hora).toISOString().split('T')[0];
        acc[data] = (acc[data] || 0) + 1;
        return acc;
      }, {});

      const registrosPorDiaArray = Object.entries(registrosPorDia).map(([data, total]) => ({
        data,
        total
      }));

      const usuariosUnicos = new Set(registros.map(r => r.usuario_id)).size;

      return res.json({
        totalRegistros: registros.length,
        usuariosUnicos,
        registrosPorDia: registrosPorDiaArray
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return res.status(500).json({ error: 'Erro ao buscar métricas dos registros' });
    }
  }
} 