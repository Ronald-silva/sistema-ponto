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
exports.RegistroPontoController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RegistroPontoController {
    registrar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { tipo, tipo_dia, valor_hora, percentual, valor_total, foto_url } = req.body;
                const { id: usuario_id } = req.user;
                const usuario = yield prisma.usuario.findUnique({
                    where: { id: Number(usuario_id) }
                });
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                if (!usuario.obra_atual_id) {
                    return res.status(400).json({ error: 'Usuário não possui obra atual definida' });
                }
                const registro = yield prisma.registroPonto.create({
                    data: {
                        tipo,
                        tipo_dia,
                        valor_hora: Number(valor_hora),
                        percentual: Number(percentual),
                        valor_total: Number(valor_total),
                        foto_url,
                        usuario_id: Number(usuario_id),
                        obra_id: usuario.obra_atual_id
                    }
                });
                return res.status(201).json(registro);
            }
            catch (error) {
                console.error('Erro ao registrar ponto:', error);
                return res.status(500).json({ error: 'Erro ao registrar ponto' });
            }
        });
    }
    listarPorUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: usuario_id } = req.user;
                const registros = yield prisma.registroPonto.findMany({
                    where: { usuario_id: Number(usuario_id) },
                    include: {
                        obra: true
                    },
                    orderBy: {
                        data_hora: 'desc'
                    }
                });
                return res.json(registros);
            }
            catch (error) {
                console.error('Erro ao listar registros:', error);
                return res.status(500).json({ error: 'Erro ao listar registros de ponto' });
            }
        });
    }
    listarPorObra(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { obra_id } = req.params;
                const registros = yield prisma.registroPonto.findMany({
                    where: { obra_id: Number(obra_id) },
                    include: {
                        usuario: true
                    },
                    orderBy: {
                        data_hora: 'desc'
                    }
                });
                return res.json(registros);
            }
            catch (error) {
                console.error('Erro ao listar registros:', error);
                return res.status(500).json({ error: 'Erro ao listar registros de ponto' });
            }
        });
    }
    getMetricas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { obra_id } = req.params;
                const registros = yield prisma.registroPonto.findMany({
                    where: { obra_id: Number(obra_id) },
                    include: {
                        usuario: true
                    }
                });
                const registrosPorDia = registros.reduce((acc, registro) => {
                    const data = new Date(registro.data_hora).toISOString().split('T')[0];
                    acc[data] = (acc[data] || 0) + 1;
                    return acc;
                }, {});
                const registrosPorDiaArray = Object.entries(registrosPorDia).map(([data, total]) => ({
                    data,
                    total
                }));
                const usuariosUnicos = new Set(registros.map(r => r.usuario_id)).size;
                return res.json({
                    totalRegistros: registros.length,
                    usuariosUnicos,
                    registrosPorDia: registrosPorDiaArray
                });
            }
            catch (error) {
                console.error('Erro ao buscar métricas:', error);
                return res.status(500).json({ error: 'Erro ao buscar métricas dos registros' });
            }
        });
    }
}
exports.RegistroPontoController = RegistroPontoController;
