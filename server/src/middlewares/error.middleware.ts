import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);

    // gestion des erreurs lié à zod
    // if (err instanceof ZodError) {
    //     return res.status(400).json({ error: 'Impossible de valider les données' });
    // }

    const status = err.status || 500;
    const message = err.message || 'Erreur interne du serveur';
    res.status(status).json({ error: message });
};
