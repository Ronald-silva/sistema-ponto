import { PrismaClient } from '@prisma/client'
import { addDays, isBefore } from 'date-fns'

export class LimpezaService {
  private prisma: PrismaClient
  private DIAS_RETENCAO = 30 // Configura quantos dias manter as fotos

  constructor() {
    this.prisma = new PrismaClient()
  }

  async limparFotosAntigas() {
    try {
      const dataLimite = addDays(new Date(), -this.DIAS_RETENCAO)

      // Limpa fotos de registros processados e antigos
      const resultado = await this.prisma.registroPonto.updateMany({
        where: {
          AND: [
            { processado: true },
            { dataHora: { lt: dataLimite } },
            { foto: { not: null } }
          ]
        },
        data: {
          foto: null // Remove a foto
        }
      })

      console.log(`Limpeza concluída: ${resultado.count} fotos removidas`)
      return resultado.count
    } catch (error) {
      console.error('Erro na limpeza automática:', error)
      throw error
    }
  }

  // Agenda a limpeza para rodar diariamente
  agendarLimpeza() {
    // Roda a limpeza todo dia à 1h da manhã
    const HORA_LIMPEZA = 1
    
    setInterval(() => {
      const agora = new Date()
      if (agora.getHours() === HORA_LIMPEZA) {
        this.limparFotosAntigas()
      }
    }, 1000 * 60 * 60) // Verifica a cada hora
  }
} 