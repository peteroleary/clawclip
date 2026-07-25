# Deployment Procedures

> Guidelines for taking ClawClip from local development to production.

## 1. Environment Topology

| Environment | Purpose | Target Platform |
|-------------|---------|-----------------|
| **Local** | Development | `localhost:3000` (Next.js) / `localhost:5173` (Vite) |
| **Preview** | PR Branches | Vercel / Firebase Hosting Preview Channels |
| **Production** | Live System | Vercel (Frontend) / Firebase (Backend) |

## 2. CI/CD Pipeline

- **Trigger**: Push to `main`.
- **Steps**:
  1. `pnpm typecheck` (TypeScript validation).
  2. `pnpm lint` (ESLint standards).
  3. UI Build step (`next build` or `vite build`).
  4. Deployment to Firebase App Hosting / Vercel.

## 3. Serverless Considerations
*(Applying `nodejs-best-practices`)*

- **Cold Starts**: API endpoints should minimize heavy synchronous initialization at the top-level to keep serverless cold starts under 500ms.
- **Environment Variables**: Managed securely via provider dashboards (e.g. `.env.local` for local dev). Do not commit secrets.
