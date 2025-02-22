import { Router } from 'express';
import multer from 'multer';
import { FaceRecognitionController } from '../controllers/FaceRecognitionController';
import { adminMiddleware } from '../middlewares/admin';

const faceRecognitionRoutes = Router();
const faceRecognitionController = new FaceRecognitionController();

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
faceRecognitionRoutes.use(adminMiddleware);
faceRecognitionRoutes.post(
  '/register/:userId',
  upload.single('image'),
  faceRecognitionController.register.bind(faceRecognitionController)
);
faceRecognitionRoutes.delete(
  '/:userId',
  faceRecognitionController.delete.bind(faceRecognitionController)
);

// Rota pública para verificação facial
faceRecognitionRoutes.post(
  '/verify',
  upload.single('image'),
  faceRecognitionController.verify.bind(faceRecognitionController)
);

export { faceRecognitionRoutes };
