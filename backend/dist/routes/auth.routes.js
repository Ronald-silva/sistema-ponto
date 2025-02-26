"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const authRoutes = (0, express_1.Router)();
exports.authRoutes = authRoutes;
const authController = new AuthController_1.AuthController();
authRoutes.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});
authRoutes.post('/login', authController.login.bind(authController));
authRoutes.post('/login-employee', authController.loginEmployee.bind(authController));
