# Field-test acceptance and observed defects — 2026-09-24

Source: founder screenshots from actual Safari and Android/Chrome and feedback; screenshots are archived separately. TEST STATUS: reproduction reports are real user observations; source fixes on fix/v073-sept24-field-test are NOT device-verified until tested on deployed preview. Retain QA identity and URL/deep link when reporting.

| ID | User-visible defect | Source diagnosis | Sept 24 candidate fix | True acceptance check |
|---|---|---|---|---|
| FT-01 | private analytics: “this operation was aborted” | analytics.js abort=15 s while analyticsDashboard awaits sequential, wide listJSON across all events/visitors/members/drops | extend request budget to 55 s, start independent reads together, keep 2-minute server-side cached dashboard; this is INTERIM, full table scan/indexing remains | login with founder key on iPhone + laptop, dashboard loads correctly, all-time/days actual counts, no leaks; verify cold and warm timings |
| FT-02 | 9-second-plus Aura | main getVibe lists EVERY Crew/Drop/chat/event before responding; client 9-second abort, then calls fast getAuraStarter | render fast server-authoritative Starter + linked Crew view FIRST; clearly label “verified so far”; optional explicit all-Crew sync; no bogus zero | Aura interactive under 2 s typical; 180 Starter and genuine Crew components show; FULL actual all-Crew score does not silently masquerade as partial |
| FT-03 | Crew takes 2–3 s | renderCrew refreshed Crew and Drops sequentially, sometimes refetch after boot | run independent refreshCrew and refreshDrops concurrently | measure on same warmed and mobile networks, confirm members/Drops unchanged and live count not stale |
| FT-04 | active tab dot looks like notifications | CSS .nav ... active::after dot | remove ONLY active selection dot, preserve actual chat unread indicator | all 5 tabs highlighted without dot; genuine unread red indicator remains |
| FT-05 | Mates shown twice header and page | count pill and Crew Mates tile both open same thing | reserve header upper-right for later DM/notifications; one Mates module; add inline chain of actual member initials/own photo; do not claim other members' global photos exist | no redundant button; Mates view opens, creator settings remains admin-only |
| FT-06 | Tenacious appears twice | progress 10 showFeedback draws Tenacious, then complete() draws Tenacious + medals | progress 10 directly renders single complete() trophy showcase | only one Tenacious celebratory screen, still displays earned 180, six starter milestones |
| FT-07 | Aura six Starter badges complete immediately | fast getAuraStarter deliberately returns only six Starter milestones; full getVibe has other small badges but is too slow | keep truthful six on fast Starter, design separate long-term 3-star achievement system for v0.8 (not secretly ship scoring) | each badge shows actual progress and real sourced criteria, long-horizon targets still unearned |
| FT-08 | score mismatch/partial yellow warning says “Crew unavailable” with Crew activity present | linked Crew getAuraStarter returns real partial score with Crew answers+membership, but old fallback message described only Starter | change to exact coverage language and full-sync optional | no misleading “only Starter” warning when score includes Crew |
| FT-09 | old/new design disparity | UX evolved as functional beta; original concept imagery never mapped to actual components | archive images, map visuals to Crew, Drops, Aura/recap; implement safe avatar chain first; defer high-cost look/feel layers | functional completeness unchanged; responsive/performance audit after visual changes |

## Release tests (minimum)
- New direct: 10 Starter → exactly one Tenacious → earned Aura → guided Profile; later new Crew creates exactly five seeded Drops.
- New Crew invite: exact linked Crew; two genuine responses → Starter 10 → Aura/Profile → return exact Crew → first custom Drop guided publish; no duplicated answers on retry.
- New Drop invite: exact Drop FIRST → Starter/Aura/Profile → original Crew → remaining genuine Drops or create; no phantom Crew.
- Returning browser: does not replay mandatory tour; Avengers, chats, answered, photos, admin and old legacy Starter answer option labels survive.
- Crew UI: 320px, 375px, 430px; no overlap/fake unread dots; header invites work; original deep links survive when custom domain is added.
- Analytics: authorized user only, time range and high-volume data; proper error when genuinely too slow, no fabricated figures.
- Full profile/scores: prevent game economy from silently switching from full to partial without labeling.
- DB export+restore and backout plan before any hosting cutover.

## Performance contracts (targets, not measured claims)
P75 first interactive Crew under 1.5s (warmed); P95 under 3s on representative Indian mobile data. Aura first useful value under 1.5s, extended global total asynchronous/optional until indexed database. Founder analytics cached under 5s, full uncached should be moved to indexed SQL/background summaries instead of raising timers indefinitely. Record actual TTFB and client timing distributions; never claim current network passed these targets without field measurement.

## Root fix to schedule
Netlify Blobs is fine for a small beta store, NOT an efficient analytics query engine. Move event aggregates to precomputed counters or SQL (D1/Supabase Postgres); maintain an idempotent backfill, verified source counts and query indexes. Merely paying for a custom domain will not cure long analytics/score scans. Avoid migration during active field test without backup, validation and rollback.
