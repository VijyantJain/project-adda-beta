# Project Adda — Master Feature & Specification Register

Canonical register. Updated 2026-09-22. Scope: **Project Adda only**. The name Adda is temporary; this is not the separate global broad-adult product. This is a living specification index, NOT a claim that every idea has shipped.

Status legend:
- [x] **BETA** = feature implemented in current field-test preview; real multi-device acceptance may still be pending.
- [ ] **IN_PROGRESS** = actively in current milestone; do not distribute as finished.
- [ ] **SPEC** = concept/product/architecture requirements documented; engineering not delivered.
- [ ] **PLANNED** = future milestone, not currently functioning.
- [ ] **BLOCKED** = requires Auth/DB/media/security/payment/domain/other user-approved infrastructure.
- [ ] **VERIFIED** = device-tested acceptance evidence; upgrade BETA only with test date, test device and outcome.

**Source of truth priority:** code + this register → feature specification → CURRENT_STATE → DECISIONS → ROADMAP → Drive Living Product Ledger → chat summaries. Never replace prior feature silently. Removal/deprecation requires a decision ID and migration plan. New feature request adds an ID here with owner milestone, dependencies and acceptance notes.

## Release / data protections
- Main = audience-facing production. Develop on v0.5-full-experience preview and use deploy preview; do not spend production deploy credits on per-feature patches.
- Do not rename/clear Netlify Blob stores; old Avengers member/Drop/answer/chat/media state is preserved.
- Beta IDs are browser-local, so “unique users” ≠ verified people. A verified account and OTP are infrastructure gates.
- Current guide uses real actions; rewards require server-side one-time ledger, not arbitrary repeat UI taps.
- Personalized items are PRIVATE onboarding only; one shared Crew retains coherent public-to-Crew shared Drop inventory.
- Real photography or generated art needs tracked licensing/creation, bundle compression and accessibility alt text. No unlicensed scraped product ads.
- Gender is optional, inclusive and secondary to explicit interests; never use it to infer identity or block access to a harmless interest.

## P — Product, experience and growth
- [x] **P-001** Working Adda branding/logo purple shell — `BETA`
- [x] **P-002** Drop-first external acquisition and deep links — `BETA`
- [x] **P-003** Direct visitor First Five + next Five + Tenacious — `BETA`
- [x] **P-004** Invited visitor provisional join + same intro + return to original Drop/Crew — `BETA`
- [x] **P-005** Achievement celebration and original neon trophy asset — `BETA`
- [ ] **P-006** Separate meaningful personal vs Crew participation loops — `SPEC`
- [x] **P-007** Persistent multi-Crew navigation and browser-known Crews — `BETA`
- [ ] **P-008** Globally persistent cross-device list of user's Crews — `BLOCKED`
- [x] **P-009** Five fixed tabs Home/Crew/Create/Vibe/Profile — `BETA`
- [x] **P-010** Onboarding explain/answer two real Crew Drops — `BETA`
- [ ] **P-011** Five-tab left-to-right guided in-app tour — `IN_PROGRESS`
- [ ] **P-012** Guide profile photo, bio, display name, username, interests — `IN_PROGRESS`
- [ ] **P-013** Guide real OTP verification before authenticated tour completion — `BLOCKED`
- [ ] **P-014** Persistent resumable guide state across refresh and accidental exit — `IN_PROGRESS`
- [x] **P-015** First-run conversion analytics and feedback prompts — `BETA`
- [ ] **P-016** Hinglish/English language selection and accessibility — `PLANNED`
- [ ] **P-017** A/B test intro vs invite, copy and content packs — `PLANNED`

## D — Drops and creation
- [x] **D-001** Quick Answer (text replies, live display) — `BETA`
- [x] **D-002** Who's Most Likely multi-member options — `BETA`
- [x] **D-003** This or That two alternatives — `BETA`
- [x] **D-004** Vote multiple options — `BETA`
- [x] **D-005** Rate 1–5 with editable inline labels — `BETA`
- [x] **D-006** Predict yes/no outcome distinct from This/That — `BETA`
- [x] **D-007** 2/3/5/current-members reveal modes and threshold rules — `BETA`
- [x] **D-008** Names/attribution only if enabled post-reveal — `BETA`
- [x] **D-009** Allow answer changes with server enforcement — `BETA`
- [x] **D-010** Late joiner answers before seeing reveal — `BETA`
- [x] **D-011** Creator Drop deletion and admin controls — `BETA`
- [x] **D-012** Rate photos in current beta — `BETA`
- [x] **D-013** This or That comparison images in beta — `BETA`
- [ ] **D-014** Short videos for rating and comparisons — `PLANNED`
- [x] **D-015** Meaningful fact/reveal insights, self-vote — `BETA`
- [ ] **D-016** Creator templates/remix/share cards — `PLANNED`
- [ ] **D-017** Format-specific settings matrix + re-conceptualized Drops — `SPEC`
- [x] **D-018** Starter Crew seeds five real shared Drops — `BETA`
- [ ] **D-019** Two private interest-led guided Drops, shared Crew remains coherent — `IN_PROGRESS`
- [ ] **D-020** Premium original realistic photography/animation asset library — `IN_PROGRESS`
- [ ] **D-021** Content rights/attribution/source registry and compression pipeline — `IN_PROGRESS`

## C — Crew, chat, social
- [x] **C-001** Crew hub (Drops, Chat, Vibe, Recap, Mates) — `BETA`
- [x] **C-002** Invite via native share plus fallback — `BETA`
- [x] **C-003** Invite popup with pre-filled friendly message — `BETA`
- [x] **C-004** Crew creator/admin rename/remove/leave/delete — `BETA`
- [ ] **C-005** Admin transfer/roles/moderation/report/block — `PLANNED`
- [x] **C-006** Clickable names/avatars into Vibe — `BETA`
- [ ] **C-007** Mates profile images/avatars from verified profiles — `BLOCKED`
- [x] **C-008** Unread chat red indicator — `BETA`
- [x] **C-009** Emoji picker in Crew Chat — `BETA`
- [ ] **C-010** Sticker collection and custom gifts — `PLANNED`
- [ ] **C-011** Weekly *time-filtered* Recap and archives — `PLANNED`
- [ ] **C-012** Crew Pulse and Mystery Reveal Chain — `PLANNED`
- [ ] **C-013** Plans/date/location/RSVP/reminders — `PLANNED`
- [ ] **C-014** Pinned shared Memories, inside jokes, highlights — `PLANNED`
- [ ] **C-015** Mutual social graph/follow/accepted private profiles — `BLOCKED`
- [ ] **C-016** 1:1 DMs/message requests — `BLOCKED`
- [ ] **C-017** 24-hour Moments/Stories image/text — `BLOCKED`
- [ ] **C-018** View-once Blink photos and signed ephemeral storage — `BLOCKED`
- [ ] **C-019** Video Moments, short clips, voice messages — `PLANNED`
- [ ] **C-020** Dedicated public rolling Arena/personal interest feed — `PLANNED`
- [ ] **C-021** Cross-Crew notifications and push opt-in — `PLANNED`

## V — Personal Vibe and retention
- [x] **V-001** Factual Vibe score, levels, early tiers — `BETA`
- [x] **V-002** First Five one-time 180 total points — `BETA`
- [x] **V-003** Six Starter badges/trophy case — `BETA`
- [x] **V-004** Personal Vibe page and external/in-app Vibe profile links — `BETA`
- [x] **V-005** Streak/badges/signature/response statistics — `BETA`
- [x] **V-006** Profile image/name/bio *device-local* editing — `BETA`
- [ ] **V-007** Interest packs optional gender secondary signal/other/skip — `IN_PROGRESS`
- [ ] **V-008** Optional gender never inferred from browsing — `SPEC`
- [ ] **V-009** Profile username local draft (not unique or verified) — `IN_PROGRESS`
- [ ] **V-010** Verified username availability/reservation — `BLOCKED`
- [ ] **V-011** DP global upload and public avatar display — `BLOCKED`
- [ ] **V-012** Email OTP and mobile OTP with abuse throttles — `BLOCKED`
- [ ] **V-013** Guest identity merge and guaranteed cross-device recovery — `BLOCKED`
- [ ] **V-014** Privacy, profile visibility and data controls — `BLOCKED`
- [ ] **V-015** Daily Vibe Deck/Charge/Streak/capsules — `PLANNED`
- [ ] **V-016** Gifts to friends, free social effects — `PLANNED`
- [ ] **V-017** Premium cosmetic gifting/monetization and anti-farming — `SPEC`
- [ ] **V-018** Profile themes/frames/pinned trophies — `PLANNED`
- [ ] **V-019** Optional safe, limited direct-contact discoverability — `BLOCKED`

## A — Analytics, operations, infra
- [x] **A-001** Private founder analytics with admin key — `BETA`
- [x] **A-002** Visitors, screen names, geography, devices, source — `BETA`
- [x] **A-003** D1/D7 cohorts, funnels, segmentation and latency — `BETA`
- [x] **A-004** Explicit UA automation signal vs Ashburn/USA caveat — `BETA`
- [ ] **A-005** Guide steps/profile content pack exposure+completion — `IN_PROGRESS`
- [ ] **A-006** Retention D30 and privacy-safe verified user analytics — `BLOCKED`
- [x] **A-007** Errors and network reliability diagnostics — `BETA`
- [x] **A-008** Event/version schema and analytics data dictionary — `BETA`
- [x] **A-009** Netlify production/preview data isolation and backup — `BETA`
- [ ] **A-010** Professional owned domain and redirect strategy — `BLOCKED`
- [ ] **A-011** Cloudflare Pages/Workers migration — `PLANNED`
- [ ] **A-012** Supabase Postgres/Auth/Storage/Realtime/RLS project — `BLOCKED`
- [ ] **A-013** Safe migration preserving Crew and every Drop record — `PLANNED`
- [ ] **A-014** PWA installability/offline-safe caching — `PLANNED`
- [ ] **A-015** Expo/React Native iOS and Android client — `PLANNED`
- [ ] **A-016** Native push and app-store publication — `PLANNED`
- [ ] **A-017** 18+ safeguards, abuse/report/mute/block, ephemeral truthfulness — `SPEC`
- [ ] **A-018** Automated unit/API/browser/device tests and staging — `IN_PROGRESS`
- [x] **A-019** Source ZIP and code/asset backup from GitHub — `BETA`
- [x] **A-020** Full SRS, current state, decision log, roadmap, migration specs — `BETA`
- [ ] **A-021** Canonical comprehensive checkboxes with status and owner gate — `IN_PROGRESS`

## New feature intake rule
1. Allocate next stable ID, source chat/date and user-facing problem.
2. Specify UX entry/exit, visuals, copy, state transitions, privacy/access, backend schema, analytics event, error/retry, edge cases and backward compatibility.
3. Assign `BETA/IN_PROGRESS/SPEC/PLANNED/BLOCKED` accurately; list infra dependency if blocked.
4. Implement behind preview and run syntax, unit, API/build, iPhone/Android acceptance before changing to `VERIFIED`.
5. Update linked source spec, change log, CURRENT_STATE and Decisions; append Drive Ledger entry and branch commit.
6. Do not confuse designed/implemented/verified/cutover; different checkboxes and release evidence.

## Milestone gates
- **M0.7 onboarding visual & guided beta:** private interest pack, ten improved starter questions, 2 personal guide cards, five-tab guide, guided local profile; event coverage. Acceptance: both cohorts complete journey without breaking existing Crew links/answers, + buttons genuinely clickable; no OTP claim.
- **M1 identity foundation:** configured Supabase/Auth, SMS+email providers, verified unique handles and profile media, guest account migration, privacy and safe one-time server reward ledger.
- **M2 retention:** Daily Deck/capsules/personal next action, Crew Pulse.
- **M3 private suite:** DMs/Moments/Blink with real authenticated media and expiry.
- **M4–M5 Crew/Arena:** Plans/Memories/Recap and personalized public rolling feed.
- **M6–M8** media expansion, GTM/native app hardening and optional cosmetic economy.

## Associated sources
- docs/PRODUCT_BLUEPRINT.md (full vision)
- docs/ROADMAP.md (milestones)
- docs/DECISIONS.md (change rationale)
- docs/FIRST_FIVE_VIBE_RUN.md (starter and cohorts)
- docs/ONBOARDING_IDENTITY_CONTACTS.md (profiles, verified OTP, contacts)
- docs/REWARD_ECONOMY.md (score and gifts)
- docs/ANALYTICS_V2.md (definitions)
- docs/TECHNOLOGY_MIGRATION_PLAN.md (infra)
- docs/ARCHITECTURE_VNEXT.md and docs/SUPABASE_SCHEMA_DRAFT.sql (target schema)
- docs/CHATGPT_CONTINUITY.md and Drive Living Product Ledger (handoff)
