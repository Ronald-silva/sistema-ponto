"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obrasRouter = void 0;
const express_1 = require("express");
const ObraController_1 = require("../controllers/ObraController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const obrasRouter = (0, express_1.Router)();
exports.obrasRouter = obrasRouter;
const obraController = new ObraController_1.ObraController();
// Handlers
const indexHandler = (req, res) => {
    void obraController.index(req, res);
};
const showHandler = (req, res) => {
    void obraController.show(req, res);
};
const createHandler = (req, res) => {
    void obraController.create(req, res);
};
const updateHandler = (req, res) => {
    void obraController.update(req, res);
};
const deleteHandler = (req, res) => {
    void obraController.delete(req, res);
};
const getMetricasHandler = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const controller = new ObraController_1.ObraController();
    yield controller.getMetricas(request, response);
});
// Rotas públicas
obrasRouter.get('/', indexHandler);
obrasRouter.get('/:id', showHandler);
// Rotas protegidas
obrasRouter.post('/', ensureAuthenticated_1.ensureAuthenticated, createHandler);
obrasRouter.put('/:id', ensureAuthenticated_1.ensureAuthenticated, updateHandler);
obrasRouter.delete('/:id', ensureAuthenticated_1.ensureAuthenticated, deleteHandler);
obrasRouter.get('/:id/metricas', ensureAuthenticated_1.ensureAuthenticated, getMetricasHandler);
