"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const registroPonto_routes_1 = require("./registroPonto.routes");
const sessions_routes_1 = require("./sessions.routes");
const usuarios_routes_1 = require("./usuarios.routes");
const metricas_routes_1 = require("./metricas.routes");
const obras_routes_1 = require("./obras.routes");
const registros_routes_1 = require("./registros.routes");
const horasExtras_routes_1 = require("./horasExtras.routes");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const router = (0, express_1.Router)();
exports.router = router;
const indexHandler = (_req, res) => {
    res.json({ message: 'API Controle de Horas Extras' });
};
// Rotas públicas
router.get('/', indexHandler);
router.use('/sessions', sessions_routes_1.sessionsRouter);
router.use('/obras', obras_routes_1.obrasRouter);
// Middleware de autenticação para as rotas protegidas
const protectedRouter = (0, express_1.Router)();
protectedRouter.use(ensureAuthenticated_1.ensureAuthenticated);
// Rotas protegidas
protectedRouter.use('/registros', registroPonto_routes_1.registroPontoRouter);
protectedRouter.use('/usuarios', usuarios_routes_1.usuariosRouter);
protectedRouter.use('/metricas', metricas_routes_1.metricasRouter);
protectedRouter.use('/registros-ponto', registros_routes_1.registrosRouter);
protectedRouter.use('/horas-extras', horasExtras_routes_1.horasExtrasRouter);
router.use(protectedRouter);
