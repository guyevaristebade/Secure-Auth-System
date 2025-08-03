import request from 'supertest';
import app from '../../app';
import { prisma } from '../../config/';
import { response } from 'express';

describe('e2e testing', () => {
    afterEach(async () => {
        await prisma.user.deleteMany();
        await prisma.$disconnect();
    });

    let email = '';
    beforeEach(() => {
        email = `testuser_${Date.now()}@gmail.com`;
    });

    it('Un utilisateur s’inscrit, se connecte, et accède à ses informations', async () => {
        const registerRes = await request(app)
            .post('/api/auth/register')
            .send({ email, name: 'Jean', password: 'user1234.' });
        expect(registerRes.ok).toBeTruthy();
        expect(registerRes.status).toBe(201);

        const loginRes = await request(app).post('/api/auth/login').send({ email, password: 'user1234.' });
        expect(loginRes.ok).toBeTruthy();
        expect(loginRes.status).toBe(201);
        expect(loginRes.body.data).toHaveProperty('accessToken');

        const accessToken = loginRes.body.data.accessToken;

        const meRes = await request(app).get('/api/user/me').set('Authorization', `Bearer ${accessToken}`);

        console.log(meRes.body);
    });
});
