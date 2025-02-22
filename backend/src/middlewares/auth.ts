import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface TokenPayload {
  id: string
  role: 'ADMIN' | 'EMPLOYEE'
  cpf?: string
  projectId?: string
  companyId?: string
}

export async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers

  if (!authorization) {
    return response.status(401).json({ error: 'Token não fornecido' })
  }

  const [, token] = authorization.split(' ')

  try {
    // Verificar token JWT
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload

    // Adicionar dados do usuário ao request
    request.user = {
      id: decoded.id,
      role: decoded.role,
      cpf: decoded.cpf,
      projectId: decoded.projectId,
      companyId: decoded.companyId
    }

    return next()
  } catch (err) {
    console.error('Erro ao validar token:', err)
    return response.status(401).json({ error: 'Token inválido' })
  }
}
