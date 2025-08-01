import { hashPassword, comparePassword } from '../../helpers';

describe('Helpers de gestion des mots de passe (hash & compare)', () => {
    const password = 'mySecurePassword';

    describe('hashPassword', () => {
        it("hashage d'un password", async () => {
            const hashedPassword = await hashPassword(password);
            expect(hashedPassword).not.toBe(password);
        });

        it('Renvoi est une chaine non vide', async () => {
            const hashedPassword = await hashPassword(password);
            expect(typeof hashedPassword).toBe('string'); // pour comparer le type
        });
    });

    describe('ComparePassword', () => {
        it('retourne false si le mot de passe est valide', async () => {
            const hashedPassword = await hashPassword(password);
            const isValidPassword = await comparePassword(password, hashedPassword);
            expect(isValidPassword).toBeTruthy();
        });

        it('retourne false si le mot de passe est invalide', async () => {
            const hashedPassword = await hashPassword(password);
            const isValidPassword = await comparePassword('wrongPassword', hashedPassword);
            expect(isValidPassword).toBeFalsy();
        });
    });
});
