import { Router, RequestHandler } from 'express';
import { MetricasController } from '../controllers/MetricasController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const metricasRouter = Router();
const metricasController = new MetricasController();

// Rotas protegidas
metricasRouter.use(ensureAuthenticated);

const listarUltimosRegistrosHandler: RequestHandler = async (req, res): Promise<void> => {
  await metricasController.listarUltimosRegistros(req, res);
};

metricasRouter.get('/', listarUltimosRegistrosHandler);

export { metricasRouter }; 