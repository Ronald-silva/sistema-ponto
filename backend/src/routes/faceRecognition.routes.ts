import { Router } from 'express'
import multer from 'multer'
import { FaceRecognitionController } from '../controllers/FaceRecognitionController'
import { authMiddleware } from '../middlewares/authMiddleware'

const faceRecognitionRoutes = Router()
const faceRecognitionController = new FaceRecognitionController()

// Configuração do multer para processar imagens
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Apenas imagens são permitidas'))
    }
  },
})

// Rota para registrar face (protegida)
faceRecognitionRoutes.post(
  '/register',
  authMiddleware,
  upload.single('image'),
  (req, res) => faceRecognitionController.register(req, res).catch(next)
)

// Rota para verificar face
faceRecognitionRoutes.post(
  '/verify',
  upload.single('image'),
  (req, res, next) => faceRecognitionController.verify(req, res).catch(next)
)

export { faceRecognitionRoutes } 