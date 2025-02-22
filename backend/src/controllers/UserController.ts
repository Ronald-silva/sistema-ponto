import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

export class UserController {
  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        salary: true,
        birth_year: true,
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
        email: true,
        role: true,
        salary: true,
        birth_year: true,
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
    const { name, email, password, role, salary, birth_year } = request.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return response.status(400).json({ error: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        salary,
        birth_year,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        salary: true,
        birth_year: true,
        active: true,
      },
    });

    return response.status(201).json(user);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, email, password, role, salary, active, birth_year } = request.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    const data: any = {
      name,
      email,
      role,
      salary,
      active,
      birth_year,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
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
        birth_year: true,
        active: true,
      },
    });

    return response.json(updatedUser);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    await prisma.user.delete({
      where: { id },
    });

    return response.status(204).send();
  }

  async profile(request: Request, response: Response) {
    const { id } = request.user!;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        salary: true,
        birth_year: true,
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
        birth_year: true,
        active: true,
        createdAt: true,
      },
    });

    return response.json(updatedUser);
  }
}
