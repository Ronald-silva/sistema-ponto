"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const auth_1 = require("../middlewares/auth");
const admin_1 = require("../middlewares/admin");
const projectRoutes = (0, express_1.Router)();
exports.projectRoutes = projectRoutes;
const projectController = new ProjectController_1.ProjectController();
projectRoutes.use(auth_1.authMiddleware);
const indexHandler = async (req, res, next) => {
    try {
        await projectController.index(req, res);
    }
    catch (error) {
        next(error);
    }
};
const showHandler = async (req, res, next) => {
    try {
        await projectController.show(req, res);
    }
    catch (error) {
        next(error);
    }
};
projectRoutes.get('/', indexHandler);
projectRoutes.get('/:id', showHandler);
projectRoutes.use(admin_1.adminMiddleware);
const createHandler = async (req, res, next) => {
    try {
        await projectController.create(req, res);
    }
    catch (error) {
        next(error);
    }
};
const updateHandler = async (req, res, next) => {
    try {
        await projectController.update(req, res);
    }
    catch (error) {
        next(error);
    }
};
const deleteHandler = async (req, res, next) => {
    try {
        await projectController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
};
const addUserHandler = async (req, res, next) => {
    try {
        await projectController.addUser(req, res);
    }
    catch (error) {
        next(error);
    }
};
const removeUserHandler = async (req, res, next) => {
    try {
        await projectController.removeUser(req, res);
    }
    catch (error) {
        next(error);
    }
};
projectRoutes.post('/', createHandler);
projectRoutes.put('/:id', updateHandler);
projectRoutes.delete('/:id', deleteHandler);
projectRoutes.post('/:id/users', addUserHandler);
projectRoutes.delete('/:id/users/:userId', removeUserHandler);
