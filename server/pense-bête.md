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
