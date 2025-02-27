import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import jwt, { Secret } from 'jsonwebtoken'
import { auth } from '../config/auth'

interface JwtPayload {
  id: string
  role: 'ADMIN' | 'EMPLOYEE'
  projectId?: string
}

export class AuthController {
  async login(request: Request, response: Response) {
    try {
      const { password } = request.body

      if (!password) {
        return response.status(400).json({ error: 'Senha é obrigatória' })
      }

      if (password !== 'admin123') {
        return response.status(401).json({ error: 'Senha incorreta' })
      }

      const adminUser = {
        id: 'd504a949-b481-40be-a675-1528388986aa2',
        role: 'ADMIN' as const,
        name: 'Administrador'
      }
      // @ts-ignore
      const token = jwt.sign(
        { 
          id: adminUser.id,
          role: adminUser.role
        } satisfies JwtPayload,
        auth.jwt.secret as Secret,
        { 
          expiresIn: auth.jwt.expiresIn
        }
      )

      return response.json({
        token,
        user: adminUser
      })
    } catch (error) {
      console.error('Erro no login:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async loginEmployee(request: Request, response: Response) {
    const { cpf: rawCpf, projectId } = request.body
    // Normalizar CPF removendo pontos e traços
    const cpf = rawCpf.replace(/\D/g, '')
    
    console.log('Tentativa de login:', { cpf, projectId })

    if (!cpf) {
      return response.status(400).json({ error: 'CPF é obrigatório' })
    }

    if (!projectId) {
      return response.status(400).json({ error: 'Projeto é obrigatório' })
    }

    try {
      // Buscar usuário pelo CPF
      const user = await prisma.user.findUnique({
        where: { cpf },
        select: {
          id: true,
          name: true,
          cpf: true,
          role: true,
          active: true
        }
      })

      if (!user) {
        return response.status(401).json({ error: 'Usuário não encontrado' })
      }

      if (!user.active) {
        return response.status(401).json({ error: 'Usuário inativo' })
      }

      // Buscar projeto
      const project = await prisma.project.findUnique({
        where: { 
          id: projectId
        },
        select: {
          id: true,
          name: true
        }
      })

      if (!project) {
        return response.status(401).json({ error: 'Projeto não encontrado' })
      }

      // Verificar se o usuário está associado ao projeto
      const userProject = await prisma.userProject.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: project.id
          }
        }
      })

      if (!userProject) {
        return response.status(401).json({ error: 'Usuário não está associado a este projeto' })
      }

      // Gerar token
      // @ts-ignore
      const token = jwt.sign(
        { 
          id: user.id,
          role: user.role,
          projectId: project.id
        } satisfies JwtPayload,
        auth.jwt.secret as Secret,
        { 
          expiresIn: auth.jwt.expiresIn
        }
      )

      return response.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          cpf: user.cpf,
          role: user.role
        },
        project: {
          id: project.id,
          name: project.name
        }
      })
    } catch (error) {
      console.error('Erro no login:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}
