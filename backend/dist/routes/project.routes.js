"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = require("express");
const ProjectController_1 = require("../controllers/ProjectController");
const auth_1 = require("../middlewares/auth");
const ensureAdmin_1 = require("../middlewares/ensureAdmin");
const projectRoutes = (0, express_1.Router)();
exports.projectRoutes = projectRoutes;
const projectController = new ProjectController_1.ProjectController();
projectRoutes.get('/active', async (req, res, next) => {
    try {
        await projectController.listActive(req, res);
    }
    catch (error) {
        next(error);
    }
});
projectRoutes.get('/', auth_1.ensureAuthenticated, async (req, res, next) => {
    try {
        await projectController.list(req, res);
    }
    catch (error) {
        next(error);
    }
});
projectRoutes.get('/:id', auth_1.ensureAuthenticated, async (req, res, next) => {
    try {
        await projectController.show(req, res);
    }
    catch (error) {
        next(error);
    }
});
const adminMiddlewares = [auth_1.ensureAuthenticated, ensureAdmin_1.ensureAdmin];
projectRoutes.post('/', adminMiddlewares, async (req, res, next) => {
    try {
        await projectController.create(req, res);
    }
    catch (error) {
        next(error);
    }
});
projectRoutes.put('/:id', adminMiddlewares, async (req, res, next) => {
    try {
        await projectController.update(req, res);
    }
    catch (error) {
        next(error);
    }
});
projectRoutes.delete('/:id', adminMiddlewares, async (req, res, next) => {
    try {
        await projectController.delete(req, res);
    }
    catch (error) {
        next(error);
    }
});
projectRoutes.post('/:id/users/:userId', adminMiddlewares, async (req, res, next) => {
    try {
        await projectController.addUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
projectRoutes.delete('/:id/users/:userId', adminMiddlewares, async (req, res, next) => {
    try {
        await projectController.removeUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
