"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const prisma_1 = require("../lib/prisma");
class DashboardController {
    async index(request, response) {
        try {
            const activeUsersCount = await prisma_1.prisma.user.count({
                where: {
                    active: true
                }
            });
            const projectsCount = await prisma_1.prisma.project.count();
            const timeRecordsCount = await prisma_1.prisma.timeRecord.count();
            return response.json({
                activeUsers: activeUsersCount,
                projects: projectsCount,
                timeRecords: timeRecordsCount
            });
        }
        catch (error) {
            console.error('Erro ao buscar dados do dashboard:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.DashboardController = DashboardController;
