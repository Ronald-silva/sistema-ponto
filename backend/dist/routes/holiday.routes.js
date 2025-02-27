"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.holidayRoutes = void 0;
const express_1 = require("express");
const HolidayController_1 = require("../controllers/HolidayController");
const auth_1 = require("../middlewares/auth");
const admin_1 = require("../middlewares/admin");
const holidayRoutes = (0, express_1.Router)();
exports.holidayRoutes = holidayRoutes;
const holidayController = new HolidayController_1.HolidayController();
holidayRoutes.use(auth_1.authMiddleware);
const indexHandler = async (req, res, next) => {
    try {
        await holidayController.index(req, res);
    }
    catch (error) {
        next(error);
    }
};
const showHandler = async (req, res, next) => {
    try {
        await holidayController.show(req, res);
    }
    catch (error) {
        next(error);
    }
};
holidayRoutes.get('/', indexHandler);
holidayRoutes.get('/:id', showHandler);
holidayRoutes.use(admin_1.adminMiddleware);
const createHandler = async (req, res, next) => {
    try {
        await holidayController.create(req, res);
    }
    catch (error) {
        next(error);
    }
};
const updateHandler = async (req, res, next) => {
    try {
        await holidayController.update(req, res);
    }
    catch (error) {
        next(error);
    }
};
const deleteHandler = async (req, res, next) => {
    try {
        await holidayController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
};
holidayRoutes.post('/', createHandler);
holidayRoutes.put('/:id', updateHandler);
holidayRoutes.delete('/:id', deleteHandler);
