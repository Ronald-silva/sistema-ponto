"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeRecordController = void 0;
const prisma_1 = require("../lib/prisma");
const OvertimeCalculator_1 = require("../services/OvertimeCalculator");
class TimeRecordController {
    async index(request, response) {
        const { userId, projectId, startDate, endDate } = request.query;
        const whereClause = {};
        if (userId) {
            whereClause.userId = String(userId);
        }
        if (projectId) {
            whereClause.projectId = String(projectId);
        }
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate) {
                whereClause.timestamp.gte = new Date(String(startDate));
            }
            if (endDate) {
                whereClause.timestamp.lte = new Date(String(endDate));
            }
        }
        const timeRecords = await prisma_1.prisma.timeRecord.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                project: true,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
        return response.json(timeRecords);
    }
    async show(request, response) {
        const { id } = request.params;
        const timeRecord = await prisma_1.prisma.timeRecord.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                project: true,
            },
        });
        if (!timeRecord) {
            return response.status(404).json({ error: 'Registro não encontrado' });
        }
        return response.json(timeRecord);
    }
    async create(request, response) {
        var _a;
        const { projectId, timestamp, type } = request.body;
        const userId = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return response.status(401).json({ error: 'Usuário não autenticado' });
        }
        try {
            const userProject = await prisma_1.prisma.userProject.findUnique({
                where: {
                    userId_projectId: {
                        userId,
                        projectId,
                    },
                },
            });
            if (!userProject) {
                return response.status(403).json({ error: 'Usuário não está vinculado a este projeto' });
            }
            const existingRecord = await prisma_1.prisma.timeRecord.findFirst({
                where: {
                    userId,
                    projectId,
                    type,
                    timestamp: {
                        gte: new Date(new Date(timestamp).setHours(0, 0, 0, 0)),
                        lte: new Date(new Date(timestamp).setHours(23, 59, 59, 999)),
                    },
                },
            });
            if (existingRecord) {
                return response.status(400).json({ error: 'Já existe um registro deste tipo para hoje' });
            }
            const timeRecord = await prisma_1.prisma.timeRecord.create({
                data: {
                    userId,
                    projectId,
                    timestamp: new Date(timestamp),
                    type,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    project: true,
                },
            });
            return response.status(201).json(timeRecord);
        }
        catch (error) {
            console.error('Erro ao registrar ponto:', error);
            return response.status(500).json({ error: 'Falha ao registrar ponto' });
        }
    }
    async update(request, response) {
        const { id } = request.params;
        const { timestamp, type } = request.body;
        const timeRecord = await prisma_1.prisma.timeRecord.findUnique({
            where: { id },
        });
        if (!timeRecord) {
            return response.status(404).json({ error: 'Registro não encontrado' });
        }
        const updatedTimeRecord = await prisma_1.prisma.timeRecord.update({
            where: { id },
            data: {
                timestamp: timestamp ? new Date(timestamp) : undefined,
                type,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                project: true,
            },
        });
        return response.json(updatedTimeRecord);
    }
    async delete(request, response) {
        const { id } = request.params;
        const timeRecord = await prisma_1.prisma.timeRecord.findUnique({
            where: { id },
        });
        if (!timeRecord) {
            return response.status(404).json({ error: 'Registro não encontrado' });
        }
        await prisma_1.prisma.timeRecord.delete({
            where: { id },
        });
        return response.status(204).send();
    }
    async myRecords(request, response) {
        const userId = request.user.id;
        const { projectId, startDate, endDate } = request.query;
        const whereClause = {
            userId,
        };
        if (projectId) {
            whereClause.projectId = String(projectId);
        }
        if (startDate || endDate) {
            whereClause.timestamp = {};
            if (startDate) {
                whereClause.timestamp.gte = new Date(String(startDate));
            }
            if (endDate) {
                whereClause.timestamp.lte = new Date(String(endDate));
            }
        }
        const timeRecords = await prisma_1.prisma.timeRecord.findMany({
            where: whereClause,
            include: {
                project: true,
            },
            orderBy: {
                timestamp: 'desc',
            },
        });
        return response.json(timeRecords);
    }
    async calculateOvertime(request, response) {
        const { userId, projectId, startDate, endDate } = request.body;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { salary: true },
        });
        if (!user) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        const baseHourlyRate = user.salary / 220;
        const timeRecords = await prisma_1.prisma.timeRecord.findMany({
            where: {
                userId,
                projectId,
                timestamp: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                }
            },
            orderBy: {
                timestamp: 'asc',
            },
            include: {
                project: true
            },
        });
        const overtimeCalculation = OvertimeCalculator_1.OvertimeCalculator.calculate(timeRecords, baseHourlyRate);
        return response.json(Object.assign({ baseHourlyRate }, overtimeCalculation));
    }
    async getRecent(request, response) {
        const timeRecords = await prisma_1.prisma.timeRecord.findMany({
            take: 10,
            orderBy: {
                timestamp: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                project: {
                    select: {
                        name: true
                    }
                }
            }
        });
        const formattedRecords = timeRecords.map(record => ({
            id: record.id,
            employeeName: record.user.name,
            projectName: record.project.name,
            type: record.type,
            timestamp: record.timestamp
        }));
        return response.json(formattedRecords);
    }
    async getTodayRecords(request, response) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const timeRecords = await prisma_1.prisma.timeRecord.findMany({
            where: {
                timestamp: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                project: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                timestamp: 'desc'
            }
        });
        return response.json(timeRecords.map(record => ({
            id: record.id,
            employeeName: record.user.name,
            projectName: record.project.name,
            type: record.type,
            timestamp: record.timestamp
        })));
    }
}
exports.TimeRecordController = TimeRecordController;
