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
