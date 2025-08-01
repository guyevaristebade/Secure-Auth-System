import { prisma } from '@config/db.config';
import { UnauthorizedError } from '../errors';
import { ApiResponse, UserInfos } from '../types';

export const getUserInfo = async (userId: string) => {
    const apiResponse: ApiResponse<UserInfos> = {
        ok: true,
        status: 200,
        data: null,
    };

    if (!userId) throw new UnauthorizedError('Utilisateur invalide');

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            role: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            loginAt: true,
        },
    });

    if (!user) throw new UnauthorizedError('Accès refusé');

    apiResponse.data = user;

    return apiResponse;
};
