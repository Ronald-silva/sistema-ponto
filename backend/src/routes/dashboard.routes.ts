import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { adminMiddleware } from '../middlewares/admin';

const dashboardRoutes = Router();
const dashboardController = new DashboardController();

dashboardRoutes.get('/summary', adminMiddleware, dashboardController.getSummary.bind(dashboardController));

export { dashboardRoutes };
