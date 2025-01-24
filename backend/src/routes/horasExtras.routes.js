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
exports.horasExtrasRouter = void 0;
const express_1 = require("express");
const HoraExtraController_1 = require("../controllers/HoraExtraController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const horasExtrasRouter = (0, express_1.Router)();
exports.horasExtrasRouter = horasExtrasRouter;
const horaExtraController = new HoraExtraController_1.HoraExtraController();
// Rotas protegidas
horasExtrasRouter.use(ensureAuthenticated_1.ensureAuthenticated);
// Middleware para converter Request em AuthenticatedRequest
const convertToAuthenticatedRequest = (req, res, next) => {
    const authenticatedReq = req;
    next();
};
horasExtrasRouter.use(convertToAuthenticatedRequest);
horasExtrasRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield horaExtraController.index(req, res);
}));
horasExtrasRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield horaExtraController.show(req, res);
}));
horasExtrasRouter.post('/:id/aprovar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield horaExtraController.aprovar(req, res);
}));
horasExtrasRouter.post('/:id/rejeitar', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield horaExtraController.rejeitar(req, res);
}));
