import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { ConflitError } from '../errors/conflit.error';
import { RegisterInput } from '../models/auth.model';
import { hashPassword } from '../utils/hashPassword';

export const registerService = async (data: RegisterInput) => {
    const { email, name, password } = data;
    // existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) throw new ConflitError('Un utilisateur existe déjà !');

    //hash password
    const passwordHash = hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
        },
    });

    const { password: _, ...userWithoutPassword } = user;

    return userWithoutPassword;
};

// export const loginService = async () => {};
