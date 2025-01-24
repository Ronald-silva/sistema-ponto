import { Router, Response, Request, RequestHandler } from 'express';
import { RegistroPontoController } from '../controllers/RegistroPontoController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';

const registroPontoRouter = Router();
const registroPontoController = new RegistroPontoController();

// Rotas protegidas
registroPontoRouter.use(ensureAuthenticated);

const registrarHandler: RequestHandler = async (req, res): Promise<void> => {
  await registroPontoController.registrar(req as AuthenticatedRequest, res);
};

const listarPorUsuarioHandler: RequestHandler = async (req, res): Promise<void> => {
  await registroPontoController.listarPorUsuario(req as AuthenticatedRequest, res);
};

const listarPorObraHandler: RequestHandler = async (req, res): Promise<void> => {
  await registroPontoController.listarPorObra(req, res);
};

const getMetricasHandler: RequestHandler = async (req, res): Promise<void> => {
  await registroPontoController.getMetricas(req, res);
};

registroPontoRouter.post('/', registrarHandler);
registroPontoRouter.get('/', listarPorUsuarioHandler);
registroPontoRouter.get('/obra/:obra_id', listarPorObraHandler);
registroPontoRouter.get('/metricas/:obra_id', getMetricasHandler);

export { registroPontoRouter }; 