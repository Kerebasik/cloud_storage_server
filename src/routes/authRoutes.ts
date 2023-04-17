import { body } from 'express-validator';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { AuthController } from '../controllers/authController';

const authRouter = express.Router();

authRouter.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 12 }),
  AuthController.registration,
);
authRouter.post('/login', AuthController.login);
authRouter.post('/', authMiddleware, AuthController.auth);
authRouter.get('/refresh', AuthController.refresh);
authRouter.get('/logout', AuthController.logout);
authRouter.get('/activated/:link', AuthController.activated);

export default authRouter;
