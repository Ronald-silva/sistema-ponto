import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import RegistroPontoController from '../controllers/RegistroPontoController';

const registroPontoRouter = Router();
const registroPontoController = new RegistroPontoController();

registroPontoRouter.use(ensureAuthenticated);

registroPontoRouter.get('/', async (req, res) => {
  await registroPontoController.listarPorUsuario(req, res);
});

registroPontoRouter.post('/', async (req, res) => {
  await registroPontoController.registrar(req, res);
});

export default registroPontoRouter; 