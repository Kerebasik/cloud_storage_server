import Router from 'express';
import { UserController } from '../controllers/userController';
import authMiddleware from '../middleware/authMiddleware';

const userRouter = Router();

userRouter.post('/avatar', authMiddleware, UserController.uploadAvatar);
userRouter.delete('/avatar', authMiddleware, UserController.deleteAvatar);

export default userRouter;
