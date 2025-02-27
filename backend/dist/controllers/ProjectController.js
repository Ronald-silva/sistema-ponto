"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const prisma_1 = require("../lib/prisma");
class ProjectController {
    async index(request, response) {
        try {
            const projects = await prisma_1.prisma.project.findMany();
            return response.json(projects);
        }
        catch (error) {
            console.error('Erro ao listar projetos:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async show(request, response) {
        const { id } = request.params;
        try {
            const project = await prisma_1.prisma.project.findUnique({
                where: { id }
            });
            if (!project) {
                return response.status(404).json({ error: 'Projeto não encontrado' });
            }
            return response.json(project);
        }
        catch (error) {
            console.error('Erro ao buscar projeto:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async create(request, response) {
        try {
            const { name, description, companyId } = request.body;
            const project = await prisma_1.prisma.project.create({
                data: {
                    name,
                    description,
                    companyId
                }
            });
            return response.status(201).json(project);
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro ao criar projeto' });
        }
    }
    async update(request, response) {
        try {
            const { id } = request.params;
            const { name, description, companyId } = request.body;
            const project = await prisma_1.prisma.project.update({
                where: { id },
                data: {
                    name,
                    description,
                    companyId
                }
            });
            return response.json(project);
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro ao atualizar projeto' });
        }
    }
    async delete(request, response) {
        try {
            const { id } = request.params;
            await prisma_1.prisma.project.delete({
                where: { id }
            });
            return response.status(204).send();
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro ao deletar projeto' });
        }
    }
    async addUser(request, response) {
        const { id } = request.params;
        const { userId } = request.body;
        try {
            const userProject = await prisma_1.prisma.userProject.create({
                data: {
                    userId,
                    projectId: id,
                    assignedAt: new Date()
                }
            });
            return response.status(201).json(userProject);
        }
        catch (error) {
            console.error('Erro ao adicionar usuário ao projeto:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async removeUser(request, response) {
        const { id, userId } = request.params;
        try {
            await prisma_1.prisma.userProject.delete({
                where: {
                    userId_projectId: {
                        userId,
                        projectId: id
                    }
                }
            });
            return response.status(204).send();
        }
        catch (error) {
            console.error('Erro ao remover usuário do projeto:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.ProjectController = ProjectController;
