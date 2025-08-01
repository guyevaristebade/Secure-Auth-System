import { prisma } from '@config/index';
import { ConflitError, UnauthorizedError } from '../errors';
import { loginInput, RegisterInput } from '../schemas';
import { ApiResponse, userWithoutRole, UserPayloadWithTokens, ITokens, UserPayload } from '../types';
import {
    generateAccessToken,
    generateRefreshToken,
    storeRefreshToken,
    comparePassword,
    hashPassword,
    updateLoginAt,
} from '../helpers';

export const registerService = async (data: RegisterInput) => {
    const apiResponse: ApiResponse<userWithoutRole> = {
        ok: true,
        status: 201,
        data: null,
    };

    const { email, name, password } = data;
    // existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) throw new ConflitError('Un utilisateur existe déjà !');

    //hash password
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
        },
    });

    apiResponse.data = {
        id: user.id,
        email: user.email,
        name: user.name,
    };

    return apiResponse;
};

export const loginService = async (data: loginInput) => {
    const apiResponse: ApiResponse<UserPayloadWithTokens> = {
        ok: true,
        status: 201,
        data: null,
    };
    const { email, password } = data;

    // est-ce qu'un utilisateur existe ?
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (!existingUser) throw new UnauthorizedError('Email ou mot de passe incorrect');

    // comparons les mdp
    const isPasswordValid = await comparePassword(password, existingUser.password);

    if (!isPasswordValid) throw new UnauthorizedError('Email ou mot de passe incorrect');

    // extraction de certaines informations sur l'utilisateur
    const userPayload: UserPayload = {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
    };

    // génération des tokens
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    // mise à jour de la date de login
    await updateLoginAt(existingUser.id);

    // stockage du refreshToken en base
    await storeRefreshToken(existingUser.id, refreshToken);

    apiResponse.data = {
        user: userPayload,
        accessToken,
        refreshToken,
    };

    return apiResponse;
};

export const refreshService = async (userId: string, refreshToken: string) => {
    const apiResponse: ApiResponse<ITokens> = {
        ok: true,
        status: 201,
        data: null,
    };

    if (!userId) throw new UnauthorizedError('Utilisateur invalide');

    // on vérifie que le user existe et que la valeur de refreshToken en base n'est pas null
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user || !user.refreshToken) throw new UnauthorizedError('Accès refusé');

    // on vérifie que le token en base et celui du cookie sont identique
    const compareTokens = await comparePassword(refreshToken, user.refreshToken);
    if (!compareTokens) throw new UnauthorizedError('Token invalide');

    const userPayload: UserPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };
    // on génère un newAccessToken et newRefreshToken
    const newAccessToken = generateAccessToken(userPayload);
    const newRefreshToken = generateRefreshToken(userPayload);

    // on stock le nouveau refreshToken en base pour la rotation
    await storeRefreshToken(userId, newRefreshToken);
    apiResponse.data = { accessToken: newAccessToken, refreshToken: newRefreshToken };

    return apiResponse;
};

export const logoutService = async (userId: string) => {
    if (!userId) throw new UnauthorizedError('Utilisateur invalide');

    const user = await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};
