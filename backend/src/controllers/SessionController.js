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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
class SessionController {
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Iniciando login - Dados recebidos:', request.body);
                const { cpf, senha, obra_id } = request.body;
                if (!cpf || !senha) {
                    console.log('CPF ou senha não fornecidos');
                    return response.status(400).json({ error: 'CPF e senha são obrigatórios' });
                }
                const usuario = yield prisma.usuario.findUnique({
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
                const senhaCorreta = yield (0, bcryptjs_1.compare)(senha, usuario.senha);
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
                    const obra = yield prisma.obra.findUnique({
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
                    yield prisma.usuario.update({
                        where: { id: usuario.id },
                        data: { obra_atual_id: Number(obra_id) }
                    });
                    // Atualiza o objeto do usuário com a nova obra
                    usuario.obra_atual_id = Number(obra_id);
                }
                const token = (0, jsonwebtoken_1.sign)({
                    id: usuario.id,
                    cargo: usuario.cargo
                }, process.env.JWT_SECRET || 'f7d8a9b0c1e2f3a4d5b6c7e8f9a0b1c2', {
                    subject: String(usuario.id),
                    expiresIn: '1d'
                });
                const { senha: _ } = usuario, usuarioSemSenha = __rest(usuario, ["senha"]);
                const responseData = {
                    token,
                    user: usuarioSemSenha
                };
                console.log('Login bem-sucedido - Resposta:', responseData);
                return response.json(responseData);
            }
            catch (error) {
                console.error('Erro ao fazer login:', error);
                return response.status(500).json({ error: 'Erro interno do servidor' });
            }
        });
    }
}
exports.SessionController = SessionController;
