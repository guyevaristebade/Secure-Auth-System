import { Router } from 'express';
import {
    loginController,
    logoutController,
    refreshController,
    registerController,
} from '../controllers/auth.controller';
import authMiddlewares from '../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', registerController);

authRouter.post('/login', loginController);

authRouter.get('/refresh-token', authMiddlewares.refreshTokenValidation, refreshController);

authRouter.delete('/logout', authMiddlewares.authenticatedUser, logoutController);
