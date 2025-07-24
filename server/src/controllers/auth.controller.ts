import { Request, Response, NextFunction } from 'express';
import { RegisterInput } from '../models/auth.model';
import { loginService, registerService } from '../services/auth.service';
import { loginSchema } from '../schemas';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await registerService(req.body as RegisterInput);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // on parse l'entrée utilisateur avec zod
        const valideData = loginSchema.parse(req.body);

        const { refreshToken, user, accessToken } = await loginService(valideData);

        // on stock le refreshToken dans un cookie
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
        });

        res.status(201).json({ accessToken, user });
    } catch (error) {
        next(error);
    }
};
