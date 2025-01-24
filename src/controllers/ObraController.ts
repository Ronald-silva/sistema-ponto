import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ObraController {
  async vincularUsuario(request: Request, response: Response) {
    try {
      const { usuarioId, obraId } = request.body;

      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId }
      });

      if (!usuario) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      await prisma.obrasUsuario.create({
        data: {
          usuario_id: usuarioId,
          obra_id: obraId
        }
      });

      return response.status(201).json({ message: 'Usuário vinculado com sucesso' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao vincular usuário à obra' });
    }
  }

  async desvincularUsuario(request: Request, response: Response) {
    try {
      const { usuarioId, obraId } = request.body;

      const obraUsuario = await prisma.obrasUsuario.findFirst({
        where: {
          usuario_id: usuarioId,
          obra_id: obraId
        }
      });

      if (!obraUsuario) {
        return response.status(404).json({ error: 'Vínculo não encontrado' });
      }

      await prisma.obrasUsuario.delete({
        where: {
          id: obraUsuario.id
        }
      });

      return response.json({ message: 'Usuário desvinculado com sucesso' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao desvincular usuário da obra' });
    }
  }

  async atualizarObraAtual(request: Request, response: Response) {
    try {
      const { usuarioId, obraId } = request.body;

      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId }
      });

      if (!usuario) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      const obraUsuario = await prisma.obrasUsuario.findFirst({
        where: {
          usuario_id: usuarioId,
          obra_id: obraId
        }
      });

      if (!obraUsuario) {
        return response.status(404).json({ error: 'Usuário não está vinculado a esta obra' });
      }

      await prisma.usuario.update({
        where: { id: usuarioId },
        data: { obra_atual_id: obraId }
      });

      return response.json({ message: 'Obra atual atualizada com sucesso' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao atualizar obra atual' });
    }
  }

  async excluir(request: Request, response: Response) {
    try {
      const { id } = request.params;

      // Verificar registros de ponto
      const registrosPonto = await prisma.registroPonto.findMany({
        where: {
          obra_id: id
        }
      });

      // Verificar horas extras
      const horasExtras = await prisma.horaExtra.findMany({
        where: {
          obra_id: id
        }
      });

      // Verificar usuários vinculados
      const funcionariosAtivos = await prisma.obrasUsuario.count({
        where: {
          obra_id: id
        }
      });

      if (registrosPonto.length > 0 || horasExtras.length > 0 || funcionariosAtivos > 0) {
        return response.status(400).json({
          error: 'Não é possível excluir a obra pois existem registros vinculados'
        });
      }

      await prisma.obra.delete({
        where: { id }
      });

      return response.json({ message: 'Obra excluída com sucesso' });

    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao excluir obra' });
    }
  }
}

export default new ObraController(); 