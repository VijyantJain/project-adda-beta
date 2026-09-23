# Project Adda — ChatGPT Continuity & Project Operating System
Updated: 2026-09-22

## Problem
A long project must not depend on one ChatGPT conversation. Chats can become too long, context can be truncated, and no model should be expected to reconstruct exact code/product state from memory.

## Solution
Use three persistent layers:

### 1. GitHub = exact technical source of truth
Contains:
- current code
- commits
- branch history
- architecture docs
- current state
- decisions
- roadmap

### 2. Google Drive Project Adda folder = business/product source of truth
Contains:
- Living Product Ledger
- research
- visual references
- proposals
- test material
- master blueprint copies

### 3. ChatGPT chats = working sessions
Chats are workrooms, not the permanent database.

## Recommended chat structure
Do not keep one mega-chat forever. Use workstream chats:
1. Adda — Product & GTM
2. Adda — Frontend / UX
3. Adda — Backend / Supabase
4. Adda — Analytics / Research
5. Adda — Growth / Arena / Recommendations

A chat can end at a milestone. Start a new one before it becomes unusably long.

## Starting a new chat
Paste:

"Project Adda continuation. Read VijyantJain/project-adda-beta docs/PROJECT_CONTEXT.md, CURRENT_STATE.md, DECISIONS.md, ROADMAP.md, PRODUCT_BLUEPRINT.md and ARCHITECTURE_VNEXT.md. Inspect the branch specified in CURRENT_STATE.md. Read the Project Adda Drive Living Product Ledger where needed. Treat those sources and current code as authoritative over prior chat memory. Continue from Active Task."

Then state the specific task.

## Ending/handover protocol
Before abandoning a long chat, ask:
"Create Project Adda handoff."

The handoff should:
- update CURRENT_STATE.md
- record decisions in DECISIONS.md
- update ROADMAP if sequencing changed
- update Product Ledger in Drive
- note latest branch/commit/deploy
- note unresolved bugs
- note Active Task
- avoid leaving unique decisions only in prose chat

## Resuming from Point X
Do not say "continue where we left off" alone.
Say:
"Continue Project Adda from milestone M2 / decision D005 / commit <sha> / section <name> in PRODUCT_BLUEPRINT.md."

This gives an exact referent.

## Conflict rule
Priority:
1. explicit latest user instruction
2. current code + CURRENT_STATE.md
3. DECISIONS.md
4. PRODUCT_BLUEPRINT / ARCHITECTURE
5. Drive Ledger
6. chat memory

## Release discipline
Every testable release should have:
- semantic label (e.g. v0.5.8)
- branch/commit
- deploy URL
- one release note
- migration/state note
- known issues
- analytics period

## Why memory is not enough
ChatGPT Memory can preserve high-level context, but exact source code, schema, commit IDs, feature flags, and detailed product decisions must live in versioned documents.

## Documentation hygiene after each milestone
- Add specific feature requirements to a canonical file such as FIRST_FIVE_VIBE_RUN.md / REWARD_ECONOMY.md.
- Update CURRENT_STATE.md on an actual code/release transition.
- Append new decisions to DECISIONS.md, and change ROADMAP only if sequencing changed.
- Append a short linked summary to the Drive Ledger. Do not mirror enormous code snippets into Drive.
- Only call an idea SHIPPED when source and deployment status support it; distinguish preview from production and build checks from device E2E.

## Minimum continuity packet
If every other chat disappears, these files are sufficient to restart:
- PROJECT_CONTEXT.md
- CURRENT_STATE.md
- DECISIONS.md
- ROADMAP.md
- PRODUCT_BLUEPRINT.md
- ARCHITECTURE_VNEXT.md
- current GitHub branch
- Drive Living Product Ledger


## Current continuation checkpoint — v0.6.1
Read FIRST_FIVE_VIBE_RUN.md for the actual two new-user journeys, exact screenshot trophy asset, one-action Tenacious page and seeded-Crew invite prompt. Read ONBOARDING_IDENTITY_CONTACTS.md before adding OTP/handles/avatar/contact features. Verify CURRENT_STATE against current branch and preview deploy status; do not assume production main contains preview changes. Update the Living Product Ledger when new feedback changes a flow.

## Latest 2026-09-22 continuation checkpoint
Current branch v0.5-full-experience has newer v0.6.2 preview than production main. Source ZIP can be downloaded from https://github.com/VijyantJain/project-adda-beta/archive/refs/heads/v0.5-full-experience.zip. FIRST_FIVE_VIBE_RUN.md, ANALYTICS_V2.md and TECHNOLOGY_MIGRATION_PLAN.md are canonical for recent onboarding/analytics/hosting decisions. No Supabase projects were present in connected account at last check. Existing Netlify field-test Blob store must never be cleared or renamed. Per-device DP/name/bio editor is beta only; real OTP/signup not yet shipped.


## Latest v0.7 preview checkpoint
Start with docs/FEATURE_SPEC_CHECKLIST.md (103 stable IDs), docs/ONBOARDING_M07_SRS.md (current guided code vs blocked Auth), docs/CONTENT_ASSET_REGISTRY.md (Starter v2 + outstanding real-image work), docs/CURRENT_STATE.md (actual release), docs/DECISIONS.md (versioning/gender/invite rationale), docs/ROADMAP.md (gates). Branch v0.5-full-experience remains preview, not main. Download complete source/assets ZIP from https://github.com/VijyantJain/project-adda-beta/archive/refs/heads/v0.5-full-experience.zip. New photo/media assets may be incomplete; don't state world-class final photographic visuals are ready while D-020 open. Connected Supabase has no project/provider configured at last check, so verified OTP is blocked.

## 2026-09-23 v0.7.1 activation decision
Direct Tenacious no longer pressures users to invite friends; solo Aura/Home/Profile continue. Invited users keep exact target. Aura is display language only, legacy getVibe/analytics/storage unchanged. Guide requires dedicated modal actions, no skip, optional default/emoji avatar and guided profile; Crew list must mark user's answers. Checklist grows from 103 to 109 stable IDs. M0.8 Daily Aura Deck is a new planned personal-retention prototype, not shipped. Confirm development HEAD/Netlify status and actual mobile QA on resumption.

## Screenshot incident and v0.7.2 repair
Founder reported v0.7.1 direct Tenacious screenshot leads to blank 0 Aura with 0/0 badges and no guided tour, plus still-visible lowercase vibe and unsatisfactory repeated SVG silhouettes. Root cause direct route simply rendered Aura without Crew-dependent guide; getVibe timeout fabricated zero fallback. New no-Crew getAuraStarter uses same starter/v1 and guide/v1 participant data to show real 180 and six Starter trophies; solo guide uses independent persistent pending/state/done keys and launches AFTER Aura is hydrated, with three explicit Aura explainer cards then Home/Crew info/Create info/Profile. Prior 0.7.1 browsers with Tenacious recover. Invited returns original Crew/Drop with real answers. Starter v3 new-arrivals only, old v1/v2 answers retained; 24 local WebP photos and fallback, licensing master audit open. Current canonical checklist 115. See docs/RELEASE_v0.7.2.md and confirm current branch HEAD before edits. No main merge/Blob rename/OTP pretense.


## 2026-09-23 late — founder v0.7.3 crew discussion (SPEC ONLY)
Source baseline v0.7.2 HEAD 8b1da1789c2e7bad6110c6bdafbf911b1b11b377. A creator coming from completed Aura/Profile uses ordinary createCrew (which does not seed), and first-Crew guide currently belongs to older starterCreateCrew / invite path. Keep working v0.7.2 frozen. New draft docs are CREW_AND_DROP_ONBOARDING_V073_SRS.md and CREW_ONBOARDING_FLOWCHARTS_V073.md on separate design/v0.7.3-crew-drop-onboarding branch. Register proposed expansion 115→128, all new IDs SPEC. Three first-time entry points require distinct order: direct Starter first; Crew-link actual Crew first, then existing Drops OR Starter if none; Drop-link actual Drop answer first then Starter/Aura/Profile then Crew. First-ever created Crew guide includes 2-interest 5-drop idempotent shared seed and two actual answers, Crew invite, creator-only Settings and dedicated Mates; first custom Drop guide covers all six formats/real settings/once-only publish/exact Drop share. Pending founder choice: is 10-Card Starter required after new Crew-link users already answered 2 real Drops? No source code, Netlify main, deployment or store change in this design-only checkpoint.


## Founder-confirmed D038, 2026-09-23 — MANDATORY onboarding after first two Crew-link answers
For a first-time beta visitor opening a Crew invitation with at least two real unanswered Drops, the required order is: enter exact Crew → member tour → two genuine Drop answers → mandatory Starter 10/Tenacious → guided Aura/Profile → return to exact invited Crew → mandatory complete + first-custom-Drop tour → publish in THAT Crew → offer sharing exact newly created Drop → normal use. Already earned Crew points and response records are retained; Starter's 180 points count once. Preserve the original crewId across refresh. No new Crew creation, duplicate seed, duplicate answer or forced invitation. If fewer than two unanswered Drops remain, answer any genuine available Drop and proceed with a clearly described fallback without trapping the visitor. This decision supersedes any earlier “optional”, “deferred” or “pending” text about this specific cohort. New DROP-link entrants still answer the exact invited Drop FIRST before Starter. Existing visitors do not repeat Starter. DECIDED / SPEC, NOT IMPLEMENTED.

## v0.7.3 field-test implementation (2026-09-23)
Source code for direct/Crew-invite/Drop-invite journeys, first-created Crew tour, idempotent 5-seed interest pack, first authored Drop tutorial, Crew Mates/admin Settings and share handling is deployed to the development preview, NOT main. v0.7.2 recovery commit: 8b1da1789c2e7bad6110c6bdafbf911b1b11b377. Detailed flow SRS: docs/CREW_AND_DROP_ONBOARDING_V073_SRS.md; diagrams docs/CREW_ONBOARDING_FLOWCHARTS_V073.md; release evidence docs/RELEASE_v0.7.3.md. Static npm test 19/19, JS syntax and backend TS transpile pass. API-backed isolated QA on new Crew c_5e6d2e27bb confirms same Crew id on retry, five unique eligible seed types/two interest Drops (five on repeat), two real answers retained, one custom Drop on publish retry, and Starter 10=180; Aura with scoped actual Crew bonus=210. Actual on-device/full visual end-to-end of all three entries and invitation sheet is not independently verified; obtain field-test feedback and fix regressions before labeling production-stable or starting v0.8. No Avengers or existing user data reset; main remains unmerged.

## 2026-09-24 founder screenshot review and canonical cleanup
User observed analytics 15-second abort, Aura global scan and partial misleading warning, 2–3-second Crew fetch, active-tab false notification dots, duplicate header Mates, duplicate Tenacious, need lifetime three-star achievements, domain/DB/AI/visual revival. Backup branch backup/v073-before-sept24-feedback at f281d55e012e2ef96e92826b4d8958ce34cc2194; all 22 historical docs copied byte-for-byte to docs/archive/2026-09-24-pre-cleanup/, unchanged originals still in docs/. Candidate repair source code under fix/v073-sept24-field-test; Starter final Tenacious once; Crew concurrent reads, avatar chain and single Mates control; Aura fast truthful scoped score first with optional full sync; analytics cached/parallel reads plus 55s budget, NOT an indexed-SQL root cure. Test 25/25 source-contract tests, JS checks, API TypeScript transpilation passed on repair branch; real founder admin analytics + field-device acceptance STILL REQUIRED. New canonical START_HERE links product direction, field-test gates, v0.8 ideas, visual atlas, AI, domain runbook; no domain bought/Cloudflare database deployed. Uploaded visuals ZIP in original conversation. Do not promise ZERO timeout or incorrectly claim v0.8 implemented. Main protected.

## 2026-09-24 founder v0.8 five-way scope decision
D040 and docs/2026-09-24_V08_FOUNDER_DECISIONS.md supersede unapproved earlier minimal v0.8 cut: variable 3–5 Daily Aura interest/activity prompts; Daily Charge now/Capsules v0.8.x; three functioning achievements + two Coming Soon; earned Gems stored but not surfaced until redemption; small factual Crew Pulse experiment, full Mystery Reveal Chain deferred. Economy values/targets, Charge payoff, Pulse definition, visuals and AI still in founder discussion. User requested DISCUSSION first, then Option A stabilisation, Option B domain/web path, Option C phased scope specification, and only then implementation by explicit approval. No main merge or Blob mutation.

## 2026-09-24 D041 founder mechanics (not code approval)
Daily Aura has guaranteed three personal cards independent of Crew, optional 0–2 authentic social extras; Charge launches now and grants idempotent Aura completion reward plus progress toward long-term achievements (Capsules v0.8.x); launch three real three-star paths but titles/targets open; count lifetime active days separately from consecutive streaks with no silent fourth live path; store earned Gems invisibly, show only stars/Aura until usable cosmetic store; small Crew Pulse must require both actual meaningful actions and unique REAL participating mates, with caps. Full details in docs/2026-09-24_V08_FOUNDER_DECISIONS.md. Discussion → Option A stabilise → B domain → C phased SRS → explicit code go-ahead; main/Avengers/Blob protected.

## 2026-09-24 D042 achievements decision, no code yet
Founder selected three live paths Explorer (distinct genuine Crew answers only, NOT Daily Aura), Sparkmaker (original creations and peer responses: Star I 1 authored; II 20 authored+30 peer responses; III 200 authored+1000 peer responses), The Regular (cumulative genuine active days plus actual Daily Charge completion; streaks only optional submilestones). Retroactive stars AND one-time retro achievement Aura for provable existing beta milestones. Prelaunch Charge did not exist; DO NOT synthesize past Charge completion. Explorer and Regular threshold values, names, achievement Aura/gem rewards and level-curve extension still discussion; do not code until explicit approval. D040/D041 preserved. First A stabilisation then B domain then C final 0.8 spec by founder's instructed order.

## 2026-09-24 D043 founder achievement reward decision
+50/+300/+1500 achievement Aura for each of three paths, payable ONCE on earned Star I/II/III, including provable retroactive historic stars (up to 5,550 across full three paths). Show both earned stars and achievement-specific earned title; wording still pending. Explorer and The Regular numerical targets explicitly rejected as final; Sparkmaker 1 / (20+30 genuine peer responses) / (200+1000 peer responses) stays approved. Current Aura level curve ends at 2,000; discuss extension before implementation. No v0.8 code permission, main and Blob stores protected. D043 appended in founder decisions.

## 2026-09-24 D044 targets and naming checkpoint
Founder chose E2 Explorer 5/300/3000 distinct genuine Crew answers and R3 Regular 5 active days; 120 active+60 actual Charge-completion days; 730 active+365 actual Charge-completion days. Sparkmaker locked structure unchanged. Per path +50/+300/+1500 Aura including idempotent historical eligibility. Wants THREE complete naming systems (3 paths, nine star earned titles, all Aura level labels) and rethinks visible Aura level names with recorded scores preserved; thresholds/extension not yet approved. v0.8 code and main untouched; proceed scope discussion then Option A/B/C.

## 2026-09-24 D045 founder identity and full level-curve design
Hybrid Social Mastery naming + futuristic but performant Aura visuals. Founder wants ENTIRE Aura LEVEL CURVE REBALANCED and all user-facing level names reconsidered (not just beyond 2,000); preserve every earned Aura point and historic reward, version mapping and explain displayed level changes. Collect all legitimately earned title options; users select displayed titles independently within Explorer/Sparkmaker/Regular. Exact thresholds, level naming and 3-path titles still design discussion. Zero v0.8 application implementation approval; original A/B/C sequence maintained. See founder decisions D045.

## 2026-09-24 D046 founder design checkpoint
Expand exploratory new Aura progression to 25+ levels, full visible name/threshold rebalance and more playful/futuristic achievement titles; keep every earned Aura point and badge but do not preserve old visible Aura level names as collectible by default. Featured user-selected earned profile title AND individual earned titles per path. None of the exact level/name/threshold suggestions are accepted yet. No v0.8 coding; Option A/B/C sequence intact. See D046 founder decisions.

## 2026-09-24 D047 founder open-ended Aura decision
Do not assume the 33-level concept is approved: Aura progression is open-ended, with named chapters and periodic finite level releases; all stage names interleave playful-social and futuristic-luminous language. Versioned actual thresholds, keep genuine Aura accruing beyond highest published level, no fabricated next threshold. Preserve all scores/badges, replace old visible labels, maintain independently chosen featured/per-path achievement titles. v0.8 code NOT authorised; founder still discussing Daily Charge, Crew Pulse, exact names and launch-level curve before A/B/C.

## 2026-09-24 D048 founder checkpoint
Seven-day rolling hybrid real-activity + unique-mates Crew Pulse selected; exact score and payoff open. Launch 25+ Aura levels with count/thresholds after economy modelling, future named chapters open-ended. Daily Charge completion rule intentionally NOT chosen from earlier options; do not assume 3/3 personal card completion. Founder discussion before A stabilisation, B domain, C final spec; no app code/main change.

## 2026-09-24 D049 Daily Charge decision
Founder chose CHOOSE YOUR DAILY MISSION with +10 Aura one-time daily completion, and personal Charge completely Crew-INDEPENDENT. Do NOT propose or implement a Social Spark/Creator Mode mission requiring ordinary Crew answer/Drop creation to fill personal Charge; earlier illustrative social routes superseded. Offer solo-only mission choices; up to two genuine social Daily Aura extras still separate and contribute real Crew Pulse but zero personal Charge. Completion thresholds/per-card Aura/timezone unresolved. D040–D048 retained, no code/deploy, A→B→C after discussion.

## 2026-09-24 D050 selected personal mission structure and Aura rate
Founder chooses THREE DIFFERENT SOLO Daily Charge completion missions, +10 per genuine unique PERSONAL Daily Aura card, switching chosen mission allowed only BEFORE Charge completion. +10 one-time daily Charge bonus remains separate (max 3×10 +10=40 personal+Charge Aura/day with three guaranteed personal cards); 0–2 real Crew extras don't fill Charge and use legitimate Crew reward independently. Exact mission names/types/required counts and switching carryover still OPEN. No coding, release or user-data mutation. D040–D049 unchanged, A→B→C after scope discussion.

## 2026-09-24 D051 solo mission detail approved
Quick Play 2 distinct personal answers; Curious 1 curiosity-eligible card + one OTHER distinct personal answer; Creative Spark one eligible saved PRIVATE creative response. Three daily PERSONAL card slots are mission-aware; before Charge completes can switch and replace only unanswered cards, retaining all genuine saved answers/+10 per-card Aura, recomputing new route from eligible saved answers; +10 Charge once/day max. Do not farm new slots on switch; if new route impossible using remaining slots, need explicit honest fallback. Names/card classification/creative minimum/timezone pending. No v0.8 code authorised.

## 2026-09-24 D052 founder eight titles, CORE Orb, roadmap review
Star titles selected exactly: Explorer Pathfinder, Opinion Magnet, Infinite Explorer; Sparkmaker First Mover, Scene Architect, Star III NOT Legendary Catalyst, needs alternative; The Regular Familiar Face, Constant Star, Here to Stay. Evolving Aura Orb is permanent CENTER of product and first v0.8 identity/UI; app icon derived from master aspirational designed Orb, no false earned status. Old docs deferring entire Orb to 0.8.x superseded. New detailed phase/change ledger docs/2026-09-24_V08_RELEASE_SCOPE_LEDGER.md. User asks if now move A stabilise/B domain/C final SRS: yes these are next, no v0.8 coding until explicit approval, preserve Avengers/Blob/main.
