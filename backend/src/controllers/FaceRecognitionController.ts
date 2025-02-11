import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { FaceRecognitionService } from '../services/FaceRecognitionService';

export class FaceRecognitionController {
  private faceRecognitionService: FaceRecognitionService;

  constructor() {
    this.faceRecognitionService = new FaceRecognitionService();
  }

  async register(request: Request, response: Response) {
    const { userId } = request.params;
    const imageBuffer = request.file?.buffer;

    if (!imageBuffer) {
      return response.status(400).json({ error: 'Imagem não fornecida' });
    }

    try {
      // Verifica se o usuário existe
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Se o usuário já tem um faceId, remove o registro antigo
      if (user.faceId) {
        await this.faceRecognitionService.deleteFace(user.faceId);
      }

      // Registra o novo rosto
      const faceId = await this.faceRecognitionService.registerFace(imageBuffer, userId);

      // Atualiza o faceId do usuário
      await prisma.user.update({
        where: { id: userId },
        data: { faceId },
      });

      return response.json({ message: 'Rosto registrado com sucesso', faceId });
    } catch (error) {
      console.error('Erro ao registrar rosto:', error);
      return response.status(500).json({ error: 'Falha ao registrar rosto' });
    }
  }

  async verify(request: Request, response: Response) {
    const imageBuffer = request.file?.buffer;

    if (!imageBuffer) {
      return response.status(400).json({ error: 'Imagem não fornecida' });
    }

    try {
      const userId = await this.faceRecognitionService.verifyFace(imageBuffer);

      if (!userId) {
        return response.status(401).json({ error: 'Rosto não reconhecido' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      return response.json({ message: 'Rosto verificado com sucesso', user });
    } catch (error) {
      console.error('Erro ao verificar rosto:', error);
      return response.status(500).json({ error: 'Falha ao verificar rosto' });
    }
  }

  async delete(request: Request, response: Response) {
    const { userId } = request.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      if (!user.faceId) {
        return response.status(400).json({ error: 'Usuário não possui rosto registrado' });
      }

      // Remove o rosto do AWS Rekognition
      await this.faceRecognitionService.deleteFace(user.faceId);

      // Remove o faceId do usuário
      await prisma.user.update({
        where: { id: userId },
        data: { faceId: null },
      });

      return response.json({ message: 'Rosto removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover rosto:', error);
      return response.status(500).json({ error: 'Falha ao remover rosto' });
    }
  }
}
