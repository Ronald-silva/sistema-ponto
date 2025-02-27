"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = require("../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../config/auth");
class AuthController {
    async login(request, response) {
        try {
            const { password } = request.body;
            if (!password) {
                return response.status(400).json({ error: 'Senha é obrigatória' });
            }
            if (password !== 'admin123') {
                return response.status(401).json({ error: 'Senha incorreta' });
            }
            const adminUser = {
                id: 'd504a949-b481-40be-a675-1528388986aa2',
                role: 'ADMIN',
                name: 'Administrador'
            };
            const token = jsonwebtoken_1.default.sign({
                id: adminUser.id,
                role: adminUser.role
            }, auth_1.auth.jwt.secret, {
                expiresIn: auth_1.auth.jwt.expiresIn
            });
            return response.json({
                token,
                user: adminUser
            });
        }
        catch (error) {
            console.error('Erro no login:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async loginEmployee(request, response) {
        const { cpf: rawCpf, projectId } = request.body;
        const cpf = rawCpf.replace(/\D/g, '');
        console.log('Tentativa de login:', { cpf, projectId });
        if (!cpf) {
            return response.status(400).json({ error: 'CPF é obrigatório' });
        }
        if (!projectId) {
            return response.status(400).json({ error: 'Projeto é obrigatório' });
        }
        try {
            const user = await prisma_1.prisma.user.findUnique({
                where: { cpf },
                select: {
                    id: true,
                    name: true,
                    cpf: true,
                    role: true,
                    active: true
                }
            });
            if (!user) {
                return response.status(401).json({ error: 'Usuário não encontrado' });
            }
            if (!user.active) {
                return response.status(401).json({ error: 'Usuário inativo' });
            }
            const project = await prisma_1.prisma.project.findUnique({
                where: {
                    id: projectId
                },
                select: {
                    id: true,
                    name: true
                }
            });
            if (!project) {
                return response.status(401).json({ error: 'Projeto não encontrado' });
            }
            const userProject = await prisma_1.prisma.userProject.findUnique({
                where: {
                    userId_projectId: {
                        userId: user.id,
                        projectId: project.id
                    }
                }
            });
            if (!userProject) {
                return response.status(401).json({ error: 'Usuário não está associado a este projeto' });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                role: user.role,
                projectId: project.id
            }, auth_1.auth.jwt.secret, {
                expiresIn: auth_1.auth.jwt.expiresIn
            });
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
            });
        }
        catch (error) {
            console.error('Erro no login:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.AuthController = AuthController;
