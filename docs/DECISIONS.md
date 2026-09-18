# Project Adda — Decision Log
Updated: 2026-09-18

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
