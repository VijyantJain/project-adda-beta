# v0.7.3 Proposed User Journeys — Flowcharts

Status: SPEC, design-stage companion to CREW_AND_DROP_ONBOARDING_V073_SRS.md; the v0.7.2 field-test preview remains frozen.

## A. Entry router (three new-user entry points)
~~~mermaid
flowchart TD
 A[Open Adda] --> B{Entry URL?}
 B -->|Direct| C{Recognized returning beta user?}
 C -->|No| D[Starter 10 → Tenacious 180]
 D --> E[Aura guided → Home → Crew / Create explainer → Profile]
 E --> F[Normal app; optional first Crew]
 C -->|Yes| F
 B -->|Crew invite| G{Recognized returning beta user?}
 G -->|Yes| H[Exact linked Crew → normal usage]
 G -->|No| I[Exact Crew welcome + member guide]
 I --> J{Actual unanswered Drops?}
 J -->|Two or more| K[Coach TWO real Crew answers]
 K --> L[Required Starter 10 → Tenacious → Aura/Profile]
 J -->|Zero| M[Starter 10 + Aura/Profile guide]
 M --> N[Return EXACT invited Crew → guided first custom Drop]
 J -->|One| O[Coach real available answer → honest next-step fallback]
 O --> L
 B -->|Drop invite| P{Recognized returning beta user?}
 P -->|Yes| Q[Exact Drop → answer or real waiting/result → normal]
 P -->|No| R[Explain exact linked Drop → real answer FIRST]
 R --> S[Starter 10 → Tenacious → Aura / Profile]
 S --> T[Return exact Crew + member guide]
 T --> U{Two OTHER unanswered Drops?}
 U -->|Yes| V[Coach two actual answers → normal Crew]
 U -->|Fewer than two| W[Use available genuine answer then first custom Drop tutorial]
 W --> X[Publish into EXACT Crew → offer share → normal]
~~~

## B. First-ever created Crew / repeat creator
~~~mermaid
flowchart TD
 A[Create New Crew from Home / Crew / +] --> B{Saved display name exists?}
 B -->|Yes| C[Hey name 👋 Name your Crew]
 B -->|No| D[Ask display name once + Crew name]
 C --> E[Start Crew → server confirmation]
 D --> E
 E --> F{First Crew CREATED by this participant?}
 F -->|No| G[Normal Crew homepage: Invite mates + Create Drop CTAs]
 F -->|Yes| H[Welcome; display ACTUAL Aura credit]
 H --> I[Spotlight Crew header + invite + Chat + Recap + Mates + admin-only Settings + Drops + Create]
 I --> J[Choose top TWO interests]
 J --> K[Idempotent seed of five real shared Drops: Short / Either / Vote / Rate / Predict]
 K --> L[Explain Drop and answer first interest Drop]
 L --> M[Answer second interest Drop]
 M --> N[Unanswered at top, answered at bottom]
 N --> O[Offer Crew invite in Hinglish + native share/fallback]
 O --> P[Accurate returned/cancel/retry state → finish tour → Crew]
~~~

## C. Any participant's first CUSTOM Drop
~~~mermaid
flowchart TD
 A[Tap Create + in a real Crew] --> B{First user-authored Drop?}
 B -->|No| C[Regular Create Drop editor]
 B -->|Yes| D[Guided overview of all SIX formats]
 D --> E{At least two real mates?}
 E -->|No| F[Explain Who's Most Likely but lock it]
 E -->|Yes| G[All six eligible as settings permit]
 F --> H[Choose eligible format]
 G --> H
 H --> I[Guide question + type-specific fields + media if relevant]
 I --> J[Guide reveal threshold, name attribution, change-answer settings]
 J --> K[Validate + preview]
 K --> L[Publish exactly ONE real Drop; server acknowledges]
 L --> M[Show saved Drop → invite EXACT Drop link]
 M --> N[Native OS share or fallback]
 N --> O{Share cancelled or unavailable?}
 O -->|Yes| P[Retry share or explicit can't share now recovery]
 O -->|No| Q[Accurate acknowledgement, no false delivered claim]
 P --> Q
 Q --> R[Guide complete → Crew; no duplicate publication]
~~~

## D. Crew module and permissions
~~~mermaid
flowchart TD
 A[Crew homepage] --> B[Chat → this Crew chat]
 A --> C[Recap → REAL aggregate current Crew facts]
 A --> D[Mates → member list, admins identified]
 A --> E[Drops → unanswered first; genuine results below]
 A --> F{Current viewer admin?}
 F -->|Yes| G[Admin-only Crew Settings gear: rename / remove / insights / delete]
 F -->|No| H[No edit-settings gear; own Leave Crew accessible separately]
 A --> I[Global Aura remains BOTTOM tab only]
~~~

## Entry-order invariants
- Direct: Starter BEFORE Aura and optional Crew.
- New Crew invite with Drops: exact Crew and real answers FIRST. Starter 10/Tenacious/Aura/Profile is REQUIRED after two Crew answers; return to same Crew.
- New Drop invite: exact invited Drop and real answer BEFORE Starter, then Aura/Profile, then Crew/other answers or create.
- Returning linked users: exact Crew/Drop without forced Starter replay.
- A participant cannot be classified as an authenticated registered human across devices until real auth exists.


## Founder-confirmed D038, 2026-09-23 — MANDATORY onboarding after first two Crew-link answers
For a first-time beta visitor opening a Crew invitation with at least two real unanswered Drops, the required order is: enter the EXACT linked Crew → member-specific Crew welcome/tour → answer TWO REAL unanswered Crew Drops → play all TEN Starter questions → unlock Tenacious → complete guided Aura/Home/Crew/Create/Profile setup → return to the SAME original Crew and resume normal usage. Already earned Crew points and response records are retained; Starter's 180 points count once. Preserve the original crewId across refresh. No new Crew creation, duplicate seed, duplicate answer or forced invitation. If fewer than two unanswered Drops remain, answer any genuine available Drop and proceed with a clearly described fallback without trapping the visitor. This decision supersedes any earlier “optional”, “deferred” or “pending” text about this specific cohort. New DROP-link entrants still answer the exact invited Drop FIRST before Starter. Existing visitors do not repeat Starter. DECIDED / SPEC, NOT IMPLEMENTED.
