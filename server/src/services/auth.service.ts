import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { ConflitError } from '../errors/conflit.error';
import { RegisterInput, userPayload } from '../models/auth.model';
import { hashPassword } from '../helpers/hashPassword';
import { loginInput } from '../schemas';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { generateAccessToken, generateRefreshToken, storeRefreshToken } from '../helpers/generateTokens';

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

export const loginService = async (data: loginInput) => {
    const { email, password } = data;

    // est-ce qu'un utilisateur existe ?
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) throw new UnauthorizedError('Email ou mot de passe incorrect');

    // comparons les mdp
    const passwordCompare = await bcrypt.compare(password, existingUser.password);

    if (!passwordCompare) throw new UnauthorizedError('Email ou mot de passe incorrect');

    // extraction de certaines informations sur l'utilisateur
    const userPayload: userPayload = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
    };

    // génération des tokens
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(existingUser.id);

    // mise à jour de la date de login
    await prisma.user.update({
        where: { id: existingUser.id },
        data: { loginAt: new Date() },
    });

    // stockage du refreshToken en base
    await storeRefreshToken(existingUser.id, refreshToken);

    return {
        accessToken,
        refreshToken,
        user: userPayload,
    };
};
