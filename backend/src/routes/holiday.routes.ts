import { Router, RequestHandler } from 'express';
import { HolidayController } from '../controllers/HolidayController';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const holidayRoutes = Router();
const holidayController = new HolidayController();

holidayRoutes.use(authMiddleware);

// Rotas públicas (apenas autenticação necessária)
const indexHandler: RequestHandler = async (req, res, next) => {
  try {
    await holidayController.index(req, res);
  } catch (error) {
    next(error);
  }
};

const showHandler: RequestHandler = async (req, res, next) => {
  try {
    await holidayController.show(req, res);
  } catch (error) {
    next(error);
  }
};

holidayRoutes.get('/', indexHandler);
holidayRoutes.get('/:id', showHandler);

// Rotas administrativas
holidayRoutes.use(adminMiddleware);

const createHandler: RequestHandler = async (req, res, next) => {
  try {
    await holidayController.create(req, res);
  } catch (error) {
    next(error);
  }
};

const updateHandler: RequestHandler = async (req, res, next) => {
  try {
    await holidayController.update(req, res);
  } catch (error) {
    next(error);
  }
};

const deleteHandler: RequestHandler = async (req, res, next) => {
  try {
    await holidayController.delete(req, res);
  } catch (error) {
    next(error);
  }
};

holidayRoutes.post('/', createHandler);
holidayRoutes.put('/:id', updateHandler);
holidayRoutes.delete('/:id', deleteHandler);

export { holidayRoutes };
