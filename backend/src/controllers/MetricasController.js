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
exports.MetricasController = void 0;
const client_1 = require("@prisma/client");
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
class MetricasController {
    getDashboardMetrics(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Total de usuários
                const totalUsers = yield prisma.usuario.count({
                    where: { ativo: true }
                });
                // Registros de ponto hoje
                const recordsToday = yield prisma.registroPonto.count({
                    where: {
                        data_hora: {
                            gte: (0, date_fns_1.startOfDay)(new Date()),
                            lte: (0, date_fns_1.endOfDay)(new Date())
                        }
                    }
                });
                // Total de horas extras
                const overtime = yield prisma.horaExtra.aggregate({
                    _sum: {
                        quantidade: true,
                        valor_total: true
                    }
                });
                // Horas extras pendentes
                const pendingOvertime = yield prisma.horaExtra.count({
                    where: {
                        status: 'PENDENTE'
                    }
                });
                return response.json({
                    totalUsers,
                    recordsToday,
                    totalOvertime: overtime._sum.quantidade || 0,
                    totalOvertimeValue: overtime._sum.valor_total || 0,
                    pendingOvertime
                });
            }
            catch (error) {
                console.error('Erro ao buscar métricas:', error);
                return response.status(500).json({ error: 'Erro ao buscar métricas do dashboard' });
            }
        });
    }
    getChartData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Registros de ponto dos últimos 7 dias
                const records = yield prisma.registroPonto.findMany({
                    where: {
                        data_hora: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        }
                    },
                    select: {
                        data_hora: true,
                        tipo: true
                    },
                    orderBy: {
                        data_hora: 'asc'
                    }
                });
                // Horas extras dos últimos 7 dias
                const overtime = yield prisma.horaExtra.findMany({
                    where: {
                        data: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                        }
                    },
                    select: {
                        data: true,
                        quantidade: true,
                        valor_total: true
                    },
                    orderBy: {
                        data: 'asc'
                    }
                });
                return response.json({
                    records,
                    overtime
                });
            }
            catch (error) {
                console.error('Erro ao buscar dados dos gráficos:', error);
                return response.status(500).json({ error: 'Erro ao buscar dados dos gráficos' });
            }
        });
    }
    ultimosRegistros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const records = yield prisma.registroPonto.findMany({
                    take: 10,
                    orderBy: {
                        data_hora: 'desc'
                    },
                    include: {
                        usuario: {
                            select: {
                                nome: true
                            }
                        }
                    }
                });
                return res.json(records);
            }
            catch (error) {
                return res.status(400).json({ error: 'Erro ao buscar últimos registros' });
            }
        });
    }
    horasExtrasPendentes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const overtime = yield prisma.horaExtra.findMany({
                    where: {
                        status: 'PENDENTE'
                    },
                    take: 10,
                    orderBy: {
                        data: 'desc'
                    },
                    include: {
                        usuario: {
                            select: {
                                nome: true
                            }
                        }
                    }
                });
                return res.json(overtime);
            }
            catch (error) {
                return res.status(400).json({ error: 'Erro ao buscar horas extras pendentes' });
            }
        });
    }
}
exports.MetricasController = MetricasController;
