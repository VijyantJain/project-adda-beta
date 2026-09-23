# Adda v0.7.3 — 2026-09-24 field-test repair

Release mode: development Deploy Preview; production main NOT merged or changed. Code SHA 87304eac2febf08b194658ac76ed1d5b5c116f19. Baseline backup branch backup/v073-before-sept24-feedback at f281d55e012e2ef96e92826b4d8958ce34cc2194. Historical 22 docs copied byte-identically into docs/archive/2026-09-24-pre-cleanup/.

## Changes live in field-test preview
- Active bottom-tab highlight no longer draws a misleading small dot; genuine unread-chat indicator remains.
- Crew header duplicate Mates count removed; header right area reserved for later notifications/DM; inline overlapping chain represents real mates by initials and own local photo. Dedicated Mates tile remains.
- Starter step 10 opens ONE Tenacious showcase with all earned Starter badges/180-point reward, rather than presenting Tenacious on both feedback and completion screens.
- Crew page fetches Crew/mates and Drop list concurrently instead of serially.
- Aura opens fast using real stored Starter and selected Crew earned points; marks this as “verified so far,” not a fabricated full score. Full-store scan becomes an EXPLICIT optional Sync full Aura action, which may remain slow.
- Private founder Analytics: client no longer aborts automatically at 15 seconds; 55-second budget, independent server-side data reads in parallel, 2-minute cache for an authorized dashboard. **This is an interim mitigation, not an indexed backend or proof that first full cold load always succeeds.** SQL/precomputed rollups needed before broad field-testing.
- Original 22 docs backed up with SHA manifest, canonical new documents covering domain migration, AI, 0.8 achievement/Daily Aura discussion, visuals and open bugs, and new-chat handoff.
- Original 10 submitted visuals/screenshots bundled in conversation artifact Adda_Visual_References_Archive_2026-09-24.zip. Binary uploads are not claimed to be committed as source-ready licensed graphics.

## Verified test evidence
- npm test: 25/25 source-contract regression tests PASS; app.js/starter.js/analytics.js Node parse pass; netlify/functions/api.ts esbuild transpilation pass.
- Netlify deployed code SHA 87304eac... with GitHub combined status success. Live deployed assets app.js, starter.js, styles.css, analytics.js HTTP 200 and contain patched source.
- Live anonymous safe synthetic QA on Crew c_5e6d2e27bb: getCrew HTTP200 ~0.66s, listDrops HTTP200 ~0.79s with six seeded+custom real records, scoped getAuraStarter HTTP200 ~0.57s with 210 genuine fast-score points. These are a single server-side sample, NOT Indian mobile p75/p95.
- Private analytics without admin key returns HTTP401. Valid founder-key first full dashboard load **not tested** here because the private key is not available in this work context.
- Real iPhone Safari/Android Chrome/WhatsApp in-app full journeys, 26-mate Avengers latency, analytics cold-start correctness and extended all-Crew score still NEED founder's field test. Do not call this production-stable.

## Known root architectural debt
getVibe scans all drop/chat/event blobs and analyticsDashboard still aggregates full historical objects; free managed function compute and Blob scans may be unsuitable as cohort grows. Perform audited export/backfill to indexed SQL or precomputed per-user/per-day rollups, with old Crew/Drop deep-link continuity and no data loss. A custom domain is independent from this performance fix.

## Next decisions
Choose candidate domain/registrar, confirm target domain and whether to keep current site until schema migration. Founder reviews v0.8 Daily Aura/three-star cosmetic-gems proposal and image atlas AFTER 2–3 days of real field test; none are shipped here.
