# START HERE — Project Adda canonical navigation (2026-09-24)

This is the front door for humans, developers and future ChatGPT chats. Do not infer that a proposed feature is shipped from an old append-only note. Read this index BEFORE modifying production code.

## Reality / branch boundaries
- Main production branch: preserve until explicit founder approval; the live FIELD TEST is the development/preview context, NOT a production app.
- Last accepted baseline: v0.7.3 release evidence in docs/RELEASE_v0.7.3.md, commit f281d55e012e2ef96e92826b4d8958ce34cc2194. v0.7.2 recoverable at commit 8b1da1789c2e7bad6110c6bdafbf911b1b11b377.
- Current feedback hardening occurs on fix/v073-sept24-field-test; a commit here does NOT mean deployed. Read GitHub HEAD and Netlify deploy status on every new chat. Do not conflate staging, preview and main.
- Named Netlify stores MUST be preserved: preview adda-v05-fieldtest; main production adda-v03. User Crews, in particular Avengers, plus member/response/chat/media/starter/guide keys must not be cleared, seeded over or renamed casually.
- Direct/Crew-link/Drop-link guided route order is founder-locked in docs/CREW_AND_DROP_ONBOARDING_V073_SRS.md and docs/CREW_ONBOARDING_FLOWCHARTS_V073.md.
- Current bugs and unverified releases: docs/2026-09-24_FIELD_TEST_ACCEPTANCE.md. Deployed Sept 24 patch evidence: docs/RELEASE_v073_FIELD_PATCH_2026_09_24.md. Historic release tests in docs/RELEASE_v0.7.3.md.
- Existing stable feature IDs and original specification: docs/FEATURE_SPEC_CHECKLIST.md. Stable existing IDs should NEVER be renumbered. New ideas require IDEA/PROPOSED statuses, not a fake green tick.

## New canonical reading order
1. This START_HERE.
2. docs/2026-09-24_PRODUCT_DIRECTION.md — scope, phases and explicit decisions/constraints.
3. docs/2026-09-24_V08_FOUNDER_DECISIONS.md — **five initial plus six further founder-confirmed v0.8 choices; D040–D045 (achievement targets/rewards, hybrid naming/visuals, planned full level-curve rebalance with ALL earned Aura preserved); supersedes ambiguous candidate language; DESIGN ONLY.**
4. docs/2026-09-24_FIELD_TEST_ACCEPTANCE.md — immediate observed bugs and field-test pass/fail.
5. docs/2026-09-24_V08_DESIGN_BRIEF.md — options for next release; founder discussion, NOT implementation approval.
5. docs/2026-09-24_VISUAL_REFERENCE_ATLAS.md — uploaded concept references and feature mapping.
6. docs/2026-09-24_AI_OPPORTUNITY_MAP.md — actual AI propositions, costs and privacy.
7. docs/2026-09-24_DOMAIN_AND_MIGRATION_RUNBOOK.md — owned domain, zero/low-cost hosting, safe Blob-to-indexed-DB migration.
8. docs/TECHNOLOGY_MIGRATION_PLAN.md, docs/ARCHITECTURE_VNEXT.md, docs/SUPABASE_SCHEMA_DRAFT.sql — historical proposals, check status before using verbatim.
9. docs/DECISIONS.md and docs/CHATGPT_CONTINUITY.md — immutable historical decision/context log, including older terminology.

## Full-originals archival guarantee
A byte-for-byte copy of ALL 22 source docs before this cleanup is in docs/archive/2026-09-24-pre-cleanup/ with Git blob SHA manifest. Also a separate backup Git branch backup/v073-before-sept24-feedback at f281d55e012e2ef96e92826b4d8958ce34cc2194. Do not delete or squash either. New files clarify the canonical direction; original docs remain untouched in their historical paths and archive, including contradictory phase labels and Vibe→Aura vocabulary.
User-uploaded original visuals and field-test screenshots are preserved in the conversation archive ZIP Adda_Visual_References_Archive_2026-09-24.zip; these are references, not automatically cleared licensing.
