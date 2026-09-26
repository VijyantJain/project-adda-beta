# Project Adda — consolidated product direction, 2026-09-24

Status: living product strategy, not blanket permission to ship new features. Owner: Vijyant Jain. Primary promise: a private, low-friction place where REAL friends participate together; plus meaningful solo Aura value before/without active mates. Do not build a generic infinite public feed or insert fake social proof. User-visible Vibe has become Aura; old route/API/storage labels stay for backward compatibility.

## Phases and release gates
| Phase | Scope | Gate |
|---|---|---|
| v0.7.3 field-test hardening, NOW | unblock analytics, fast honest Aura, Crew rendering, remove active-nav dots, avoid duplicate Tenacious, avatar chain/unique Mates affordance, onboarding regression | inspect actual iOS Safari, Android Chrome and WhatsApp in-app on live preview; preserve all old Crew data |
| Domain/hosting bridge, BEFORE wider invites | buy an owned domain; connect to CURRENT site safely without changing Netlify store context; decide whether to migrate entire API/data or keep Netlify temporarily | domain owner pays registrar; verify live DNS/SSL/deep links, no blank new Blob store |
| v0.8 personal return loop, DISCUSSION | 3–5 optional Daily Aura cards; varied real prompts, personal recap, non-exploitative repeat value; starter long-horizon 3-star achievements and first lightweight cosmetics; polish already mapped concept UI | coherent reason to return even without friends; metrics and editorial/content QA; founder approves exact scoring |
| v0.8.x visual refinements | member avatar chains in Crew/Home/reveal, profile identity, share cards, subtle neon and optional lightweight Aura orb fallback | responsive 320–430px; LCP and reduced motion pass; authentic people/photos only |
| v0.9 creator/community depth | optional opt-in AI Drop copilot, factual Crew recap, contextual Drop suggestions, richer template/remix, Crew Pulse/Plans, fast analytics DB aggregate | privacy/redaction, per-user cost budget, moderation, idempotent content writes |
| v1.0 durable social foundation | real authentication/account recovery, globally synced profile photos, durable indexed DB, consent-based messaging/notifications, report/block, private media permissions; PWA polish | backup+restore drill, role rules server-side, privacy/access review, security/load/mobile acceptance |
| later, evidence-led | opt-in shared-interests and compatibility (not psychological diagnosis), nearby events + location map (explicit permission), opt-in 3D Aura, sound snippets (clear rights), DMs, Arena feed | cohort evidence for demand, data protection and operating budget; no vanity launch |

## Non-negotiable principles
- Guest/browser participant ID is NOT verified identity. Same human on a different phone may be treated as new until auth exists.
- A new Crew-link visitor answers up to two real Crew Drops, then Starter/Tenacious/Aura/Profile, returns EXACT original Crew, creates FIRST user-authored Drop there and is offered exact Drop sharing. A new Drop-link visitor answers exact invited Drop FIRST; direct visitors play Starter first.
- User-authored first custom Drop and five system-seeded Drops are different ledger categories. Publish once, answer once, don't invent engagement/rewards.
- Unanswered Drops at top, answered below. Crew settings admin-only. Mates list separate, header space reserved for future notification/DM button.
- App must feel fast, but never trade response correctness or UI score honesty for a fake instant number.
- Share sheet opening ≠ delivered invite. Compatibility percentages and group “consensus” must not be fabricated.
- 3-star achievements/gems should support mastery and cosmetic identity, not pay-to-win, paid odds, time-pressure manipulation or large reward for spamming shares.
- No v0.8 code or production main merge on the strength of this plan alone.

## What this cleans up
Historical ROADMAP, PRODUCT_BLUEPRINT, FIRST_FIVE_VIBE_RUN and early ONBOARDING texts capture earlier product directions; this document resolves their status without deleting their original content. Phase names may be renumbered later but stable feature IDs MUST remain. Use CURRENT_STATE for chronology, START_HERE for current direction and FIELD_TEST_ACCEPTANCE for real open bugs.

## Proposed release naming
Current = v0.7.3 field test + date-stamped acceptance patch; NEXT = v0.8 only after 2–3 days of feedback. Domain is an infrastructure milestone, not proof of a finished native app or improved speed.

## Founder-confirmed first v0.8 direction update, 2026-09-24
See docs/2026-09-24_V08_FOUNDER_DECISIONS.md (D040). Daily Aura varies 3–5 by interests/activity; Daily Charge launches but Capsules wait until v0.8.x; three live three-star achievement paths plus two Coming Soon; Gems tracked but hidden until actual cosmetic redemption; a small factual Crew Pulse experiment joins first v0.8. This corrects historical text that placed ALL Crew Pulse after the personal loop. The full Reveal Chain, expensive visual layers and public Arena remain later. No v0.8 implementation approved; field-test hardening / domain / final spec still precede coding.

## D052 CURRENT PHASE OVERRIDE (2026-09-24)
This older summary's v0.8.x optional Aura Orb wording is superseded: core evolving Aura Orb, prominent Aura/Home/profile visual and master-Orb brand/app icon motif are FIRST-v0.8 scope, with static/reduced-motion/performance-safe first render. v0.8.x covers expanded effects/skins/optional WebGL only. Other current phase corrections and renamed/deferred historical features in docs/2026-09-24_V08_RELEASE_SCOPE_LEDGER.md. Keep status DISCUSSION NOT IMPLEMENTED.
