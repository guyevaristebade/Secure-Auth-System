import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { userPayload } from '../models/auth.model';

export const generateAccessToken = (user: userPayload) => {
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });

    return accessToken;
};

export const generateRefreshToken = (user: userPayload) => {
    const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: '7d' });
    return refreshToken;
};

export const storeRefreshToken = async (userId: string, token: string) => {
    const hashToken = await bcrypt.hash(token, 10);
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: hashToken },
    });
};

export const deleteRefreshToken = async (userId: string) => {
    await prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
    });
};
