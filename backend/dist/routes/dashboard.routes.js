"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = void 0;
const express_1 = require("express");
const DashboardController_1 = require("../controllers/DashboardController");
const auth_1 = require("../middlewares/auth");
const admin_1 = require("../middlewares/admin");
const dashboardRoutes = (0, express_1.Router)();
exports.dashboardRoutes = dashboardRoutes;
const dashboardController = new DashboardController_1.DashboardController();
dashboardRoutes.use(auth_1.authMiddleware);
dashboardRoutes.use(admin_1.adminMiddleware);
const indexHandler = async (req, res, next) => {
    try {
        await dashboardController.index(req, res);
    }
    catch (error) {
        next(error);
    }
};
dashboardRoutes.get('/', indexHandler);
