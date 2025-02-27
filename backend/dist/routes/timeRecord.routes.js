"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeRecordRoutes = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const TimeRecordController_1 = require("../controllers/TimeRecordController");
const admin_1 = require("../middlewares/admin");
const timeRecordRoutes = (0, express_1.Router)();
exports.timeRecordRoutes = timeRecordRoutes;
const timeRecordController = new TimeRecordController_1.TimeRecordController();
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
timeRecordRoutes.get('/', admin_1.adminMiddleware, timeRecordController.index.bind(timeRecordController));
timeRecordRoutes.get('/recent', admin_1.adminMiddleware, timeRecordController.getRecent.bind(timeRecordController));
timeRecordRoutes.get('/:id', admin_1.adminMiddleware, timeRecordController.show.bind(timeRecordController));
timeRecordRoutes.put('/:id', admin_1.adminMiddleware, timeRecordController.update.bind(timeRecordController));
timeRecordRoutes.delete('/:id', admin_1.adminMiddleware, timeRecordController.delete.bind(timeRecordController));
timeRecordRoutes.post('/calculate-overtime', admin_1.adminMiddleware, timeRecordController.calculateOvertime.bind(timeRecordController));
timeRecordRoutes.get('/my-records', timeRecordController.myRecords.bind(timeRecordController));
timeRecordRoutes.post('/', upload.single('image'), timeRecordController.create.bind(timeRecordController));
