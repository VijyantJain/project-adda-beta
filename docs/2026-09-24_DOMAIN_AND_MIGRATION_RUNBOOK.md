# Project Adda — owned domain, cheap web deployment and safe migration runbook

Date: 2026-09-24. This is a NO-MIGRATION-YET plan until domain purchase and data-safe deployment are approved. Domain is a web ADDRESS, not hosting/database and does NOT resolve API slowness. App already runs on the web; the next step is custom-domain routing/PWA polish, then backend architecture improvements if necessary.

## Baseline and protection
GitHub repo VijyantJain/project-adda-beta; development field test via Netlify Deploy Preview in SAME Netlify site; main is intentionally older. In code: preview getStore("adda-v05-fieldtest"), production getStore("adda-v03"), and a historical one-time deploy preview migration. Netlify Blob stores are context/site-sensitive. NEVER spin up a different Netlify site or point a custom domain at production main and assume existing Crew chats/responses appear. Never change context of existing production branch without analyzing makeStore() and exact Blob store accessible there.

## Domain buying checklist (no invented availability)
- Ask founder to shortlist 3–5 easily spoken names, e.g. getadda.in, playadda.in, ouradda.in, addaapp.in, playadda.com; examples only, availability/trademark NOT confirmed.
- For India-first, .in/.co.in often affordable; for global brand consider .com when cost/availability work. Buy only after checkout displays BOTH year-one and renewal prices including tax/premium, WHOIS/privacy policy and transfer lock.
- Porkbun published .com regular from about USD 11.08/year at research time; Cloudflare Registrar sells supported domains at registry cost, but requires Cloudflare DNS nameservers. A cheaper first-year promo can renew much higher. Verify prices live at purchase, no claim that Adda names are free or currently available.
- Select registrar based on hosting plan: if cheap Netlify BRANCH subdomains require Netlify DNS, a domain registered at a registrar allowing nameserver changes makes setup easier; Cloudflare Registrar normally keeps Cloudflare nameservers. Keeping Cloudflare DNS also works with Cloudflare Pages/Workers and the long-run plan.
- Founder must create/pay for domain in personal/company account, enable 2FA and auto-renew, keep invoice/ownership, grant least-privilege technical access. Do NOT share registrar password/payment credentials in chat.

## Option A — least risky TODAY: stay on CURRENT site, add branded beta domain
Netlify Free supports custom domains/SSL, but current field test lives at deploy-preview-1--...; connecting root domain to site production branch could show wrong old main app AND a different adda-v03 store. DO NOT do that casually.
Safer candidate: enable deploy of a SHORT "beta" branch in existing Netlify site, fast-forward only after acceptance; check Netlify branch context is NOT production and makeStore selects adda-v05-fieldtest. Use Netlify branch subdomain beta.<owned-domain> via Netlify DNS as documented; branch subdomains available on all plans, while automatic custom domains for Deploy Previews can have plan/DNS requirements. Keep preview URL as recovery for old invite links. Validate on live domain with a NEW test participant and existing permitted Crew before sending invitations.
Alternative: retain existing preview URL for this 2–3-day beta while domain is bought; do not force a topology migration during active field test.

## Option B — lowest recurring future architecture, after safe export
Cloudflare Pages hosts static HTML/CSS/JS/images and custom domain; Pages Functions/Workers can implement /api. D1 SQL stores members/Crews/Drops/responses/Aura event ledger and indexed analytics; R2 only for permitted uploaded photos/media. Workers Free daily requests and D1 read/write/storage limits apply; static pages are free on included plan but not infinite backend calls. No dedicated VM is needed for early cohorts. Requires REAL rewriting of Netlify-specific API and migration of all keys. DO NOT merely point Cloudflare Pages to GitHub and expect Netlify Blob data to follow.
Alternative if SQL/API effort or auth dominates: Supabase Postgres + Auth + Storage with Cloudflare Pages static frontend; monitor quotas/region (prefer near India, check eligible region), RLS/privacy and storage egress.
PWA (“Add to Home Screen”) is web technology and can precede Expo React Native; iOS push and background permissions have their own limitations. App store build only after retention and operating cost justify maintenance.

## Portable deployment process that ChatGPT can help orchestrate
1. Founder buys and confirms domain, target country/audience and which backend plan to adopt; do not authorize payment/sign-in sharing.
2. Freeze accepted field-test SHA; make Git branch and immutable backup. Export count/hash key categories and media from adda-v05-fieldtest to encrypted storage with owner access.
3. If Cloudflare: founder creates account, chooses Pages/Workers/D1/R2 and adds GitHub repo integration with least privilege; secrets via Cloudflare dashboard or GitHub repo secrets (NOT in code).
4. Deploy static preview first on temporary *.pages.dev, with private isolated QA data/worker; build API compatibility map from every /api?action=... endpoint. Keep exact Crew/Drop deep links, same-origin /api, share URL generation, index.html fallback and MIME/asset caching.
5. If migrating: idempotent importer with key→table mapping, raw source SHA/content count, per-Crew totals; handle user "p_" IDs, deterministic seeded Drops, Provisional vs real membership, media blobs, award ledger, analytics. DO NOT upgrade to verified account IDs during data import in one step.
6. Dry run sample then full clone; compare expected Crews/members/Drops/responses/Starter/Aura/share-event metadata and public no-PII analytics; reject any missing content/point mismatch.
7. Short write freeze during final delta import; point DNS/custom SSL; smoke direct + old Crew link + old Drop link in iOS, Android, WhatsApp; background media fetch and admin endpoints.
8. Maintain rollback to Netlify URL and store, no dual write without transaction/dedupe. Update read/write freeze documentation and verify redirects for old URLs while keeping old site online for existing invitations.
9. Only after acceptance switch main domain default URL; paid AI/SMS/transactional email can be connected later.

## No-cost floor vs honest costs
- Domain: annual charge; no legitimate promise of permanently free custom .com/.in.
- Current Netlify site: free tier credits/limits may cover trial; no second backend purchase needed just for a vanity domain. Data-scan latency remains.
- Cloudflare Pages static and Workers/D1 free allowances may handle a small beta; measure request count and DB writes; auth OTP, outgoing WhatsApp/SMS, licensed images, model tokens, video media and high data egress are likely cost lines.
- Most impactful near-term speed win: index/counter-based analytics and per-participant Aura events, avoid scanning entire Blob store. Buying a domain does NOT implement this.

## References checked at planning time
Porkbun public pricing: https://porkbun.com/products/domains
Cloudflare Registrar: https://www.cloudflare.com/domains/
Netlify Free custom domain: https://www.netlify.com/pricing/
Netlify branch subdomains: https://docs.netlify.com/manage/domains/manage-domains/manage-domains-for-branch-deploys/
Netlify preview domains: https://docs.netlify.com/manage/domains/manage-domains/manage-domains-for-deploy-previews/
Cloudflare Pages: https://developers.cloudflare.com/pages/functions/pricing/
Cloudflare D1: https://developers.cloudflare.com/d1/platform/pricing/
Cloudflare domain setup: https://developers.cloudflare.com/pages/configuration/custom-domains/

## Option B starts after founder functional A acceptance (2026-09-25)
Founder explicitly passed all targeted exact invite, Aura full sync, founder Analytics and general mobile/laptop smoke checks. A functional acceptance permits domain discovery and a safe proposed beta URL but DOES NOT approve deploying main, changing preview's backed store or migrating from Netlify to Cloudflare. Pending founder: candidate owned names/TLD, ceiling for first-year/renewal, registrar/company ownership, whether use beta.<domain> first; decide intended main/root later. Keep old deep links and production main d88cb5c... separate. Approved Star title Social Supernova unaffected.

## D054 — Adda is working name ONLY; postpone permanent branded domain (2026-09-25)

Founder explicitly confirms Adda is NOT the final app/brand name; all user-facing Adda name, wordmark, welcome, metadata, share copy and eventually branded app-icon packaging will be renamed. Earlier getadda/playadda/etc. domain examples are NOT approved purchases.

Option A functional acceptance stands. Split Option B:
- B0: retain existing Netlify Deploy Preview as temporary PRIVATE beta distribution; preserve live Crew/Drop deep links, preview/production separation and old Blob stores. No new owned vanity domain needed for this cohort.
- B1 ON HOLD until final brand selection: evaluate memorable/pronounceable naming, candidate domain availability, first-year AND renewal costs, trademark/conflict diligence, store listings and handles; initial searches do not constitute legal clearance. Founder confirms and purchases in founder-controlled account only. Then plan beta/root URL rollout safely.
- Option C may proceed BEFORE B1 as BRAND-AGNOSTIC v0.8 SRS. Make display brand/name, logos, metadata, URLs, asset naming, sharing copy configurable; use temporary Adda label in UI until approved replacement. Aura Orb stays permanent core icon motif independent of brand name.

Critical migration rule: only rename USER-FACING branding, never blindly search-and-replace INTERNAL historical keys and identifiers such as adda-v05-fieldtest, adda-v03, localStorage keys, getVibe, event names, participant/Crew/Drop IDs, old deep links. A new custom domain is a NEW browser origin; device-local guest/profile data does not automatically transfer. Plan explicit identity/link recovery and safe staged link handling, snapshots and rollback without losing Aura, badges or Crew data.

No domain purchased, no DNS edits, no source/application v0.8 changes, no main merge and no live data mutation authorised. This supersedes the suggestion to purchase an Adda-named domain immediately.

## D055 founder sequence selection (2026-09-25)
Founder selected naming and brand discovery BEFORE final v0.8 SRS. First complete brand brief/candidates, pronunciation and preliminary official trademark/app-store/domain screening, then founder approves final name, then owned domain purchase/B1 safe deployment and final named C SRS sequencing. B0 existing beta stays; no payment, rename, build, DNS or migration approved. See docs/2026-09-25_BRAND_NAMING_DISCOVERY.md.
