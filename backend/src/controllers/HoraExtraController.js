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
exports.HoraExtraController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class HoraExtraController {
    index(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horasExtras = yield prisma.horaExtra.findMany({
                    include: {
                        usuario: true
                    },
                    orderBy: {
                        data: 'desc'
                    }
                });
                return res.json(horasExtras);
            }
            catch (error) {
                console.error('Erro ao listar horas extras:', error);
                return res.status(500).json({ error: 'Erro ao listar horas extras' });
            }
        });
    }
    show(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const horaExtra = yield prisma.horaExtra.findUnique({
                    where: { id: Number(id) },
                    include: {
                        usuario: true
                    }
                });
                if (!horaExtra) {
                    return res.status(404).json({ error: 'Hora extra não encontrada' });
                }
                return res.json(horaExtra);
            }
            catch (error) {
                console.error('Erro ao buscar hora extra:', error);
                return res.status(500).json({ error: 'Erro ao buscar hora extra' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { quantidade, valor_hora, data, percentual } = req.body;
                const { id: usuario_id } = req.user;
                const valor_total = Number(quantidade) * Number(valor_hora) * (1 + Number(percentual) / 100);
                const horaExtra = yield prisma.horaExtra.create({
                    data: {
                        quantidade: Number(quantidade),
                        valor_hora: Number(valor_hora),
                        data: new Date(data),
                        status: 'PENDENTE',
                        usuario_id: Number(usuario_id),
                        percentual: Number(percentual),
                        valor_total
                    }
                });
                return res.status(201).json(horaExtra);
            }
            catch (error) {
                console.error('Erro ao criar hora extra:', error);
                return res.status(500).json({ error: 'Erro ao criar hora extra' });
            }
        });
    }
    aprovar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const horaExtra = yield prisma.horaExtra.update({
                    where: { id: Number(id) },
                    data: {
                        status: 'APROVADA'
                    }
                });
                return res.json(horaExtra);
            }
            catch (error) {
                console.error('Erro ao aprovar hora extra:', error);
                return res.status(500).json({ error: 'Erro ao aprovar hora extra' });
            }
        });
    }
    rejeitar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const horaExtra = yield prisma.horaExtra.update({
                    where: { id: Number(id) },
                    data: {
                        status: 'REJEITADA'
                    }
                });
                return res.json(horaExtra);
            }
            catch (error) {
                console.error('Erro ao rejeitar hora extra:', error);
                return res.status(500).json({ error: 'Erro ao rejeitar hora extra' });
            }
        });
    }
    listarPorUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: usuario_id } = req.user;
                const horasExtras = yield prisma.horaExtra.findMany({
                    where: { usuario_id: Number(usuario_id) },
                    orderBy: {
                        data: 'desc'
                    }
                });
                return res.json(horasExtras);
            }
            catch (error) {
                console.error('Erro ao listar horas extras:', error);
                return res.status(500).json({ error: 'Erro ao listar horas extras' });
            }
        });
    }
    getMetricas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const horasExtras = yield prisma.horaExtra.findMany({
                    include: {
                        usuario: true
                    }
                });
                const totalHoras = horasExtras.reduce((total, hora) => total + hora.quantidade, 0);
                const totalValor = horasExtras.reduce((total, hora) => total + hora.valor_total, 0);
                const usuariosUnicos = new Set(horasExtras.map(h => h.usuario_id)).size;
                const horasPorStatus = {
                    PENDENTE: horasExtras.filter(h => h.status === 'PENDENTE').length,
                    APROVADA: horasExtras.filter(h => h.status === 'APROVADA').length,
                    REJEITADA: horasExtras.filter(h => h.status === 'REJEITADA').length
                };
                return res.json({
                    totalHoras,
                    totalValor,
                    usuariosUnicos,
                    horasPorStatus
                });
            }
            catch (error) {
                console.error('Erro ao buscar métricas:', error);
                return res.status(500).json({ error: 'Erro ao buscar métricas das horas extras' });
            }
        });
    }
}
exports.HoraExtraController = HoraExtraController;
