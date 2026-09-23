# Adda v0.8 — Founder-confirmed five product decisions and reconciliation

Date: 2026-09-24. Status: FOUNDER DECISIONS recorded / DESIGN DISCUSSION OPEN / NO v0.8 CODE APPROVED.
Authoritative superseding decisions for ambiguous v0.8 proposal language in docs/2026-09-24_V08_DESIGN_BRIEF.md. Keep all previous historical roadmaps and originals unchanged, including docs/archive/2026-09-24-pre-cleanup/. Canonical index docs/START_HERE.md.

## Five founder-locked decisions (verbatim intent)
1. **Daily Aura:** variable **3–5 optional cards** based on interests and actual activity, not a mandatory fixed-card quiz. Decide content algorithm, whether an empty-Crew user gets different supply, notification policy and time zone before engineering.
2. **Daily Charge:** include in FIRST v0.8; **Mystery Aura Capsules are deferred to v0.8.x**. Charge must have a transparent first-release utility beyond a decorative meter: e.g. daily-completion state and progress toward a meaningful, explicitly granted reward/achievement. Do not imply users can open Capsules in first release.
3. **Achievements:** show three genuine three-star paths initially (proposed Drop Explorer, Dropsmith, Still Here); show Crew Spark and Shared Memories as **Coming Soon**, never counterfeit progress/claims or imply their future reward balances are available. Names/thresholds/point rewards still require approval and historic data backfill safeguards.
4. **Gems:** internally track **earned** Gems with a versioned, deduplicated ledger, but DO NOT display a public balance before a real, usable cosmetic-redemption/catalogue experience is ready. Exact earning quantity/retroactivity and catalog are unresolved. No paid or cash-like random rewards.
5. **Crew Pulse:** a SMALL **factual, testable Crew Pulse experiment** in FIRST v0.8 alongside Daily Aura. This is NOT permission to ship full Mystery Reveal Chain, weekly league, timers, social rankings or additional invented group insights. Use only real stored Crew events and truthful counters; exact pulse window, threshold and surfaced payoff require founder approval.

## Scope matrix — reconcile historical vs current
| Family | First v0.8 intent | Later / separately gated |
|---|---|---|
| Personal daily | Interest/activity-led 3–5 optional editorially curated, language-aware quick cards; skip/resume, no repeated Starter rewards; genuine limited scoring | Large public Arena content inventory, fully AI-generated deck, forced daily streak pressure |
| Daily Charge | Earn from real capped daily actions and show clear progress/meaning | Capsule open/variable rewards in v0.8.x |
| Personal streak and progress | Actual day definition, optional stop/resume, truthful next action | Streak manipulation, fabricated countdown |
| Three-star achievements | Drop Explorer, Dropsmith, Still Here, server event+reward ledger; start with 3 visible working paths | Crew Spark/Shared Memories Coming Soon until real identity/referrals and peer verification |
| Gems | Store only earned, not shown till redeemable cosmetics exist | Paid Gems, trade, loot boxes and paid experience |
| Aura profile / Home | Show Daily Aura, Charge, real available Crew Drops, achievement progress and actual score | Fake friend activity, infinite public For You feed |
| Crew Pulse experiment | Small real-activity metric with actual numerator, period, members, cap and no false events | Full Mystery Reveal Chain, weekly challenges, social leaderboard unless separately approved |
| Visual uplift | Preserve original Adda board design language, genuine avatar chains, photo-led cards and high-value Reveal moments with responsive/performance gates | Heavy GPU-dependent orb, global images before identity/media privacy infrastructure |
| AI | Curated templates and rule-based “next meaningful action”; optional AI Copilot discussed, not founder-approved for first cut | Paid LLM calls, inferred compatibility, ingesting private chats, bots voting |
| Foundation | Correct indexed/cheap-enough aggregates, beta-safe participant ID and one-time rewards; actual iOS/Android feedback | Verified cross-device identity / Supabase / D1 migration separate project with export+rollback |
| CoC-style economy | Three-star targets, first-star achievable, long horizon 2/3; cosmetics only | Monetization, season passes, premium reward claims |

## Proposed achievement thresholds only, NOT LOCKED
Drop Explorer 5/150/3000 distinct real Crew Drop answers; Dropsmith 1/40/500 genuine authored Drops; Still Here 3/60/730 genuine active days. Proposed coming-soon Crew Spark 1/15/100 verified new invited real mates; Shared Memories 2/100/2000 genuine responses by other people to authored Drops. First Spark / Rising Star / Legend and illustrative Aura+Gems reward amounts are all PENDING the founder's economy review. Unique per-participant/achievement/star ledger and idempotent backfill, no duplicate Starter/guide/Drop XP. Browser-local account cannot prove lifetime unique humans. Distinguish total score from limited first-page score; don't promise global totals if a Blob scan times out.

## Previously discussed, intentionally not silently removed
Original Daily Vibe Loop includes Daily Charge → Vibe Capsule → next-action chain; v0.8.x gets Capsule, not cancelled. Original two retention engines include Daily Aura + Crew Pulse/Reveal Chain; first v0.8 gets Daily Aura and SMALL Crew Pulse experiment, not the full Reveal Chain. The original blueprint also includes daily/seasonal missions, opt-in notifications, cosmetics, fair free/premium gifts, Recap/Memories, Plans, DMs/Moments/Blink and Arena; these remain in historical ROADMAP/PRODUCT_BLUEPRINT and are NOT silently added to first v0.8. Proxima profile shared-interest graph, compatibility percentages and nearby map require consent, identity and cost safeguards (later). Purple achievement UI is a design reference, not approval of unrelated music uploading or false ranks. Pink Aura Orb gets optional lightweight design exploration; paid AI Drop Copilot remains a separate value/cost experiment after core Create UX stability.

## Founder decisions still REQUIRED before any v0.8 implementation
A. **Variable deck assembly**: should 3/4/5 depend on only self-declared interests, number of real Crew actions, daily time/availability, or explicit user choice? What is the guaranteed solo supply? What if there are no quality eligible cards? Daily reset timezone.
B. **Daily Charge payoff without Capsules**: threshold, reset, cap, reward and meaning. Do NOT market an unopened Capsule.
C. **Achievements**: confirm first-three names/targets, non-streak Still Here vs consecutive days, XP amounts, historical member backfill and whether the two Coming Soon paths show future thresholds or just titles.
D. **Gems**: when exactly are they earned, are they awarded retroactively, does the user see *any* star-with-gem indication before a catalogue exists, and when do we implement real cosmetics? “Track but don't show until redemption” means no misleading Gems balance/reward promise.
E. **Small Crew Pulse experiment**: select (i) simple last-7-days response count toward a threshold or (ii) activity mixture with capped weights; define at least one actual payoff (factual recap/reveal or small Crew marker), windows, privacy, old-Crew score and lower bound for member count. Do not reward spammed chat/share attempts or invent participation.
F. **First v0.8 visual cut**: which screens (Home / Aura / Crew / Drop / Reveal) receive new art, whether lightweight Aura Orb v0.8 or 0.8.x, source license/asset ownership, 320–430px and reduced-motion/performance budget.
G. **AI experiment**: curated-only v0.8 vs one optional backend-key-protected Drop Copilot v0.8.x; privacy and hard inference budget.
H. **Release prerequisite**: field-test analytics correctness / fast Aura+Crew / no double Tenacious / real device checks and domain-URL persistence. Stabilization fixes must not be mislabeled as newly invented v0.8 features.

## Deliberate execution order after founder concludes this discussion
(1) Founder-approved exact v0.8 product scope and acceptance criteria, but do not implement yet. (2) Option A: stabilize accepted v0.7.3 field-test defects and benchmark. (3) Option B: choose/buy domain and safe web deployment without changing Blob context accidentally. (4) Option C: finalized phased v0.8 roadmap/SRS/economy/visual spec after the above decisions. (5) Implementation only on explicit later go-ahead; main remains untouched.
