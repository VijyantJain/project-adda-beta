# Project Adda — ChatGPT Continuity & Project Operating System
Updated: 2026-09-18

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
