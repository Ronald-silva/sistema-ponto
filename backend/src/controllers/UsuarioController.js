"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const StorageService_1 = require("../services/StorageService");
const prisma = new client_1.PrismaClient();
const storageService = new StorageService_1.StorageService();
class UsuarioController {
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ error: 'Usuário não autenticado' });
                }
                const user = yield prisma.usuario.findUnique({
                    where: { id: Number(userId) },
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        cpf: true,
                        cargo: true,
                        obra_atual_id: true,
                        valor_hora: true
                    }
                });
                if (!user) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                return res.json(user);
            }
            catch (error) {
                console.error('Erro ao buscar usuário:', error);
                return res.status(500).json({ error: 'Erro ao buscar usuário' });
            }
        });
    }
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prisma.usuario.findMany({
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        cpf: true,
                        cargo: true,
                        obra_atual_id: true,
                        valor_hora: true
                    }
                });
                return res.json(users);
            }
            catch (error) {
                return res.status(400).json({ error: 'Erro ao listar usuários' });
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield prisma.usuario.findUnique({
                    where: { id: Number(id) },
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        cpf: true,
                        cargo: true,
                        obra_atual_id: true,
                        valor_hora: true
                    }
                });
                if (!user) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                return res.json(user);
            }
            catch (error) {
                return res.status(400).json({ error: 'Erro ao buscar usuário' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, email, cpf, senha, cargo, obra_atual_id, valor_hora } = req.body;
                const userExists = yield prisma.usuario.findFirst({
                    where: {
                        OR: [
                            { email },
                            { cpf }
                        ]
                    }
                });
                if (userExists) {
                    return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
                }
                const hashedPassword = yield (0, bcryptjs_1.hash)(senha, 8);
                const user = yield prisma.usuario.create({
                    data: {
                        nome,
                        email,
                        cpf,
                        senha: hashedPassword,
                        cargo,
                        obra_atual_id,
                        valor_hora
                    },
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        cpf: true,
                        cargo: true,
                        obra_atual_id: true,
                        valor_hora: true
                    }
                });
                return res.status(201).json(user);
            }
            catch (error) {
                return res.status(400).json({ error: 'Erro ao criar usuário' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, email, cpf, senha, cargo, obra_atual_id, valor_hora } = req.body;
                const userExists = yield prisma.usuario.findUnique({
                    where: { id: Number(id) }
                });
                if (!userExists) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                const emailOrCpfExists = yield prisma.usuario.findFirst({
                    where: {
                        OR: [
                            { email },
                            { cpf }
                        ],
                        NOT: {
                            id: Number(id)
                        }
                    }
                });
                if (emailOrCpfExists) {
                    return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
                }
                const data = {
                    nome,
                    email,
                    cpf,
                    cargo,
                    obra_atual_id,
                    valor_hora
                };
                if (senha) {
                    data.senha = yield (0, bcryptjs_1.hash)(senha, 8);
                }
                const user = yield prisma.usuario.update({
                    where: { id: Number(id) },
                    data,
                    select: {
                        id: true,
                        nome: true,
                        email: true,
                        cpf: true,
                        cargo: true,
                        obra_atual_id: true,
                        valor_hora: true
                    }
                });
                return res.json(user);
            }
            catch (error) {
                return res.status(400).json({ error: 'Erro ao atualizar usuário' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const userExists = yield prisma.usuario.findUnique({
                    where: { id: Number(id) }
                });
                if (!userExists) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                yield prisma.usuario.delete({
                    where: { id: Number(id) }
                });
                return res.status(204).send();
            }
            catch (error) {
                return res.status(400).json({ error: 'Erro ao excluir usuário' });
            }
        });
    }
    uploadDescritor(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = request.user;
                const { descritor_facial } = request.body;
                if (!descritor_facial) {
                    return response.status(400).json({ error: 'Descritor facial não fornecido' });
                }
                // Atualiza o usuário com o descritor facial
                const usuario = yield prisma.usuario.update({
                    where: { id: Number(id) },
                    data: {
                        descritor_facial
                    }
                });
                return response.json({
                    message: 'Descritor facial atualizado com sucesso'
                });
            }
            catch (error) {
                console.error('Erro ao atualizar descritor facial:', error);
                return response.status(500).json({ error: 'Erro ao atualizar descritor facial' });
            }
        });
    }
    atualizarObraAtual(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { obra_id } = req.body;
                const usuario = yield prisma.usuario.update({
                    where: { id: Number(id) },
                    data: { obra_atual_id: Number(obra_id) }
                });
                return res.json(usuario);
            }
            catch (error) {
                console.error('Erro ao atualizar obra atual:', error);
                return res.status(500).json({ error: 'Erro ao atualizar obra atual' });
            }
        });
    }
}
exports.UsuarioController = UsuarioController;
