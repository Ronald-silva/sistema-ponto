import { Request, Response, NextFunction } from 'express'

export function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  const { user } = request

  if (!user?.role || user.role !== 'ADMIN') {
    return response.status(403).json({ error: 'Acesso negado' })
  }

  return next()
} 