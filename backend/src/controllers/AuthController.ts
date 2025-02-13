import { Request, Response } from 'express'
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
      // Simular funcionário (temporário)
      const employee = {
        id: '123',
        name: 'João da Silva',
        cpf,
        role: 'EMPLOYEE'
      }

      // Simular projeto (temporário)
      const project = {
        id: projectId,
        name: 'Obra 1'
      }

      // Lista de empresas
      const companies = [
        { id: '1', name: 'CDG Engenharia' },
        { id: '2', name: 'Urban Engenharia' },
        { id: '3', name: 'Consórcio Aquiraz PDD' },
        { id: '4', name: 'Consórcio BCL' },
        { id: '5', name: 'Consórcio BME' },
        { id: '6', name: 'Consórcio BBJ' }
      ]
      const company = companies.find(c => c.id === companyId)

      if (!company) {
        return response.status(404).json({ error: 'Empresa não encontrada' })
      }

      // Gerar token JWT
      const token = jwt.sign(
        { 
          id: employee.id,
          role: employee.role,
          cpf: employee.cpf,
          projectId,
          companyId
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
