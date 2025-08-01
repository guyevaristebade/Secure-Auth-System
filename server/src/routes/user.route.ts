import { getUserInfosController } from '../controllers';
import { authMiddlewares } from '../middlewares';
import { Router } from 'express';

export const userRouter = Router();

userRouter.get('/me', authMiddlewares.authenticatedUser, getUserInfosController);
