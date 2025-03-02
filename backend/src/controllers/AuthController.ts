import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import jwt, { Secret } from 'jsonwebtoken'
import { auth } from '../config/auth'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'

interface JwtPayload {
  id: string
  role: UserRole
  projectId?: string
}

const loginSchema = z.object({
  cpf: z.string(),
  projectId: z.string(),
})

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

      const adminId = 'd504a949-b481-40be-a675-1528388986aa'

      // Buscar ou criar o usuário admin
      let adminUser = await prisma.user.findUnique({
        where: { id: adminId }
      })

      if (!adminUser) {
        console.log('Criando usuário admin...')
        adminUser = await prisma.user.create({
          data: {
            id: adminId,
            name: 'Administrador',
            password: 'admin123',
            role: 'ADMIN',
            cpf: '00000000000',
            active: true,
            salary: 0,
            birth_date: new Date('1990-01-01'),
            admission_date: new Date('2024-01-01')
          }
        })
        console.log('Usuário admin criado:', adminUser)
      }

      // @ts-ignore
      const token = jwt.sign(
        { 
          sub: adminUser.id,
          role: adminUser.role
        },
        auth.jwt.secret as Secret,
        { 
          expiresIn: auth.jwt.expiresIn
        }
      )

      return response.json({
        token,
        user: {
          id: adminUser.id,
          name: adminUser.name,
          role: adminUser.role
        }
      })
    } catch (error) {
      console.error('Erro no login:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  async loginEmployee(request: Request, response: Response) {
    const { cpf: rawCpf, projectId } = request.body
    console.log('📝 Tentativa de login - Dados recebidos:', { rawCpf, projectId })
    
    // Normalizar CPF removendo pontos e traços
    const cpf = rawCpf?.replace(/\D/g, '') || ''
    console.log('📝 CPF normalizado:', cpf)
    
    if (!cpf) {
      console.log('❌ CPF não fornecido')
      return response.status(400).json({ error: 'CPF é obrigatório' })
    }

    try {
      console.log('🔍 Buscando usuário pelo CPF:', cpf)
      // Buscar usuário pelo CPF
      const user = await prisma.user.findFirst({
        where: { 
          cpf,
          active: true
        },
        select: {
          id: true,
          name: true,
          cpf: true,
          role: true,
          active: true
        }
      })

      console.log('📝 Resultado da busca:', user ? 'Usuário encontrado' : 'Usuário não encontrado')

      if (!user) {
        return response.status(401).json({ 
          error: 'Usuário não encontrado',
          details: 'Verifique se o CPF está correto e se você está cadastrado no sistema'
        })
      }

      if (!user.active) {
        console.log('❌ Usuário inativo:', user.cpf)
        return response.status(401).json({ 
          error: 'Usuário inativo',
          details: 'Entre em contato com o administrador para reativar seu acesso'
        })
      }

      let project = null
      // Buscar projeto apenas se foi fornecido um projectId
      if (projectId) {
        console.log('🔍 Buscando projeto:', projectId)
        project = await prisma.project.findFirst({
          where: { 
            id: projectId,
            active: true
          },
          select: {
            id: true,
            name: true,
            companyId: true
          }
        })

        console.log('📝 Resultado da busca do projeto:', project ? 'Projeto encontrado' : 'Projeto não encontrado')

        if (!project) {
          return response.status(401).json({ 
            error: 'Projeto não encontrado ou inativo',
            details: 'O projeto informado não existe ou está inativo'
          })
        }
      }

      // Gerar token com ou sem projeto
      const tokenPayload: any = { 
        sub: user.id,
        role: user.role
      }

      // Adiciona projeto e empresa ao token apenas se um projeto foi fornecido
      if (project) {
        tokenPayload.projectId = project.id
        tokenPayload.companyId = project.companyId
      }

      console.log('🔑 Gerando token com payload:', tokenPayload)

      const token = jwt.sign(
        tokenPayload,
        auth.jwt.secret as Secret,
        { 
          expiresIn: auth.jwt.expiresIn
        }
      )

      const response_payload: any = {
        token,
        user: {
          id: user.id,
          name: user.name,
          cpf: user.cpf,
          role: user.role
        }
      }

      // Adiciona informações do projeto na resposta apenas se ele foi fornecido
      if (project) {
        response_payload.project = {
          id: project.id,
          name: project.name,
          companyId: project.companyId
        }
      }

      console.log('✅ Login realizado com sucesso para o usuário:', user.name)
      return response.json(response_payload)
    } catch (error) {
      console.error('❌ Erro no login:', error)
      return response.status(500).json({ 
        error: 'Erro interno do servidor',
        details: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
      })
    }
  }

  async authenticate(request: Request, response: Response) {
    const { cpf, password } = request.body

    const user = await prisma.user.findUnique({
      where: { cpf },
    })

    if (!user) {
      return response.status(401).json({ error: 'CPF ou senha inválidos' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return response.status(401).json({ error: 'CPF ou senha inválidos' })
    }

    if (!user.active) {
      return response.status(401).json({ error: 'Usuário inativo' })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role } as JwtPayload,
      auth.secret as Secret,
      {
        expiresIn: auth.expiresIn,
      }
    )

    return response.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      token,
    })
  }

  async authenticateEmployee(req: Request, res: Response) {
    try {
      const { cpf: rawCpf, projectId } = loginSchema.parse(req.body)
      
      console.log('📝 Tentativa de login - Dados recebidos:', { rawCpf, projectId })
      
      // Normaliza o CPF removendo caracteres especiais
      const cpf = rawCpf.replace(/\D/g, '')
      
      console.log('📝 CPF normalizado:', cpf)
      console.log('🔍 Buscando usuário pelo CPF:', cpf)
      
      // Busca o usuário pelo CPF
      const user = await prisma.user.findFirst({
        where: {
          cpf: cpf,
          role: {
            not: 'ADMIN' // Garante que não é um admin tentando logar como funcionário
          }
        }
      })
      
      console.log('📝 Resultado da busca:', user ? 'Usuário encontrado' : 'Usuário não encontrado')
      
      if (!user) {
        return res.status(401).json({ error: 'CPF não encontrado' })
      }

      // Verifica se o usuário está ativo
      if (!user.active) {
        return res.status(401).json({ error: 'Usuário inativo' })
      }

      // Verifica se o projeto existe e está ativo
      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
          active: true
        }
      })

      if (!project) {
        return res.status(401).json({ error: 'Projeto não encontrado ou inativo' })
      }

      // Gera o token JWT
      const token = sign(
        {
          userId: user.id,
          projectId: project.id,
          role: user.role
        },
        process.env.JWT_SECRET as string,
        {
          subject: user.id,
          expiresIn: '1d'
        }
      )

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      })

    } catch (error) {
      console.error('❌ Erro na autenticação:', error)
      return res.status(400).json({ error: 'Erro na autenticação' })
    }
  }
}
