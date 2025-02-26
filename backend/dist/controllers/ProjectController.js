"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const prisma_1 = require("../lib/prisma");
class ProjectController {
    async index(request, response) {
        const { userId } = request.query;
        try {
            const projects = await prisma_1.prisma.project.findMany({
                orderBy: {
                    createdAt: 'desc'
                }
            });
            if (userId) {
                const filteredProjects = projects.filter(project => project.users.some(user => user.userId === userId));
                return response.json(filteredProjects);
            }
            return response.json(projects);
        }
        catch (error) {
            console.error('Erro ao listar projetos:', error);
            return response.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            const project = await prisma_1.prisma.project.findUnique({
                where: { id },
                include: {
                    userProjects: {
                        include: {
                            user: true
                        }
                    }
                }
            });
            if (!project) {
                return res.status(404).json({ error: 'Projeto não encontrado' });
            }
            return res.json(project);
        }
        catch (error) {
            console.error('Erro ao buscar projeto:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async create(req, res) {
        try {
            const { name, description, companyId } = req.body;
            const project = await prisma_1.prisma.project.create({
                data: {
                    name,
                    description,
                    companyId,
                    status: 'ACTIVE'
                }
            });
            return res.status(201).json(project);
        }
        catch (error) {
            console.error('Erro ao criar projeto:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, status } = req.body;
            const project = await prisma_1.prisma.project.update({
                where: { id },
                data: {
                    name,
                    description,
                    status
                }
            });
            return res.json(project);
        }
        catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async findById(request, response) {
        try {
            const { id } = request.params;
            const project = await prisma_1.prisma.project.findUnique({
                where: { id },
                include: {
                    overtimeRules: true
                }
            });
            if (!project) {
                return response.status(404).json({ error: 'Projeto não encontrado' });
            }
            return response.json(project);
        }
        catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'Erro ao buscar projeto' });
        }
    }
    async list(req, res) {
        try {
            const projects = await prisma_1.prisma.project.findMany({
                include: {
                    userProjects: {
                        include: {
                            user: true
                        }
                    }
                }
            });
            return res.json(projects);
        }
        catch (error) {
            console.error('Erro ao listar projetos:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await prisma_1.prisma.project.delete({
                where: { id }
            });
            return res.status(204).send();
        }
        catch (error) {
            console.error('Erro ao excluir projeto:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async addUser(req, res) {
        try {
            const { id, userId } = req.params;
            const userProject = await prisma_1.prisma.userProject.create({
                data: {
                    userId,
                    projectId: id
                },
                include: {
                    user: true,
                    project: true
                }
            });
            return res.status(201).json(userProject);
        }
        catch (error) {
            console.error('Erro ao adicionar usuário ao projeto:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async removeUser(req, res) {
        try {
            const { id, userId } = req.params;
            await prisma_1.prisma.userProject.delete({
                where: {
                    userId_projectId: {
                        userId,
                        projectId: id
                    }
                }
            });
            return res.status(204).send();
        }
        catch (error) {
            console.error('Erro ao remover usuário do projeto:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
    async listActive(req, res) {
        try {
            const projects = await prisma_1.prisma.project.findMany({
                where: {
                    status: 'ACTIVE'
                },
                include: {
                    userProjects: {
                        include: {
                            user: true
                        }
                    }
                }
            });
            return res.json(projects);
        }
        catch (error) {
            console.error('Erro ao listar projetos ativos:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
exports.ProjectController = ProjectController;
