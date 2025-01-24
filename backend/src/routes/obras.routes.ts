import { Router, RequestHandler } from 'express';
import { ObraController } from '../controllers/ObraController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { Request, Response } from 'express';

const obrasRouter = Router();
const obraController = new ObraController();

// Handlers
const indexHandler: RequestHandler = (req, res) => {
  void obraController.index(req, res);
};

const showHandler: RequestHandler = (req, res) => {
  void obraController.show(req, res);
};

const createHandler: RequestHandler = (req, res) => {
  void obraController.create(req, res);
};

const updateHandler: RequestHandler = (req, res) => {
  void obraController.update(req, res);
};

const deleteHandler: RequestHandler = (req, res) => {
  void obraController.delete(req, res);
};

const getMetricasHandler = async (request: Request, response: Response) => {
  const controller = new ObraController();
  await controller.getMetricas(request, response);
};

// Rotas públicas
obrasRouter.get('/', indexHandler);
obrasRouter.get('/:id', showHandler);

// Rotas protegidas
obrasRouter.post('/', ensureAuthenticated, createHandler);
obrasRouter.put('/:id', ensureAuthenticated, updateHandler);
obrasRouter.delete('/:id', ensureAuthenticated, deleteHandler);

obrasRouter.get('/:id/metricas', ensureAuthenticated, getMetricasHandler);

export { obrasRouter }; 