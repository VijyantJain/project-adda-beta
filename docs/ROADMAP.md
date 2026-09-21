# Project Adda — Product Roadmap
Updated: 2026-09-22
Roadmap is milestone-based; dates should follow validation rather than force feature shipping.

## M0 — Current Field Test (NOW)
Goal: validate both entry-through-Drop and a direct first-timer's play-before-create experience.
Ship only:
- blocking UX fixes
- stable global app shell
- clickable identities -> Vibe profile
- analytics/error instrumentation
- current Drop/Chat/Vibe feature set
- First Five + optional Bonus 5 + cumulative Vibe + introductory trophies
- preseed 5 real Drops for a new Crew without requiring question authoring
- separate First Five funnel and completion-to-Crew conversion

Do not add major new social systems during the live wave.

Exit evidence:
- usable/stable on mobile
- measurable funnel
- several real Crews tested
- qualitative feedback captured
- understanding of top Drop formats and abandonment points

## M1 — Identity + Realtime Foundation
Goal: make Adda a durable account-based product.
- Supabase migration
- authentication
- stable profile IDs
- avatars
- cross-device Crew membership
- RLS/security
- realtime Crew updates
- notification inbox foundation
- media storage/CDN foundation
- block/report primitives
- public/private profile controls

## M2 — Personal Retention Beta: Daily Vibe Loop
Expand the finite v0.6 Starter Deck into a daily/seasonal reward supply, not an infinite reward loop for repeating the same starter questions.
Goal: prove return behavior even when friends are inactive.
- Daily Deck (small personalized set of micro-actions)
- Vibe XP/score
- Daily Charge meter
- streak
- Mystery Capsule
- missions
- badge progress
- unlockable profile/Vibe cosmetics
- next-action chain
- Arena-backed fallback actions
- retention cohort analytics

Exit evidence:
- D1/D7 return improvement
- repeat Daily Deck completion
- users care about score/streak/unlocks without prompting

## M3 — Private Social Suite
Goal: deepen direct social use.
- DMs v1 (text, emoji, Drop/profile sharing)
- message requests
- mute/block/report
- Moment/Story v1 (24h photo/text)
- audience controls: Crew / accepted followers / custom circle
- Moment replies -> DM
- viewers list
- reactions
- view-once "Blink" image in DM/Crew
- expiry/deletion worker
- notifications
- templates/remix
- richer prompt packs

## M4 — Crew Depth
Goal: make each Crew valuable beyond Drops.
- Crew Pulse + Mystery Reveal Chain
- weekly Crew challenges
- Plans/events/RSVP
- shared lists
- pinned memories/inside jokes
- Moments inside Crew
- Recap -> Memory archive
- recurring rituals
- Crew titles/cosmetics
- lightweight moderation roles

## M5 — Arena Growth Beta
Goal: create always-available discovery and public participation.
- rolling public feed
- public Drops
- public Moments where permitted
- follow graph / accepted-private account model
- interest model
- personalized candidate generation/ranking
- "not interested" / hide controls
- diversity/freshness/exploration
- creator/profile discovery
- deep links back to profiles/Crews/Drops
- safety moderation and rate limits
- feed experiment framework

## M6 — Ephemeral + Messaging Expansion
- short video Moments
- voice/image messaging
- view-once video
- replay policies
- message search
- richer group DMs if validated
- story highlights (optional permanent saves)
- native-app media capture UX
- push notification controls

## M7 — GTM Hardening
- native-quality client (PWA/native decision based on usage)
- push notifications
- robust abuse/moderation operations
- scalable recommendation service
- media transcoding/CDN
- observability/SLOs
- experimentation platform
- onboarding localization
- regional/Hinglish packs
- accessibility
- privacy/security review
- app-store readiness if native
- brand/name finalization

## M8 — Monetisation (only after retention)
See docs/REWARD_ECONOMY.md for free gifts, premium cosmetic gifts and fairness/anti-farming questions; no paid Vibe purchases are approved.
Candidate—not locked:
- profile/Vibe cosmetics
- Crew themes/effects
- premium Crew/admin tools
- collectible/event badge packs
- brand/campus/event experiences
- creator tools
Avoid damaging the core social loop with premature ads.


## v0.6.1 corrective activation milestone (preview)
- Full-width visual Starter cards and screenshot-exact neon trophy reward stage.
- Solo user at Tenacious has one Create Crew CTA, a seeded pack and in-app invite dialog.
- Invited newcomer joins provisionally, completes Starter once per beta browser and lands in original Crew/Drop.
- Home becomes a useful real Crew/Vibe dashboard; the Arena/public feed is not yet shipped.
- Exit check: first-five completion, refresh/idempotent points, ten completion, five seeded Drops, native share, invited return, existing Avengers data, fixed header/bottom bar after onboarding and real mobile usability.

## M1 account/profile/contact dependencies
Real email + phone OTP (configured Supabase/email/SMS provider), verified profile IDs, merged browser guests and Vibe, unique handle availability, DP/avatar, optional bio, per-profile privacy, optional permission-on-intent Find Friends. See ONBOARDING_IDENTITY_CONTACTS.md.
