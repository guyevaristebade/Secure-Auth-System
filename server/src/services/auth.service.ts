import bcrypt from 'bcryptjs';
import prisma from '../config/db.config';
import { ConflitError } from '../errors/conflit.error';
import { userPayload } from '../types/auth.model';
import { hashPassword } from '../helpers/hashPassword';
import { loginInput, RegisterInput } from '../schemas';
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
    const accessToken = generateAccessToken(existingUser.id);
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

export const refreshService = async (userId: string, refreshToken: string) => {
    // on vérifie que le user existe et que la valeur de refreshToken en base n'est pas null
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user || !user.refreshToken) throw new UnauthorizedError('Accès refusé');

    // on vérifie que le token en base et celui du cookie sont identique
    const compareTokens = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!compareTokens) throw new UnauthorizedError('Token invalide');

    // on génère un newAccessToken et newRefreshToken
    const newAccessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    // on stock le nouveau refreshToken en base pour la rotation
    await storeRefreshToken(userId, newRefreshToken);

    return { newAccessToken, newRefreshToken };
};

export const logoutService = async (userId: string) => {
    if (!userId) throw new UnauthorizedError('Utilisateur invalide');

    const user = await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};
