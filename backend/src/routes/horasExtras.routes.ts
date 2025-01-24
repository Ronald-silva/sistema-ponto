import { Router, Request, Response, NextFunction } from 'express';
import { HoraExtraController } from '../controllers/HoraExtraController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';

const horasExtrasRouter = Router();
const horaExtraController = new HoraExtraController();

// Rotas protegidas
horasExtrasRouter.use(ensureAuthenticated);

// Middleware para converter Request em AuthenticatedRequest
const convertToAuthenticatedRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authenticatedReq = req as AuthenticatedRequest;
  next();
};

horasExtrasRouter.use(convertToAuthenticatedRequest);

horasExtrasRouter.get('/', async (req: Request, res: Response) => {
  await horaExtraController.index(req as AuthenticatedRequest, res);
});

horasExtrasRouter.get('/:id', async (req: Request, res: Response) => {
  await horaExtraController.show(req as AuthenticatedRequest, res);
});

horasExtrasRouter.post('/:id/aprovar', async (req: Request, res: Response) => {
  await horaExtraController.aprovar(req as AuthenticatedRequest, res);
});

horasExtrasRouter.post('/:id/rejeitar', async (req: Request, res: Response) => {
  await horaExtraController.rejeitar(req as AuthenticatedRequest, res);
});

export { horasExtrasRouter }; 