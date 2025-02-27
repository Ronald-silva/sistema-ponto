import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

// Rotas de autenticação
const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
};

const employeeLoginHandler: RequestHandler = async (req, res, next) => {
  try {
    await authController.loginEmployee(req, res);
  } catch (error) {
    next(error);
  }
};

authRoutes.post('/login', loginHandler);
authRoutes.post('/employee', employeeLoginHandler);

export { authRoutes };
