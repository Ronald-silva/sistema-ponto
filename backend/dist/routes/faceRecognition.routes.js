"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faceRecognitionRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const FaceRecognitionController_1 = require("../controllers/FaceRecognitionController");
const admin_1 = require("../middlewares/admin");
const faceRecognitionRoutes = (0, express_1.Router)();
exports.faceRecognitionRoutes = faceRecognitionRoutes;
const faceRecognitionController = new FaceRecognitionController_1.FaceRecognitionController();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Apenas imagens são permitidas'));
        }
    },
});
faceRecognitionRoutes.use(admin_1.adminMiddleware);
faceRecognitionRoutes.post('/register/:userId', upload.single('image'), faceRecognitionController.register.bind(faceRecognitionController));
faceRecognitionRoutes.delete('/:userId', faceRecognitionController.delete.bind(faceRecognitionController));
faceRecognitionRoutes.post('/verify', upload.single('image'), faceRecognitionController.verify.bind(faceRecognitionController));
