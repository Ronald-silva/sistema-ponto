import { Router, RequestHandler } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { AuthenticatedRequest } from '../middlewares/ensureAuthenticated';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const usuariosRouter = Router();
const usuarioController = new UsuarioController();

// Handler para verificar cargo do usuário
const verificarCargoHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.verificarCargo(req, res);
};

// Rota pública para verificar cargo
usuariosRouter.get('/cargo/:cpf', verificarCargoHandler);

// Rotas protegidas
usuariosRouter.use(ensureAuthenticated);

// Middleware para converter Request em AuthenticatedRequest
const convertToAuthenticatedRequest: RequestHandler = (req, res, next) => {
  const authenticatedReq = req as AuthenticatedRequest;
  next();
};

usuariosRouter.use(convertToAuthenticatedRequest);

const meHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.me(req as AuthenticatedRequest, res);
};

const uploadDescritorHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.uploadDescritor(req as AuthenticatedRequest, res);
};

const indexHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.index(req, res);
};

const showHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.show(req, res);
};

const createHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.create(req, res);
};

const updateHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.update(req, res);
};

const deleteHandler: RequestHandler = async (req, res): Promise<void> => {
  await usuarioController.delete(req, res);
};

const atualizarObraAtualHandler: RequestHandler = async (req, res) => {
  await usuarioController.atualizarObraAtual(req as AuthenticatedRequest, res);
};

usuariosRouter.get('/', indexHandler);
usuariosRouter.get('/me', meHandler);
usuariosRouter.get('/:id', showHandler);
usuariosRouter.post('/', createHandler);
usuariosRouter.put('/:id', updateHandler);
usuariosRouter.delete('/:id', deleteHandler);
usuariosRouter.post('/descritor', uploadDescritorHandler);
usuariosRouter.post('/:id/obra-atual', atualizarObraAtualHandler);

export { usuariosRouter }; 