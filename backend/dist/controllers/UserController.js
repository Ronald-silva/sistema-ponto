"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserController {
    async index(request, response) {
        const users = await prisma_1.prisma.user.findMany({
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
        return response.json(users);
    }
    async show(request, response) {
        const { id } = request.params;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
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
        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        return response.json(user);
    }
    async create(request, response) {
        const { name, email, password, role, salary, birth_date, cpf } = request.body;
        if (!cpf) {
            return response.status(400).json({ error: 'CPF é obrigatório' });
        }
        const userExists = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (userExists) {
            return response.status(400).json({ error: 'Usuário já existe' });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                cpf,
                salary: salary ? Number(salary) : undefined,
                birth_date: birth_date ? new Date(birth_date) : undefined,
                admission_date: new Date(),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                cpf: true,
                salary: true,
                birth_date: true,
                active: true,
            },
        });
        return response.status(201).json(user);
    }
    async update(request, response) {
        const { id } = request.params;
        const { name, email, password, role, salary, active, birth_date } = request.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        const data = {
            name,
            email,
            role,
            salary: salary ? Number(salary) : undefined,
            active,
            birth_date: birth_date ? new Date(birth_date) : undefined,
        };
        if (password) {
            data.password = await bcrypt_1.default.hash(password, 10);
        }
        const updatedUser = await prisma_1.prisma.user.update({
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
            },
        });
        return response.json(updatedUser);
    }
    async delete(request, response) {
        const { id } = request.params;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        await prisma_1.prisma.user.delete({
            where: { id },
        });
        return response.status(204).send();
    }
    async profile(request, response) {
        const { id } = request.user;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
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
        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        return response.json(user);
    }
    async updateProfile(request, response) {
        const { id } = request.user;
        const { name, email, currentPassword, newPassword } = request.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        if (email && email !== user.email) {
            const userWithEmail = await prisma_1.prisma.user.findUnique({
                where: { email },
            });
            if (userWithEmail) {
                return response.status(400).json({ error: 'Email já está em uso' });
            }
        }
        const data = {
            name,
            email,
        };
        if (newPassword) {
            if (!currentPassword) {
                return response.status(400).json({ error: 'Senha atual é necessária' });
            }
            const isValidPassword = await bcrypt_1.default.compare(currentPassword, user.password);
            if (!isValidPassword) {
                return response.status(401).json({ error: 'Senha atual inválida' });
            }
            data.password = await bcrypt_1.default.hash(newPassword, 10);
        }
        const updatedUser = await prisma_1.prisma.user.update({
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
exports.UserController = UserController;
