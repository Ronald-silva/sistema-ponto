import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import { auth } from '../config/auth'
import { UserRole } from '@prisma/client'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
  role: UserRole
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
  
  console.log('Token recebido:', token)
  console.log('Secret usado:', auth.jwt.secret)

  try {
    const decoded = verify(token, auth.jwt.secret) as TokenPayload
    console.log('Token decodificado:', decoded)
    
    const { sub, role } = decoded

    const user = await prisma.user.findUnique({
      where: { id: sub },
    })

    if (!user) {
      console.log('Usuário não encontrado com ID:', sub)
      throw new Error('User not found')
    }

    console.log('Usuário encontrado:', user)

    request.user = {
      id: sub,
      role,
    }

    return next()
  } catch (error) {
    console.error('Erro ao validar token:', error)
    throw new Error('Invalid JWT token')
  }
}
