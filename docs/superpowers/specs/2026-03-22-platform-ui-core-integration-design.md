# holyship-ui Platform-UI-Core Integration

**Date:** 2026-03-22
**Status:** Draft
**Scope:** holyship-ui (~/holyship-ui), consuming @wopr-network/platform-ui-core

## Problem

holyship-ui is a standalone Next.js 16 app with 4 pages, no auth, no billing, no settings. It uses Bearer token auth (`DEFCON_ADMIN_TOKEN`) and has zero user-facing account management. Meanwhile, the holyship backend already has the full platform-core stack wired: better-auth (GitHub OAuth), credit ledger, gateway metering, billing tRPC, settings tRPC, org/tenant support. The UI just doesn't expose any of it.

## Approach: Option A — Cherry-Pick Integration

holyship-ui is NOT a thin shell (unlike wopr/paperclip/nemoclaw) because holyship's product model is fundamentally different. Fleet-based products manage persistent bot instances. Holy Ship manages issues with ephemeral workers. Fleet management, instances, channels, bot settings, plugin marketplace — none of these apply.

holyship-ui owns its routing and layout. It imports specific pages and components from platform-ui-core that apply to the issue-driven model.

## What Gets Imported from platform-ui-core

### Auth (GitHub OAuth only)

- **Login page** — GitHub OAuth button only. No email/password forms. No signup form (GitHub OAuth auto-creates on first login).
- **OAuth callback** — `auth/callback/[provider]/page.tsx`
- **Org invite** — `(auth)/invite/[token]/page.tsx` — accept org invitation

Skipped: forgot-password, reset-password, signup, email verify (no email auth).

### Billing (6 pages)

- **Credits** — `billing/credits/page.tsx` — credit balance, purchase history
- **Payment** — `billing/payment/page.tsx` — payment methods, crypto checkout (new dynamic billing with icons, partial payments, confirmations)
- **Plans** — `billing/plans/page.tsx` — subscription tiers
- **Usage** — `billing/usage/page.tsx` — metered usage breakdown (tokens consumed per entity/worker)
- **Hosted usage** — `billing/usage/hosted/page.tsx` — hosted inference costs
- **Referrals** — `billing/referrals/page.tsx` — referral program

### Settings (10 pages)

- **Account** — `settings/account/page.tsx`
- **Profile** — `settings/profile/page.tsx`
- **API keys** — `settings/api-keys/page.tsx` — gateway service keys for programmatic access
- **Notifications** — `settings/notifications/page.tsx`
- **Security** — `settings/security/page.tsx`
- **Org** — `settings/org/page.tsx` — org management, member invites
- **Activity** — `settings/activity/page.tsx`
- **Providers** — `settings/providers/page.tsx` — BYOK provider keys
- **Secrets** — `settings/secrets/page.tsx`
- **Brain** — `settings/brain/page.tsx` — AI personality/config

### Admin (selected pages, admin role only)

- **Tenants** — `admin/tenants/page.tsx`
- **Payment methods** — `admin/payment-methods/page.tsx` — chain management, icon URLs
- **Promotions** — `admin/promotions/` — coupon management
- **Billing health** — `admin/billing-health/page.tsx`
- **Accounting** — `admin/accounting/page.tsx`
- **Audit** — `admin/audit/page.tsx`
- **Affiliates** — `admin/affiliates/page.tsx`

Skipped: fleet-updates, gpu, inference, marketplace, migrations, onboarding, incidents, email-templates, roles, compliance (fleet/product-specific).

### Components

- **sidebar.tsx** — adapted for holyship navigation sections
- **account-switcher.tsx** — org/tenant switching
- **theme-provider.tsx** — dark mode first
- **All shadcn/ui primitives** — platform-ui-core's `components/ui/` directory
- **billing/** — all billing components (buy-credits-panel, buy-crypto-credits-panel, org-billing-page, etc.)
- **settings/** — settings components
- **auth/** — OAuth buttons, auth forms
- **pricing/** — pricing cards
- **status-badge.tsx** — status indicators
- **observability/** — metrics components (for usage dashboards)

### Lib

- **api.ts** — `apiFetch`, `getSupportedPaymentMethods`, `createCheckout`, `getChargeStatus`, all API functions
- **api-config.ts** — `API_BASE_URL` from env
- **brand-config.ts** — brand customization via `NEXT_PUBLIC_BRAND_*` env vars
- **trpc.ts** — tRPC client. Requires `TRPCProvider` wrapper in root or dashboard layout for all tRPC-backed pages to work.
- **auth.ts** — better-auth client config
- **utils.ts** — `cn()` and shared utilities
- **errors.ts** — error hierarchy (AppError, ApiError, etc.)
- **tenant-context.tsx** — tenant ID management via HttpOnly cookie

## What Stays holyship-specific

### Pipeline Board (`/pipeline`)
Entity state columns, entity cards. The core holyship workflow view — issues flowing through states as workers claim and process them.

### Radar (`/radar`)
Worker slot grid, event log, sources panel, worker list. Real-time view of ephemeral workers claiming and processing entities.

### Entity Detail (`/entity/[id]`)
Activity feed, artifacts panel, entity timeline. Deep view into a single issue's processing history. Moves under `(dashboard)` route group to get the sidebar layout.

### API Proxy Routes
- `api/defcon/[...path]` — proxy to holyship backend (entity/pipeline operations)
- `api/radar/[...path]` — proxy to radar (worker monitoring)
- `api/sources` — source configuration

These use `DEFCON_ADMIN_TOKEN` for server-side auth (not user-facing).

### holyship-specific Libs
- `defcon-client.ts` — holyship backend REST client
- `defcon-ws.ts` — WebSocket for real-time updates
- `radar-client.ts` — radar REST client
- `entity-provisioner.ts` — git worktree provisioning
- `sources/` — cron scheduling, source config

## What Gets Skipped

| platform-ui-core page | Why skipped |
|----------------------|-------------|
| Fleet management | No persistent fleet — holyship uses ephemeral workers |
| Instances | No persistent instances — workers are ephemeral |
| Channels | No channels — holyship works via issues/entities |
| Bot settings | No bots — holyship has flows, not bots |
| Plugin marketplace | No plugins in the traditional sense — holyship has flows |
| Onboarding wizard | Different onboarding flow (repo interrogation, flow design) |
| Chat | No chat interface — holyship is issue-driven |
| Changesets | No changesets — holyship entities are different |
| Dashboard (fleet) | Different dashboard — pipeline/radar is the home view |
| Network page | No P2P network — centralized architecture |
| Rate overrides (admin) | Fleet-specific rate limiting — not applicable |

## Auth Architecture

### Current state
holyship-ui uses `DEFCON_ADMIN_TOKEN` (Bearer header) for all server-side API calls. No user-facing auth. No sessions.

### Target state
- **User auth:** better-auth with GitHub OAuth (already wired in holyship backend via platform-core)
- **Session:** HttpOnly cookie-based sessions (better-auth standard)
- **Tenant:** org = tenant. GitHub user creates/joins org. `X-Tenant-Id` header on all API calls.
- **Server-side proxies:** Keep `DEFCON_ADMIN_TOKEN` for `api/defcon/` and `api/radar/` proxy routes (these are internal, not user-facing)
- **Middleware:** `src/proxy.ts` — adapted from wopr-platform-ui's `proxy.ts` pattern (Next.js picks it up via `export const config = { matcher }`). Protects `(dashboard)` routes, redirects unauthenticated to `/login`.

### Auth flow
1. User hits holyship-ui → middleware checks session cookie
2. No session → redirect to `/login`
3. User clicks "Sign in with GitHub" → better-auth OAuth flow
4. Callback → session created → redirect to pipeline (home)
5. First login auto-creates user + default org (tenant)
6. Subsequent requests include session cookie → middleware passes through
7. `X-Tenant-Id` set from tenant context (HttpOnly cookie via `/api/tenant` route)

## Layout

### Sidebar sections

```
SHIP (holyship-specific)
  Pipeline        — /pipeline (home)
  Radar           — /radar

BILLING
  Credits         — /billing/credits
  Usage           — /billing/usage
  Payment         — /billing/payment
  Plans           — /billing/plans

SETTINGS
  Account         — /settings/account
  API Keys        — /settings/api-keys
  Org             — /settings/org
  Security        — /settings/security
  Providers       — /settings/providers
  Notifications   — /settings/notifications

ADMIN (admin role only)
  Tenants         — /admin/tenants
  Payment Methods — /admin/payment-methods
  Promotions      — /admin/promotions
  Billing Health  — /admin/billing-health
```

### Home page
Pipeline board is the default authenticated view, not a generic dashboard.

## Brand Config

```env
NEXT_PUBLIC_BRAND_NAME="Holy Ship"
NEXT_PUBLIC_BRAND_DOMAIN="holyship.dev"
NEXT_PUBLIC_BRAND_LOGO="/logo.svg"
NEXT_PUBLIC_BRAND_SUPPORT_EMAIL="support@holyship.dev"
NEXT_PUBLIC_API_URL="https://api.holyship.dev"
```

## Dependencies

### Added to holyship-ui
- `@wopr-network/platform-ui-core@1.18.0` — all shared components, pages, libs
- Transitive: Radix UI, shadcn, framer-motion, better-auth client, recharts, @scure/bip32, @scure/bip39
- Note: holyship-ui's CLAUDE.md lists Radix and framer-motion but they are not in package.json today — they arrive transitively via platform-ui-core

### Tailwind config merge
platform-ui-core expects shadcn CSS variables (colors, radius, etc.). holyship-ui currently has a minimal Tailwind 4 setup. Import platform-ui-core's CSS variables into holyship-ui's global CSS. Components are imported directly from the platform-ui-core package (e.g., `import { BuyCryptoCreditPanel } from "@wopr-network/platform-ui-core/components/billing/buy-crypto-credits-panel"`) — no local copies.

### Required env vars

**Auth (better-auth + GitHub OAuth):**
```env
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=https://holyship.dev
GITHUB_CLIENT_ID=<github-oauth-app-id>
GITHUB_CLIENT_SECRET=<github-oauth-app-secret>
```

**Brand:**
```env
NEXT_PUBLIC_BRAND_NAME="Holy Ship"
NEXT_PUBLIC_BRAND_DOMAIN="holyship.dev"
NEXT_PUBLIC_API_URL="https://api.holyship.dev"
```

**Existing (keep):**
```env
DEFCON_URL=<holyship-backend-url>
DEFCON_ADMIN_TOKEN=<admin-token>
RADAR_URL=<radar-url>
```

## Backend Changes Required

### holyship (backend)
- **Bump platform-core to latest (v1.49.3+)** — get new crypto billing (icons, partial payments, confirmations)
- **Add reconciliation cron** (nice-to-have) — copy pattern from wopr-platform for drift monitoring
- No other backend changes needed — better-auth, billing, gateway, tRPC already wired

## Migration Path

### Phase 1: Dependencies and auth
- Add platform-ui-core dependency
- Set up shadcn CSS variables
- Import auth pages (login, OAuth callback, invite)
- Add middleware for route protection
- Wire brand config env vars

### Phase 2: Layout and billing
- Adopt sidebar layout with holyship-specific sections
- Import all billing pages
- Import crypto checkout panel (with new icons/partial payments)
- Wire tRPC client to holyship backend

### Phase 3: Settings and admin
- Import settings pages
- Import admin pages (tenants, payment methods, promotions)
- Wire org/tenant context

### Phase 4: Polish
- Holyship-specific branding on imported pages
- Sidebar navigation matches design spec
- Dark mode verified on all pages
- Existing pipeline/radar/entity pages use shadcn primitives

## Success Criteria

- User can sign in with GitHub → see pipeline board
- User can purchase credits (Stripe + crypto with icons) → credits reflected in balance
- User can see metered usage (tokens consumed by workers) → matches gateway meter events
- User can manage org, invite team members, manage API keys
- Admin can manage payment methods, tenants, promotions
- Existing pipeline/radar/entity pages continue to work unchanged
- All pages dark mode first
