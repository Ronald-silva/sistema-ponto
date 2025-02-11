import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { adminMiddleware } from '../middlewares/admin';

const userRoutes = Router();
const userController = new UserController();

// Rotas públicas
userRoutes.get('/profile', userController.profile);
userRoutes.put('/profile', userController.updateProfile);

// Rotas administrativas
userRoutes.use(adminMiddleware);
userRoutes.get('/', userController.index);
userRoutes.post('/', userController.create);
userRoutes.get('/:id', userController.show);
userRoutes.put('/:id', userController.update);
userRoutes.delete('/:id', userController.delete);

export { userRoutes };
