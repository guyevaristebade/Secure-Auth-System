import { Request, Response, NextFunction } from 'express';
import { loginService, logoutService, refreshService, registerService } from '../services';
import { loginSchema, registerSchema } from '../schemas';
import { generateCookie } from '../helpers';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = registerSchema.parse(req.body); // je vais délégué la vérification à un middlewares de validation d'erreur Zod qui va prendre le schema en parametre
        const response = await registerService(parsedData);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // on parse l'entrée utilisateur avec zod
        const parsedData = loginSchema.parse(req.body); // je vais délégué la vérification à un middlewares de validation d'erreur Zod qui va prendre le schema en parametre

        const response = await loginService(parsedData);
        const refreshToken = response.data?.refreshToken;

        // on stock le refreshToken dans un cookie
        generateCookie(refreshToken!, res);

        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
};

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).userId;
    const refreshToken = req.cookies.refresh_token;

    try {
        const response = await refreshService(userId, refreshToken);

        const newAccessToken = response.data?.accessToken as string;
        const newRefreshToken = response.data?.refreshToken as string;

        //console.log((req as any).userId);
        await generateCookie(newRefreshToken, res);

        response.message = 'Token rafraîchit avec succès';

        res.status(201).json({
            ok: true,
            status: 201,
            data: { accessToken: newAccessToken },
            message: 'Token rafraîchit avec succès',
        });
    } catch (error) {
        next(error);
    }
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        await logoutService(userId);
        res.clearCookie('refresh_token');

        res.status(201).json({ message: 'Deconnexion réussi' });
    } catch (error) {
        next(error);
    }
};
