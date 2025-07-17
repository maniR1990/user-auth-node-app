# User Authentication Service

This repository contains a small Node.js API for user registration and login. It is built with **Express**, **TypeScript**, and **Prisma** and uses **Redis** for sessions and caching.

## Requirements

- Node.js v10.15.3 or later
- PostgreSQL database
- Redis server
- Yarn or npm

## Setup

1. Install dependencies
   ```bash
   yarn
   ```
2. Configure environment variables in a `.env` file:
   - `DATABASE_URL` – connection string for PostgreSQL
   - `REDIS_URL` – Redis connection URL
   - `SESSION_SECRET` – secret used to sign the session cookie
   - `JWT_SECRET` – secret used to sign JWT tokens
   - `PORT` (optional) – server port (defaults to `4000`)
3. Run database migrations
   ```bash
   npx prisma migrate deploy
   ```
4. Start the application
   ```bash
   yarn start
   ```

For a production build, run `yarn build` followed by `yarn start-prod`.

## API

Base URL: `/api`

| Method & Endpoint | Body (JSON) | Response | Notes |
| ---------------------------- | ----------------------------------------------- | ---------------------------------------------------- | ----- |
| `POST /register` | `{ email, password, fullName, bio?, profilePictureUrl?, preferredLanguage? }` | `201 { user }` | Creates a user and profile |
| `POST /login` | `{ email, password }` | `{ token, user }` | Stores a session and returns a JWT token |
| `GET /test` | – | `"User routes working"` | Simple health route |
| `GET /me` | – | `{ message, user }` | Requires a session cookie |
| `GET /allUserDetails` | – | `[{ id, email, profile?, ... }]` | Requires `Authorization: Bearer <token>` header. Results are cached for 5 minutes |

## Implementation

### Login Technique

When a user logs in, credentials are checked against the database. If valid, a session is created using [`express-session`](https://github.com/expressjs/session) with a Redis store. A JWT token is also issued for token-protected routes. Sessions live in Redis as defined in [`sessionMiddleWare.ts`](src/lib/middle-ware/sessionMiddleWare.ts) and JWT verification is handled in [`authMiddleWare.ts`](src/lib/middle-ware/authMiddleWare.ts).

### Caching

The endpoint to fetch all registered users caches the result in Redis for 5 minutes. Subsequent requests are served directly from Redis if available. See [`getAllregisteredUserController`](src/controller/user.controller.ts) for implementation details.

### Other Utilities

- **Prisma** handles all database access ([`prisma.ts`](src/lib/db/prisma.ts)).
- **Bcrypt** is used to hash passwords before storing them.
- **Zod** validates request payloads.
- TypeScript is compiled to JavaScript via `tsc`.

## Development Commands

```bash
# Start development server with nodemon
yarn start

# Build compiled version
yarn build

# Start compiled app using pm2
yarn start-prod

# Stop pm2 instance
yarn stop-prod -- <id>
```

Feel free to modify the Prisma schema and run `npx prisma migrate dev` to create migrations during development.
