import { Router, RequestHandler } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth';
import { adminMiddleware } from '../middlewares/admin';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.use(authMiddleware);
dashboardRoutes.use(adminMiddleware);

const indexHandler: RequestHandler = async (req, res, next) => {
  try {
    await dashboardController.index(req, res);
  } catch (error) {
    next(error);
  }
};

dashboardRoutes.get('/', indexHandler);

export { dashboardRoutes };
