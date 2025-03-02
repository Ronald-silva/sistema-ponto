import { Router } from 'express'
import multer from 'multer'
import { FaceRecognitionController } from '../controllers/FaceRecognitionController'

const faceRoutes = Router()
const upload = multer()
const faceController = new FaceRecognitionController()

// Rota para detecção facial em tempo real
faceRoutes.post(
  '/face-detection',
  upload.single('image'),
  (req, res) => faceController.detectFace(req, res)
)

// Rota para registro de ponto com reconhecimento facial
faceRoutes.post(
  '/time-records',
  upload.single('image'),
  (req, res) => faceController.registerTimeEntry(req, res)
)

export { faceRoutes } 