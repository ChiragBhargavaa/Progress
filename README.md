# Progress

Free, open-source client management portal for agencies and freelancers. Track milestones, requirements, design inspiration, and project progress with a calm, client-friendly interface.

## Features

- **Admin portal** — Neon Auth email/password signup (invite code required), create projects, manage milestones and requirements, mark tasks complete, set live site URL, reveal client access codes
- **Client portal** — 8-character access code login, view progress (read-only checkboxes), add milestones and requirements, tech stack preferences, 20 color presets + custom + developer CSS variables, design inspiration links
- **Visual design** — Flat Design Seeds palette, no gradients, responsive layout
- **Stack** — Next.js 16, Neon Postgres, Drizzle ORM, Neon Auth (`@neondatabase/auth`)

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/ChiragBhargavaa/Progress.git
cd Progress
npm install
```

### 2. Neon database and auth

1. Create a [Neon](https://neon.tech) project (or use the Neon MCP `create_project` tool).
2. Enable **Neon Auth** on the project (Console → Auth → Enable, or MCP `provision_neon_auth`).
3. Add `http://localhost:3000` as a trusted origin (MCP `configure_neon_auth` or Console).
4. Copy **DATABASE_URL** (pooled) and **Auth URL** from the Neon Console.

### 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon Postgres connection string |
| `NEON_AUTH_BASE_URL` | Neon Auth URL (ends with `/neondb/auth`) |
| `NEON_AUTH_COOKIE_SECRET` | Min 32 chars (`openssl rand -base64 32`) |
| `ADMIN_INVITE_CODE` | Secret required for admin signup |
| `SESSION_SECRET` | Min 32 chars for client session cookies |
| `ENCRYPTION_KEY` | Min 16 chars for admin password reveal |
| `NEXT_PUBLIC_APP_URL` | App URL (`http://localhost:3000` in dev) |

### 4. Database schema

```bash
npm run db:push
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- **Admin:** Sign up at `/admin/signup` with your invite code, then create a project.
- **Client:** Use the generated 8-character code at **Login as Client**.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the same environment variables in Project Settings → Environment Variables.
4. Add your production URL to Neon Auth trusted origins.
5. Deploy.

You can also use the Vercel MCP `deploy_to_vercel` after linking the project.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:push` | Push Drizzle schema to Neon |

## License

License TBD — see repository for updates.

## Contributing

Contributions welcome. Please open an issue before large changes.
