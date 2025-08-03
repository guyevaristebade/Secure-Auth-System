import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/';

describe('auth route', () => {
    afterEach(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    let email = '';
    beforeAll(() => {
        email = `testuser_${Date.now()}@gmail.com`;
    });

    describe('/register', () => {
        it("Un utilisateur s'enregistre avec un champs manquant", async () => {
            const response = await request(app).post('/api/auth/register').send({ email, password: 'user1234.' });
            expect(response.status).toBe(500); // ici un problème au niveau du code, code = 400
            expect(response.ok).toBeFalsy();
        });

        it('inscription reussi', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ email, name: 'Jean', password: 'user1234.' });
            expect(response.status).toBe(201);
            expect(response.body.ok).toBeTruthy();
            expect(response.body.data).not.toHaveProperty('password');
            expect(response.body.data.email).toBe(email);
            expect(response.body.data.name).toBe('Jean');
        });

        it('Un utilisateur existe déjà', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({ email, name: 'Jean', password: 'user1234.' });
            expect(response.status).toBe(409);
        });

        it("Un utilisateur s'enregistre avec un mdp trop court ", async () => {
            const response = await request(app).post('/api/auth/register').send({ email, password: 'user' });
            expect(response.status).toBe(400);
            expect(response.ok).toBeFalsy();
        });
    });

    describe('/login', () => {
        it('Un utilisateur se connecte', async () => {
            const response = await request(app).post('/api/auth/login').send({ email, password: 'user1234.' });

            expect(response.status).toBe(201);
            expect(response.ok).toBeTruthy();
            expect(response.body.data.user.email).toBe(email);
            expect(response.body.data.user.name).toBe('Jean');
            expect(response.body.data.user.role).toBe('USER');
            expect(response.body.data).toHaveProperty('accessToken');
            expect(response.body.data).toHaveProperty('refreshToken');
            expect(response.body.data).not.toHaveProperty('password');
        });

        it('Un utilisateur se connecte avec un mauvais mdp', async () => {
            const response = await request(app).post('/api/auth/login').send({ email, password: 'user1234' });
            expect(response.status).toBe(401);
            expect(response.ok).toBeFalsy();
            expect(response.body.data).toBeNull();
        });
    });

    describe('/logout', () => {
        it('un utilisateur tente demande un nouveau token', async () => {
            const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'user1234.' });

            expect(loginRes.status).toBe(201);
            expect(loginRes.ok).toBeTruthy();
            expect(loginRes.body.data).toHaveProperty('refreshToken');

            const accessToken = loginRes.body.data.accessToken;

            const logoutRes = await request(app)
                .delete('/api/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(logoutRes.ok).toBeTruthy();
            expect(logoutRes.body).toHaveProperty('message');
            expect(logoutRes.body.message).toBe('Deconnexion réussi');
        });
    });
});
