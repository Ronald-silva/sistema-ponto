import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { OvertimeCalculator } from '../services/OvertimeCalculator';

export class TimeRecordController {
  async index(request: Request, response: Response) {
    const { userId, projectId, startDate, endDate } = request.query;

    const whereClause: any = {};

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

    const timeRecords = await prisma.timeRecord.findMany({
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

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const timeRecord = await prisma.timeRecord.findUnique({
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

  async create(request: Request, response: Response) {
    const { projectId, timestamp, type } = request.body;
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({ error: 'Usuário não autenticado' });
    }

    try {
      // Verifica se o usuário está vinculado ao projeto
      const userProject = await prisma.userProject.findUnique({
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

      // Verifica se já existe um registro do mesmo tipo no mesmo dia
      const existingRecord = await prisma.timeRecord.findFirst({
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

      const timeRecord = await prisma.timeRecord.create({
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
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      return response.status(500).json({ error: 'Falha ao registrar ponto' });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { timestamp, type } = request.body;

    const timeRecord = await prisma.timeRecord.findUnique({
      where: { id },
    });

    if (!timeRecord) {
      return response.status(404).json({ error: 'Registro não encontrado' });
    }

    const updatedTimeRecord = await prisma.timeRecord.update({
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

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const timeRecord = await prisma.timeRecord.findUnique({
      where: { id },
    });

    if (!timeRecord) {
      return response.status(404).json({ error: 'Registro não encontrado' });
    }

    await prisma.timeRecord.delete({
      where: { id },
    });

    return response.status(204).send();
  }

  async myRecords(request: Request, response: Response) {
    const userId = request.user!.id;
    const { projectId, startDate, endDate } = request.query;

    const whereClause: any = {
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

    const timeRecords = await prisma.timeRecord.findMany({
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

  async calculateOvertime(request: Request, response: Response) {
    const { userId, projectId, startDate, endDate } = request.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { salary: true },
    });

    if (!user) {
      return response.status(404).json({ error: 'Usuário não encontrado' });
    }

    const baseHourlyRate = user.salary / 220;

    const timeRecords = await prisma.timeRecord.findMany({
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

    const overtimeCalculation = OvertimeCalculator.calculate(timeRecords, baseHourlyRate);

    return response.json({
      baseHourlyRate,
      ...overtimeCalculation,
    });
  }

  async getRecent(request: Request, response: Response) {
    const timeRecords = await prisma.timeRecord.findMany({
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

  async getTodayRecords(request: Request, response: Response) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const timeRecords = await prisma.timeRecord.findMany({
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
    })

    return response.json(
      timeRecords.map(record => ({
        id: record.id,
        employeeName: record.user.name,
        projectName: record.project.name,
        type: record.type,
        timestamp: record.timestamp
      }))
    )
  }
}
