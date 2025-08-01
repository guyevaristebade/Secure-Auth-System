# Secure-Auth-System

## 1. Présentation du projet

Nom du projet : `Système d'authentification avec refresh token rotation et gestion de rôle`

### Objectif du projet :

Ce projet fournit une API d'authentification basé sur refresh token rotation avec la gestion des rôle (admin, user, etc...), écris avec Typescript et Express

### Stack technique

[![Express](https://img.shields.io/badge/Express.js-000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Zod](https://img.shields.io/badge/Zod-3A7AFE?logo=zod&logoColor=white)](https://zod.dev/)
[![Bcrypt](https://img.shields.io/badge/Bcrypt-1A237E?logo=bcrypt&logoColor=white)](https://github.com/kelektiv/node.bcrypt.js)
[![HTTPOnly Cookie](https://img.shields.io/badge/Cookie-HTTPOnly-ffca28)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
[![JestT](https://img.shields.io/badge/Jest-000000?logo=Jest&logoColor=white)](https://jwt.io/)

### Fonctionnalités

- Authentification (register/login/logout)

- Rotation de refresh token

- Gestion des rôles

- Middleware de validation Zod

- Tests à venir

## 2. Installation

```bash
git clone https://github.com/guyevaristebade/Secure-Auth-System.git
cd Secure-Auth-System
npm install
cp .env.example .env
npm run dev
```

## 3. Variables d’environnement (.env)

PORT=

DATABASE_URL=

ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

NODE_ENV=

CORS_ORIGIN=

## 4. Structure du projet

```pgsql
src/
├── config/
├── controllers/
├── middlewares/
├── routes/
├── schemas/
├── services/
├── types/
├── helpers/
└── server.ts
└── app.ts
```

## 5. Endpoints API

| Méthode | Route                     | Auth ? | Rôle requis | Description             |
| ------- | ------------------------- | ------ | ----------- | ----------------------- |
| POST    | `/api/auth/register`      | ❌     | -           | Inscription             |
| POST    | `/api/auth/login`         | ❌     | -           | Connexion               |
| GET     | `/api/auth/refresh-token` | ✅     | -           | Génère un nouveau token |
| DELETE  | `/api/auth/logout`        | ✅     | -           | Déconnexion             |
| GET     | `/api/user/me`            |        | -           | user information        |

## 6. Middlewares

- authenticatedUser: vérifie le JWT Access Token pour savoir si l'utilisateur est connecté

- refreshTokenValidation: vérifie validité du refresh_token

- validation(schema): valide les données avec Zod

- checkRole('ADMIN'): protège des routes par rôle
