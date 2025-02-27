import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { auth } from '../config/auth'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
  role: 'ADMIN' | 'EMPLOYEE'
}

export async function authMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new Error('JWT token is missing')
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, auth.jwt.secret) as TokenPayload
    const { sub, role } = decoded

    const user = await prisma.user.findUnique({
      where: { id: sub },
    })

    if (!user) {
      throw new Error('User not found')
    }

    request.user = {
      id: sub,
      role,
    }

    return next()
  } catch {
    throw new Error('Invalid JWT token')
  }
}
