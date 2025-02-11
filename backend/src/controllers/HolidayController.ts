import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class HolidayController {
  async index(request: Request, response: Response) {
    const { projectId, year } = request.query;

    const whereClause: any = {};

    if (projectId) {
      whereClause.projectId = String(projectId);
    }

    if (year) {
      const startDate = new Date(Number(year), 0, 1);
      const endDate = new Date(Number(year), 11, 31);
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const holidays = await prisma.holiday.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return response.json(holidays);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const holiday = await prisma.holiday.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!holiday) {
      return response.status(404).json({ error: 'Feriado não encontrado' });
    }

    return response.json(holiday);
  }

  async create(request: Request, response: Response) {
    const { date, description, type, projectId } = request.body;

    // Se for um feriado específico de projeto, verifica se o projeto existe
    if (type === 'PROJECT_SPECIFIC' && projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return response.status(404).json({ error: 'Projeto não encontrado' });
      }
    }

    // Verifica se já existe um feriado na mesma data para o mesmo projeto
    const existingHoliday = await prisma.holiday.findFirst({
      where: {
        date: new Date(date),
        projectId: projectId || null,
      },
    });

    if (existingHoliday) {
      return response.status(400).json({ error: 'Já existe um feriado nesta data para este projeto' });
    }

    const holiday = await prisma.holiday.create({
      data: {
        date: new Date(date),
        description,
        type,
        projectId: type === 'PROJECT_SPECIFIC' ? projectId : null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return response.status(201).json(holiday);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { date, description, type, projectId } = request.body;

    const holiday = await prisma.holiday.findUnique({
      where: { id },
    });

    if (!holiday) {
      return response.status(404).json({ error: 'Feriado não encontrado' });
    }

    // Se for um feriado específico de projeto, verifica se o projeto existe
    if (type === 'PROJECT_SPECIFIC' && projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return response.status(404).json({ error: 'Projeto não encontrado' });
      }
    }

    // Verifica se já existe outro feriado na mesma data para o mesmo projeto
    const existingHoliday = await prisma.holiday.findFirst({
      where: {
        date: new Date(date),
        projectId: projectId || null,
        NOT: {
          id,
        },
      },
    });

    if (existingHoliday) {
      return response.status(400).json({ error: 'Já existe um feriado nesta data para este projeto' });
    }

    const updatedHoliday = await prisma.holiday.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        description,
        type,
        projectId: type === 'PROJECT_SPECIFIC' ? projectId : null,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return response.json(updatedHoliday);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const holiday = await prisma.holiday.findUnique({
      where: { id },
    });

    if (!holiday) {
      return response.status(404).json({ error: 'Feriado não encontrado' });
    }

    await prisma.holiday.delete({
      where: { id },
    });

    return response.status(204).send();
  }
}
