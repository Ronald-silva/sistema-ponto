import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { sign } from 'jsonwebtoken'

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { cpf, obraAtual } = req.body
      console.log('Dados recebidos:', { cpf, obraAtual })

      // Primeiro, verifica se o usuário existe
      const usuario = await prisma.usuario.findFirst({
        where: { cpf }
      })
      
      console.log('Usuário encontrado:', usuario)

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' })
      }

      // Depois verifica se a obra corresponde
      if (usuario.obraAtual !== obraAtual) {
        console.log('Obra não corresponde:', { 
          usuarioObra: usuario.obraAtual, 
          obraRecebida: obraAtual 
        })
        return res.status(401).json({ error: 'Obra não corresponde' })
      }

      // Verifica se é admin
      const isAdmin = usuario.perfil === 'ADMIN'

      const token = sign(
        { 
          id: usuario.id,
          isAdmin // Inclui no token
        },
        process.env.JWT_SECRET || 'default',
        { expiresIn: '1d' }
      )

      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          cpf: usuario.cpf,
          obra_atual: usuario.obraAtual,
          perfil: usuario.perfil
        },
        token
      })
    } catch (error) {
      console.error('Erro no login:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }
} 