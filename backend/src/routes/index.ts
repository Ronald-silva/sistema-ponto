import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { RegistroPontoController } from '../controllers/RegistroPontoController'
import { authMiddleware } from '../middlewares/auth'
import { PrismaClient } from '@prisma/client'
import { DashboardController } from '../controllers/DashboardController'

const routes = Router()
const authController = new AuthController()
const registroPontoController = new RegistroPontoController()
const prisma = new PrismaClient()
const dashboardController = new DashboardController()

// Rotas públicas
routes.post('/auth/login', authController.login)

// Rotas protegidas
routes.use(authMiddleware)
routes.post('/registros', registroPontoController.registrar)
routes.get('/registros', registroPontoController.listarHistorico)

// Adicione esta rota para testes
routes.get('/usuarios', async (req, res) => {
  const usuarios = await prisma.usuario.findMany({
    include: {
      registros: true
    }
  })
  return res.json(usuarios)
})

// Rotas do dashboard (protegidas)
routes.get('/dashboard/stats', dashboardController.getStats)

export { routes } 