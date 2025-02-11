import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { adminMiddleware } from '../middlewares/admin';

const projectRoutes = Router();
const projectController = new ProjectController();

// Rotas públicas (usuários autenticados)
projectRoutes.get('/', projectController.index);
projectRoutes.get('/:id', projectController.show);

// Rotas administrativas
projectRoutes.use(adminMiddleware);
projectRoutes.post('/', projectController.create);
projectRoutes.put('/:id', projectController.update);
projectRoutes.delete('/:id', projectController.delete);
projectRoutes.post('/:id/users', projectController.addUser);
projectRoutes.delete('/:id/users/:userId', projectController.removeUser);

export { projectRoutes };
