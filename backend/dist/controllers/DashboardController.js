"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const prisma_1 = require("../lib/prisma");
class DashboardController {
    async getSummary(request, response) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayRecordsCount = await prisma_1.prisma.timeRecord.count({
            where: {
                timestamp: {
                    gte: today
                }
            }
        });
        const activeEmployeesCount = await prisma_1.prisma.employee.count({
            where: {
                active: true
            }
        });
        const activeProjectsCount = await prisma_1.prisma.project.count({
            where: {
                active: true
            }
        });
        return response.json({
            todayRecordsCount,
            activeEmployeesCount,
            activeProjectsCount
        });
    }
}
exports.DashboardController = DashboardController;
