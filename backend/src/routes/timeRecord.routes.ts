import { Router } from 'express';
import multer from 'multer';
import { TimeRecordController } from '../controllers/TimeRecordController';
import { adminMiddleware } from '../middlewares/admin';

const timeRecordRoutes = Router();
const timeRecordController = new TimeRecordController();

// Configuração do multer para processar o upload de imagens
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  },
});

// Rotas administrativas
timeRecordRoutes.get('/', adminMiddleware, timeRecordController.index.bind(timeRecordController));
timeRecordRoutes.get('/recent', adminMiddleware, timeRecordController.getRecent.bind(timeRecordController));
timeRecordRoutes.get('/:id', adminMiddleware, timeRecordController.show.bind(timeRecordController));
timeRecordRoutes.put('/:id', adminMiddleware, timeRecordController.update.bind(timeRecordController));
timeRecordRoutes.delete('/:id', adminMiddleware, timeRecordController.delete.bind(timeRecordController));
timeRecordRoutes.post('/calculate-overtime', adminMiddleware, timeRecordController.calculateOvertime.bind(timeRecordController));

// Rotas públicas
timeRecordRoutes.get('/my-records', timeRecordController.myRecords.bind(timeRecordController));
timeRecordRoutes.post('/', upload.single('image'), timeRecordController.create.bind(timeRecordController));

export { timeRecordRoutes };
