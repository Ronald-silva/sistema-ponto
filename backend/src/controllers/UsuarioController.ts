import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';
import bcrypt from 'bcryptjs';
import { StorageService } from '../services/StorageService';

const prisma = new PrismaClient();
const storageService = new StorageService();

export class UsuarioController {
  async me(request: AuthenticatedRequest, res: Response) {
    try {
      if (!request.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(request.user.id) },
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          cargo: true,
          valor_hora: true,
          ativo: true,
          obra_atual_id: true
        }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async index(req: Request, res: Response) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          cargo: true,
          valor_hora: true,
          ativo: true,
          obra_atual_id: true
        }
      });

      return res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          cargo: true,
          valor_hora: true,
          ativo: true,
          obra_atual_id: true
        }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, email, cpf, senha, cargo, valor_hora } = req.body;

      const usuarioExistente = await prisma.usuario.findFirst({
        where: {
          OR: [
            { email },
            { cpf }
          ]
        }
      });

      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
      }

      const senhaHash = await bcrypt.hash(senha, 8);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          cpf,
          senha: senhaHash,
          cargo,
          valor_hora: Number(valor_hora),
          ativo: true
        },
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          cargo: true,
          valor_hora: true,
          ativo: true
        }
      });

      return res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, cpf, senha, cargo, valor_hora, ativo } = req.body;

      const usuarioExistente = await prisma.usuario.findUnique({
        where: { id: Number(id) }
      });

      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const data: any = {};

      if (nome) data.nome = nome;
      if (email) data.email = email;
      if (cpf) data.cpf = cpf;
      if (senha) data.senha = await bcrypt.hash(senha, 8);
      if (cargo) data.cargo = cargo;
      if (valor_hora) data.valor_hora = Number(valor_hora);
      if (typeof ativo === 'boolean') data.ativo = ativo;

      const usuario = await prisma.usuario.update({
        where: { id: Number(id) },
        data,
        select: {
          id: true,
          nome: true,
          email: true,
          cpf: true,
          cargo: true,
          valor_hora: true,
          ativo: true,
          obra_atual_id: true
        }
      });

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await prisma.usuario.delete({
        where: { id: Number(id) }
      });

      return res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
  }

  async uploadDescritor(request: AuthenticatedRequest, res: Response) {
    try {
      const { descriptor } = request.body;

      if (!request.user?.id) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const usuario = await prisma.usuario.update({
        where: { id: Number(request.user.id) },
        data: {
          descritor_facial: descriptor
        }
      });

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao atualizar descritor facial:', error);
      return res.status(500).json({ error: 'Erro ao atualizar descritor facial' });
    }
  }

  async atualizarObraAtual(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { obra_id } = req.body;

      const usuario = await prisma.usuario.update({
        where: { id: Number(id) },
        data: { obra_atual_id: Number(obra_id) }
      });

      return res.json(usuario);
    } catch (error) {
      console.error('Erro ao atualizar obra atual:', error);
      return res.status(500).json({ error: 'Erro ao atualizar obra atual' });
    }
  }

  async verificarCargo(req: Request, res: Response) {
    try {
      const { cpf } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { cpf },
        select: {
          cargo: true
        }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json({ cargo: usuario.cargo });
    } catch (error) {
      console.error('Erro ao verificar cargo:', error);
      return res.status(500).json({ error: 'Erro ao verificar cargo do usuário' });
    }
  }
} 