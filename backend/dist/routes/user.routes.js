"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const auth_1 = require("../middlewares/auth");
const admin_1 = require("../middlewares/admin");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
const userController = new UserController_1.UserController();
userRoutes.use(auth_1.authMiddleware);
const profileHandler = async (req, res, next) => {
    try {
        await userController.profile(req, res);
    }
    catch (error) {
        next(error);
    }
};
const updateProfileHandler = async (req, res, next) => {
    try {
        await userController.updateProfile(req, res);
    }
    catch (error) {
        next(error);
    }
};
userRoutes.get('/profile', profileHandler);
userRoutes.put('/profile', updateProfileHandler);
userRoutes.use(admin_1.adminMiddleware);
const indexHandler = async (req, res, next) => {
    try {
        await userController.index(req, res);
    }
    catch (error) {
        next(error);
    }
};
const createHandler = async (req, res, next) => {
    try {
        await userController.create(req, res);
    }
    catch (error) {
        next(error);
    }
};
const showHandler = async (req, res, next) => {
    try {
        await userController.show(req, res);
    }
    catch (error) {
        next(error);
    }
};
const updateHandler = async (req, res, next) => {
    try {
        await userController.update(req, res);
    }
    catch (error) {
        next(error);
    }
};
const deleteHandler = async (req, res, next) => {
    try {
        await userController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
};
userRoutes.get('/', indexHandler);
userRoutes.post('/', createHandler);
userRoutes.get('/:id', showHandler);
userRoutes.put('/:id', updateHandler);
userRoutes.delete('/:id', deleteHandler);
