import { Router } from 'express';
import { authMiddlewares } from '../middlewares';
import { loginSchema, registerSchema } from '../schemas';
import { loginController, logoutController, refreshController, registerController } from '../controllers';

export const authRouter = Router();

authRouter.post('/register', authMiddlewares.validationError(registerSchema, '/register'), registerController);

authRouter.post('/login', authMiddlewares.validationError(loginSchema, '/login'), loginController);

authRouter.get('/refresh-token', authMiddlewares.refreshTokenValidation, refreshController);

authRouter.delete('/logout', authMiddlewares.authenticatedUser, logoutController);
