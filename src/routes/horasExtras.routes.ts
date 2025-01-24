import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import HoraExtraController from '../controllers/HoraExtraController';

const horasExtrasRouter = Router();
const horaExtraController = new HoraExtraController();

horasExtrasRouter.use(ensureAuthenticated);

horasExtrasRouter.get('/', async (req, res) => {
  await horaExtraController.listar(req, res);
});

horasExtrasRouter.post('/', async (req, res) => {
  await horaExtraController.solicitar(req, res);
});

horasExtrasRouter.post('/:id/aprovar', async (req, res) => {
  await horaExtraController.aprovar(req, res);
});

horasExtrasRouter.post('/:id/rejeitar', async (req, res) => {
  await horaExtraController.rejeitar(req, res);
});

export default horasExtrasRouter; 