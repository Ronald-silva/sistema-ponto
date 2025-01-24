import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export class SessionController {
  async create(request: Request, response: Response) {
    try {
      console.log('Iniciando login - Dados recebidos:', request.body);
      const { cpf, senha, obra_id } = request.body;

      if (!cpf || !senha) {
        console.log('CPF ou senha não fornecidos');
        return response.status(400).json({ error: 'CPF e senha são obrigatórios' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { cpf },
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          senha: true,
          cargo: true,
          valor_hora: true,
          obra_atual_id: true,
          ativo: true
        }
      });

      if (!usuario) {
        console.log('Usuário não encontrado para o CPF:', cpf);
        return response.status(400).json({ error: 'Credenciais inválidas' });
      }

      if (!usuario.ativo) {
        console.log('Usuário inativo:', cpf);
        return response.status(400).json({ error: 'Usuário inativo' });
      }

      const senhaCorreta = await compare(senha, usuario.senha);

      if (!senhaCorreta) {
        console.log('Senha incorreta para o usuário:', cpf);
        return response.status(400).json({ error: 'Credenciais inválidas' });
      }

      // Se não for admin, precisa selecionar uma obra
      if (usuario.cargo !== 'ADMIN' && !obra_id) {
        console.log('Obra não selecionada para usuário não-admin');
        return response.status(400).json({ error: 'Selecione uma obra para continuar' });
      }

      // Verifica se a obra existe e está ativa
      if (obra_id) {
        const obra = await prisma.obra.findUnique({
          where: { id: Number(obra_id) }
        });

        if (!obra) {
          console.log('Obra não encontrada:', obra_id);
          return response.status(400).json({ error: 'Obra não encontrada' });
        }

        if (!obra.ativa) {
          console.log('Obra inativa:', obra_id);
          return response.status(400).json({ error: 'Obra inativa' });
        }

        // Atualiza a obra atual do usuário
        await prisma.usuario.update({
          where: { id: usuario.id },
          data: { obra_atual_id: Number(obra_id) }
        });

        // Atualiza o objeto do usuário com a nova obra
        usuario.obra_atual_id = Number(obra_id);
      }

      const token = sign(
        { 
          id: usuario.id,
          cargo: usuario.cargo
        },
        process.env.JWT_SECRET || 'f7d8a9b0c1e2f3a4d5b6c7e8f9a0b1c2',
        { 
          subject: String(usuario.id),
          expiresIn: '1d' 
        }
      );

      const { senha: _, ...usuarioSemSenha } = usuario;

      const responseData = {
        token,
        user: usuarioSemSenha
      };

      console.log('Login bem-sucedido - Resposta:', responseData);
      return response.json(responseData);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
} 