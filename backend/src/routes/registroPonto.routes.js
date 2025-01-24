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
exports.registroPontoRouter = void 0;
const express_1 = require("express");
const RegistroPontoController_1 = require("../controllers/RegistroPontoController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const registroPontoRouter = (0, express_1.Router)();
exports.registroPontoRouter = registroPontoRouter;
const registroPontoController = new RegistroPontoController_1.RegistroPontoController();
// Rotas protegidas
registroPontoRouter.use(ensureAuthenticated_1.ensureAuthenticated);
// Middleware para converter Request em AuthenticatedRequest
const convertToAuthenticatedRequest = (req, res, next) => {
    const authenticatedReq = req;
    next();
};
registroPontoRouter.use(convertToAuthenticatedRequest);
registroPontoRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield registroPontoController.registrar(req, res);
}));
registroPontoRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield registroPontoController.listarPorUsuario(req, res);
}));
