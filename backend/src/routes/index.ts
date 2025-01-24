import { Router, Request, Response, NextFunction, Handler } from 'express';
import { registroPontoRouter } from './registroPonto.routes';
import { sessionsRouter } from './sessions.routes';
import { usuariosRouter } from './usuarios.routes';
import { metricasRouter } from './metricas.routes';
import { obrasRouter } from './obras.routes';
import { registrosRouter } from './registros.routes';
import { horasExtrasRouter } from './horasExtras.routes';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const router = Router();

const indexHandler: Handler = (_req: Request, res: Response) => {
  res.json({ message: 'API Controle de Horas Extras' });
};

// Rotas públicas
router.get('/', indexHandler);
router.use('/sessions', sessionsRouter);
router.use('/obras', obrasRouter);

// Middleware de autenticação para as rotas protegidas
const protectedRouter = Router();
protectedRouter.use(ensureAuthenticated);

// Rotas protegidas
protectedRouter.use('/registros', registroPontoRouter);
protectedRouter.use('/usuarios', usuariosRouter);
protectedRouter.use('/metricas', metricasRouter);
protectedRouter.use('/registros-ponto', registrosRouter);
protectedRouter.use('/horas-extras', horasExtrasRouter);

router.use(protectedRouter);

export { router }; 