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
exports.usuariosRouter = void 0;
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const usuariosRouter = (0, express_1.Router)();
exports.usuariosRouter = usuariosRouter;
const usuarioController = new UsuarioController_1.UsuarioController();
// Handler para verificar cargo do usuário
const verificarCargoHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cpf } = req.params;
        const usuario = yield prisma.usuario.findUnique({
            where: { cpf },
            select: { cargo: true }
        });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.json({ cargo: usuario.cargo });
    }
    catch (error) {
        console.error('Erro ao buscar cargo do usuário:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
});
// Rota pública para verificar cargo
usuariosRouter.get('/cargo/:cpf', verificarCargoHandler);
// Rotas protegidas
usuariosRouter.use(ensureAuthenticated_1.ensureAuthenticated);
// Middleware para converter Request em AuthenticatedRequest
const convertToAuthenticatedRequest = (req, res, next) => {
    const authenticatedReq = req;
    next();
};
usuariosRouter.use(convertToAuthenticatedRequest);
const meHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.me(req, res);
});
const uploadDescritorHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.uploadDescritor(req, res);
});
const indexHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.index(req, res);
});
const showHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.show(req, res);
});
const createHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.create(req, res);
});
const updateHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.update(req, res);
});
const deleteHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.delete(req, res);
});
const atualizarObraAtualHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield usuarioController.atualizarObraAtual(req, res);
});
usuariosRouter.get('/me', meHandler);
usuariosRouter.post('/descritor', uploadDescritorHandler);
usuariosRouter.get('/', indexHandler);
usuariosRouter.get('/:id', showHandler);
usuariosRouter.post('/', createHandler);
usuariosRouter.put('/:id', updateHandler);
usuariosRouter.delete('/:id', deleteHandler);
usuariosRouter.post('/:id/obra-atual', atualizarObraAtualHandler);
