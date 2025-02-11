import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const authRoutes = Router();
const authController = new AuthController();

// Rota de teste
authRoutes.get('/test', (req, res) => {
  res.json({ message: 'Test route working' });
});

// Rotas de autenticação
authRoutes.post('/login', authController.login);
authRoutes.post('/employee', authController.loginEmployee);
authRoutes.post('/register', authController.register);

export { authRoutes };
