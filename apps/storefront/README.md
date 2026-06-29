# Sellio Storefront

**Standalone — no monorepo required.**

This Next.js app is fully self-contained. All shared types and the API client are inlined directly under `src/`:

| Path | Purpose |
|------|---------|
| `src/types/index.ts` | All TypeScript interfaces shared across the storefront |
| `src/lib/api-client.ts` | `SellioAPI` class and `api` singleton for backend calls |

To install and build independently (e.g. on shared hosting or a VPS):

```bash
npm install
npm run build
npm run start      # production server
# or: npm run dev  # development with Turbopack
```

No `packages/` directory, no workspace tools (pnpm/yarn workspaces), and no additional monorepo siblings are required.

**Monorepo note:** When working inside the full Sellio monorepo at `repo/apps/storefront/`, the same standalone setup applies — the `packages/api-client` and `packages/types` directories are no longer referenced by the storefront. They remain in the monorepo as a historical artifact and may be used by other tooling, but the storefront does not depend on them.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
