import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

export class UserController {
  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        salary: true,
        birth_date: true,
        active: true,
        createdAt: true,
      },
    });

    return response.json(users);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        salary: true,
        birth_date: true,
        active: true,
        createdAt: true,
      },
    });

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    return response.json(user);
  }

  async create(request: Request, response: Response) {
    try {
      console.log('📝 Dados recebidos:', request.body);
      const { name, cpf, role, salary, birth_date, admission_date } = request.body;

      // Validações básicas
      if (!name || !cpf || !role || !salary || !birth_date || !admission_date) {
        console.log('❌ Dados incompletos:', { name, cpf, role, salary, birth_date, admission_date });
        return response.status(400).json({ 
          error: 'Todos os campos são obrigatórios',
          details: 'Nome, CPF, Cargo, Salário, Data de Nascimento e Data de Admissão são obrigatórios'
        });
      }

      console.log('🔍 Criando novo usuário...');
      const user = await prisma.user.create({
        data: {
          name,
          cpf,
          role,
          salary: Number(salary),
          birth_date: new Date(birth_date),
          admission_date: new Date(admission_date),
          active: true,
          password: '123456' // Senha padrão sem hash
        },
        select: {
          id: true,
          name: true,
          cpf: true,
          role: true,
          salary: true,
          birth_date: true,
          admission_date: true,
          active: true,
        },
      });

      console.log('✅ Usuário criado com sucesso:', user);
      return response.status(201).json(user);
    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error);
      
      if (error.code === 'P2002') {
        return response.status(400).json({ 
          error: 'CPF já cadastrado',
          details: 'Já existe um funcionário cadastrado com este CPF'
        });
      }

      return response.status(500).json({ 
        error: 'Erro ao criar usuário',
        details: error.message
      });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, role, salary, active, birth_date, admission_date } = request.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    const data: any = {
      name,
      role,
      salary: salary ? Number(salary) : undefined,
      active,
      birth_date: birth_date ? new Date(birth_date) : undefined,
      admission_date: admission_date ? new Date(admission_date) : undefined
    };

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        salary: true,
        birth_date: true,
        admission_date: true,
        active: true,
      },
    });

    return response.json(updatedUser);
  }

  async delete(request: Request, response: Response) {
    try {
      console.log('🔍 Iniciando exclusão de usuário...');
      const { id } = request.params;
      console.log('📝 ID recebido:', id);

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        console.log('❌ Usuário não encontrado');
        return response.status(404).json({ error: 'Usuário não encontrado' });
      }

      console.log('✅ Usuário encontrado, procedendo com a exclusão');
      await prisma.user.delete({
        where: { id },
      });

      console.log('✅ Usuário excluído com sucesso');
      return response.status(204).send();
    } catch (error) {
      console.error('❌ Erro ao excluir usuário:', error);
      return response.status(500).json({ 
        error: 'Erro ao excluir usuário',
        details: error.message
      });
    }
  }

  async profile(request: Request, response: Response) {
    const { id } = request.user!;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        cpf: true,
        role: true,
        salary: true,
        birth_date: true,
        active: true,
        createdAt: true,
      },
    });

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    return response.json(user);
  }

  async updateProfile(request: Request, response: Response) {
    const { id } = request.user!;
    const { name, email, currentPassword, newPassword } = request.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (email && email !== user.email) {
      const userWithEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (userWithEmail) {
        return response.status(400).json({ error: 'Email já está em uso' });
      }
    }

    const data: any = {
      name,
      email,
    };

    if (newPassword) {
      if (!currentPassword) {
        return response.status(400).json({ error: 'Senha atual é necessária' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);

      if (!isValidPassword) {
        return response.status(401).json({ error: 'Senha atual inválida' });
      }

      data.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        salary: true,
        birth_date: true,
        active: true,
        createdAt: true,
      },
    });

    return response.json(updatedUser);
  }
}
