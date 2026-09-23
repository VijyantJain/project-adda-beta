# Project Adda — Decision Log
Updated: 2026-09-22

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

## D013 — Play-before-create onboarding
For a direct new arrival without a Crew, run First Five before asking to create or invite. Shared Drop and Crew deep links keep their direct flows. Creator gets five automatically seeded Crew Drops after opting in.

## D014 — Intro rewards are earned and idempotent
Starter answers earn 10 Vibe each with one-time +30 and +50 milestone bonuses; milestones are real, not fake countdowns or simulated votes. Separate Starter records from private Crew records; prevent repeated reward farming. First Five v1 details live in docs/FIRST_FIVE_VIBE_RUN.md.

## D015 — Reward economy and future gifting are separate concepts
Future free/premium gifts are concept proposals only. Preserve Vibe as earned activity status; purchased cosmetics must not directly buy competitive experience. Assess caps, abuse prevention, recipient controls, refunds, pricing and legal matters before implementation. See docs/REWARD_ECONOMY.md.

## D016 — Document on each meaningful product change
Update the feature-specific canonical spec, CURRENT_STATE, DECISIONS and ROADMAP as appropriate, then append the Drive Product Ledger handoff. Do not duplicate full master specs across every file or leave unique decisions only in chat.


## D017 — Separate solo and invited first journeys
Solo first-timer: First Five / Bonus → one Tenacious Crew-creation CTA → five seeded Drops → share dialog. Invited first-timer: provisional enrollment, First Five, one Enter <Crew> CTA, display-name finalization, original Crew/Drop. Existing members keep direct flow; see FIRST_FIVE_VIBE_RUN.md.

## D018 — Honest final reward and visual consistency
Tenacious itself shows earned Starter Vibe and specifically labeled Starter achievements. No View Vibe/Back to Crews buttons there and no “not now” escape on Crew form. Reward uses the exact supplied neon-trophy screenshot crop with animated flashes, reduced-motion and full-width mobile presentation.

## D019 — Invite/share is user-initiated
After backend confirms five seeded Drops, show a dialog previewing a fun prefilled invite. Open OS share/WhatsApp only on user action; opening the share sheet is not equivalent to verified delivery.

## D020 — Verified identity and contacts are staged, never faked
Beta browser-local participantId does not provide a true lifetime guarantee. Actual email/phone OTP, cross-device merge, profile handle, DP, bio and contacts opt-in need M1 provider/database foundations. Permission prompts must follow the user's explicit Find Friends action.

## D021 — Ten questions before first-time conversion
Both truly new direct and invited browsers see identical initial welcome and complete First Five AND second five before cohort-specific Tenacious conversion. Five-question trophy is a milestone, not an escape to Crew. Invited path cannot redirect or finish before Tenacious.

## D022 — Guided first-Crew interaction
After the first generated Crew or first invited Crew/Drop, show opt-skippable real coach marks for Crew meaning, Drop meaning, choice/answer and one additional Drop. Store completion locally for beta; migrate to verified profile progress in M1.

## D023 — Evidence-driven analytics, no automatic origin verdict
Ashburn/USA/Linux is not independently a bot/internal marker. Track automation UA/missing browser signals separately and preserve underlying visitor records. Do not equate Netlify HTTP request totals with unique browser visitors or verified humans. See ANALYTICS_V2.md.

## D024 — Profile beta versus verified identity
A functioning browser-local name/bio/DP editor may ship now, prominently labeled device-only. Never claim working email/mobile OTP, global username availability or cross-device sync without actual configured backend/Auth/SMS/email provider and migration.


## D025 — Version starter deck, never overwrite prior participants
New Starter records deckVersion=v2 with 6 common + 2 selected-interest + 2 common content; v1 answers keep original 10 questions. Points and six achievements remain consistent. Changing content for in-progress records requires new versioned deck, not in-place reassignment.

## D026 — Private interest-led guide and optional gender
Interest pack explicit and selectable by everyone. Gender optional/private as SECONDARY tone for requested selected interest; no exclusive gender access or inference. Two guided interest questions are personal, not added to common Crew Drop inventory/reveals/Recap. All Crew members retain five shared seed Drops.

## D027 — Complete five-tab + profile guide after two real Crew answers
Ordered Home → Crew → + Create → Vibe → Profile coach marks and real screen navigation. Profile photo optional, bio, username draft; no fake uniqueness claims. Preserve opt-out/replay, guide progress and no repeated server points on retries.

## D028 — OTP is an actual deployment gate
The user-approved end-state is guided email/mobile OTP through authenticated account creation. Current beta cannot complete that step without provider, SMS/email service and DB. Mark guide as awaiting_provider rather than falsely claiming verification; users stay able to play and return. Never silently treat localStorage as a verified identity.

## D029 — Aura is the user-facing status language
Use Aura/Aura Score/Aura page in product UI; keep legacy Vibe API keys, event names and historical documents for compatibility. This is not a storage migration or a score reset.
## D030 — Guided tour is a controlled mission
No midway Skip or outside-tap dismissal. Only one advertised coach-card action at a time; actual answer interaction unlocked when needed. Photo, personal bio, gender and username draft cannot become compulsory disclosure; local avatar/default are legitimate completion paths. Refresh recovery, browser/accessibility testing are acceptance gates.
## D031 — Tenacious is a continuation, not a forced invitation
Direct new users earn a personal Aura before they know Adda. Make Aura the next primary destination; optional Crew CTA. Invited users enter their actual shared Crew/Drop. Record solo-to-profile/social activation and do not conflate creator invitations with true personal value.
## D032 — Cold start requires a truthful independent personal loop
Plan a finite, interest-led Daily Aura Deck after validating current activation; no fake members, manufactured vote percentages, fabricated scarcity, manipulative notification pressure or click-for-points farming. Distinguish current Starter from future daily repeat supply.

**D029 implementation note:** Server-supplied historical Starter feedback, level names and badge display labels must use Aura too; numeric scores and stable old record identifiers are intentionally not migrated or reset.

## D033 — Direct tour must be Crew-independent
Separate persisted solo participant journey automatically begins on real Aura after Tenacious, preceding Home→Crew informational view→Create informational view→guided Profile. Rescue v0.7.1 missed-guidance users. No Crew creation/invites required to complete intro. Invited journey keeps exact Crew/Drop.
## D034 — Never hide server-earned score behind fabricated fallback
Add getAuraStarter per-participant server read (Starter+guide), shared level curve; show 180 on 10 confirmed Starter answers. Full Crew getVibe remains backward-compatible; label partial/retry on aggregation failure instead of 0 and 0/0 trophies.
## D035 — Visual and content versioning
New Starter v3 questions and 24 real bundled WebPs; original v1/v2 answer-option catalogs and records preserved. Photo source/photographer/release/high-resolution acceptance D-020/D-021 remain unverified for wide distribution.
## D036 — Explicit, factual Aura economy
Present actual per-action scores, note recorded shares ≠ delivered invitations, keep legacy key/event/score history, plan anti-farming without silent reset.


## PROPOSED D033 — First-ever created Crew has its own guided activation
Differentiate CREATED vs JOINED; reuse existing profile name; spotlight real Crew functions; choose two explicit interests, server-seed 5 distinct shared eligible Drop formats idempotently, coach 2 real interest answers and offer a genuine Crew share action. Do not repeat after second created Crew. Status SPEC pending founder flow review.

## PROPOSED D034 — Crew IA separates member list from admin settings
Crew Chat, Recap and Mates are social modules; personal Aura remains in global navigation; admin-only Crew Settings is a distinct gear. Retain non-admin Leave Crew. Recap currently aggregates real all-time Crew activity, not fictional AI or weekly highlights. Status SPEC.

## PROPOSED D035 — Deep-link priority before generic onboarding
New Drop invite must answer exact Drop first; new Crew invite enters actual Crew first; direct journey stays frozen. Existing beta user skips compulsory Starter; local browser identity is not verified auth. Crew-invite existing-Drops follow-on Starter and Aura/Profile are mandatory after two genuine Crew answers (D038). Status SPEC.

## PROPOSED D036 — First custom Drop tutorial / no invented share success
Explain six formats, prohibit one-mate Most Likely, guide type-specific fields/settings, commit once, then offer actual Drop deep link via OS share/fallback. Share sheet opening does not confirm delivery; cancelled share has safe recovery. Status SPEC.

## PROPOSED D037 — Seed and reward safety
Only first ordinary-created Crew's opted-in seed flow writes five real shared Drops, 5 different allowed types, backend idempotency and partial-write recovery. Do not modify original seeded five or award a fabricated second reward. Status SPEC.


## Founder-confirmed D038, 2026-09-23 — MANDATORY onboarding after first two Crew-link answers
For a first-time beta visitor opening a Crew invitation with at least two real unanswered Drops, the required order is: enter the EXACT linked Crew → member-specific Crew welcome/tour → answer TWO REAL unanswered Crew Drops → play all TEN Starter questions → unlock Tenacious → guided Aura/Home/Crew/Create/Profile → return SAME original Crew → mandatory first-custom-Drop guided creation through + → publish real Drop in original Crew → offer exact Drop deep-link share → finish tour and resume normal usage. Already earned Crew points and response records are retained; Starter's 180 points count once. Preserve the original crewId across refresh. No new Crew creation, duplicate seed, duplicate answer or forced invitation. If fewer than two unanswered Drops remain, answer any genuine available Drop and proceed with a clearly described fallback without trapping the visitor. This decision supersedes any earlier “optional”, “deferred” or “pending” text about this specific cohort. New DROP-link entrants still answer the exact invited Drop FIRST before Starter. Existing visitors do not repeat Starter. DECIDED / SPEC, NOT IMPLEMENTED.

## D039 — First custom Drop is REQUIRED before Crew-link newcomer onboarding finishes (founder confirmed 2026-09-23)
D038's return to original Crew is a handoff, NOT the end of onboarding. Once Aura and guided Profile finish, the Crew invitee must be shown “Now create your first Drop inside [Crew name]”, complete all first-custom-Drop + screen explanations, publish once in that exact Crew, and receive an opportunity to share THAT Drop. Only then mark this invite-specific guided journey complete and allow normal usage. Apply this to non-empty Crew (after two genuine Crew answers) and to empty Crew (already specified); no force-replay for returning visitors or users who already authored their first custom Drop. Persist pending Crew ID, guided step and published Drop ID across reload; no double points/duplicate posts. DECIDED, SPEC NOT SHIPPED.

## D040 — Five founder-confirmed v0.8 scope decisions (2026-09-24)
1. Daily Aura is variable 3–5 optional cards based on interests/activity. 2. Daily Charge first v0.8; Capsules v0.8.x. 3. Three launched three-star achievement paths, two labelled Coming Soon. 4. Track earned Gems but hide their balance until actual cosmetic redemption is usable. 5. Include a SMALL factual Crew Pulse experiment, not the entire Mystery Reveal Chain. Targets/rewards, Charge payoff, Pulse thresholds and visual cut not yet approved. See docs/2026-09-24_V08_FOUNDER_DECISIONS.md. THIS IS PRODUCT DECISION ONLY, NOT AUTHORISATION TO BUILD OR DEPLOY.

## D041 — Six founder-confirmed v0.8 mechanics (2026-09-24)
Three guaranteed personal Daily Aura cards, with zero-to-two REAL-activity extras; Charge completion gives a modest one-time Aura bonus plus long-term achievement progress; first release has three genuine achievement paths but names/targets pending, and cumulative active days distinct from consecutive streaks (fourth streak path NOT implicitly approved); Gems track privately but show only stars/Aura until working cosmetic redemption; small Crew Pulse experiment combines authentic meaningful actions and distinct real mate participation. All point amounts, period boundaries, achievement path membership, Pulse mechanics and visuals remain founder-review items. See docs/2026-09-24_V08_FOUNDER_DECISIONS.md. DECIDED DIRECTION ONLY / NO V0.8 CODING APPROVAL.

## D042 — Founder v0.8 achievements architecture (2026-09-24)
Three live three-star paths: Explorer (only distinct genuine Crew Drop answers; Daily Aura separate), Sparkmaker (actual authored Drops AND peer responses; tiers 1 authored / 20 authored +30 peer responses / 200 authored +1000 peer responses), The Regular (cumulative real active days AND real Daily Charge completions; consecutive streaks are optional sub-milestones, not a fourth working path). Give historical participants legitimately earned achievement stars AND one-time retroactive achievement Aura via versioned idempotent ledger; do not fake prelaunch Charge completion or replay baseline activity Aura. Exact names beyond working labels, Explorer/Regular thresholds and bonus amounts remain open. Full detail: docs/2026-09-24_V08_FOUNDER_DECISIONS.md. DESIGN ONLY; no v0.8 implementation authority.

## D043 — Founder locks generous Star Aura and star/title dual identity, 2026-09-24
Per achievement path award +50/+300/+1500 Aura once at Stars I/II/III (1,850/path, up to 5,550 across first 3 paths). Show Star tier AND achievement-specific earned title; exact path/tier wording is not locked. Explorer and The Regular milestone targets were expressly NOT approved; earlier numerical curves are examples. Sparkmaker structure remains D042 locked. Historical earned achievement Aura paid retroactively exactly once when genuine source records qualify; no prelaunch Charge invented. Discuss new Aura levels beyond existing 2,000 Legend without altering earned history. See D043 in docs/2026-09-24_V08_FOUNDER_DECISIONS.md. NO V0.8 CODE AUTHORISATION.

## D044 — Founder locks two long-horizon target curves, opens full naming redesign (2026-09-24)
Explorer = 5 / 300 / 3,000 distinct real Crew Drop answers, Daily Aura excluded. The Regular = 5 genuine active days / (120 active days AND 60 actual Daily Charge completion days) / (730 active days AND 365 actual Charge completion days); no fake historical Charge. Sparkmaker remains 1 / (20+30 real peer responses) / (200+1,000 peers). Each path +50/+300/+1,500 Aura on earned Stars I/II/III once, including provenance-verified historical awards. Founder requests THREE complete naming systems before approving path names/earned titles and reconsiders ALL visible Aura level names, but every earned score remains intact; threshold rebalance NOT approved. See D044 in docs/2026-09-24_V08_FOUNDER_DECISIONS.md. NO V0.8 CODE APPROVAL.

## D045 — Founder hybrid identity, complete display-level rebalance and collected earned titles (2026-09-24)
Warm Social Mastery names + futuristic Aura visuals; redesign ALL visible Aura level labels and the FULL displayed threshold curve, while preserving every earned Aura point, base record and historical reward. Exact new labels, numerical thresholds and migration/display rules still unapproved. Collect all actually earned per-path titles and let users choose which earned title to display separately for each achievement; no locked titles selectable. Keep previously locked Explorer/Sparkmaker/Regular targets, +50/+300/+1500 star bonuses and hidden Gems. No v0.8 code permission. See D045 in docs/2026-09-24_V08_FOUNDER_DECISIONS.md.

## D046 — Founder chooses 25+ Aura level exploration, playful/futuristic titles and featured profile title (2026-09-24)
Explore a complete 25+ displayed Aura level curve, rebalancing levels and titles without changing ANY earned Aura points or earned badges. Old visible level labels are replaced (no mandatory old-title collectibles); keep raw history. Explore new playful/futuristic titles for 3 paths/9 Stars; exact titles and 25+ thresholds pending approval. Permit user-selected featured earned profile title PLUS independently chosen earned titles in each of three achievement paths. Maintain D040–D045 targets and one-time +50/+300/+1500 bonus; NO CODE/DEPLOY AUTHORISATION. Full D046 in docs/2026-09-24_V08_FOUNDER_DECISIONS.md.

## D047 — Open-ended named Aura chapters, blended naming at all stages (2026-09-24)
Founder chose OPEN-ENDED Aura progression, finite published level table expandable by new named chapters and levels periodically (no hard 33-level cap), with social/playful and futuristic/luminous names interleaved at EVERY stage. Complete displayed level rebalance remains planned while all earned Aura, badges and raw reward records preserved; obsolete level display names need not be collectibles. Actual launch thresholds/chapter sizes/names/release cadence remain UNAPPROVED. Do not freeze accrued Aura at top published level. See D047 in docs/2026-09-24_V08_FOUNDER_DECISIONS.md. DESIGN ONLY, NO CODE.
