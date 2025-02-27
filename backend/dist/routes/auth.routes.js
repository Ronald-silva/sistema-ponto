"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const authController = new AuthController_1.AuthController();
const loginHandler = async (req, res, next) => {
    try {
        await authController.login(req, res);
    }
    catch (error) {
        next(error);
    }
};
const employeeLoginHandler = async (req, res, next) => {
    try {
        await authController.loginEmployee(req, res);
    }
    catch (error) {
        next(error);
    }
};
authRoutes.post('/login', loginHandler);
authRoutes.post('/employee', employeeLoginHandler);
