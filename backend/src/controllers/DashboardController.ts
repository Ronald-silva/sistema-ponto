import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class DashboardController {
  async getSummary(request: Request, response: Response) {
    // Busca registros de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayRecordsCount = await prisma.timeRecord.count({
      where: {
        timestamp: {
          gte: today
        }
      }
    });

    // Busca funcionários ativos
    const activeEmployeesCount = await prisma.employee.count({
      where: {
        active: true
      }
    });

    // Busca projetos ativos
    const activeProjectsCount = await prisma.project.count({
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
