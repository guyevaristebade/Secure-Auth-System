import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Erreur server';
    res.status(status).json({ error: message });
};
