import { Request, Response, NextFunction } from 'express'

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

  // ID fixo do admin que definimos no frontend
  const adminId = 'd504a949-b481-40be-a675-1528388986aa2'

  try {
    if (token === adminId) {
      request.user = {
        id: adminId,
        role: 'ADMIN'
      }
      return next()
    }

    // TODO: Implementar verificação de funcionário
    if (token === 'temp-employee-id') {
      request.user = {
        id: token,
        role: 'EMPLOYEE'
      }
      return next()
    }

    return response.status(401).json({ error: 'Token inválido' })
  } catch (err) {
    return response.status(401).json({ error: 'Token inválido' })
  }
}
