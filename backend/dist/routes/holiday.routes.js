"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holidayRoutes = void 0;
const express_1 = require("express");
const HolidayController_1 = require("../controllers/HolidayController");
const admin_1 = require("../middlewares/admin");
const holidayRoutes = (0, express_1.Router)();
exports.holidayRoutes = holidayRoutes;
const holidayController = new HolidayController_1.HolidayController();
holidayRoutes.get('/', holidayController.index);
holidayRoutes.get('/:id', holidayController.show);
holidayRoutes.use(admin_1.adminMiddleware);
holidayRoutes.post('/', holidayController.create);
holidayRoutes.put('/:id', holidayController.update);
holidayRoutes.delete('/:id', holidayController.delete);
