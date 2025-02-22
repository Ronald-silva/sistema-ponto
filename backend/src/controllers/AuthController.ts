import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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
        role: 'ADMIN',
        name: 'Administrador'
      }

      const token = jwt.sign(
        { 
          id: adminUser.id,
          role: adminUser.role
        },
        JWT_SECRET,
        { 
          expiresIn: '1d'
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
    const { cpf: rawCpf, projectId, companyId } = request.body
    // Normalizar CPF removendo pontos e traços
    const cpf = rawCpf.replace(/\D/g, '')
    
    console.log('Tentativa de login:', { cpf, projectId, companyId })

    if (!cpf) {
      return response.status(400).json({ error: 'CPF é obrigatório' })
    }

    if (!projectId) {
      return response.status(400).json({ error: 'Projeto é obrigatório' })
    }

    if (!companyId) {
      return response.status(400).json({ error: 'Empresa é obrigatória' })
    }

    try {
      // Buscar funcionário pelo CPF
      const employee = await prisma.employee.findUnique({
        where: { cpf },
        select: {
          id: true,
          name: true,
          cpf: true,
          active: true
        }
      })

      if (!employee) {
        return response.status(401).json({ error: 'Funcionário não encontrado' })
      }

      if (!employee.active) {
        return response.status(401).json({ error: 'Funcionário inativo' })
      }

      // Buscar projeto
      const project = await prisma.project.findUnique({
        where: { 
          id: projectId,
          active: true
        },
        select: {
          id: true,
          name: true
        }
      })

      if (!project) {
        return response.status(401).json({ error: 'Projeto não encontrado ou inativo' })
      }

      // Buscar empresa
      const company = await prisma.company.findUnique({
        where: { 
          id: companyId,
          active: true
        },
        select: {
          id: true,
          name: true
        }
      })

      if (!company) {
        return response.status(401).json({ error: 'Empresa não encontrada ou inativa' })
      }

      // Gerar token
      const token = jwt.sign(
        { 
          id: employee.id,
          role: 'EMPLOYEE',
          projectId: project.id,
          companyId: company.id
        },
        JWT_SECRET,
        { 
          expiresIn: '1d'
        }
      )

      return response.json({
        token,
        user: {
          id: employee.id,
          name: employee.name,
          cpf: employee.cpf,
          role: 'EMPLOYEE'
        },
        project: {
          id: project.id,
          name: project.name
        },
        company: {
          id: company.id,
          name: company.name
        }
      })
    } catch (error) {
      console.error('Erro no login:', error)
      return response.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
}
