import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ObraController {
  async index(_req: Request, res: Response) {
    try {
      const obras = await prisma.obra.findMany({
        include: {
          _count: {
            select: {
              usuarios_atuais: true,
              registros: true
            }
          }
        }
      });

      return res.json(obras);
    } catch (error) {
      console.error('Erro ao listar obras:', error);
      return res.status(500).json({ error: 'Erro ao listar obras' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const obra = await prisma.obra.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: {
              usuarios_atuais: true,
              registros: true
            }
          }
        }
      });

      if (!obra) {
        return res.status(404).json({ error: 'Obra não encontrada' });
      }

      return res.json(obra);
    } catch (error) {
      console.error('Erro ao buscar obra:', error);
      return res.status(500).json({ error: 'Erro ao buscar obra' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, endereco } = req.body;

      const obra = await prisma.obra.create({
        data: {
          nome,
          endereco,
          ativa: true
        }
      });

      return res.status(201).json(obra);
    } catch (error) {
      console.error('Erro ao criar obra:', error);
      return res.status(500).json({ error: 'Erro ao criar obra' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, endereco, ativa } = req.body;

      const obra = await prisma.obra.update({
        where: { id: Number(id) },
        data: {
          nome,
          endereco,
          ativa
        }
      });

      return res.json(obra);
    } catch (error) {
      console.error('Erro ao atualizar obra:', error);
      return res.status(500).json({ error: 'Erro ao atualizar obra' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Verificar se existem registros vinculados
      const registros = await prisma.registroPonto.findMany({
        where: { obra_id: Number(id) }
      });

      const usuariosVinculados = await prisma.obrasUsuario.findMany({
        where: { obra_id: Number(id) }
      });

      if (registros.length > 0 || usuariosVinculados.length > 0) {
        return res.status(400).json({
          error: 'Não é possível excluir a obra pois existem registros vinculados'
        });
      }

      await prisma.obra.delete({
        where: { id: Number(id) }
      });

      return res.json({ message: 'Obra excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir obra:', error);
      return res.status(500).json({ error: 'Erro ao excluir obra' });
    }
  }

  async vincularUsuario(req: Request, res: Response) {
    try {
      const { usuario_id, obra_id } = req.body;

      await prisma.obrasUsuario.create({
        data: {
          usuario_id: Number(usuario_id),
          obra_id: Number(obra_id)
        }
      });

      return res.status(201).json({ message: 'Usuário vinculado com sucesso' });
    } catch (error) {
      console.error('Erro ao vincular usuário:', error);
      return res.status(500).json({ error: 'Erro ao vincular usuário à obra' });
    }
  }

  async desvincularUsuario(req: Request, res: Response) {
    try {
      const { usuario_id, obra_id } = req.body;

      await prisma.obrasUsuario.deleteMany({
        where: {
          usuario_id: Number(usuario_id),
          obra_id: Number(obra_id)
        }
      });

      return res.json({ message: 'Usuário desvinculado com sucesso' });
    } catch (error) {
      console.error('Erro ao desvincular usuário:', error);
      return res.status(500).json({ error: 'Erro ao desvincular usuário da obra' });
    }
  }

  async getMetricas(req: Request, res: Response) {
    try {
      const { id: obraId } = req.params;

      const registros = await prisma.registroPonto.count({
        where: { obra_id: Number(obraId) }
      });

      const usuariosAtivos = await prisma.obrasUsuario.count({
        where: { obra_id: Number(obraId) }
      });

      return res.json({
        registros,
        usuariosAtivos
      });
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      return res.status(500).json({ error: 'Erro ao buscar métricas da obra' });
    }
  }
} 