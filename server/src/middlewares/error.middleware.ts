import { ApiResponse } from '../types';
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // console.log(err.stack);
    const status = err.status || 500;
    const message = err.message || 'Erreur server';
    const apiResponse: ApiResponse = {
        ok: false,
        data: null,
        status,
        error: message,
    };
    res.status(status).json(apiResponse);
};
