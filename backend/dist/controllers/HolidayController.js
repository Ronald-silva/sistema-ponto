"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidayController = void 0;
const prisma_1 = require("../lib/prisma");
class HolidayController {
    async index(request, response) {
        try {
            const holidays = await prisma_1.prisma.holiday.findMany({
                orderBy: {
                    date: 'asc'
                }
            });
            return response.json(holidays);
        }
        catch (error) {
            console.error('Erro ao listar feriados:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async show(request, response) {
        const { id } = request.params;
        try {
            const holiday = await prisma_1.prisma.holiday.findUnique({
                where: { id }
            });
            if (!holiday) {
                return response.status(404).json({ error: 'Feriado não encontrado' });
            }
            return response.json(holiday);
        }
        catch (error) {
            console.error('Erro ao buscar feriado:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async create(request, response) {
        const { name, date } = request.body;
        try {
            const holiday = await prisma_1.prisma.holiday.create({
                data: {
                    name,
                    date: new Date(date)
                }
            });
            return response.status(201).json(holiday);
        }
        catch (error) {
            console.error('Erro ao criar feriado:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async update(request, response) {
        const { id } = request.params;
        const { name, date } = request.body;
        try {
            const holiday = await prisma_1.prisma.holiday.update({
                where: { id },
                data: {
                    name,
                    date: new Date(date)
                }
            });
            return response.json(holiday);
        }
        catch (error) {
            console.error('Erro ao atualizar feriado:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async delete(request, response) {
        const { id } = request.params;
        try {
            await prisma_1.prisma.holiday.delete({
                where: { id }
            });
            return response.status(204).send();
        }
        catch (error) {
            console.error('Erro ao excluir feriado:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.HolidayController = HolidayController;
