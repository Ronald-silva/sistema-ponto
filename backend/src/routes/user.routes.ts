import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(authMiddleware);

// Rotas do perfil (usuário autenticado)
const profileHandler: RequestHandler = async (req, res, next) => {
  try {
    await userController.profile(req, res);
  } catch (error) {
    next(error);
  }
};

const updateProfileHandler: RequestHandler = async (req, res, next) => {
  try {
    await userController.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
};

userRoutes.get('/profile', profileHandler);
userRoutes.put('/profile', updateProfileHandler);

// Rotas administrativas
userRoutes.use(adminMiddleware);

const indexHandler: RequestHandler = async (req, res, next) => {
  try {
    await userController.index(req, res);
  } catch (error) {
    next(error);
  }
};

const createHandler: RequestHandler = async (req, res, next) => {
  try {
    await userController.create(req, res);
  } catch (error) {
    next(error);
  }
};

const showHandler: RequestHandler = async (req, res, next) => {
  try {
    await userController.show(req, res);
  } catch (error) {
    next(error);
  }
};

const updateHandler: RequestHandler = async (req, res, next) => {
  try {
    await userController.update(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteHandler: RequestHandler = async (req, res, next) => {
  try {
    await userController.delete(req, res);
  } catch (error) {
    next(error);
  }
};

userRoutes.get('/', indexHandler);
userRoutes.post('/', createHandler);
userRoutes.get('/:id', showHandler);
userRoutes.put('/:id', updateHandler);
userRoutes.delete('/:id', deleteHandler);

export { userRoutes };
