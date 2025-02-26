"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const prisma_1 = require("../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    async login(req, res) {
        try {
            const { cpf, password } = req.body;
            const user = await prisma_1.prisma.user.findUnique({
                where: { cpf }
            });
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }
            if (!user.active) {
                return res.status(401).json({ error: 'Usuário inativo' });
            }
            if (password !== '123456') {
                return res.status(401).json({ error: 'Senha incorreta' });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                role: user.role
            }, process.env.JWT_SECRET || 'default_secret', {
                expiresIn: '1d'
            });
            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    cpf: user.cpf,
                    role: user.role
                },
                token
            });
        }
        catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async loginEmployee(req, res) {
        try {
            const { cpf, projectId } = req.body;
            const user = await prisma_1.prisma.user.findUnique({
                where: { cpf },
                include: {
                    userProjects: {
                        where: {
                            projectId
                        }
                    }
                }
            });
            if (!user) {
                return res.status(401).json({ error: 'Usuário não encontrado' });
            }
            if (!user.active) {
                return res.status(401).json({ error: 'Usuário inativo' });
            }
            if (user.role !== 'EMPLOYEE') {
                return res.status(401).json({ error: 'Usuário não é um funcionário' });
            }
            if (!user.userProjects.length) {
                return res.status(401).json({ error: 'Funcionário não está associado a este projeto' });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                role: user.role,
                projectId
            }, process.env.JWT_SECRET || 'default_secret', {
                expiresIn: '1d'
            });
            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    cpf: user.cpf,
                    role: user.role,
                    projectId
                },
                token
            });
        }
        catch (error) {
            console.error('Erro ao fazer login:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.AuthController = AuthController;
