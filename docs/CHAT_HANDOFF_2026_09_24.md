# Project Adda — cross-chat continuation card (2026-09-24)

Purpose: a new chat can continue from the actual repository, not guess from truncated conversations. This file is part of Project Adda and changes when the working HEAD/release changes.

## User's immediate priorities
- Field-test current v0.7.3 with friends for 2–3 days; fix actual bugs from iPhone/Android/WhatsApp. No v0.8 “everything at once” until founder reviews daily loop and achievement economy.
- Acquire affordable OWNED domain only after name, registrar and deploy context agreed; avoid accidental migration of users into blank database.
- Explore free/low-cost Cloudflare Pages + Workers + D1 or Supabase SQL and proper indexed analytics, but do not move Netlify Blob records without safe export/count/hash/import/rollback.
- Brainstorm AI Drop Copilot, factual recap, multilingual prompts and 3D Aura Orb; no phantom friends, fake votes or hidden inference over private chat.
- Bring back original Adda multi-screen concept's face-circle avatar chains and polished lilac/purple/neon visual identity WITHOUT breaking existing API routes and real shared engagement. External PROXIMA and purple game pictures are inspiration, NOT shipping or licensed art.
- Archive every original doc; 22 original docs byte-identical archived under docs/archive/2026-09-24-pre-cleanup/. Original uploaded 10 visual files + field-test screenshots also bundled in conversation artifact Adda_Visual_References_Archive_2026-09-24.zip; in a NEW chat reattach ZIP if pixel-precise image editing is required.

## Immutable safety refs
Repo: https://github.com/VijyantJain/project-adda-beta
Accepted earlier recovery: v0.7.2 SHA 8b1da1789c2e7bad6110c6bdafbf911b1b11b377
Initial v0.7.3 preview: f281d55e012e2ef96e92826b4d8958ce34cc2194
Backup branch: backup/v073-before-sept24-feedback (the earlier preview).
Sept 24 fixes staged on: fix/v073-sept24-field-test (check actual HEAD and deployed branch before claiming status).
Development branch: v0.5-full-experience; production main MUST NOT be merged without user approval.
Preview: https://deploy-preview-1--project-adda-field-test.netlify.app
Preview Blob name: adda-v05-fieldtest; production Blob name: adda-v03; preserve Avengers Crew, all IDs/answers/chats/media.
Three entry journey diagram: docs/CREW_ONBOARDING_FLOWCHARTS_V073.md, full exact SRS docs/CREW_AND_DROP_ONBOARDING_V073_SRS.md.
Canonical reading: docs/START_HERE.md, then dated direction/bugs/v0.8/visual/AI/domain docs.

## First action in new chat
Read branch heads and Netlify status; read START_HERE and FIELD_TEST_ACCEPTANCE and latest RELEASE_v0.7.3.md. Ask user for no repeated history and no login secrets. Distinguish source code parse/source tests from real iPhone & authorized analytics E2E.

## Pasteable new-chat prompt
“I am continuing Project Adda. Use repo VijyantJain/project-adda-beta and first read docs/START_HERE.md, docs/2026-09-24_FIELD_TEST_ACCEPTANCE.md, docs/2026-09-24_PRODUCT_DIRECTION.md, docs/2026-09-24_V08_DESIGN_BRIEF.md, docs/2026-09-24_VISUAL_REFERENCE_ATLAS.md, docs/2026-09-24_AI_OPPORTUNITY_MAP.md, docs/2026-09-24_DOMAIN_AND_MIGRATION_RUNBOOK.md and docs/CHAT_HANDOFF_2026_09_24.md. Check live GitHub branches and Netlify preview SHA, NOT assumptions from old chats. Keep main, Avengers and both Netlify Blob stores untouched; original docs archive and backup branch must remain. Continue Sept 24 field-test fixes + domain decision + v0.8 review from current actual state. Do not claim complete without real test/deploy evidence.”
