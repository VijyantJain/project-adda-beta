# Project Adda — v0.8 scope ledger, phased delivery and lineage (2026-09-24)

STATUS: FOUNDER-APPROVED DIRECTION / PRODUCT DESIGN, NOT SHIPPED OR CODE-AUTHORIZED. Source of current v0.8 phase scope: this document plus docs/2026-09-24_V08_FOUNDER_DECISIONS.md D040–D052. Older ROADMAP, FEATURE_FLOWS_VNEXT, PRODUCT_BLUEPRINT, V08_DESIGN_BRIEF and VISUAL_REFERENCE_ATLAS record important historical ideas, but superseded phase assignments MUST NOT be read as current approval. This is a release-intent/specification checklist; code + live QA are necessary to label items DONE. Maintain existing 128 canonical feature IDs, append new stable IDs only.

## Founder decisions D052–D053 — nine titles and permanent Aura Orb
- The founder selected all 9 Star-earned display titles, in exact order by path. Working path names remain Explorer, Sparkmaker and The Regular unless specifically renamed later.
  - Explorer: Star I **Pathfinder**; Star II **Opinion Magnet**; Star III **Infinite Explorer**.
  - Sparkmaker: Star I **First Mover**; Star II **Scene Architect**; Star III **Social Supernova**, explicitly replacing **Legendary Catalyst**.
  - The Regular: Star I **Familiar Face**; Star II **Constant Star**; Star III **Here to Stay**.
- All nine title strings are founder-selected; any localisation/casing still open. Do not overwrite titles with newer brainstorms. Separate path labels from earned-title labels and overall Aura LEVEL labels. Preserve per-path selected earned titles plus one featured earned profile title.
- **Evolving Aura Orb is a PERMANENT, CENTRAL brand and product primitive starting in FIRST v0.8**, NOT a disposable concept, optional afterthought or blanket deferral to v0.8.x. It signifies verified earned Aura/level progression visually; visible as the prominent hero on Aura, recognisable Home/profile/achievement presence, and the core motif for the Adda app icon/identity system.
- First v0.8 MUST include recognizable authored original Orb art, real-level-linked visual evolution, a lightweight motion-capable treatment with attractive STATIC fallback, reduced-motion support, battery/data/low-end/mobile performance gate, and a clear real score/level equivalent. Feature can remain static when motion unsupported; the Orb identity itself never disappears. Progressive WebGL/high-cost 3D interaction, many collectible skins and complex effects are LATER enhancements, not preconditions to v0.8.
- App icon should be derived from the aspirational **highest designed/master Orb aesthetic** as stable BRAND EMBLEM, paired with recognisable Adda identity; it is not a claim that every user has earned that appearance, and an open-ended level system has no eternally final highest level. Favicon, PWA/app icon and share branding are different asset sizes/usages. Verify rights to any inspirational images and create own exportable assets, do not silently embed the reference render.
- Older documents claiming ALL Orb work is optional v0.8.x, or only a concept experiment, are SUPERSEDED by D052. Old main brand/source IDs and beta data are not silently changed.

## Release boundaries — clean feature checklist

### Option A — CURRENT v0.7.3 field-test stabilisation BEFORE v0.8 work
[ ] Validate real iPhone Safari, Android Chrome and WhatsApp in-app, direct/Crew/Drop invite exact paths, first custom Drop, refresh, back, empty Crew, existing Avengers, all six formats, original scores, + buttons, fixed top/bottom shell and share-sheet fallback.
[ ] Validate real founder-key analytics cold/warm, total/unique definitions, partial vs all-Crew Aura score, error/timeout; sample TTFB, mobile 320/375/430 and failure/retry. The September 24 patch's 25/25 static tests do not prove these device checks.
[ ] Repair *verified* blockers with regression, backup and non-destructive patch, on dev/preview only unless separately authorised; do not silently call beta stable or reset stored data.
[ ] Preserve legacy Crew, Drop, member, answer, chat/media, guide, Starter and earned score records.

### Option B — affordable owned domain / safe distribution
[ ] Select/check/buy domain in founder's registrar account; founder owns it, verify costs and renewal.
[ ] Attach safe branded web URL to correct beta deploy context/store, verify SSL, Crew/Drop/profile deep links, invite/OS share, redirects and preview analytics.
[ ] Confirm browser origin/local-storage identity consequences, no unexpected guest duplication and no silent change to Netlify Blob preview store adda-v05-fieldtest versus main adda-v03. Backup/export + rollback before larger migration.
[ ] Decide retain Netlify for now versus later indexed DB migration; domain is NOT performance solution.

### v0.8 — FIRST meaningfully returning Aura release (discussion scope; all unshipped)
[ ] 3 GUARANTEED personally playable, interest-led Daily Aura cards per chosen day and at most 2 genuinely available Crew/activity extras; genuine finite content pool, skip/resume, repeat avoidance, language-aware friendly copy, explicit optionality; NEVER fake other members or turn Starter into daily repeat earnings.
[ ] Mission-aware 3-slot SOLO Charge menu: Quick Play two distinct personal cards; Curious one curiosity card + one OTHER distinct personal card; Creative Spark one genuine saved PRIVATE creative response. Switching BEFORE Charge completes preserves earned responses and +10/card, replaces only unanswered slots, and recomputes selected route eligibility from real stored events. No Crew action fills personal Charge. Resolve no-possible-switch edge case in SRS. All personal card ordinary +10 each, capped at three paid slots/day (+30); exactly one +10 Charge completion bonus/day (+40 max deck + Charge), real Charge completion date toward Regular. No prelaunch fictional Charge history.
[ ] Three real working three-star achievement paths: Explorer 5/300/3000 distinct genuine Crew Drop answers (Daily Aura excluded); Sparkmaker 1 authored/(20 authored AND 30 real peer replies)/(200 authored AND 1000 peer replies); The Regular 5 genuine active days/(120 active AND 60 real Charge-completed days)/(730 active AND 365 Charge days); streak cumulative distinct from consecutive, optional within Regular.
[ ] Achievement milestone +50/+300/+1500 Aura PER PATH per real earned Star I/II/III, idempotent including source-proven retroactive achievement bonuses for old users; historical Starter/activity Aura and badges preserved, no double scoring, no fabricated beta verified-human or retro Charge counts. Exactly 3 working paths + Crew Spark and Shared Memories clearly Coming Soon without pretend earnings.
[ ] The nine earned titles selected across D052–D053; earn and collect all actual titles, independently choose shown earned title per path and one featured earned profile title, keep names separate from Aura levels.
[ ] Rebalance FULL displayed Aura level thresholds and labels with 25+ actually published levels at launch only AFTER economy and privacy-safe actual beta score distribution are examined. Named chapters, future periodic extendable levels, social+futuristic language at every stage. Keep every scored Aura point and earned badge; old visible level labels replaced, raw historic score records preserved. Continue accruing actual Aura at current highest published level.
[ ] Evolving Orb at heart of Aura/Home/profile/achievement visual system, level-linked meaningful appearance changes, static-safe render plus lightweight animation, reduced-motion, low-end QA, branding motif and master-orb-derived app icon/favicon/PWA identity; Adda wordmark retained. Non-interactive Orb is acceptable first cut; NOT deferred as a whole.
[ ] SMALL factual Crew Pulse experiment on a ROLLING seven-day Crew activity window combining real eligible actions AND unique contributing mates; one tiny truthful payoff to specify; never fake votes, share conversions, private chat inferences or group size, never treat rolling expiration as loss of lifetime Aura. Full Mystery Reveal Chain is NOT first v0.8.
[ ] Home/Aura/Profile/Crews/Drop/Reveal polish mapped to original Adda reference: fixed navigation/top shell, responsive photo-led cards with cleared art rights and WebP compression, true member initials/avatar chain, real next-action CTA, clearer results, real earned progress, purposeful share cards without false delivery claim. Curated format-aware Create templates and deterministic next-action guidance; first custom-Drop flow remains as locked. First v0.8 should feel recognisably more designed, not merely add counters.
[ ] Reward ledger, participant/day/card slot/stars idempotence and real source timestamps, factual score aggregation, solo-vs-Crew metrics, Charge mission selection/switch/completion, real Pulse unique mates, retention instrumentation, no long full-store scan on critical path. No unapproved real auth/cross-device assertions.

### v0.8.x — next small iterations, not deleted
[ ] Mystery **Aura Capsules** tied to real personal Charge/progression with disclosed non-cash reward rules; capsule reveal/next meaningful action, fair reward economy, never gambling or false scarce odds.
[ ] Working cosmetic redemption catalogue, approved Gem earn/spend/retro rules and user-visible balance ONLY after redemptions actually work; profile/Orb skins, borders, themes and collectible effects, no pay-to-win or paid Aura.
[ ] Richer Orb animations/high-tier finishes and opt-in advanced interactive 3D when performance allows; first v0.8's core branded, evolving Orb MUST remain.
[ ] Iterations of Daily missions, creative/interest content, non-punitive consecutive-streak submilestones, seasonal/weekly content missions and earned badges; optional next-action progression and authentic share/flex cards.
[ ] Factual Crew Pulse insight and deeper per-Crew Recap prototype, inspect whether real social loop actually improves; more templates/remix and optional limited AI Drop Copilot experiment AFTER first Create reliability, privacy and spend constraints.
[ ] Founder-choice legacy-account recovery and stronger indexed cached aggregates as scale/reliability demand; cannot claim verified identities before auth.

### v0.9 — group depth and creator/community retention (gated by actual beta evidence)
[ ] Expand Crew Pulse from v0.8 small experiment to full genuine milestone / Mystery Reveal Chain, meaningful reward and next-activity handoff, capped weights, factual denominators, small Crew handling.
[ ] Period-scoped factual Crew Recap, optional highlight-to-Memory flow, shareable genuine peer insights and optional opt-in reviewed recap text; no fake mates or analysis of private chats without consent.
[ ] Richer editable contextual Drop templates, remix, creator tooling and optional paid backend-key-limited AI Drop Copilot/translation/tone suggestions only after opt-in, moderation, privacy and proven value. Core app independent of Gemini uptime and payment.
[ ] Crew rituals/challenges/selected weekly missions and next-activity loops, small scoped in-app notification/Inbox experiment with quiet hours and mute/opt-out if reliability/security permits.
[ ] Indexed score/analytics aggregates and event capture (possibly earlier as required for A/v0.8 correctness); real cross-Crew membership cannot be claimed without authenticated IDs.

### v1.0 / foundation gate — durable real-account social platform
[ ] Verified account/auth and recovery, genuine cross-device identity/merge, unique handles, globally synced avatar/profile, privacy/audience permission; indexed database migration/backfill with verified export, rollback, server roles/RLS and protected private media.
[ ] Scalable realtime, notification prefs, moderation/report/block/mute, availability/error observability, reliable score counters. User-owned domain and PWA/native distribution decisions based on evidence.
[ ] Then separately gated private social suite: DMs, Moment/Story 24h photo/text, audience/replies, view-once Blink only with real expiry/deletion; NOT promises for v0.8 or unconditional v0.9.

### v1.1+ / later discovery and expansion, evidence and safeguards required
[ ] Arena PUBLIC discovery feed, public Drops, responsible recommendation controls, creator/follow graph, hide/report, public/private profiles.
[ ] Shared-interest/connection map, Proxima-inspired consensual social graph and optional explained interest-overlap, NEVER speculative interpersonal/romance compatibility percentages. Nearby plans/events/calendar/maps only on explicit location intent.
[ ] Full Crew Plans/RSVP, shared lists, pinned Memories/inside jokes, story highlights; gradual short-video/voice media, stickers/GIFs, view-once video, licensed sound snippets and advanced art effects as cost/moderation permit.
[ ] Opt-in richer AI assist, multilingual accessibility/personalisation without private-chat ingestion or fake friends, native iOS/Android if supported by retention and budget, monetisation only cosmetic/creator/admin once fair and justified.

## What changed from earlier plans (feature lineage / explicit supersession)
| Earlier plan/reference | NOW | Next eligible phase / reason |
|---|---|---|
| Personal Daily Vibe 5–10 cards | Three guaranteed PERSONAL + 0–2 genuine activity extras, Daily Aura terminology | First v0.8; smaller finite high-quality supply, real social extras optional |
| Daily Deck sourced primarily from Crew/Arena | Three solo cards ALWAYS available even with no Crew, social extras separately | First v0.8; Arena not fabricated; later public sourcing after Arena actually exists |
| Charge accumulates from every Crew/creator action | User-chosen SOLO mission only, +10 per real personal card +10 Charge once/day | First v0.8; D049–D051 supersede all Crew-for-Charge examples |
| 3/3 cards mandatory or social-dependent chosen mission | Quick Play 2; Curious 1 curiosity+1 other; Creative 1 private creative answer | First v0.8; mission switching only before completion |
| Daily Charge automatically opens Capsule in first daily loop | Charge grants once-daily Aura and actual Regular progress without implying Capsule | Capsule v0.8.x |
| 3-stars Drop Explorer, Dropsmith, Still Here 5/150/3000 etc | Explorer, Sparkmaker, The Regular with D044 numerical curves and D052 earned names | First v0.8; all nine titles selected |
| Cumulative 730 day called streak; fourth streak path | Cumulative real active days and consecutive streak tracked separately; optional Regular sub-milestones | First v0.8 basic streak, richer submilestones v0.8.x |
| Gems rewarded and balance shown before useful shop | Invisible/versioned ledger if award quantities approved; display ONLY once cosmetic catalogue/redeem works | Catalogue v0.8.x or later based on actual product |
| No Crew Pulse until later | Small rolling seven-day factual real-action + unique-mate Pulse experiment | First v0.8; complete chain/reveals later v0.9 |
| Original full Mystery Reveal Chain | Not cancelled; not sneakily first v0.8 | v0.9 conditional on meaningful first Pulse signal |
| Aura orb optional CSS v0.8.x; 3D much later | Original evolving Orb is FIRST v0.8 permanent central UI/brand primitive and app-icon motif | Advanced WebGL/skins v0.8.x+; only heavy interaction deferred |
| Fixed Aura 11-level ladder or proposed permanent 20/33-level cap | Full display-level rebalance, 25+ launch levels after score modelling, open-ended named chapters | First v0.8, append chapters later, PRESERVE every earned score |
| Legacy Aura level titles might become collectibles | Not necessary; replaced visibly, existing genuine badges and score remain | First v0.8 |
| Only highest earned title displayed | Collect all, select per-path earned title and optional featured profile title | First v0.8 |
| One big dark Proxima makeover / compatibility scores / maps | Use purple/lilac Adda social design with futuristic Orb/Aura accents, no unsupported inference | Orb v0.8, consent-led graph/map v1.1+ |
| Full AI-generated decks and always-on AI | Curated templates and deterministic coach first | Opt-in Drop Copilot v0.8.x/v0.9; AI is NEVER needed for scoring/core |
| Infinite Arena feed to fix no-Crew cold start | Real guaranteed personal deck, no invented social results | Arena after safety/identity/moderation |
| Real user photos/globally synced avatar immediately | REAL initials and own local avatar first, source-checked photo-led card assets | Full synced DP/media after auth/permissions |
| Rich media, stickers, Rank It, React only, music upload | Six real existing formats retained; art/media expansions are separate | Rank It/React later if tested, video/sound after rights/infra |
| DMs, Moments/Blink, Plans, Memories, push, monetisation | Preserve as explicit future scope, not first-v0.8 promises | v0.9 experiments, v1.0+ foundation/private-suite, v1.1+ discovery as gated |
| Old Vibe user-visible label and local IDs | Aura user-visible; internal old getVibe/routes/Blob keys may remain for backward compatibility | Names/levels change in display only; no destructive storage rename |
| New domain means faster app or verified people | Branded URL is distribution; performance requires aggregates/indexed DB; auth requires verified identity | A/B infrastructure stages and foundation gate |

## Founder questions to carry into C without stalling A or B
1. Sparkmaker Star III title **Social Supernova** founder-approved D053. Localisation/casing and achievement PATH names remain to verify; do not reopen the earned-title selection.
2. Daily Charge impossible-switch when all 3 slots are answered or no remaining eligible category: prevent impossible switches (show reason), or permit a zero-base-Aura supplementary creative prompt; maintain +30 max card Aura and +10 Charge cap. Define minimum creative save and truthfulness, daily timezone/clock-change policy.
3. Crew Pulse 168 elapsed hours vs seven participant-local calendar dates; genuine action weights, distinct-participant minimum, what to do with 1–2 mates/older membership, no fraudulent results, one small truthful payoff.
4. Actual privacy-safe beta Aura distribution, actual founder-key analytics cold load, mobile measurements, first 25+ level thresholds/names and Orb-tier mapping. DO NOT choose numbers from illustrative charts before modelling.
5. Gem grant quantities/retro policy and catalogue costs/identity readiness; whether to show only titles for two Coming Soon paths, optional Orb skins and intro brand assets; image license/source registry and accessibility performance.
6. Minimum technical correctness gate for v0.8: browser beta IDs are not verified distinct humans, source-proven rewards only; block exploitative per-day/Star awards and finish backup/recovery. Cross-device verified ID/OTP is a separate agreed infrastructure milestone.

## Execution decision
Founder may MOVE ON TO A NOW: these are mostly acceptance parameters/design choices for C, not blockers to v0.7.3 field-test stabilisation or safe domain selection. Next A (field test QA/performance/reliability), then B (domain and store safety), then C (canonical full v0.8 SRS and final approved feature checklist/acceptance and economy), then explicit engineering authority for v0.8. The founder has NOT authorized code or deploy by requesting a clean roadmap.

## D054 brand-neutral roadmap sequencing (supersedes domain-before-SRS requirement)
Adda WORKING brand only. Existing Deploy Preview is safe temporary distribution; avoid Adda-named domain purchase. Option C brand-agnostic SRS may proceed now while permanent B1 domain waits for final brand selection, availability/conflict checks and founder purchase. Aura Orb central first v0.8 stays but final app wordmark/icon lock waits for brand. No blind internal key rename or cross-origin guest identity reset. Canonical runbook D054.
