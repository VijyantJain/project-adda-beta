# Adda — Domain, Infrastructure & App Migration Plan
Updated 2026-09-22. Proposal and implementation gates; no automatic service migration or account cost approval.

## Current architecture
Static vanilla JavaScript, CSS and HTML + Netlify Functions + Netlify Blobs. GitHub branch v0.5-full-experience deploys to Netlify PR preview; production main is separate. The persistent field-test store adda-v05-fieldtest includes Crew data; production uses adda-v03. Do not rename/delete stores in a domain/hosting migration.

## Immediate professional URL (before migration)
Acquire or use a domain the owner controls. In the production Netlify site add an existing domain or subdomain in Domain Management and set correct DNS CNAME/A as Netlify directs. Custom domains can be used without a paid Netlify plan; registration itself costs money. Example only: play.YOURDOMAIN.tld. Do not point a permanent public domain to a disposable deploy-preview URL. First verify and merge preview to main in one controlled release. Keep old netlify.app URLs redirecting until invitations have decayed, and preserve ?crew=?drop=?profile deep links.

## Stage 1: independent static host
Cloudflare Pages free hosts static assets (free unlimited static requests in published pricing). Current Netlify function and Blob store do not follow automatically. Avoid moving only the HTML to Cloudflare while leaving unplanned broken /api paths. Option: temporary Cloudflare Pages static frontend proxy to Netlify API, but it retains function usage/credits and adds CORS and additional origin complexity; use only if deliberately configured/tested.

## Stage 2: durable backend and identity
Supabase Postgres, RLS, Auth, Storage, Realtime, Edge Functions (or dedicated API if later justified). No Supabase projects found on the connected account as of 2026-09-22; create/select a project after user confirms organization/cost/region. Real mobile OTP needs an SMS provider and configured quotas, email OTP needs reliable sender/SMTP and verified domain. Never expose service-role key to frontend. Add migrations for profiles, guest_identities, Crew tables, Drops/answers, Starter achievements, verified point-event ledger, analytics events, media, invite tokens, notifications, DMs, Moments and privacy settings.

## Migration safety
1. Freeze schema contract / export a verified snapshot of Blob key inventory and checksums; back up original fieldtest/prod separately.
2. Build Postgres schemas with RLS and staging database. Import Crew/member/Drop/response/chat/media into staging preserving IDs, creator relationships, timestamps, reveal state, original public links.
3. Reconcile counts per Crew, sample actual response payloads, verify media files and exact old public deep links.
4. Dual-read/shadow-read new backend from test branch and compare response shape/performance. Avoid dual writes until idempotent reconciliation and rollback are designed.
5. Invite a small cohort to staging. After QA and cost review, run cutover with rollback link and no deleting historical Netlify Blobs.
6. Redirect domain and old invite links when ready. Log failures and run data integrity checks for 7+ days.

## App creation milestone
PWA: installable icon/home-screen app can precede native stores after HTTPS domain, service worker, manifest, responsive UX and offline-safe caching; native OS shares are already available on supported browsers.
Native later: use React Native + Expo/EAS for iOS and Android only once identity, realtime, notifications and media flows are stable. Shared business rules/API types with web React/Next/TypeScript client. Apple Developer / Google Play Console enrollment and review are separate real-world steps; do not claim automatic publication.
Do not rewrite all six Drop formats and analytics during one risky live-data deployment.

## Recommended target
Frontend: React + TypeScript (Next.js if SEO/public Arena is material; otherwise Vite/React SPA + PWA).
Data/auth: Supabase Postgres/Auth/Realtime/Storage with RLS, typed database schema and transactional points.
API: server-side Edge functions for privileged operations, anti-abuse, media links, invite token signing.
Analytics: separate append-only product events with indexed aggregates, server/UX error monitoring and no raw public IP exposure.
Media: private storage, signed URL access, thumbnail creation, 24h/view-once expiry workers, safe reporting/access.
Hosting/DNS: Cloudflare Pages + owned custom domain after API migration; do not treat Netlify and Cloudflare as data stores.
Mobile: Expo React Native, using stable backend; build when test retention justifies ongoing App Store/Play Store maintenance.

## Next owner choices
Owned domain name and DNS authority; Supabase organization/project, database region, expected user/storage spend, SMS/email provider, platform migration budget and distribution gates. Netlify remaining credits are account UI state; do not infer exact balance from screenshots taken earlier.
