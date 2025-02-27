import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class HolidayController {
  async index(request: Request, response: Response) {
    try {
      const holidays = await prisma.holiday.findMany({
        orderBy: {
          date: 'asc'
        }
      });

      return response.json(holidays);
    } catch (error) {
      console.error('Erro ao listar feriados:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const holiday = await prisma.holiday.findUnique({
        where: { id }
      });

      if (!holiday) {
        return response.status(404).json({ error: 'Feriado não encontrado' });
      }

      return response.json(holiday);
    } catch (error) {
      console.error('Erro ao buscar feriado:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async create(request: Request, response: Response) {
    const { name, date } = request.body;

    try {
      const holiday = await prisma.holiday.create({
        data: {
          name,
          date: new Date(date)
        }
      });

      return response.status(201).json(holiday);
    } catch (error) {
      console.error('Erro ao criar feriado:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name, date } = request.body;

    try {
      const holiday = await prisma.holiday.update({
        where: { id },
        data: {
          name,
          date: new Date(date)
        }
      });

      return response.json(holiday);
    } catch (error) {
      console.error('Erro ao atualizar feriado:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    try {
      await prisma.holiday.delete({
        where: { id }
      });

      return response.status(204).send();
    } catch (error) {
      console.error('Erro ao excluir feriado:', error);
      return response.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
