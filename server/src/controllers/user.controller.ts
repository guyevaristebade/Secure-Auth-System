import { getUserInfo } from '../services';
import { Request, Response, NextFunction } from 'express';

export const getUserInfosController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).userId;
        const response = await getUserInfo(userId);
        res.status(response.status).json(response);
    } catch (error) {
        next(error);
    }
};
