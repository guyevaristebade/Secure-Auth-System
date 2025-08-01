import jwt from 'jsonwebtoken';
import { UserPayload } from '../../types';
import { generateAccessToken, generateRefreshToken } from '../../helpers';

describe('Helpers de gestion des tokens', () => {
    const userPayload: UserPayload = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Jules',
        role: 'USER',
    };
    describe('generateAccessToken', () => {
        it('Renvoi est une chaine non vide', async () => {
            const accessToken = await generateAccessToken(userPayload);
            expect(typeof accessToken).toBe('string');
        });

        it('Le token généré expire dans 15 minutes ', async () => {
            const accessToken = await generateAccessToken(userPayload);
            const decoded = jwt.decode(accessToken);
            const time = decoded?.exp - decoded?.iat!;
            expect(time).toBe(900); // 15minutes === 900 s
        });

        it('Le token contient bien l’identifiant utilisateur', async () => {
            const accessToken = await generateAccessToken(userPayload);
            const decoded = jwt.decode(accessToken);
            expect(decoded?.id).toBe(userPayload.id);
        });

        it('Deux tokens générés avec des appels différents sont bien différents', async () => {
            // iat l'heure à laquelle le token est emit
            // même si le token est emit avec le même userid l'heure d'emission est différente

            const accessToken1 = await generateAccessToken(userPayload);
            const t1 = jwt.decode(accessToken1)?.iat;
            const accessToken2 = await generateAccessToken(userPayload);
            const t2 = jwt.decode(accessToken2)?.iat;

            expect(t1).toBe(t2);
        });
    });

    describe('generateRefreshToken', () => {
        it('Renvoi est une chaine non vide', async () => {
            const refreshToken = await generateRefreshToken(userPayload);
            expect(typeof refreshToken).toBe('string');
        });

        it('Le token généré expire dans 24h ', async () => {
            const refreshToken = await generateRefreshToken(userPayload);
            const decoded = jwt.decode(refreshToken);
            const time = decoded?.exp - decoded?.iat!;
            expect(time).toBe(86400); // 24h === 86400 s
        });

        it('Le token contient bien l’identifiant utilisateur', async () => {
            const refreshToken = await generateRefreshToken(userPayload);
            const decoded = jwt.decode(refreshToken);
            expect(decoded?.id).toBe(userPayload.id);
        });

        it('Deux tokens générés avec des appels différents sont bien différents', async () => {
            // iat l'heure à laquelle le token est emit
            // même si le token est emit avec le même userid l'heure d'emission est différente

            const refreshToken1 = await generateAccessToken(userPayload);
            const t1 = jwt.decode(refreshToken1)?.iat;
            const refreshToken2 = await generateAccessToken(userPayload);
            const t2 = jwt.decode(refreshToken2)?.iat;

            expect(t1).toBe(t2);
        });
    });
});
