# Project Adda — v0.6.1 First-Time Journey Repair

Date: 2026-09-22. Branch: v0.5-full-experience. PREVIEW only.
Preview URL: https://deploy-preview-1--project-adda-field-test.netlify.app

## Implemented
- User-provided exact neon-trophy art cropped into local WebP asset; full-width milestone/completion screens with animated flashes, sparks and confetti; local SVG fallback and reduced-motion support.
- Full-width mobile Starter cards; no thin floating nested app layer.
- Tenacious screen displays real earned Starter Vibe, labeled Starter achievements and ONE primary CTA appropriate to cohort.
- Solo: Start my own Crew -> one name/Crew form -> backend seeds 5 real Drops -> in-app prefilled invite prompt -> explicit share action.
- Invited: auto-provisional Crew membership from invite; First Five then one Enter <Crew> CTA -> name -> originally linked Crew/Drop, without empty Create Crew detour. Previously named members enter shared links directly.
- Backend Starter Crew creation saves ID before idempotent seed, retries after interruptions, and leaves pre-existing five-seeded Crews unchanged.
- Richer authentic Home/Vibe/Crew dashboard and fixed app shell outside onboarding.
- No fake social percentages/OTP signup, no production data migration/reset.

## Verified
Starter source parses. 27 simulated user-journey/flow checks passed on v0.6.1 source, including solo and invited Tenacious CTA, reward points and single Create CTA. Netlify preview build status succeeded on code head before docs finalization. Actual real iOS/Android browser E2E still pending.

## Follow-up
M1 verified mobile/email OTP via configured provider, authenticated cross-device account/profile merge, unique username, avatar/DP, bio, profile privacy, intentional contacts opt-in. See ONBOARDING_IDENTITY_CONTACTS.md.

## Safety and release
This is not merged to main production. Existing Crew/Drop/chat/media/response stores untouched. Invitation share must be tapped by user; opening share sheet does not prove delivered invite. Before sending widely, test solo link, fresh Crew invite link, existing Avengers link, 5/10 refresh/retry, five seed count, mobile fixed nav and actual share sheets.
