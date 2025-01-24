import { Request, Response } from 'express';
import { prisma } from '../database';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';

class RegistroPontoController {
  async listarPorUsuario(request: AuthenticatedRequest, response: Response) {
    try {
      const usuario_id = request.user.id;

      const registros = await prisma.registroPonto.findMany({
        where: { usuario_id },
        include: {
          obra: true
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return response.json(registros);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao buscar registros de ponto' });
    }
  }

  async registrar(request: AuthenticatedRequest, response: Response) {
    try {
      const usuario_id = request.user.id;
      const { tipo, obra_id, foto_url } = request.body;

      const registro = await prisma.registroPonto.create({
        data: {
          tipo,
          usuario_id,
          obra_id,
          foto_url
        }
      });

      return response.status(201).json(registro);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'Erro ao registrar ponto' });
    }
  }
}

export default new RegistroPontoController(); 