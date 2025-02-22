import { Request, Response, NextFunction } from 'express';

export function adminMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { user } = request;

  if (!user) {
    return response.status(401).json({ error: 'Usuário não autenticado' });
  }

  if (user.role !== 'ADMIN') {
    return response.status(403).json({ error: 'Acesso negado' });
  }

  return next();
}
