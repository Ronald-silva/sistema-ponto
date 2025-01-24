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
exports.sessionsRouter = void 0;
const express_1 = require("express");
const SessionController_1 = require("../controllers/SessionController");
const sessionsRouter = (0, express_1.Router)();
exports.sessionsRouter = sessionsRouter;
const sessionController = new SessionController_1.SessionController();
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield sessionController.create(req, res);
});
sessionsRouter.post('/', createHandler);
