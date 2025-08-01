# PENSE BÊTE

## Prisma

### Installer prisma

```code
npm install -D prisma tsx
```

```code
npx prisma init
```

Url de ta bd dans le fichier .env

```code
DATABASE_URL="postgresql://janedoe:mypassword@localhost:5432/mydb?schema=sample"
```

### Génération du client & migration des données

```code
pnpx prisma generate
pnpx prisma migrate dev --name "init"
```

NB: La commande ` prisma migrate dev` exécute automatiquement `prisma generate` pour s'assurer que le client Prisma est à jour avec le dernier schéma.

---

📌 Résumé des conventions Git pour ton projet back-end

| Action               | Convention de nom                       |
| -------------------- | --------------------------------------- |
| Nouvelle feature     | `feat/login`, `feat/refresh-token`      |
| Correction de bug    | `fix/token-expiry`, `fix/typo-register` |
| Tâche de maintenance | `chore/update-deps`, `chore/linting`    |
| Refacto              | `refactor/auth-service`                 |

---

## Quelques fonction utile

`middleware de validation d'un refreshToken`

```ts
const refreshTokenValidation = (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refresh_token;

    // on vérifie le token
    if (!refreshToken) throw new UnauthorizedError('Accès refusé');

    try {
        // on vérifie la validité du token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as DecodedToken;

        // s'il est valide on attache ses information à decoded
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        console.log('Echec du rafrîchissement du Token ', error);
        next(error);
    }
};
```

tests
| Fonction | Test unitaire | Test d’intégration | E2E (avec requêtes API) |
| ----------------- | ------------- | ------------------ | ----------------------- |
| `hashPassword` | ✅ | – | – |
| `registerService` | ✅ | ✅ | ✅ |
| `loginService` | ✅ | ✅ | ✅ |
| `refreshService` | ✅ | ✅ | ✅ |
| `logoutService` | ✅ | ✅ | ✅ |

## liens utile

https://dev.to/claradev32/integration-testing-with-nodejs-370c
