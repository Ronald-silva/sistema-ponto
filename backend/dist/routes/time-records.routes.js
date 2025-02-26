"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeRecordsRoutes = void 0;
const express_1 = require("express");
const TimeRecordController_1 = require("../controllers/TimeRecordController");
const admin_1 = require("../middlewares/admin");
const timeRecordsRoutes = (0, express_1.Router)();
exports.timeRecordsRoutes = timeRecordsRoutes;
const timeRecordController = new TimeRecordController_1.TimeRecordController();
timeRecordsRoutes.get('/today', admin_1.adminMiddleware, timeRecordController.getTodayRecords.bind(timeRecordController));
timeRecordsRoutes.post('/', timeRecordController.create.bind(timeRecordController));
