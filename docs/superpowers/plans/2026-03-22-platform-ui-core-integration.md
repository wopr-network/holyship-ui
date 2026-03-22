# holyship-ui Platform-UI-Core Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate platform-ui-core into holyship-ui using the thin-shell re-export pattern — auth, billing, settings, admin pages from core, holyship-specific pages (pipeline, radar, entity) stay custom.

**Architecture:** Product UIs use a `@core/*` path alias mapping to `@wopr-network/platform-ui-core/src/*`. Each page is a one-line re-export: `export { default } from "@core/app/(dashboard)/billing/credits/page"`. The root layout provides ThemeProvider, TRPCProvider, brand config. holyship-specific pages live alongside core re-exports. CSS imports core's globals.css via `@source` + `@import`.

**Tech Stack:** Next.js 16, platform-ui-core@1.18.0, better-auth (GitHub OAuth), Tailwind 4, shadcn, tRPC

**Spec:** `docs/superpowers/specs/2026-03-22-platform-ui-core-integration-design.md`

**Reference:** `~/wopr-platform-ui/` — the working thin-shell pattern to copy from

---

## File Map

### Infrastructure (create/modify)

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `package.json` | Add platform-ui-core + transitive deps |
| Modify | `tsconfig.json` | Add `@core/*` path alias |
| Rewrite | `src/app/globals.css` | Import core's CSS via @source + @import |
| Rewrite | `src/app/layout.tsx` | Root layout with ThemeProvider, TRPCProvider, brand config |
| Create | `src/proxy.ts` | Auth middleware — protects (dashboard) routes |
| Create | `.env.holyship` | Brand config + auth env var template |

### Auth pages (create — one-line re-exports)

| File | Re-exports |
|------|-----------|
| `src/app/(auth)/layout.tsx` | `@core/app/(auth)/layout` |
| `src/app/(auth)/login/page.tsx` | `@core/app/(auth)/login/page` |
| `src/app/(auth)/invite/[token]/page.tsx` | `@core/app/(auth)/invite/[token]/page` |
| `src/app/auth/callback/[provider]/page.tsx` | `@core/app/auth/callback/[provider]/page` |

### Dashboard layout (create)

| File | Re-exports |
|------|-----------|
| `src/app/(dashboard)/layout.tsx` | `@core/app/(dashboard)/layout` |

### Billing pages (create — one-line re-exports)

| File | Re-exports |
|------|-----------|
| `src/app/(dashboard)/billing/layout.tsx` | `@core/app/(dashboard)/billing/layout` |
| `src/app/(dashboard)/billing/credits/page.tsx` | `@core/app/(dashboard)/billing/credits/page` |
| `src/app/(dashboard)/billing/payment/page.tsx` | `@core/app/(dashboard)/billing/payment/page` |
| `src/app/(dashboard)/billing/plans/page.tsx` | `@core/app/(dashboard)/billing/plans/page` |
| `src/app/(dashboard)/billing/usage/page.tsx` | `@core/app/(dashboard)/billing/usage/page` |
| `src/app/(dashboard)/billing/usage/hosted/page.tsx` | `@core/app/(dashboard)/billing/usage/hosted/page` |
| `src/app/(dashboard)/billing/referrals/page.tsx` | `@core/app/(dashboard)/billing/referrals/page` |

### Settings pages (create — one-line re-exports)

| File | Re-exports |
|------|-----------|
| `src/app/(dashboard)/settings/layout.tsx` | `@core/app/(dashboard)/settings/layout` |
| `src/app/(dashboard)/settings/account/page.tsx` | `@core/app/(dashboard)/settings/account/page` |
| `src/app/(dashboard)/settings/profile/page.tsx` | `@core/app/(dashboard)/settings/profile/page` |
| `src/app/(dashboard)/settings/api-keys/page.tsx` | `@core/app/(dashboard)/settings/api-keys/page` |
| `src/app/(dashboard)/settings/notifications/page.tsx` | `@core/app/(dashboard)/settings/notifications/page` |
| `src/app/(dashboard)/settings/security/page.tsx` | `@core/app/(dashboard)/settings/security/page` |
| `src/app/(dashboard)/settings/org/page.tsx` | `@core/app/(dashboard)/settings/org/page` |
| `src/app/(dashboard)/settings/activity/page.tsx` | `@core/app/(dashboard)/settings/activity/page` |
| `src/app/(dashboard)/settings/providers/page.tsx` | `@core/app/(dashboard)/settings/providers/page` |
| `src/app/(dashboard)/settings/secrets/page.tsx` | `@core/app/(dashboard)/settings/secrets/page` |
| `src/app/(dashboard)/settings/brain/page.tsx` | `@core/app/(dashboard)/settings/brain/page` |

### Admin pages (create — one-line re-exports)

| File | Re-exports |
|------|-----------|
| `src/app/admin/layout.tsx` | `@core/app/admin/layout` |
| `src/app/admin/tenants/page.tsx` | `@core/app/admin/tenants/page` |
| `src/app/admin/payment-methods/page.tsx` | `@core/app/admin/payment-methods/page` |
| `src/app/admin/promotions/page.tsx` | `@core/app/admin/promotions/page` |
| `src/app/admin/promotions/[id]/page.tsx` | `@core/app/admin/promotions/[id]/page` |
| `src/app/admin/promotions/[id]/edit/page.tsx` | `@core/app/admin/promotions/[id]/edit/page` |
| `src/app/admin/promotions/new/page.tsx` | `@core/app/admin/promotions/new/page` |
| `src/app/admin/billing-health/page.tsx` | `@core/app/admin/billing-health/page` |
| `src/app/admin/accounting/page.tsx` | `@core/app/admin/accounting/page` |
| `src/app/admin/audit/page.tsx` | `@core/app/admin/audit/page` |
| `src/app/admin/affiliates/page.tsx` | `@core/app/admin/affiliates/page` |

### Other core pages (create — one-line re-exports)

| File | Re-exports |
|------|-----------|
| `src/app/pricing/page.tsx` | `@core/app/pricing/page` |
| `src/app/terms/page.tsx` | `@core/app/terms/page` |
| `src/app/privacy/page.tsx` | `@core/app/privacy/page` |
| `src/app/status/page.tsx` | `@core/app/status/page` |

### holyship-specific pages (move under dashboard route group)

| Action | From | To |
|--------|------|----|
| Move | `src/app/pipeline/page.tsx` | `src/app/(dashboard)/pipeline/page.tsx` |
| Move | `src/app/radar/page.tsx` | `src/app/(dashboard)/radar/page.tsx` |
| Move | `src/app/entity/[id]/page.tsx` | `src/app/(dashboard)/entity/[id]/page.tsx` |
| Modify | `src/app/page.tsx` | Redirect to `/pipeline` (authenticated) or `/login` (unauthenticated) |

### API proxy routes (keep as-is)

| File | Keep |
|------|------|
| `src/app/api/defcon/[...path]/route.ts` | Unchanged — server-side proxy with DEFCON_ADMIN_TOKEN |
| `src/app/api/radar/[...path]/route.ts` | Unchanged — server-side proxy |
| `src/app/api/sources/route.ts` | Unchanged |

---

## Task 1: Add platform-ui-core dependency and @core alias

**Files:**
- Modify: `~/holyship-ui/package.json`
- Modify: `~/holyship-ui/tsconfig.json`

- [ ] **Step 1: Install platform-ui-core**

```bash
cd ~/holyship-ui
pnpm add @wopr-network/platform-ui-core@1.18.0
```

This brings in all transitive deps (Radix, shadcn, framer-motion, better-auth, recharts, sonner, etc.)

- [ ] **Step 2: Add @core path alias to tsconfig.json**

Add to `compilerOptions.paths`:
```json
"@core/*": ["./node_modules/@wopr-network/platform-ui-core/src/*"]
```

Keep the existing `@/*` alias for holyship-ui's own src.

- [ ] **Step 3: Verify build**

```bash
pnpm build
```

Expected: May have CSS/import issues — that's OK, next task fixes globals.css.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json
git commit -m "chore: add platform-ui-core dependency and @core path alias"
```

---

## Task 2: Set up CSS and root layout

**Files:**
- Rewrite: `~/holyship-ui/src/app/globals.css`
- Rewrite: `~/holyship-ui/src/app/layout.tsx`
- Create: `~/holyship-ui/.env.holyship`

- [ ] **Step 1: Rewrite globals.css**

Replace the entire file with:
```css
@source "../../node_modules/@wopr-network/platform-ui-core/src";
/* biome-ignore lint/correctness/noInvalidPositionAtImportRule: @source must precede @import for Tailwind v4 to scan core's source files */
@import "../../node_modules/@wopr-network/platform-ui-core/src/app/globals.css";
```

This imports all shadcn CSS variables, theme colors, and base styles from core.

- [ ] **Step 2: Create .env.holyship**

```env
# Brand
NEXT_PUBLIC_BRAND_NAME="Holy Ship"
NEXT_PUBLIC_BRAND_DOMAIN="holyship.dev"
NEXT_PUBLIC_BRAND_TAGLINE="You don't write code. You Holy Ship it."
NEXT_PUBLIC_API_URL=http://localhost:3001

# Auth (better-auth + GitHub OAuth)
BETTER_AUTH_SECRET=change-me-in-production
BETTER_AUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# holyship backend (keep existing)
DEFCON_URL=http://localhost:3001
DEFCON_ADMIN_TOKEN=
RADAR_URL=http://localhost:8080
NEXT_PUBLIC_DEFCON_WS_URL=
NEXT_PUBLIC_DEFCON_WS_TOKEN=
```

- [ ] **Step 3: Rewrite root layout**

Replace `src/app/layout.tsx` with the platform-ui-core provider pattern (adapted from wopr-platform-ui):

```tsx
import { ThemeProvider } from "@core/components/theme-provider";
import { SITE_URL } from "@core/lib/api-config";
import { getBrandConfig } from "@core/lib/brand-config";
import { TRPCProvider } from "@core/lib/trpc";
import { MotionConfig } from "framer-motion";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const brand = getBrandConfig();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${brand.productName} — Ship Code with AI`,
    template: `%s | ${brand.brandName}`,
  },
  description: brand.tagline,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{nonce && <meta property="csp-nonce" content={nonce} />}</head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <MotionConfig nonce={nonce}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange nonce={nonce}>
            <TRPCProvider>
              {children}
              <Toaster theme="dark" richColors />
            </TRPCProvider>
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
```

Keeps Geist font (holyship's existing choice) instead of JetBrains Mono.

- [ ] **Step 4: Run check**

```bash
pnpm check
```

Expected: PASS (may warn about unused existing components — that's OK)

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx .env.holyship
git commit -m "feat: root layout with platform-ui-core providers, brand config, CSS"
```

---

## Task 3: Add auth middleware and login page

**Files:**
- Create: `~/holyship-ui/src/proxy.ts`
- Create: `~/holyship-ui/src/app/(auth)/layout.tsx`
- Create: `~/holyship-ui/src/app/(auth)/login/page.tsx`
- Create: `~/holyship-ui/src/app/(auth)/invite/[token]/page.tsx`
- Create: `~/holyship-ui/src/app/auth/callback/[provider]/page.tsx`
- Modify: `~/holyship-ui/src/app/page.tsx`

- [ ] **Step 1: Create auth middleware**

Copy the middleware from wopr-platform-ui and adapt for holyship:

```bash
cp ~/wopr-platform-ui/src/proxy.ts ~/holyship-ui/src/proxy.ts
```

**Required adaptations** (the copy is wopr-specific and must be edited):
- Remove `/signup`, `/forgot-password`, `/reset-password`, `/auth/verify` from `publicPaths` (holyship has no email auth)
- Change any `"/marketplace"` redirects to `"/pipeline"` (holyship's home is pipeline)
- In `CSRF_EXEMPT_PATHS`, keep only `github` — remove Google/Discord OAuth callback exemptions
- Keep admin route gating (`/admin/*` → `platform_admin` role check)
- Keep CSRF protection and CSP headers

- [ ] **Step 2: Create auth page re-exports**

```bash
# Auth layout
mkdir -p ~/holyship-ui/src/app/\(auth\)/login
mkdir -p ~/holyship-ui/src/app/\(auth\)/invite/\[token\]
mkdir -p ~/holyship-ui/src/app/auth/callback/\[provider\]
```

`src/app/(auth)/layout.tsx`:
```tsx
export { default } from "@core/app/(auth)/layout";
```

`src/app/(auth)/login/page.tsx`:
```tsx
export { default } from "@core/app/(auth)/login/page";
```

`src/app/(auth)/invite/[token]/page.tsx`:
```tsx
export { default } from "@core/app/(auth)/invite/[token]/page";
```

`src/app/auth/callback/[provider]/page.tsx`:
```tsx
export { default } from "@core/app/auth/callback/[provider]/page";
```

- [ ] **Step 3: Update home page to redirect**

Replace `src/app/page.tsx` — redirect authenticated users to `/pipeline`, unauthenticated to `/login`:

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/pipeline");
}
```

The middleware in `proxy.ts` will catch unauthenticated users hitting `/pipeline` and redirect to `/login`.

- [ ] **Step 4: Run check**

```bash
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/proxy.ts src/app/\(auth\) src/app/auth src/app/page.tsx
git commit -m "feat: auth middleware + GitHub OAuth login, invite, callback pages"
```

---

## Task 4: Add dashboard layout and move holyship pages

**Files:**
- Create: `~/holyship-ui/src/app/(dashboard)/layout.tsx`
- Move: pipeline, radar, entity pages under (dashboard)

- [ ] **Step 1: Create dashboard layout re-export**

```bash
mkdir -p ~/holyship-ui/src/app/\(dashboard\)
```

`src/app/(dashboard)/layout.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/layout";
```

This gives all dashboard pages the sidebar, account switcher, and theme.

- [ ] **Step 2: Move holyship pages under (dashboard)**

```bash
mv ~/holyship-ui/src/app/pipeline ~/holyship-ui/src/app/\(dashboard\)/pipeline
mv ~/holyship-ui/src/app/radar ~/holyship-ui/src/app/\(dashboard\)/radar
mv ~/holyship-ui/src/app/entity ~/holyship-ui/src/app/\(dashboard\)/entity
```

- [ ] **Step 3: Verify pages still render**

```bash
pnpm dev
```

Navigate to `/pipeline`, `/radar`, `/entity/test-id`. They should now have the sidebar layout.

- [ ] **Step 4: Run check**

```bash
pnpm check
```

- [ ] **Step 5: Commit**

```bash
git add src/app/\(dashboard\)
git commit -m "feat: dashboard layout with sidebar, move pipeline/radar/entity under (dashboard)"
```

---

## Task 5: Add billing pages

**Files:**
- Create: 8 files (layout + 7 pages)

- [ ] **Step 1: Create billing directory structure**

```bash
mkdir -p ~/holyship-ui/src/app/\(dashboard\)/billing/credits
mkdir -p ~/holyship-ui/src/app/\(dashboard\)/billing/payment
mkdir -p ~/holyship-ui/src/app/\(dashboard\)/billing/plans
mkdir -p ~/holyship-ui/src/app/\(dashboard\)/billing/usage/hosted
mkdir -p ~/holyship-ui/src/app/\(dashboard\)/billing/referrals
```

- [ ] **Step 2: Create re-export files**

Each file is one line. Create all 8:

`src/app/(dashboard)/billing/layout.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/billing/layout";
```

`src/app/(dashboard)/billing/credits/page.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/billing/credits/page";
```

`src/app/(dashboard)/billing/payment/page.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/billing/payment/page";
```

`src/app/(dashboard)/billing/plans/page.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/billing/plans/page";
```

`src/app/(dashboard)/billing/usage/page.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/billing/usage/page";
```

`src/app/(dashboard)/billing/usage/hosted/page.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/billing/usage/hosted/page";
```

`src/app/(dashboard)/billing/referrals/page.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/billing/referrals/page";
```

- [ ] **Step 3: Run check**

```bash
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(dashboard\)/billing
git commit -m "feat: billing pages — credits, payment, plans, usage, referrals"
```

---

## Task 6: Add settings pages

**Files:**
- Create: 12 files (layout + 11 pages)

- [ ] **Step 1: Create settings directory structure**

```bash
mkdir -p ~/holyship-ui/src/app/\(dashboard\)/settings/{account,profile,api-keys,notifications,security,org,activity,providers,secrets,brain}
```

- [ ] **Step 2: Create re-export files**

`src/app/(dashboard)/settings/layout.tsx`:
```tsx
export { default } from "@core/app/(dashboard)/settings/layout";
```

Then one file per page — each is:
```tsx
export { default } from "@core/app/(dashboard)/settings/<name>/page";
```

For: `account`, `profile`, `api-keys`, `notifications`, `security`, `org`, `activity`, `providers`, `secrets`, `brain`.

- [ ] **Step 3: Run check**

```bash
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\(dashboard\)/settings
git commit -m "feat: settings pages — account, profile, api-keys, security, org, providers, etc."
```

---

## Task 7: Add admin pages

**Files:**
- Create: 11 files (layout + 10 pages)

- [ ] **Step 1: Create admin directory structure**

```bash
mkdir -p ~/holyship-ui/src/app/admin/{tenants,payment-methods,promotions/{new},billing-health,accounting,audit,affiliates}
mkdir -p ~/holyship-ui/src/app/admin/promotions/\[id\]/edit
```

- [ ] **Step 2: Create re-export files**

`src/app/admin/layout.tsx`:
```tsx
export { default } from "@core/app/admin/layout";
```

Then: `tenants/page.tsx`, `payment-methods/page.tsx`, `billing-health/page.tsx`, `accounting/page.tsx`, `audit/page.tsx`, `affiliates/page.tsx`, `promotions/page.tsx`, `promotions/new/page.tsx`, `promotions/[id]/page.tsx`, `promotions/[id]/edit/page.tsx`.

Each is the standard one-liner re-export.

- [ ] **Step 3: Run check**

```bash
pnpm check
```

- [ ] **Step 4: Commit**

```bash
git add src/app/admin
git commit -m "feat: admin pages — tenants, payment methods, promotions, billing health, audit"
```

---

## Task 8: Add static pages (pricing, terms, privacy, status)

**Files:**
- Create: 4 files

- [ ] **Step 1: Create re-export files**

```bash
mkdir -p ~/holyship-ui/src/app/{pricing,terms,privacy,status}
```

`src/app/pricing/page.tsx`:
```tsx
export { default } from "@core/app/pricing/page";
```

`src/app/terms/page.tsx`:
```tsx
export { default } from "@core/app/terms/page";
```

`src/app/privacy/page.tsx`:
```tsx
export { default } from "@core/app/privacy/page";
```

`src/app/status/page.tsx`:
```tsx
export { default } from "@core/app/status/page";
```

- [ ] **Step 2: Run check**

```bash
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/app/pricing src/app/terms src/app/privacy src/app/status
git commit -m "feat: static pages — pricing, terms, privacy, status"
```

---

## Task 9: Clean up old holyship-ui components

**Files:**
- Modify/remove: old `src/components/ui/` that duplicate core

- [ ] **Step 1: Check for conflicts**

holyship-ui has its own `src/components/ui/badge.tsx`, `card.tsx`, `nav.tsx`, `spinner.tsx`. These may conflict with or duplicate core's components. Check if the holyship-specific pages (pipeline, radar, entity) import from `@/components/ui/` or can be pointed to `@core/components/ui/`.

- [ ] **Step 2: Update holyship page imports**

If pipeline/radar/entity components import from `@/components/ui/badge` etc., update them to import from `@core/components/ui/badge` instead. Remove the local duplicates if no longer needed.

Keep any truly holyship-specific components (pipeline-board, entity-timeline, radar-panel, etc.) — these have no core equivalent.

- [ ] **Step 3: Run check**

```bash
pnpm check
```

- [ ] **Step 4: Run tests**

```bash
pnpm test
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ src/app/
git commit -m "refactor: use @core UI primitives, remove local duplicates"
```

---

## Task 10: Full verification and PR

- [ ] **Step 1: Run full check**

```bash
pnpm check
```

- [ ] **Step 2: Run tests**

```bash
pnpm test
```

- [ ] **Step 3: Test locally**

```bash
pnpm dev
```

Verify:
- `/login` — GitHub OAuth button renders
- `/pipeline` — pipeline board with sidebar layout
- `/radar` — radar panel with sidebar layout
- `/billing/credits` — credit balance page
- `/billing/payment` — crypto checkout with chain icons
- `/settings/account` — account settings
- `/settings/org` — org management
- `/admin/tenants` — admin tenant page (requires admin role)
- `/admin/payment-methods` — admin chain management

- [ ] **Step 4: Push and create PR**

```bash
git push -u origin feat/platform-ui-core-integration
gh pr create --title "feat: integrate platform-ui-core — auth, billing, settings, admin" --body "..."
```

- [ ] **Step 5: Wait for CI, fix any issues, merge**
