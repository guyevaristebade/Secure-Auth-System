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
npx prisma generate
npx prisma migrate dev --name "init"
```

NB: La commande ` prisma migrate dev` exécute automatiquement `prisma generate` pour s'assurer que le client Prisma est à jour avec le dernier schéma.

---
