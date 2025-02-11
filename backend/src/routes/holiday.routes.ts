import { Router } from 'express';
import { HolidayController } from '../controllers/HolidayController';
import { adminMiddleware } from '../middlewares/admin';

const holidayRoutes = Router();
const holidayController = new HolidayController();

// Rotas públicas (usuários autenticados)
holidayRoutes.get('/', holidayController.index);
holidayRoutes.get('/:id', holidayController.show);

// Rotas administrativas
holidayRoutes.use(adminMiddleware);
holidayRoutes.post('/', holidayController.create);
holidayRoutes.put('/:id', holidayController.update);
holidayRoutes.delete('/:id', holidayController.delete);

export { holidayRoutes };
