import { Request, Response, NextFunction } from 'express';
import { loginService, logoutService, refreshService, registerService } from '../services/auth.service';
import { loginSchema, registerSchema } from '../schemas';
import { DecodedToken } from '../types/auth.model';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const valideData = registerSchema.parse(req.body); // je vais délégué la vérification à un middlewares de validation d'erreur Zod qui va prendre le schema en parametre
        const result = await registerService(valideData);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // on parse l'entrée utilisateur avec zod
        const valideData = loginSchema.parse(req.body); // je vais délégué la vérification à un middlewares de validation d'erreur Zod qui va prendre le schema en parametre

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

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;
    const refresh_token = req.cookies.refresh_token;

    try {
        const { newAccessToken, newRefreshToken } = await refreshService(userId, refresh_token);
        //console.log((req as any).userId);
        res.status(201).json({ data: { accessToken: newAccessToken }, message: 'Token rafraîchit avec succès' });
    } catch (error) {
        next(error);
    }
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        await logoutService(userId);
        res.clearCookie('refresh_token');

        res.status(201).json({ message: 'Deconnexion réussi' });
    } catch (error) {
        next(error);
    }
};
