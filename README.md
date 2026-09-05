# Private Vault

The Next.js experience contains its backend through App Router route handlers. The browser never contains the password or a password comparison. MongoDB stores an Argon2id hash and hashed session tokens only.

## Local setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `SESSION_SECRET`.
2. Install dependencies with `npm install`.
3. Provision the access password without putting it in source control:

```bash
npm run provision:access
```

4. Run Next.js with `npm run dev`.

The API exposes public `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/auth/session` route handlers. The private story is served at `/vault`, which validates the HTTP-only session before rendering; `/api/story` is the initial protected resource boundary for later Mongo-backed media.

Never commit `.env`, password material, cookies, or session secrets.
