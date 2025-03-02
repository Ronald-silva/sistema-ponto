import { prisma } from '../lib/prisma'

interface CreateTimeRecordData {
  userId: string
  type: 'ENTRY' | 'EXIT'
  imageUrl: string
  confidence: number
}

export class TimeRecordService {
  async createTimeRecord(data: CreateTimeRecordData) {
    try {
      // Verifica se já existe um registro do mesmo tipo no mesmo dia
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const existingRecord = await prisma.timeRecord.findFirst({
        where: {
          userId: data.userId,
          type: data.type,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      })

      if (existingRecord) {
        throw new Error(`Já existe um registro de ${data.type === 'ENTRY' ? 'entrada' : 'saída'} para hoje`)
      }

      // Cria o registro
      const timeRecord = await prisma.timeRecord.create({
        data: {
          userId: data.userId,
          type: data.type,
          imageUrl: data.imageUrl,
          confidence: data.confidence
        }
      })

      return timeRecord
    } catch (error) {
      console.error('Erro ao criar registro:', error)
      throw error
    }
  }

  async getTimeRecords(userId: string, date?: Date) {
    try {
      const startDate = date || new Date()
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 1)

      const records = await prisma.timeRecord.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lt: endDate
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })

      return records
    } catch (error) {
      console.error('Erro ao buscar registros:', error)
      throw error
    }
  }
} 