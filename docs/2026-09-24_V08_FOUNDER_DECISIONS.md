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

## D041 — Second founder decision round: v0.8 mechanics (2026-09-24)

Six decisions, **confirmed scope direction / not implementation approval**:

1. **Daily composition = three guaranteed PERSONAL cards plus zero, one or two REAL-ACTIVITY extras.** Always make the three base cards genuinely playable even when the user has no Crew or there is no friend activity. Extras may include meaningful pending Crew activity; do not invent a fifth card, duplicate Starter questions, give phantom votes, or let the number of Crew connections limit the user's guaranteed personal supply. Interests guide personalization; no sensitive/protected-trait inference. Date boundaries, repeat avoidance and deck scoring still open.
2. **Daily Charge payoff = a modest, idempotent Aura completion bonus AND progress toward a long-term achievement.** Charge launches in first v0.8. No Capsule-open UI or claim in first release; Capsules remain v0.8.x. Charge threshold, genuine action weight, bonus amount and cap remain pending. Charge progress is not a cash-equivalent or fake countdown.
3. **Three real three-star achievement paths remain in first v0.8, but NAMES/TARGETS UNAPPROVED.** Historical candidate trio is Drop Explorer / Dropsmith / Still Here, with Crew Spark / Shared Memories displayed only as Coming Soon. The proposed 5/150/3000, 1/40/500 and 3/60/730 are EXAMPLES, not locked thresholds. Do not mark more than three paths live until founder separately changes count.
4. **Total active days and consecutive active-day streaks are DIFFERENT measurements AND DIFFERENT achievement concepts.** Do not call a 730-day cumulative goal a consecutive streak; do not erase lifetime progress if a streak breaks. The existing beta streak meter may continue to show consecutive days. A cumulative Still Here candidate and a separate consecutive-streak achievement are possible; **whether the consecutive-streak achievement replaces one of the three launch paths or waits for v0.8.x is OPEN**. No silent fourth working path. Day boundary, timezone, missed-day forgiveness and one meaningful action/day rules need approval.
5. **Gems ledger remains hidden until an ACTUAL functional cosmetic catalogue/redemption.** In first v0.8 only show earned stars and truthful Aura rewards; do not announce Gems earned, display Gem rewards or show a Gem balance before launch of the catalogue. Ledger can record awarded gems once, ideally with versioned reward amounts, but past milestones must be backfilled idempotently and award quantities explicitly approved. No pay-to-win, cash-like or random paid rewards.
6. **Crew Pulse experiment is HYBRID: genuine Crew activity PLUS distinct REAL participating mates.** Not simply a total action count or just the current member count. No points for fictitious votes, self-invites, opened shares, idle browsing or unlimited chat spam. The meter needs independently explainable contributions and authentic actual social participation; window, thresholds, relative weighting, cap, member privacy minimum and factual payoff remain PENDING. This is an intentionally small truthful experiment, NOT permission to build full Mystery Reveal Chain / league / public leaderboard.

### Revised illustrative user-visible v0.8 loop — not final UX copy
Open Adda → three available personalised mini cards even if solo → zero-to-two genuinely available activity extras → one or more actions → real Aura, Daily Charge and separate cumulative-day/streak tracking as applicable → optional daily completion bonus + achievement progress → user sees real upcoming 3-star milestones; can enter real Crew Pulse only if their Crew has genuine participants/activity. No visible Gems or Capsules in this release.

### Explicit unresolved constraints
- Composition guarantee: when the editorial personal pool cannot provide three high-quality non-repeat cards, improve/fill curated content rather than create fake “Crew activity” extras.
- If Crew extras are separately rewarded as ordinary Crew Drop answers, Charge/achievement credit may advance but duplicate base Aura must not be granted for the same action.
- An inactive day should not erase cumulative achievement progress. Consecutive streak loss should not remove already-earned Aura or badges.
- Existing historical users deserve credible achievement backfill without replaying Starter completion rewards.
- One owner/admin or one person spamming messages cannot fill a social Pulse designed for genuine group participation.

See D040 for the five initial v0.8 decisions; D041 adds the founder's detailed mechanics and supersedes contradictory wording about fixed card count, Capsule dependency, all Crew Pulse being later, or using “Still Here” interchangeably with consecutive streaks.


## D042 — Founder-selected three-path achievement architecture (2026-09-24; DESIGN, NOT CODING)

**Locked by founder** after D040/D041:
- Exactly THREE working three-star paths: Explorer + Sparkmaker + The Regular. Two other paths can remain visible as Coming Soon, not a surprise fourth active achievement.
- Explorer qualifies by distinct genuine saved **Crew Drop answers ONLY**; personal Daily Aura answers are separately measured/rewarded and never counted as Crew answers. Genuine seeded Crew Drop responses qualify; re-answering same Drop doesn't increase unique count.
- Sparkmaker combines **original user-authored Drop creation AND real peer responses**: approved requirement structure Star I=1 original Drop, Star II=20 original Drops AND 30 valid responses by other members, Star III=200 original Drops AND 1000 valid peer responses. System-seeded Drops are not user authored. Count distinct real (Drop, respondent) records, exclude creator, prevent reciprocal farming/duplicate events; exact abuse caps pending.
- The Regular is a **hybrid of distinct genuinely active days AND Daily Charge completions**. Cumulative active days and consecutive streaks are separate statistics; streaks are optional SUB-milestones within The Regular, not a fourth standalone working path. Streak break must not remove past Aura, earned stars or cumulative days. Active-day requirements, Charge thresholds, streak sub-milestone cosmetics and daily time zone remain subject to founder confirmation.
- Existing verified-by-record beta participants must receive **earned historical stars AND one-time retroactive achievement Aura**, with per-participant/path/star unique reward provenance and a dry-run/backfill audit. Historical Daily Charge completions did not exist before launch: NEVER invent them or silently equate historical answers to completed Charge. Choose founder-approved fair legacy eligibility (e.g. Star I eligible on cumulative active-day threshold alone; future Star II/III require actual Charge completions after feature launch), and backfill only milestones proven from timestamps. Do not retro-award base +10/+30 participation scores a second time.
- Exact names, Explorer thresholds, Regular targets, streak sub-targets, tier Aura bonus sizes, Gem grants, existing level curve extension and historical-data trust rules remain open. Earlier names/targets and +20/+150/+2000 or +25/+200/+2000 schedules are **illustrations, not approvals**.

**Current review candidates, NOT decisions:** Explorer 5/150/2000 distinct Crew answers; Regular 3 active days for Star I, 45 active +20 real Charge completion days for Star II, 365 active +180 Charge completion days for Star III. Streak optional 3/7/30 days cosmetic-only unless a separate award is explicitly approved. Sparkmaker Star I requires one actual authored Drop; a separate high-star peer-uniqueness/fraud threshold is an implementation/ethics gate, not a hidden post-hoc failure requirement.

Source: docs/2026-09-24_V08_FOUNDER_DECISIONS.md. This decision does NOT authorize code/deployment or alter preexisting Crew, Drop, starter, guide or Aura records.
