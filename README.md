#  RouteX

RouteX is a collaborative platform for managing workspaces, API collections, and request execution history, built as a monolithic Next.js App Router application with a Prisma + PostgreSQL backend and server-backed authentication.

The project is designed to support multi-user collaboration, structured API request management, and extensible real-time and AI-assisted features.

## Tech Stack

|      Layer | Tools Used                                                     |
| ---------: | -------------------------------------------------------------- |
|   Frontend | Next.js (App Router), React 19, TypeScript                     |
|    Backend | Next.js API routes (server in same repo)                       |
|   Database | Prisma (PostgreSQL)                                            |
|       Auth | better-auth (server + client), OAuth (GitHub, Google)          |
|    Styling | Tailwind CSS                                                   |
| Build Tool | Next.js (Turbopack via npm scripts)                            |
|  Utilities | Zod, @t3-oss/env-nextjs, @tanstack/react-query, @prisma/client |

---

## Key Features

- **Server-backed Authentication** – Provides session and account models stored in the database, with server-side auth handlers and a client auth helper.

- **Prisma Schema & Migrations** – Typed database models, migrations folder, and generated Prisma Client used by server code.

- **Workspaces & Memberships** – Workspace model with members, invites, and role enums to support multi-user collaboration.
- **Collections, Requests & Request Runs** – Modelled API request collections and runs (requests stored and request-run history recorded).

- **Client Data Layer with React Query** – Client-side caching and mutations for workspace/collection/invite flows.
- **Invite Links & Public URL Usage** – Invite URLs are constructed using a public URL env var for email/links.
- **Realtime Helpers** – Lightweight WebSocket helper and realtime UI components for collaboration features.

---

## Architecture Overview

- Monolithic Next.js application using the App Router: frontend pages and server API routes coexist in the same repo under `src/app`.

- Frontend responsibilities: UI components, React hooks, and client-side data fetching (React Query). Key folders: `src/app`, `src/components`, `src/modules`

<br/>

- Backend responsibilities: API endpoints, auth handlers, and direct DB access via Prisma Client. Key files: `src/app/api/*`, `src/lib/db.ts`, `src/lib/auth.ts`.
- Data flow: client requests → Next.js API route → server handler → Prisma Client → database; responses returned to client and cached via React Query.

<br/>

- Auth flow: OAuth provider credentials (GitHub/Google) configured via server env vars; `better-auth` provides server-side handlers (`src/app/api/auth/[...all]/route.ts`) and a client helper (`src/lib/auth-client.ts`).

---

## Configuration & Environment Variables

Only variables referenced in code are listed here.

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
GOOGLE_GENERATIVE_AI_API_KEY=xxxx
```

- `DATABASE_URL` — Postgres connection string used by Prisma/generator and server runtime (`prisma/schema.prisma`, `prisma` commands).

  - Layer: Backend / database

- `NEXT_PUBLIC_APP_URL` — Public base URL used to build invite links and as auth-client base URL (`src/modules/invites/actions`, `src/lib/auth-client.ts`).

  - Layer: Frontend & backend (public-facing URL)

- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` — GitHub OAuth credentials expected by server auth setup (`src/lib/env.ts`, `src/lib/auth.ts`).

  - Layer: Backend (auth)

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth credentials expected by server auth setup (`src/lib/env.ts`).

  - Layer: Backend (auth)

- `GOOGLE_GENERATIVE_AI_API_KEY` — API key referenced in `src/lib/env.ts` for AI-related features under `src/modules/ai`.
  - Layer: Backend (AI integrations)

---

## Getting Started Locally

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/routex.git
cd routex
npm install
```

Generate Prisma client and run migrations (development):

```bash
npx prisma generate
npx prisma migrate dev
```

Run development server:

```bash
npm run dev
```

Build and start production:

```bash
npm run build
npm start
```

Notes:

- `npm run postinstall` runs `prisma generate` as defined in `package.json`.

---

## Folder Structure (focused)

```
routex
├── prisma                # Prisma schema & migrations
├── src
│   ├── app               # Next.js App Router pages & API routes
│   │   └── api
│   ├── components        # UI primitives & providers (query-provider, ui/)
│   ├── lib               # db.ts, auth.ts, auth-client.ts, env.ts
│   └── modules           # feature modules: authentication, workspace, invites, collection, request, realtime, ai
└── package.json
```

---
