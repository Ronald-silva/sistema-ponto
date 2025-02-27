import { Router, RequestHandler } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const projectRoutes = Router();
const projectController = new ProjectController();

projectRoutes.use(authMiddleware);

// Rotas públicas (apenas autenticação necessária)
const indexHandler: RequestHandler = async (req, res, next) => {
  try {
    await projectController.index(req, res);
  } catch (error) {
    next(error);
  }
};

const showHandler: RequestHandler = async (req, res, next) => {
  try {
    await projectController.show(req, res);
  } catch (error) {
    next(error);
  }
};

projectRoutes.get('/', indexHandler);
projectRoutes.get('/:id', showHandler);

// Rotas administrativas
projectRoutes.use(adminMiddleware);

const createHandler: RequestHandler = async (req, res, next) => {
  try {
    await projectController.create(req, res);
  } catch (error) {
    next(error);
  }
};

const updateHandler: RequestHandler = async (req, res, next) => {
  try {
    await projectController.update(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteHandler: RequestHandler = async (req, res, next) => {
  try {
    await projectController.delete(req, res);
  } catch (error) {
    next(error);
  }
};

const addUserHandler: RequestHandler = async (req, res, next) => {
  try {
    await projectController.addUser(req, res);
  } catch (error) {
    next(error);
  }
};

const removeUserHandler: RequestHandler = async (req, res, next) => {
  try {
    await projectController.removeUser(req, res);
  } catch (error) {
    next(error);
  }
};

projectRoutes.post('/', createHandler);
projectRoutes.put('/:id', updateHandler);
projectRoutes.delete('/:id', deleteHandler);
projectRoutes.post('/:id/users', addUserHandler);
projectRoutes.delete('/:id/users/:userId', removeUserHandler);

export { projectRoutes };
