import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DecodedToken } from '../types/auth.model';
import { UnauthorizedError } from '../errors/unauthorized.error';

const authMiddlewares = {
    authenticatedUser: (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        // on vérifie le token
        if (!token) throw new UnauthorizedError('Accès refusé');

        try {
            // on vérifie la validité du token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as DecodedToken;

            // s'il est valide on attache ses information à decoded
            (req as any).userId = decoded.userId;
            next();
        } catch (error) {
            console.log("Echec de l'authentification ! ", error);
            next(error);
        }
    },

    // vérifie si le refreshToken du cookie est valide
    refreshTokenValidation: (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.cookies.refresh_token;

        // on vérifie le token
        if (!refreshToken) throw new UnauthorizedError('Accès refusé');

        try {
            // on vérifie la validité du token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as DecodedToken;

            // s'il est valide on attache ses information à decoded
            (req as any).userId = decoded.userId;
            next();
        } catch (error) {
            console.log('Echec du rafrîchissement du Token ', error);
            next(error);
        }
    },
};

export default authMiddlewares;
