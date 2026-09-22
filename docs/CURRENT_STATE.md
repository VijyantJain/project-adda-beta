# Project Adda — Current State
Updated: 2026-09-22 · v0.6.1

## Active branch
v0.5-full-experience

## Active preview
https://deploy-preview-1--project-adda-field-test.netlify.app

## Current field-test store
Persistent Netlify Blob field-test store. Seeded Crew/member/Drop/answer/chat/image data must remain intact.

## Current product capabilities
- v0.6.1: exact screenshot-neon trophy full-screen reward stage, responsive question/creation/completion canvas, no redundant Tenacious/form buttons
- v0.6.1: auto-enrol only genuinely new invitee as provisional member, run Starter then finalize display name and enter exact invited Crew/Drop; existing named users remain direct
- v0.6.1: retry-safe Starter Crew creation with legacy five-seed protection and immediate in-app invite prompt; no reset of seeded Avengers Crew
- richer Home with genuine Vibe and Crew access, no fake public feed

- **NEW v0.6 First Five:** a new visitor without a Crew can immediately play 5 guided solo Starter Drops; optional Bonus 5, one-time server-authoritative Vibe rewards, real trophies and topical snippets, and Starter Crew creation with 5 real preseeded Drops
- Existing root visitors with known Crews, exact shared Drop links, Crew links and public Vibe links retain their former entry paths

- private Crew creation/join
- multi-Crew Home
- persistent top/bottom app shell
- temporary Adda logo
- icon-led bottom navigation
- Quick Answer
- Most Likely
- This / That (optional images)
- Vote
- Rate (optional image, editable rating labels)
- Predict
- adaptive reveal settings
- creator/manual reveal
- results + social insights
- newcomer gating for historical revealed Drops
- Crew Chat + emoji + unread indicator
- Crew settings/admin
- member avatars
- Recap
- personal Vibe Score / levels / streak / badges / signature / current Crew rank
- public Vibe profile
- private analytics dashboard
- visitor/device/coarse geo/acquisition/product funnel/error analytics

## Immediate live-build changes completed
1. Temporary logo is wired into Home and reusable fixed headers.
2. Fixed top shell is used on Drop results, live answers, reveal countdown, join/start/error/contextual screens as well as Home/Crew/Vibe/Profile.
3. In-app identity links now open Vibe profiles without typing URLs:
   - Crew mates
   - named voters
   - Short Answer respondents
   - Chat senders
   - Most Likely result identities
4. Existing field-test data remains unchanged.

## v0.6 reward/architecture contract
- Source-of-truth detail: docs/FIRST_FIVE_VIBE_RUN.md and docs/REWARD_ECONOMY.md.
- Starter is stored only at starter/v1/<participantId>; original Crew/member/Drop/response/chat/media records untouched.
- Starter rewards up to 180 Vibe once per person/browser ID (10 per distinct answer, +30 first-five, +50 all-ten).
- Starter events are analytically distinct from real Crew Drop answers.
- First Five uses five local original SVG scenes; bonus cards use CSS/emoji gradients. No remote image dependency.
- Future gifting/paid cosmetics are documented as concepts, not live functionality.

## Product work next
Do not add the entire future roadmap to the live test at once.

Next strategic prototype after current field test:
### Daily Vibe Loop v1
Personal loop independent of Crew participation:
- Daily Deck of personalized micro-actions
- immediate Vibe reward
- Daily Charge meter
- streak
- Mystery Capsule unlock
- visible profile/status reward
- next-action chain
- Arena as always-available supply when Crews are quiet

Parallel group loop:
### Crew Pulse + Reveal Chain
Meaningful Crew activity fills a group meter and unlocks socially interesting factual Reveals.

## Infrastructure next
After current field-test learning is captured:
- migrate durable product data to Supabase/Postgres
- use Supabase Realtime for Crew/DM/notification updates
- Supabase Storage for avatars/drop media/moments/ephemeral media
- implement RLS and proper authentication
- keep static frontend hosting independent from data layer

## Known technical debt
- browser-local Crew discovery is not true cross-device membership
- polling still exists in parts of current Netlify beta
- analytics/session semantics are beta-grade
- current participant identity is browser-local, not authenticated identity
- current public profile IDs are participant IDs and should become stable profile/user IDs after authentication
- current media pipeline is beta-only
- current profile has no user-uploaded avatar
- current prediction format needs outcome resolution/reputation later

## Active Task
Mobile-smoke-test v0.6.1 solo and invited First Five on a fresh browser, including 5 answers, refresh/retry idempotency, Bonus 5, trophy/Vibe score, Starter Crew 5-Drop seed, shared existing Crew/Drop flows, and unchanged Avengers data. Collect activation funnel and qualitative feedback. Fix blockers only, then plan daily repeating Vibe Run and gifting separately.

## Vibe level curve (v0.6)
Early levels have small thresholds 0/10/25/45/60/100/150, followed by wider steps 300/600/1000/2000. Existing earned scores remain; displayed numeric level indexes shift after adding the early levels. Solo players can view earned Vibe after First Five without creating a Crew.

## Identity and upcoming profile work
Current local participantId is not a true lifetime user ID; no real email/phone OTP or contact sync is deployed. See docs/ONBOARDING_IDENTITY_CONTACTS.md for verified account merge, handles, DP/avatar, bio and permission-on-intent contacts.

## Latest v0.6.1 finish
After milestone 5/10, neon trophy plays in full-viewport splash with tap-to-dismiss and reduced-motion handling, then the standard reward details. Existing-user generic Crew Create/Join pages now retain bottom nav; focused first-run Starter/name screens intentionally do not. Main production remains unmerged.

## v0.6.2 (2026-09-22) — Invited welcome, Tenacious, first-Crew tour, analytics v2, local profile
- A fresh invited Crew/Drop browser identity now sees the SAME initial "5 quick ones. Find your Vibe." welcome as a direct first visitor; the app no longer starts the first question automatically.
- Both cohorts MUST complete all ten Starter choices; First Five trophy leads into next five (not to Crew) and Tenacious is the sole entry to Create Crew or Enter invited Crew.
- First Crew guide: explain Crew, spotlight first Drop, guide answer and second Drop, celebrate completion; skip allowed and state stored per Crew in browser. Exact shared Drop invites start the guide on that Drop. Fixed header/bottom bars remain on post-onboarding screens.
- Functional beta profile editor stores name/bio/locally compressed DP on device only. It is NOT a verified signup, shared avatar, global handle reservation or cross-device backup; those remain M1.
- Private founder analytics v2 adds traffic-quality signals, D1/D7 eligible cohorts, direct/invited entry segments, First Five completion, first-answer latency, errors by message, source/paths/screens/hourly, engagement and active respondents. Analytics v2 dictionary: docs/ANALYTICS_V2.md.
- Screenshot-only USA/Ashburn/Linux signals do not establish Netlify internals or unique US humans. These rows are retained; only explicit automation UA/missing-browser heuristics flagged for review.
- No existing Crew/Drop/response/chat/media data reset. Current branch differs from main; PREVIEW only. Source ZIP: GitHub branch archive; see docs/TECHNOLOGY_MIGRATION_PLAN.md.


## M0.7 preview — CURRENT (2026-09-22)
- New browser starters use versioned v2 quirky content: six universal questions with s6 explicit interest choice, two interest-led private personalized Starter questions, and two final universal cards. Exact old v1 starter records continue their old questions and awards unchanged; no original Crew data reset.
- First-time Crew guide now begins with optional gender + interest confirmation and two PRIVATE interest-led questions worth 10+15 one-time server Vibe, then two ACTUAL shared Crew Drop answers, then spotlight walkthrough left-to-right of Home, Crew, +, Vibe, Profile. Profile coach marks guide optional photo, bio and username draft; no fake global username availability.
- Guide points have separate additive guide/v1/<pid> backend ledger; retry returns zero additional earned points. Five-tab tour state and Crew two-answer progress resume after browser refresh; Profile offers replay without duplicating points.
- Browser-local profile supports name, bio, locally compressed DP, username draft, interests and optional private gender. Initial s6 interest is preselected when Crew personal guide begins. No gender-only exclusion; different user's private cards never fragment common shared Crew results.
- Real OTP signup / verified account / public DP & username availability **NOT deployed** because no configured Supabase Auth and delivery provider/project. The guided beta ends its currently available steps as awaiting_provider, not OTP verified; app remains usable.
- Starter art remains five original bundled SVG illustrations plus user-supplied neon trophy. Premium realistic/licensed image and motion library is an OPEN design/asset acceptance item; do not claim it is produced.
- Full canonical 99-item ledger docs/FEATURE_SPEC_CHECKLIST.md; feature-specific implementation SRS docs/ONBOARDING_M07_SRS.md and asset docs/CONTENT_ASSET_REGISTRY.md. Preview branch only; real iPhone/Android test required before wider sharing.
