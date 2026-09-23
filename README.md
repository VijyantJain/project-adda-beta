# Project Adda — Living Beta (v0.7.1 preview)

Functional multi-user validation build for Project Adda. The current `v0.5-full-experience` branch holds the newer v0.7 guided onboarding and product architecture. `main` is the separate production line; do not assume it includes preview features.

This repository contains the mobile-first beta, Netlify Function API, persistent Crew/Drop/chat state using Netlify Blobs, and the internal research console.

## Test objective
Validate the core loop with real users:

Create Crew → invite friends → create Drop → answer across devices → shared threshold unlocks → Reveal → next Drop / Crew Chat.

## Deployment
Designed for Netlify. `netlify.toml` publishes the repository root and Netlify automatically builds the function under `netlify/functions/`.

## Canonical source of truth for long-term project continuity

- [Complete feature and specification checklist](docs/FEATURE_SPEC_CHECKLIST.md) — stable IDs and honest status (BETA, IN_PROGRESS, SPEC, PLANNED, BLOCKED). Do not mark items VERIFIED without device QA.
- [Current State](docs/CURRENT_STATE.md) — actual branch/deploy/data and current limits.
- [M0.7 onboarding SRS](docs/ONBOARDING_M07_SRS.md) — direct/invited journeys, private interest-led cards, five-tab mission, profile and eventual OTP.
- [Content and asset register](docs/CONTENT_ASSET_REGISTRY.md) — what's bundled vs pending realistic imagery.
- [Master Product Blueprint](docs/PRODUCT_BLUEPRINT.md) and [Roadmap](docs/ROADMAP.md) — long-term strategy and milestone gates.
- [Decision Log](docs/DECISIONS.md) and [ChatGPT Continuity](docs/CHATGPT_CONTINUITY.md) — why features exist and how to resume work.
- [Analytics Dictionary](docs/ANALYTICS_V2.md), [Identity Spec](docs/ONBOARDING_IDENTITY_CONTACTS.md), [Migration Plan](docs/TECHNOLOGY_MIGRATION_PLAN.md).

## Full source archive

[Download the complete current preview branch ZIP](https://github.com/VijyantJain/project-adda-beta/archive/refs/heads/v0.5-full-experience.zip). It includes source and bundled artwork, NOT live Netlify Blob data, Supabase data or secret environment variables. Back up datasets separately before any infrastructure cutover.

## Current preview activation correction
v0.7.1 adds user-facing Aura, non-skippable in-app guide, optional local avatars, no-Crew solo continuation and answered Drop badges. Read the updated 109-ID register and the v0.7.1 sections in CURRENT_STATE/ONBOARDING_M07_SRS. These changes require real mobile QA and are not a production main release.

## v0.7.2 — Aura-first screenshot fix / field-test preview
Direct Tenacious automatically launches real-scored Aura and a resumable Aura→Home→Crew-explainer→+ explainer→guided Profile mission. getAuraStarter returns first-session points/badges without scanning every Crew. New users see Starter v3, bundled 24 real-photo scenes with original local SVG fallback; v1/v2 Starter progress and original Crew/Drop/chat/media persist unchanged. Preview only; high-resolution asset/license audit, mobile E2E and verified accounts are separate gates. See [release protocol](docs/RELEASE_v0.7.2.md), [115-feature checklist](docs/FEATURE_SPEC_CHECKLIST.md), and [photo registry](docs/CONTENT_ASSET_REGISTRY.md).

Static regression suite: `npm test`. It is NOT a substitute for real iPhone/Android end-to-end testing. Production main is not merged.

### Current v0.7.3 field-test preview
The Crew/Drop onboarding changes are now on the development preview, not production main. See [release evidence and unresolved device QA](docs/RELEASE_v0.7.3.md); v0.7.2 recoverable at commit `8b1da1789c2e7bad6110c6bdafbf911b1b11b377`. Foundational v0.8 and domain release are NOT bundled. Complete three-entry field tests before production acceptance.
