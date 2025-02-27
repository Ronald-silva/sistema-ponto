import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export function adminMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const { role } = request.user;

  if (role !== 'ADMIN') {
    throw new Error('Acesso não autorizado');
  }

  return next();
}
