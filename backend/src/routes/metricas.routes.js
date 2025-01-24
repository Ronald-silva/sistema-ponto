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
exports.metricasRouter = void 0;
const express_1 = require("express");
const MetricasController_1 = require("../controllers/MetricasController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const metricasRouter = (0, express_1.Router)();
exports.metricasRouter = metricasRouter;
const metricasController = new MetricasController_1.MetricasController();
metricasRouter.use(ensureAuthenticated_1.ensureAuthenticated);
const indexHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield metricasController.index(req, res);
});
const ultimosRegistrosHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield metricasController.ultimosRegistros(req, res);
});
const horasExtrasPendentesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield metricasController.horasExtrasPendentes(req, res);
});
metricasRouter.get('/', indexHandler);
metricasRouter.get('/registros/ultimos', ultimosRegistrosHandler);
metricasRouter.get('/horas-extras/pendentes', horasExtrasPendentesHandler);
