import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { DecodedToken, UserPayload } from '../types';
import { UnauthorizedError } from '../errors';
import { ZodObject, ZodError } from 'zod';

export const authMiddlewares = {
    authenticatedUser: (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        // on vérifie le token

        if (!token) throw new UnauthorizedError('Accès refusé');

        try {
            // on vérifie la validité du token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as UserPayload;

            // s'il est valide on attache ses information à decoded
            (req as any).user = decoded;
            next();
        } catch (error) {
            console.log("Echec de l'authentification ! ", error);
            next(error);
        }
    },

    checkRole(role: string) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const userRole = (req as any).user.role;
            try {
                if (userRole !== role) throw new UnauthorizedError("Vous n'avez pas les droits");

                next();
            } catch (error) {
                next(error);
            }
        };
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

    //
    validationError: (schema: ZodObject) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse(req.body);
                next();
            } catch (error) {
                if (error instanceof ZodError) {
                    const message = error.issues[0].message;
                    res.status(400).json({
                        ok: false,
                        status: 400,
                        message,
                    });
                }
                // au suivant si ce n'est pas le cas
                next(error);
            }
        };
    },
};
