import { Router } from 'express';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { projectRoutes } from './project.routes';
import { timeRecordRoutes } from './timeRecord.routes';
import { holidayRoutes } from './holiday.routes';
import { faceRecognitionRoutes } from './faceRecognition.routes';
import { dashboardRoutes } from './dashboard.routes';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Rotas públicas
router.use('/auth', authRoutes);

// Rotas protegidas
router.use(authMiddleware);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/time-records', timeRecordRoutes);
router.use('/holidays', holidayRoutes);
router.use('/face-recognition', faceRecognitionRoutes);
router.use('/dashboard', dashboardRoutes);

export { router };