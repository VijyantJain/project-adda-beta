# Option A — v0.7.3 field-test stabilisation audit, 2026-09-25

STATUS: STARTED. Read-only GitHub/Netlify review + one NON-PRODUCT regression-test update; no live data write, no production merge or v0.8 feature implementation.

## Founder naming decision D053
Sparkmaker Star III earned title = **Social Supernova**, replacing the rejected Legendary Catalyst. Eight D052 titles remain: Explorer Pathfinder / Opinion Magnet / Infinite Explorer; Sparkmaker First Mover / Scene Architect / Social Supernova; The Regular Familiar Face / Constant Star / Here to Stay. All three path numeric thresholds, Aura rewards and Orb scope remain unchanged.

## Read-only verified baseline (2026-09-25)
- GitHub dev branch v0.5-full-experience BEFORE this audit: a218b9b973866262a526e8b0bb077e9b27e322cc, documentation-only last several commits; fix/v073-sept24-field-test code commit 87304eac2febf08b194658ac76ed1d5b5c116f19; main d88cb5cb4fed1058645b2886c9170f3c97f0537e.
- GitHub combined status for 87304e... shows Netlify deploy-preview SUCCESS at https://deploy-preview-1--project-adda-field-test.netlify.app . This means last code patch was accepted by Netlify status, NOT a new end-to-end mobile acceptance or verified founder Analytics response. Dev-docs HEAD may have a separate preview build; do not assume latest docs commit is deployed.
- Netlify project project-adda-field-test site ID 04f2af96-bc52-44cd-88be-c5aa1eded5a1, CURRENT primary production deploy ID 6aacfaeba2c8aa00070fd755, ready, COMMIT d88cb5c... on main, published 2026-09-18; public primary site and preview are DIFFERENT versions/contexts. Do not send field testers to the primary site assuming it contains latest preview. Netlify connector currently exposes production deploy info but no list/search of Deploy Preview IDs, so exact latest preview deploy detail not authoritatively independently retrieved.
- Prior docs/RELEASE_v073_FIELD_PATCH_2026_09_24.md reports 25/25 source-contract regression tests passed on 87304e... and read-only synthetic Crew/Aura HTTP 200 at the time. This audit did NOT rerun those Node tests or new mobile/browser acceptance; live Netlify preview web fetch was unavailable in the audit environment.
- Static inspection found test drift: tests/v072-smoke.test.mjs hard-coded exactly 128 total feature IDs, but canonical checklist now contains 128 historical IDs plus 11 intentionally UNCHECKED v0.8 SPEC IDs = 139. Test assertion updated to verify legacy 128, 11 additional SPEC and uniqueness, rather than falsely fail legitimate documentation intake. Test runner results must be confirmed in CI/local environment; do not mark tests PASSED just from static inspection.
- Documented FT-01 analytics 55-second client abort + cached full Blob scan is interim, not fixed root-indexing; FT-02 quick Aura shows scoped 'verified so far', not all-Crew total; FT-03 concurrent Crew fetch; FT-04 active dots removed; FT-05 real Mates chain; FT-06 single Tenacious. Device/authorized metrics remain UNVERIFIED.

## A acceptance matrix — founder test checklist
| ID | On-device/action | Expected truthful result | Status |
|---|---|---|---|
| A-01 | iPhone Safari + Android Chrome + WhatsApp in-app, visit EXACT preview URL | Main app shell, fixed top/bottom, no overlapping CTA or phantom active-dot; chat unread indicator preserved | NEED TEST |
| A-02 | New DIRECT browser (private/incognito), complete 10 Starter | One Tenacious, six actual Starter badges, 180 Starter Aura, solo Aura/Home/Crew/+ and Profile guided; no forced Crew | NEED TEST |
| A-03 | Fresh Crew invite with 2+ genuinely unanswered Drops | Exact linked Crew, 2 genuine answers, Starter once, Aura/Profile, exact original Crew, FIRST CUSTOM Drop in that Crew, share offered; no dupes | NEED TEST |
| A-04 | Fresh exact Drop invite | Exact Drop FIRST, then appropriate Starter/guide, back to exact Crew; no wrong Crew | NEED TEST |
| A-05 | Returning founder beta browser and Avengers | Old Crew members/chat/Drop/answers/photos/admin and link work; no forced Starter replay; no destructive writes | NEED TEST |
| A-06 | Open Aura before optional full sync, then full sync if needed | Fast verified scoped score explicitly not asserted full; full score includes all real Crews without false zero/double; latency measured | NEED TEST |
| A-07 | Founder Analytics with existing private key, cold + warm, desktop and phone | Authorized counts D1/D7/cohorts/geography/errors; valid cold/warm timings; no indefinite spinner; 401 without key; NEVER put private key in chat | NEED FOUNDER ACCESS/TEST |
| A-08 | Create Crew, 5 seeds, answer one real Drop, create one custom Drop, share cancel and retry | Exactly 5 genuine seeds, one published custom Drop, valid native share/fallback, no fake delivered claim or double rewards | NEED TEST |
| A-09 | Low mobile network, 320/375/430px, back/refresh/restart | Retry path, input focus, Crew listing, safe onboarding resume; record measured TTFB/error rather than guessed speed | NEED TEST |
| A-10 | GitHub test execution after ID-register assertion fix | Node tests and backend transpilation pass; no direct code change from documentation intake | NEED RUNNER |

## Next action
Founder should run a short controlled device pass on the REAL deploy-preview URL with separate fresh and returning browsers, return results (device/browser, link cohort, screenshot/error text, rough timing). Assistant can triage actual failures and make NON-DESTRUCTIVE v0.7.3 fixes on development branch, backed by tests. Owner founder key remains private, enter only into live authorised Analytics page. Do NOT move domain or data store in Option A.

## Additional audit maintenance
Corrected literal escaping in the new v072-smoke test assertion on follow-up commit; verified static registry split: 128 historical IDs, 11 new unshipped SPEC IDs, 139 unique total, all 11 shown unchecked and SPEC. This was a targeted JS/source-data preflight; full Node test runner remains not executed in this environment.
