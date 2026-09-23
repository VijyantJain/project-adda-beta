# Project Adda — Canonical Context
Last updated: 2026-09-22

## Purpose
This file is the bootstrap document for any new ChatGPT chat, developer, contractor, or AI agent working on Project Adda. If chat history conflicts with this file, CURRENT_STATE.md, DECISIONS.md, the live branch, or the Drive Product Ledger, the versioned sources of truth win.

## Product
Working name: Adda (temporary; not locked for GTM).
Core thesis: a private-first social product for real-world groups, built around lightweight social objects called Drops.

Core objects:
- Crew: private real-world friend group.
- Drop: lightweight social interaction object.
- Reveal: result/reward after participation.
- Vibe: personal factual identity/status based on real product activity.
- Crew Pulse: proposed group progression/reveal loop.
- Arena: future public rolling feed for discovery and always-available participation.
- Moment: future short-lived photo/text/video post.
- Blink: proposed view-once / disappearing media primitive.
- DM: future 1:1 private messaging.

Acquisition principle: Drop is the acquisition object, not Crew.
UX principle: few words, one obvious action, immediate feedback, real social consequence.

## Current code
Repository: VijyantJain/project-adda-beta
Active development branch: v0.5-full-experience
Production branch: main
Current field-test preview: https://deploy-preview-1--project-adda-field-test.netlify.app
Private analytics: /analytics.html

Current stack:
- Vanilla JS SPA
- Netlify Functions
- Netlify Blobs persistent field-test store
- GitHub source control
- Supabase connected and intended for vNext migration

## Data protection rule
The active field-test store contains live Crew/member/Drop/response/chat/media data. Never replace, clear, rename, migrate, or reset the field-test store during a live wave unless explicitly required and recoverable. UI hotfixes must be additive/non-destructive.

## Current live-test objectives
Current v0.6 add-on: play-before-create First Five + Bonus Five, milestone rewards, Starter Crew pack and activation funnel. Read docs/FIRST_FIVE_VIBE_RUN.md and docs/REWARD_ECONOMY.md when working on onboarding, Vibe points or monetization.
Primary question: does a recipient who enters through a shared Drop continue voluntarily into other interactions?
Watch:
- shared Drop opens
- join rate
- answered >=1 / >=2 / >=5 distinct Drops
- Drop creation
- share action
- repeat sessions
- errors/performance
- Drop-format performance

## Product direction
Short-term personal retention: Daily Vibe Loop (personal, always available).
Short-term group retention: Crew Pulse + Reveal Chain.
Long-term identity: Vibe / public Vibe profile.
Always-available discovery: Arena rolling feed.
Private social layer: Crew Chat + DMs + Moments + disappearing media.

## Non-negotiable product constraints
- 18+ initial launch.
- Private Crews by default.
- No protected/sensitive personality inference.
- No appearance-rating mechanics.
- Vibe uses factual product activity, not pseudo-psychology.
- No gambling/stakes in Predict.
- Public discovery comes after private-group retention is demonstrated.
- Do not optimize only for raw dwell time; optimize for meaningful participation, return, creation, sharing, and social connection.

## Mandatory workflow before code changes
1. Read this file.
2. Read docs/CURRENT_STATE.md.
3. Read docs/DECISIONS.md.
4. Inspect the exact active branch files before editing.
5. Preserve field-test data.
6. Make changes on v0.5-full-experience unless a newer branch is explicitly named.
7. Run frontend syntax checks.
8. Verify deploy status.
9. Update CURRENT_STATE.md / CHANGELOG or decision docs for meaningful changes.

## New-chat bootstrap prompt
Use this exact instruction in a fresh chat:

"Project Adda continuation. Read the repository docs/PROJECT_CONTEXT.md, docs/CURRENT_STATE.md, docs/DECISIONS.md, docs/ROADMAP.md, docs/PRODUCT_BLUEPRINT.md and docs/ARCHITECTURE_VNEXT.md from VijyantJain/project-adda-beta. Inspect the active branch stated in CURRENT_STATE.md. Use the Project Adda Drive folder and Living Product Ledger for product history. Treat those files and current code as source of truth over chat memory. Then continue from the Active Task in CURRENT_STATE.md. Do not reset or migrate live field-test data unless explicitly instructed."
