import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config';

export const generateAccessToken = (userId: string) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '15m' });

    return accessToken;
};

/*
    Le refreshToken ne doit pas contenir des information comme le role , les permissions etc.. pour des raisons de sécurité
*/
export const generateRefreshToken = (userId: string) => {
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
        expiresIn: '1d',
    });
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
