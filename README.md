# RouteX

RouteX is a workbench for building, sending and organizing REST and WebSocket requests. Read a response's status, timing and body at a glance, keep requests in collections, and share a workspace with your team through an invite link.

## Features

- **REST requests.** Choose a method (GET, POST, PUT, PATCH, DELETE), set query parameters, headers and a JSON or plain-text body, and send. The status, timing and size sit above the response body.
- **Layout.** The response opens side by side with the request by default. Flip to stacked from the layout control.
- **WebSocket.** Connect to a `ws://` or `wss://` endpoint, send JSON or text, and follow the message log. Sent and received messages are marked by direction. Connections reconnect automatically after a dropped connection.
- **Collections and workspaces.** Save requests into named collections inside a workspace. Rename, filter and delete from the sidebar, or with right-click.
- **Autosave.** Parameter, header and body edits save as you type. Unsaved requests show a dot until you save them.
- **Command palette (⌘K / Ctrl+K).** Search requests across the workspace, run commands and switch workspaces.
- **Team invites.** Generate an invite link from the top bar. Expired or used links explain what went wrong.
- **AI assist.** Suggest a name for a request, or generate a JSON body from a plain-language description. Generated JSON replaces the current body.
- **Light and dark themes**, and a responsive layout that works on phones.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | Open the command palette |
| `⌘↵` / `Ctrl+Enter` | Send the current request |
| `⌘S` / `Ctrl+S` | Save the request to a collection (updates it if already saved) |
| `⌘G` / `Ctrl+G` | New request tab |
| `↑` / `↓` in the WebSocket log | Move between messages |

## Tech stack

- **Framework:** Next.js 15 (App Router, Turbopack), React 19, TypeScript
- **UI:** Tailwind CSS 4, shadcn/ui components on Radix primitives, Lucide icons, IBM Plex fonts
- **Editors:** Monaco (request bodies and responses)
- **State and data:** Zustand (request tabs, WebSocket connection), TanStack Query (server data), React Hook Form and Zod (forms)
- **Backend:** Next.js server actions and route handlers, Prisma 6 with PostgreSQL
- **Auth:** better-auth with GitHub OAuth
- **AI:** Vercel AI SDK with Google Gemini

## Getting started

### Requirements

- Node.js 20 or newer
- A PostgreSQL database (a local one via Docker, or a hosted instance)
- A GitHub OAuth app, and optionally a Google OAuth app
- A Google AI API key, only if you want the AI features

### 1. Install

```bash
git clone https://github.com/kartikey2004-git/routeX.git
cd routeX
npm install        # also runs `prisma generate`
```

### 2. Configure environment variables

Create a `.env` file in the project root. Git ignores it. Do not commit real values.

| Variable | Used for |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string, for example `postgresql://user:password@localhost:5432/routex` |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Local database created by `docker compose` |
| `BETTER_AUTH_SECRET` | Secret used to sign sessions. Generate a long random string |
| `BETTER_AUTH_URL` | Public base URL of the app, for example `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Same public base URL, used to build invite links |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth app (required for sign-in) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth app (required by the environment schema) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI key for the AI features |

The app validates its OAuth and AI variables at startup, so every one of them must be set, even if you don't use that feature.

### 3. Set up the database

Use either your own PostgreSQL instance, or the bundled Docker one:

```bash
# Optional: local PostgreSQL 16 on port 5432.
# Needs POSTGRES_PASSWORD in your .env.
docker compose up -d

npx prisma migrate dev    # apply the schema
```

### 4. Configure GitHub sign-in

In your GitHub OAuth app, set the authorization callback URL:

- **Development:** `http://localhost:3000/api/auth/callback/github`
- **Production:** `https://YOUR-DOMAIN/api/auth/callback/github`

For production, also set `BETTER_AUTH_URL` to your domain, and add your production origin to `trustedOrigins` in `src/lib/auth.ts`. It currently lists only `http://localhost:3000`.

### 5. Run

```bash
npm run dev        # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server (Turbopack) |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check the project |

## Routes

| Path | Who sees it | Purpose |
| --- | --- | --- |
| `/` | Everyone (signed-in users are redirected to `/app`) | Public landing page |
| `/sign-in` | Everyone (signed-in users are redirected to their destination) | GitHub sign-in. Accepts `?callbackUrl=` for same-site paths only |
| `/app` | Signed in | REST workbench |
| `/realtime` | Signed in | WebSocket client |
| `/invite/[token]` | Signed in | Accept a workspace invite |

Signed-out visitors to `/app` or `/realtime` go to `/sign-in` and return to the page they asked for after signing in.

## Project structure

```
src/
  app/                    Routes: marketing (/), auth (/sign-in), workspace (/app, /realtime), invite, API
    api/ai/               AI route handlers (JSON body generation, name suggestions)
    api/auth/             better-auth handler
  components/
    ui/                   shadcn/ui primitives
    shared/               App-wide building blocks: states, confirm dialog, hint, skeleton
  modules/                Feature modules
    authentication/       User menu, GitHub sign-in button
    collection/           Collections sidebar, tree, create/rename/delete dialogs
    request/              Request bar, tabs, key-value editor, body editor, response viewer, store
    realtime/             WebSocket hook (connect, reconnect, log) and its components
    landing/              Marketing page sections and copy
    layout/               Top bar, command palette, workspace switcher, invite popover
    workspace/, invites/, ai/   Server actions and hooks for those features
  lib/                    auth, db (Prisma client), env validation, utilities
  middleware.ts           Session gate for /app and /realtime
prisma/                   Schema and migrations
```

## Data and security notes

- Requests, collections and workspaces are stored in PostgreSQL through Prisma.
- Tab state (open requests, unsaved edits) lives in the browser session and is not saved until you save a request.
- The middleware only checks that a session cookie exists. Pages validate the session on the server.
- Redirects after sign-in accept same-site relative paths only.

## Known limitations

- Disabled key-value rows are not kept when you leave a request tab.
- AI features depend on the availability of the configured Google model. Requests time out after 30 seconds.
- The WebSocket client does not persist message history between sessions.

## License

No license has been chosen yet. Add one before accepting outside contributions.
