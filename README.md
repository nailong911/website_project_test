# Ultra Portfolio - Prisma backend (SQLite)

This backend uses Prisma + SQLite and is preconfigured to work with the front-end you have.
Follow these steps to run locally (Node+npm already required):

1. Install dependencies:
   ```bash
   cd backend_prisma
   npm install
   ```

2. Generate Prisma client and create database + run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
   This will create `prisma/dev.db` (SQLite) and apply schema.

3. Start server:
   ```bash
   npm start
   ```

4. Test:
   - API root: http://localhost:3000/api/test
   - Register: POST http://localhost:3000/api/auth/register
     body: { "username":"you", "email":"you@example.com", "password":"pwd" }

Notes:
- JWT secret can be set via env `JWT_SECRET`
- Uploaded files are saved under `uploads/`
- If you want to keep the DB in repo, copy `prisma/dev.db` after migrate
