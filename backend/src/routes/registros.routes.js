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
exports.registrosRouter = void 0;
const express_1 = require("express");
const RegistroPontoController_1 = require("../controllers/RegistroPontoController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const registrosRouter = (0, express_1.Router)();
exports.registrosRouter = registrosRouter;
const registroPontoController = new RegistroPontoController_1.RegistroPontoController();
registrosRouter.use(ensureAuthenticated_1.ensureAuthenticated);
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield registroPontoController.create(req, res);
});
const indexHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield registroPontoController.index(req, res);
});
registrosRouter.post('/', createHandler);
registrosRouter.get('/', indexHandler);
