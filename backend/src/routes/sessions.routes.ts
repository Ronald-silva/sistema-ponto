import { Router, Request, Response, RequestHandler } from 'express';
import { SessionController } from '../controllers/SessionController';

const sessionsRouter = Router();
const sessionController = new SessionController();

const createHandler: RequestHandler = async (req, res) => {
  await sessionController.create(req, res);
};

sessionsRouter.post('/', createHandler);

export { sessionsRouter }; 