import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middlewares/auth';
import jwt from 'jsonwebtoken';
import { auth } from '../config/auth';

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

// Rota de teste para verificar token
authRoutes.get('/verify-token', authMiddleware, (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    console.log('=== TESTE DE TOKEN ===');
    console.log('Token:', token);
    console.log('Secret:', auth.jwt.secret);
    
    const decoded = jwt.verify(token, auth.jwt.secret);
    console.log('Decodificado:', decoded);
    
    return res.json({ 
      message: 'Token válido',
      decoded,
      user: req.user
    });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(401).json({ error: 'Token inválido', details: error });
  }
});

export { authRoutes };
