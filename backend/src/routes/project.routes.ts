import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureAdmin } from '../middlewares/ensureAdmin';

const projectRoutes = Router();
const projectController = new ProjectController();

// Rota pública para listar projetos ativos
projectRoutes.get('/active', projectController.active);

// Rotas protegidas
projectRoutes.use(ensureAuthenticated);
projectRoutes.get('/', projectController.index);
projectRoutes.get('/:id', projectController.show);

// Rotas de admin
projectRoutes.use(ensureAdmin);
projectRoutes.post('/', projectController.create);
projectRoutes.put('/:id', projectController.update);
projectRoutes.delete('/:id', projectController.delete);
projectRoutes.post('/:id/users/:userId', projectController.addUser);
projectRoutes.delete('/:id/users/:userId', projectController.removeUser);

export { projectRoutes };
