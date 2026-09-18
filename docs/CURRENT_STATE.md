# Project Adda — Current State
Updated: 2026-09-18

## Active branch
v0.5-full-experience

## Active preview
https://deploy-preview-1--project-adda-field-test.netlify.app

## Current field-test store
Persistent Netlify Blob field-test store. Seeded Crew/member/Drop/answer/chat/image data must remain intact.

## Current product capabilities
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
Verify the global shell/profile-link hotfix on real mobile browsers, then freeze the current field-test experience except for blocking defects. Collect field-test evidence while designing vNext around the Daily Vibe Loop, Crew Pulse, DMs, Moments/Blink, Plans/Memories and Arena in documented/separate implementation work.
