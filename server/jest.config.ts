export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'], // Pour aller chercher tous les tests dans ton dossier tests/
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': 'ts-jest', // Transpile les .ts
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // Si tu utilises des alias @ pour src/
    },
};
