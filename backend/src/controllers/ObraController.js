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
exports.ObraController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ObraController {
    index(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const obras = yield prisma.obra.findMany({
                    include: {
                        _count: {
                            select: {
                                usuarios_atuais: true,
                                registros: true
                            }
                        }
                    }
                });
                return res.json(obras);
            }
            catch (error) {
                console.error('Erro ao listar obras:', error);
                return res.status(500).json({ error: 'Erro ao listar obras' });
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const obra = yield prisma.obra.findUnique({
                    where: { id: Number(id) },
                    include: {
                        _count: {
                            select: {
                                usuarios_atuais: true,
                                registros: true
                            }
                        }
                    }
                });
                if (!obra) {
                    return res.status(404).json({ error: 'Obra não encontrada' });
                }
                return res.json(obra);
            }
            catch (error) {
                console.error('Erro ao buscar obra:', error);
                return res.status(500).json({ error: 'Erro ao buscar obra' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, endereco } = req.body;
                const obra = yield prisma.obra.create({
                    data: {
                        nome,
                        endereco,
                        ativa: true
                    }
                });
                return res.status(201).json(obra);
            }
            catch (error) {
                console.error('Erro ao criar obra:', error);
                return res.status(500).json({ error: 'Erro ao criar obra' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, endereco, ativa } = req.body;
                const obra = yield prisma.obra.update({
                    where: { id: Number(id) },
                    data: {
                        nome,
                        endereco,
                        ativa
                    }
                });
                return res.json(obra);
            }
            catch (error) {
                console.error('Erro ao atualizar obra:', error);
                return res.status(500).json({ error: 'Erro ao atualizar obra' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // Verificar se existem registros vinculados
                const registros = yield prisma.registroPonto.findMany({
                    where: { obra_id: Number(id) }
                });
                const usuariosVinculados = yield prisma.obrasUsuario.findMany({
                    where: { obra_id: Number(id) }
                });
                if (registros.length > 0 || usuariosVinculados.length > 0) {
                    return res.status(400).json({
                        error: 'Não é possível excluir a obra pois existem registros vinculados'
                    });
                }
                yield prisma.obra.delete({
                    where: { id: Number(id) }
                });
                return res.json({ message: 'Obra excluída com sucesso' });
            }
            catch (error) {
                console.error('Erro ao excluir obra:', error);
                return res.status(500).json({ error: 'Erro ao excluir obra' });
            }
        });
    }
    vincularUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuario_id, obra_id } = req.body;
                yield prisma.obrasUsuario.create({
                    data: {
                        usuario_id: Number(usuario_id),
                        obra_id: Number(obra_id)
                    }
                });
                return res.status(201).json({ message: 'Usuário vinculado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao vincular usuário:', error);
                return res.status(500).json({ error: 'Erro ao vincular usuário à obra' });
            }
        });
    }
    desvincularUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { usuario_id, obra_id } = req.body;
                yield prisma.obrasUsuario.deleteMany({
                    where: {
                        usuario_id: Number(usuario_id),
                        obra_id: Number(obra_id)
                    }
                });
                return res.json({ message: 'Usuário desvinculado com sucesso' });
            }
            catch (error) {
                console.error('Erro ao desvincular usuário:', error);
                return res.status(500).json({ error: 'Erro ao desvincular usuário da obra' });
            }
        });
    }
    getMetricas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: obraId } = req.params;
                const registros = yield prisma.registroPonto.count({
                    where: { obra_id: Number(obraId) }
                });
                const usuariosAtivos = yield prisma.obrasUsuario.count({
                    where: { obra_id: Number(obraId) }
                });
                return res.json({
                    registros,
                    usuariosAtivos
                });
            }
            catch (error) {
                console.error('Erro ao buscar métricas:', error);
                return res.status(500).json({ error: 'Erro ao buscar métricas da obra' });
            }
        });
    }
}
exports.ObraController = ObraController;
