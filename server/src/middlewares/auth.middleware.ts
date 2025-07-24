import { Request, Response, NextFunction } from 'express';
import { RegisterInput } from 'models/auth.model';

export const validateUserRegistration = (req: Request, res: Response, next: NextFunction) => {
    const { email, name, password } = req.body as RegisterInput;

    if (!email || !name || !password) {
        res.status(400).json({ message: 'Toutes les informations sont requises !' });
    }

    next();
};
