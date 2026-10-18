# LedgerFlow — Small Business Accounting (Version 1)

A full-stack accounting web application for small businesses and freelancers built with Next.js, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and NextAuth.js.

## What's in Version 1

- **Project setup** with Next.js 14 App Router, TypeScript, Tailwind CSS, and Prisma.
- **PostgreSQL schema** for users, companies, income, expenses, categories, and attachments.
- **Authentication** with email/password registration, login, logout, and protected pages.
- **Responsive app shell** with sidebar navigation, mobile bottom nav, and a dashboard placeholder.
- **Unit tests** with Vitest and **E2E tests** with Playwright covering auth flows.

## Tech stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth.js v5 (Auth.js) with Credentials provider
- bcryptjs for password hashing
- Zod for server-side validation
- Vitest + Testing Library for unit tests
- Playwright for E2E tests

## Getting started

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Strong random secret for signing sessions |
| `NEXTAUTH_URL` | Public base URL, e.g. `http://localhost:3000` |

In the preview environment, add these in the workspace **Secrets** panel.

### 2. Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically via the `postinstall` script.

### 3. Apply database migrations

The initial schema migration is included in the project. Apply it with:

```bash
npm run db:migrate
```

> In the preview environment the migration is applied through the Database panel; no manual migration command is required there.

### 4. Seed demo data (optional)

```bash
# Windows PowerShell
$env:DEMO_USER_PASSWORD = "YourDemoPassword123"
npm run db:seed

# macOS / Linux
DEMO_USER_PASSWORD=YourDemoPassword123 npm run db:seed
```

This creates a demo user `demo@example.com` with the password you provide.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run db:migrate` | Run Prisma Migrate |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:seed` | Seed the database with demo data |
| `npm run db:studio` | Open Prisma Studio |

## Project structure

```
.
├── e2e/                    Playwright E2E tests
├── prisma/
│   ├── schema.prisma       Database schema
│   └── seed.ts             Demo data seed script
├── src/
│   ├── app/                Next.js App Router pages
│   │   ├── (app)/          Authenticated app shell
│   │   ├── api/auth/       NextAuth + custom register API
│   │   ├── login/
│   │   ├── register/
│   │   └── page.tsx        Landing redirect
│   ├── auth.ts             NextAuth.js configuration
│   ├── components/         React components
│   ├── lib/                Utilities (prisma, password, zod, utils)
│   ├── middleware.ts       Route protection
│   └── types/              TypeScript declarations
├── tests/                  Vitest config
├── .env.example
├── package.json
├── playwright.config.ts
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Authentication

- Registration is handled by `POST /api/auth/register` with Zod validation and bcrypt hashing.
- Login/logout/session management is handled by NextAuth.js with the Credentials provider and JWT sessions stored in httpOnly cookies.
- Unauthenticated users are redirected to `/login` by the middleware.
- Authenticated users are redirected away from `/login` and `/register`.

## Testing

Run unit tests:

```bash
npm run test
```

Run E2E tests (starts the dev server automatically):

```bash
npm run test:e2e
```

## Windows setup notes

- Use PowerShell or Git Bash to run the commands above.
- When setting environment variables inline in PowerShell, use `$env:VAR_NAME = "value"`.
- Ensure Node.js 18+ is installed.

## Deployment

This app is designed to deploy to Vercel:

1. Connect your Git repository to Vercel.
2. Add `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` to the Vercel Environment Variables.
3. Set the build command to `npm run build`.
4. For file uploads in production, configure Vercel Blob or an S3-compatible storage service and update the attachment upload logic in a later phase.

## Troubleshooting

- **Prisma Client is outdated**: Run `npm run db:generate`.
- **Database connection errors**: Verify `DATABASE_URL` is set and the database is reachable.
- **NextAuth session errors**: Verify `NEXTAUTH_SECRET` is set to a strong random value.

## Roadmap

- Phase 1 — Project setup and authentication ✅
- Phase 2 — Company profile
- Phase 3 — Income and expense management
- Phase 4 — Dashboard and reporting
- Phase 5 — Testing, documentation, and deployment
