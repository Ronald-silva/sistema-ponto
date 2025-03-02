import { Request, Response } from 'express'
import { FaceRecognitionService } from '../services/FaceRecognitionService'
import { TimeRecordService } from '../services/TimeRecordService'

export class FaceRecognitionController {
  private faceService: FaceRecognitionService
  private timeRecordService: TimeRecordService

  constructor() {
    this.faceService = new FaceRecognitionService()
    this.timeRecordService = new TimeRecordService()
  }

  async detectFace(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem fornecida' })
      }

      const imageBase64 = req.file.buffer.toString('base64')
      const result = await this.faceService.detectFace(imageBase64)

      return res.json(result)
    } catch (error) {
      console.error('Erro na detecção facial:', error)
      return res.status(500).json({ error: 'Erro ao processar imagem' })
    }
  }

  async registerTimeEntry(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhuma imagem fornecida' })
      }

      const { userId, type } = req.body
      if (!userId || !type) {
        return res.status(400).json({ error: 'Dados incompletos' })
      }

      const imageBase64 = req.file.buffer.toString('base64')

      // Verifica se a face corresponde ao usuário
      const searchResult = await this.faceService.searchFace(imageBase64)
      
      if (searchResult.userId !== userId) {
        return res.status(401).json({ error: 'Face não corresponde ao usuário' })
      }

      // Registra o ponto
      const timeRecord = await this.timeRecordService.createTimeRecord({
        userId,
        type,
        imageUrl: '', // TODO: Implementar armazenamento da imagem
        confidence: searchResult.confidence
      })

      return res.json(timeRecord)
    } catch (error) {
      console.error('Erro ao registrar ponto:', error)
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message })
      }
      return res.status(500).json({ error: 'Erro ao registrar ponto' })
    }
  }
} 