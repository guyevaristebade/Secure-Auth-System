import { prisma } from '../config';

export const updateLoginAt = async (userId: string) => {
    await prisma.user.update({
        where: { id: userId },
        data: { loginAt: new Date() },
    });
};
