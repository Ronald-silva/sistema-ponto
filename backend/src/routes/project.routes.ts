import { Router, RequestHandler } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const projectRoutes = Router();
const projectController = new ProjectController();

// Rota pública para projetos ativos
projectRoutes.get('/active', async (req, res, next) => {
  try {
    await projectController.getActiveProjects(req, res);
  } catch (error) {
    next(error);
  }
});

// Middleware de autenticação para as demais rotas
projectRoutes.use(authMiddleware);

// Rotas que necessitam autenticação
projectRoutes.get('/', async (req, res, next) => {
  try {
    await projectController.index(req, res);
  } catch (error) {
    next(error);
  }
});

projectRoutes.get('/:id', async (req, res, next) => {
  try {
    await projectController.show(req, res);
  } catch (error) {
    next(error);
  }
});

// Rota de atualização (precisa apenas de autenticação)
projectRoutes.put('/:id', async (req, res, next) => {
  try {
    await projectController.update(req, res);
  } catch (error) {
    next(error);
  }
});

// Rotas administrativas
projectRoutes.use(adminMiddleware);

projectRoutes.post('/', async (req, res, next) => {
  try {
    await projectController.create(req, res);
  } catch (error) {
    next(error);
  }
});

projectRoutes.delete('/:id', async (req, res, next) => {
  try {
    await projectController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

export { projectRoutes };
