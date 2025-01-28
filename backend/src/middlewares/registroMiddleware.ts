import { Request, Response, NextFunction } from 'express'
import { LimpezaService } from '../services/LimpezaService'

export async function verificarLimpezaMiddleware(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  try {
    const limpezaService = new LimpezaService()
    
    // Verifica se precisa limpar antes de salvar novo registro
    const totalRegistros = await prisma.registroPonto.count({
      where: { foto: { not: null } }
    })

    // Se tiver muitos registros com foto, força uma limpeza
    if (totalRegistros > 1000) { // Ajuste esse número conforme necessário
      await limpezaService.limparFotosAntigas()
    }

    next()
  } catch (error) {
    next(error)
  }
} 