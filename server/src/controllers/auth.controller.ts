import { Request, Response, NextFunction } from 'express';
import { RegisterInput } from '../models/auth.model';
import { registerService } from '../services/auth.service';

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await registerService(req.body as RegisterInput);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

// export const loginController
