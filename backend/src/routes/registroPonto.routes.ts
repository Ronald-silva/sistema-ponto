import { Router, Request, Response, NextFunction } from 'express';
import { RegistroPontoController } from '../controllers/RegistroPontoController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';

const registroPontoRouter = Router();
const registroPontoController = new RegistroPontoController();

// Rotas protegidas
registroPontoRouter.use(ensureAuthenticated);

// Middleware para converter Request em AuthenticatedRequest
const convertToAuthenticatedRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticatedReq = req as AuthenticatedRequest;
  next();
};

registroPontoRouter.use(convertToAuthenticatedRequest);

registroPontoRouter.post('/', async (req: Request, res: Response) => {
  await registroPontoController.registrar(req as AuthenticatedRequest, res);
});

registroPontoRouter.get('/', async (req: Request, res: Response) => {
  await registroPontoController.listarPorUsuario(req as AuthenticatedRequest, res);
});

export { registroPontoRouter }; 