import { Router, RequestHandler } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const userRoutes = Router();
const userController = new UserController();

// Middleware de autenticação para todas as rotas
userRoutes.use(authMiddleware);

// Rotas que precisam de autenticação de admin
userRoutes.get('/', adminMiddleware, async (req, res, next) => {
  try {
    await userController.index(req, res);
  } catch (error) {
    next(error);
  }
});

userRoutes.post('/', adminMiddleware, async (req, res, next) => {
  try {
    await userController.create(req, res);
  } catch (error) {
    next(error);
  }
});

userRoutes.get('/:id', adminMiddleware, async (req, res, next) => {
  try {
    await userController.show(req, res);
  } catch (error) {
    next(error);
  }
});

userRoutes.put('/:id', adminMiddleware, async (req, res, next) => {
  try {
    await userController.update(req, res);
  } catch (error) {
    next(error);
  }
});

userRoutes.delete('/:id', adminMiddleware, async (req, res, next) => {
  try {
    await userController.delete(req, res);
  } catch (error) {
    next(error);
  }
});

// Rotas de perfil (não precisam de admin)
userRoutes.get('/profile', async (req, res, next) => {
  try {
    await userController.profile(req, res);
  } catch (error) {
    next(error);
  }
});

userRoutes.put('/profile', async (req, res, next) => {
  try {
    await userController.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
});

export { userRoutes };
