import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

// Rota de teste
authRoutes.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Rotas de autenticação
authRoutes.post('/login', (req, res) => authController.login(req, res));
authRoutes.post('/employee', (req, res) => authController.loginEmployee(req, res));
authRoutes.post('/register', (req, res) => authController.register(req, res));

export { authRoutes };
