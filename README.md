# Renewal Leak

Stripe failed-renewal recovery for micro-SaaS.

Slice 1: Connect a Stripe account (Connect OAuth) and/or ingest failed payments from CSV. Land on a Failed payments list with last-sync time.

## Stack

- Next.js (App Router) + TypeScript
- Prisma + SQLite locally (`DATABASE_URL=file:./dev.db`)
- Postgres-ready schema (change `provider` + `DATABASE_URL` when you deploy)

## Local setup

```bash
cp .env.example .env
# fill Stripe keys
npm install
npx prisma db push
npm run dev
```

Open http://localhost:3000

## Stripe env vars

| Variable | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Platform secret key (`sk_test_...`) |
| `STRIPE_CLIENT_ID` | Connect application client id (`ca_...`) from Stripe Dashboard → Connect settings |
| `STRIPE_REDIRECT_URI` | Must match the redirect URI registered in Connect settings. Local default: `http://localhost:3000/api/stripe/callback` |
| `NEXT_PUBLIC_APP_URL` | App origin used after OAuth (`http://localhost:3000`) |
| `DATABASE_URL` | `file:./dev.db` locally |

Create a Connect application in test mode, add the redirect URI, then click **Connect Stripe**. On success the workspace stores `stripe_account_id` and `lastSyncAt`.

## CSV ingest

Upload a CSV with at least:

```csv
email,amount_cents,currency,decline_code,name,failed_at
jane@acme.com,4900,usd,insufficient_funds,Jane,2026-08-01
```

`amount` (dollars) is also accepted. Rows become `FailedPayment` records on the same list.

## Data model (stubs)

- `Workspace` — `stripeAccountId`, `lastSyncAt`, `approveAboveCents`
- `Customer`
- `FailedPayment` — `declineCode`, `source` (`stripe` \| `csv`)
- `DunningAttempt`
- `Recovery` — `pendingApproval`, `approveAboveCents`

## Git

- Feature branches off `development`
- PRs target `development` only
- Do not merge to `main` from feature work

## Non-goals (this slice)

Cancel flows, SMS, AI copy, teams/SSO, marketing site, mobile.
