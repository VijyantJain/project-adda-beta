# Project Adda — Decision Log
Updated: 2026-09-22

## D001 — Working name is temporary
"Adda" is a working name, not a locked GTM brand. Brand assets should separate symbol from wordmark where possible.

## D002 — Drop is the acquisition object
External sharing should normally land on a specific Drop. After participation, the user enters the Crew/app.

## D003 — Crew is a persistent social place
Crew is not just a poll folder. It contains Drops, Chat, Recap, Mates, settings/admin, and future Pulse/Plans/Moments/Memories.

## D004 — Vibe is personal and factual
Vibe is an individual identity/status layer based on real activity. It must not infer sensitive traits or pseudo-psychological labels.

## D005 — Two retention loops, not one
Personal: Daily Vibe Loop.
Group: Crew Pulse + Reveal Chain.
Personal retention must still work when a Crew is quiet.

## D006 — Public Vibe is the social profile surface
Inside the app, names/avatars should be tappable to Vibe profiles. External Vibe links are for sharing, not the primary in-app navigation mechanism.

## D007 — Arena is eventually a rolling personalized public feed
Arena will provide always-available public content and discovery. Ranking should optimize meaningful interactions/creation/return while maintaining diversity and safety, not merely raw watch time.

## D008 — Ephemeral media is part of the long-term product
Moments/Stories (24h) and view-once/disappearing media are planned. They are private/audience-controlled by default and require proper storage expiry, safety, reporting, and message-request rules.

## D009 — DMs are essential long-term
1:1 messaging enters after stable identity/auth/social graph. Start with text/replies/shared Drops; add media/view-once after safety/storage foundations.

## D010 — Current live test must remain stable
Feature exploration belongs in docs or separate branches. Current audience-facing build gets only blocking fixes and explicitly approved test features.

## D011 — Supabase is vNext data direction
Postgres + Realtime + Storage + RLS is the intended next backend direction. Do not migrate during the current live test.

## D012 — Source of truth is not chat history
Exact state lives in GitHub docs/current code + Drive Product Ledger. Chat memory is supplementary only.

## D013 — Play-before-create onboarding
For a direct new arrival without a Crew, run First Five before asking to create or invite. Shared Drop and Crew deep links keep their direct flows. Creator gets five automatically seeded Crew Drops after opting in.

## D014 — Intro rewards are earned and idempotent
Starter answers earn 10 Vibe each with one-time +30 and +50 milestone bonuses; milestones are real, not fake countdowns or simulated votes. Separate Starter records from private Crew records; prevent repeated reward farming. First Five v1 details live in docs/FIRST_FIVE_VIBE_RUN.md.

## D015 — Reward economy and future gifting are separate concepts
Future free/premium gifts are concept proposals only. Preserve Vibe as earned activity status; purchased cosmetics must not directly buy competitive experience. Assess caps, abuse prevention, recipient controls, refunds, pricing and legal matters before implementation. See docs/REWARD_ECONOMY.md.

## D016 — Document on each meaningful product change
Update the feature-specific canonical spec, CURRENT_STATE, DECISIONS and ROADMAP as appropriate, then append the Drive Product Ledger handoff. Do not duplicate full master specs across every file or leave unique decisions only in chat.


## D017 — Separate solo and invited first journeys
Solo first-timer: First Five / Bonus → one Tenacious Crew-creation CTA → five seeded Drops → share dialog. Invited first-timer: provisional enrollment, First Five, one Enter <Crew> CTA, display-name finalization, original Crew/Drop. Existing members keep direct flow; see FIRST_FIVE_VIBE_RUN.md.

## D018 — Honest final reward and visual consistency
Tenacious itself shows earned Starter Vibe and specifically labeled Starter achievements. No View Vibe/Back to Crews buttons there and no “not now” escape on Crew form. Reward uses the exact supplied neon-trophy screenshot crop with animated flashes, reduced-motion and full-width mobile presentation.

## D019 — Invite/share is user-initiated
After backend confirms five seeded Drops, show a dialog previewing a fun prefilled invite. Open OS share/WhatsApp only on user action; opening the share sheet is not equivalent to verified delivery.

## D020 — Verified identity and contacts are staged, never faked
Beta browser-local participantId does not provide a true lifetime guarantee. Actual email/phone OTP, cross-device merge, profile handle, DP, bio and contacts opt-in need M1 provider/database foundations. Permission prompts must follow the user's explicit Find Friends action.

## D021 — Ten questions before first-time conversion
Both truly new direct and invited browsers see identical initial welcome and complete First Five AND second five before cohort-specific Tenacious conversion. Five-question trophy is a milestone, not an escape to Crew. Invited path cannot redirect or finish before Tenacious.

## D022 — Guided first-Crew interaction
After the first generated Crew or first invited Crew/Drop, show opt-skippable real coach marks for Crew meaning, Drop meaning, choice/answer and one additional Drop. Store completion locally for beta; migrate to verified profile progress in M1.

## D023 — Evidence-driven analytics, no automatic origin verdict
Ashburn/USA/Linux is not independently a bot/internal marker. Track automation UA/missing browser signals separately and preserve underlying visitor records. Do not equate Netlify HTTP request totals with unique browser visitors or verified humans. See ANALYTICS_V2.md.

## D024 — Profile beta versus verified identity
A functioning browser-local name/bio/DP editor may ship now, prominently labeled device-only. Never claim working email/mobile OTP, global username availability or cross-device sync without actual configured backend/Auth/SMS/email provider and migration.
