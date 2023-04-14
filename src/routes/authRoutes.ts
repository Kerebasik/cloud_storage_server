import { body } from 'express-validator';
import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { AuthController } from '../controllers/authController';

const authRoutes = express.Router();

authRoutes.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 12 }),
  AuthController.registration,
);
authRoutes.post('/login', AuthController.login);
authRoutes.post('/', authMiddleware, AuthController.auth);
authRoutes.get('/refresh', AuthController.refresh);
authRoutes.get('/logout', AuthController.logout);
authRoutes.get('/activated/:link', AuthController.activated)

export default authRoutes;
