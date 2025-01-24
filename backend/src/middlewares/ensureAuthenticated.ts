import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface TokenPayload {
  id: string | number;
  cargo: string;
}

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, process.env.JWT_SECRET || 'default');
    const { id, cargo } = decoded as TokenPayload;

    request.user = {
      id,
      cargo
    };

    return next();
  } catch {
    throw new Error('Invalid JWT token');
  }
} 