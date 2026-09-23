# Adda v0.7.3 — Crew, Drop Creation and Invite-Entry Product SRS

Status: SPEC / FOUNDER FLOW REVIEW. This design document is NOT an implementation or deployment claim.
Baseline: v0.7.2 commit 8b1da1789c2e7bad6110c6bdafbf911b1b11b377, development branch v0.5-full-experience.
Draft date: 2026-09-23. Companion: CREW_ONBOARDING_FLOWCHARTS_V073.md.

## 0. Preservation / release contract
- Freeze the working v0.7.2 direct Starter (10) → Tenacious (180) → Aura×3 → Home → Crew information → Create information → Profile and existing score/trophy infrastructure until changes are implemented and regressed on a separate feature branch.
- Do not merge into main, clear/rename Netlify stores, overwrite existing Crews (especially Avengers), replace legacy v1/v2/v3 Starter answers, or reset members, responses, images, Chat, points or analytics.
- No repeated production deployments. Product decisions/specification on this separate non-release branch; ship together only after founder confirms flow and preview QA.
- Explicitly distinguish SPEC, BETA and device VERIFIED. Accounts/OTP/global names are NOT live; “registered/returning” presently means a recognizable local beta participant and, where applicable, confirmed Crew membership. A new device/browser cannot be reliably identified as an existing person until real auth.
- All hints about successful invite delivery, social vote totals, and Aura earned points must reflect actual backend/provider evidence. Do not infer that opening OS share sheet means message was sent.

## 1. Root cause / current behaviour to retain or repair
Current starterCreateCrew endpoint creates five shared Drops. The ordinary createCrew endpoint creates a Crew with no seeded Drops. After v0.7.2 direct onboarding, users naturally take ordinary createCrew and encounter an empty page. The existing first-Crew coach is invoked primarily via the old starterCreateCrew and invited-finish paths, not ordinary createCrew. The normal Crew hub currently has Chat, redundant personal Aura, Recap and Mates, while both Mates and header count lead to a combined settings/member page. Recap currently shows real current all-time Drop count, response count, member count, result count, most-used format and highest-response Drop. It is not yet a weekly time-window recap. These are implementation observations, not future desired functionality.

## 2. First-time name and Crew creation form
- Reuse non-empty local profile displayName / browser participant name. Example: “Hey Vijyant 👋 What are we calling your Crew?” followed by Crew name, helper about the private group, and Start Crew. Do not require a second name field when a name exists.
- If no usable name exists: ask display name once and Crew name; store display name locally, send nickname to backend member record, update the local profile without losing photo/bio/handle/interest. Name remains unverified and device-local; any change across other Crews requires an explicit future rename policy.
- Disable duplicate submissions; show preparing state and recover idempotently after slow/failing response. Record first CREW CREATED by this participant versus first CREW JOINED; these are different milestones.
- Do not seed existing/second-or-later Crews implicitly without an explicit product rule. New Crew creation must remain useful even when no seed pack is chosen.

## 3. Crew homepage visual information architecture
Header: Crew name, Invite button, and (admin only) small Crew Settings gear. Members list is a standalone “Mates” button/card in the page body; move/repoint existing header people count so it opens Mates, not Settings, or remove redundant header shortcut after QA.
Main module cards: Chat (Crew-specific); Recap (factual Crew summary); Mates (all confirmed/provisional members with admin label as applicable). Remove personal Aura from the Crew module area; personal Aura remains in global bottom navigation. Place a conspicuous Drops section with unanswered-first list and a Create + action. Admin-specific management is not disguised as Mates.
Crew Settings: admin-editable name, manage/remove members, delete Crew, admin insights. Never give a non-admin functional edit controls or call admin endpoints on their behalf. A normal member still needs Leave Crew on a separate, non-admin personal action surface (e.g. Mates footer).
Recap must tell the truth about data source and period: counts/actual highest-response Drop; in empty Crew say “Your recap starts when the Crew plays” rather than implying a nonexistent highlight. Time-filtered weekly recap remains a different planned feature.
Unanswered Drops are sorted first for the viewing participant, then answered Drops; each keeps response count, You’re up / Answered / Result ready. Seeded answers from the guided mission count as REAL responses; never duplicate them on rerun. Do not alter Crew-wide reveal rules.

## 4. First ever CREW CREATED: guided journey
Entry: creator presses Start Crew; successful server-created Crew loads. If this is first Crew ever CREATED by the participant, begin dedicated non-skippable Crew creator guide (NOT the already completed solo Aura/Profile tour).
Stage A: congratulate first Crew and, if backend confirms a new +10 membership reward, show exactly that. No invented extra award.
Stage B: each meaningful Crew home element receives one short spotlight: title/invite, Chat, Recap, Mates, admin-only Settings, Drops list, Create (+), and unanswered/answered/result states. Show live/relevant screen, not an off-screen fake control.
Stage C: ask TOP TWO explicit interests, preselect existing s6/optional profile interest only as a suggestion; user can change both. Require distinct selections or permit one with a clear fallback (decide in UI); optional gender is never a substitute. Save selections in scoped guide state; do not publish these private picks or overwrite an existing Crew’s public Drops.
Stage D: server seeds EXACTLY FIVE distinct shared real Drops: one linked to each of the two interests plus three varied curated prompts, one of each eligible type Quick Answer, This or That, Vote, Rate, Predict; Who’s Most Likely is explained later but never seeded for a one-mate Crew. All five shared to current and future mates; seed must be server-side, per-Crew idempotent, retry/partial-write recoverable. No duplicate seed on refresh, and never reset old Crew content.
Stage E: explain what a Drop is, the options/response/reveal. Coach the creator through TWO unanswered interest Drops using actual member and response endpoints. Record both answers; after each, it moves below unanswered cards. If a retry finds one/both already answered, resume or use a genuine unanswered Drop; never demand a duplicate response.
Stage F: congratulate two real answers, show opt-in invitation with funny Hinglish message and actual Crew link; use native share sheet when available, fallback apps/copy otherwise. Explain the goal: more real mates means more actual outcomes. Do not assert invitation delivered. Finish the guide after share action has been offered/returned or a transparent “Couldn’t share now” recovery path; don't trap users on OS cancellation/offline. A return invitation CTA remains visible.
No additional forced Aura/Profile tour for the already completed direct user. This first-created-Crew guide is separate and replayable without farming rewards.

## 5. Creator of second or later Crew
Open the new Crew normally. Do not impose the full first-Crew coach. Offer “Invite your mates” (Crew link → native sheet/fallback; funny editable Hinglish) and “Create a Drop” as clear next actions. No false seeded five if not explicitly seeded. First custom Drop created in ANY Crew still gets a one-time Create-Drop tutorial if not completed.

## 6. First custom Drop tutorial (irrespective of entry point)
Fire on first explicit attempt to create a user-authored Drop from +/Create in a real Crew; server-supplied authored-drop count, not seeded system Drops, determines eligibility. Can resume when opened elsewhere; own first seeded pack does not count as user's first custom Drop.
Stage 1: short purpose; explain all SIX formats with one concrete example each (Quick Answer, This or That, Vote, Rate, Predict, Who’s Most Likely). If fewer than TWO real Crew mates, Who’s Most Likely visible but unavailable with helpful “Unlocks with one more mate”; server validates too.
Stage 2: pick eligible format; show only settings relevant to chosen type, explain question, options, image picker where relevant, rating label edits, prediction outcome and reveal threshold/name/answer-change settings (honour current type settings matrix). No fake public results.
Stage 3: valid preview/confirmation; mandatory fields checked both client and server. One publish action must create EXACTLY ONE Drop. Use stable idempotency key/client request token or safe lookup after network timeout; never post duplicate on retry.
Stage 4: show the actual saved Drop and offer **this Drop’s deep link**, not generic Crew link, via OS share/fallback and playful Hinglish text. Track sheet open, cancel/fallback separately; do not call “sent” unless confirmed (normal Web Share does not prove app delivery).
Stage 5: guide ends only after invitation offer/share interaction and accurate final acknowledgement. If OS share is cancelled, clearly offer Retry or “Can’t share now; keep my Drop” as transparent no-trap recovery while preserving the published Drop. Return to Crew with new Drop unanswered for creator unless they separately answered it.
Native sharing only from a real user gesture (not delayed automatic share call outside gesture). Existing share menu and Drop format behaviours remain intact.

## 7. Invite cohort routing: entry precedence and exact deep-link fidelity
At link open, retain exact crewId/dropId/query campaign as a pending immutable invitation context until the desired action is completed. Check actual participant/session membership and saved Starter state, not just “profile screen seen”. If link came from a Drop, Drop action wins over generic Crew tour. Refresh/back/network retry must never erase the target, duplicate member or award.
New here means no recognized earlier complete participant identity in this browser; since real auth isn't shipped, a returning human on a different browser may take new-user flow. Never say verified/registered solely from localStorage.

A. Direct new: keep v0.7.2 flow untouched. Later first Crew CREATED triggers section 4; later first custom Drop triggers section 6.

B. First-time via CREW link with EXISTING Drops:
  1. Land in actual linked Crew, provisional join if necessary; request one nickname only when a public action needs it; welcome “You’re in [Crew]”.
  2. Full newcomer Crew explanation adapted to MEMBER view (no admin Settings control), without forced new Crew.
  3. Teach and answer the top two genuine unanswered Drops from that Crew; after response, badges and ordering update.
  4. Continue normal usage. REQUIRED (D038): after TWO REAL Crew answers, ten Starter questions and guided Aura/Profile are compulsory, followed by return to the same Crew.

C. First-time via CREW link with ZERO available Drops:
  1. Welcome to linked Crew and explain Crew; do not pretend it has seeded content.
  2. Transition to the existing full ten-card Starter, Tenacious, Aura/Home/Crew/Create/Profile tour without losing link; on completion return to exact linked Crew.
  3. Start first custom Drop tutorial; guide real publishing in that Crew; share this new Drop; resume normal use.
  4. A Crew with existing Drops but all answered by this particular user needs a sensible return path, not forced re-answer; classify available unanswered vs total carefully.

D. Returning via CREW link: join/resolve membership and land directly in the exact Crew, no forced Starter/first-Crew or profile tour. If user has never created a custom Drop, only an explicit Create action triggers section 6.

E. First-time via DROP link:
  1. Preserve exact Drop and Crew; explain this REAL Drop first and guide answering it BEFORE Starter. If posting a public answer needs a nickname, request just one lightweight name; don't run full profile at this moment. Do not reveal others' result prior to eligible answer.
  2. Once real answer acknowledged, introduce app tour and 10 Starter cards → Tenacious → Aura explained → Home → Crew/Create information → optional-avatar/Profile.
  3. Return to same linked Crew; run full member-specific Crew explanation and guide two OTHER genuine unanswered Drops if available; do not re-ask the original invite Drop.
  4. If no other real unanswered Drops exist, guide the user into first custom Drop tutorial, publish in THIS Crew and offer the Drop link; then normal use.
  5. Do not create a new blank Crew during these steps.

F. Returning via DROP link: land on exact Drop (joining Crew if needed and authorized), answer/view real result per access rules and continue normal usage. No forced replay of onboarding. If the Drop was already answered, show the actual waiting/result state.

## 8. Proposed short on-screen copy samples (edit/test before ship)
- Crew creation: “Hey [name] 👋 Ab apni gang ko naam do!” / “Your Crew name”; if missing name, “What should your mates call you?”
- New creator: “Your first Crew is live! 👥 Your Aura grew by [actual points] ⚡” (omit amount unless backend confirms earned).
- Chat: “Crew ki baatein, sirf Crew ke saath. 💬”
- Recap: “Your Crew’s real highlights—once you start playing.”
- Mates: “Who’s in your gang? See everyone here.”
- Interest: “Choose two things your gang would love to debate.”
- Invite Crew: “Oye [name], gang ka Adda khul gaya 😂 5 Drops waiting. Tu nahi aaya toh hot takes kaun dega? 👀 [link]” (only say 5 if there are 5).
- Invite Drop: “Ek sawaal hai. Tera answer jaan-na zaroori hai 😂 Vote/answer kar, phir dekhte hain gang ka scene 👀 [link]”.
- Drop tutorial: “Six ways to start a scene. Pick one; we'll show you the settings.”
Copy is an editable default, not emotional manipulation or fictitious group activity.

## 9. Flow/state architecture and idempotency
Use explicit per-participant, per-entry journey state: visitor id; entry_kind=direct|crew_invite|drop_invite; exact pending crew/drop; stage/substage; actual Starter version+progress (server); Aura guide done; first-created-Crew guide done keyed by crewId; first custom Drop created/tour done keyed by participant+created dropId; last confirmed answer; seed batch id/status; invitation offered/opened/cancelled (NOT delivered).
State machine transitions only after API success; create/update actions server-reconciled on timeout before retry; write answer/seed/create idempotently; ensure UI guard is scoped to active modal/answer/publish; preserve browser refresh and internal navigation. Do not mark any step done simply because a screen rendered. One-time guide points still use guide/v1/<pid> or documented additive keys, never repeated direct score edits. Preserve existing preview and production Blob names.

## 10. Instrumentation
Track first_crew_created vs crew_joined; crew_guide_started/element_seen/interests_selected/seed_attempt/seed_completed/first_answer/second_answer/invite_offered/share_opened/share_cancelled/finished; drop_guide_started/format_seen/format_picked/setting_seen/publish_succeeded/drop_share_offered/drop_share_opened/done; newcomer_crew_link/newcomer_drop_link and exact-target-return; error/retry/cancel. Count real activity not “invite delivered” from opening a sheet. Segment direct vs crew vs Drop invites and older beta participants. Avoid collection of free-text private answers in analytics.

## 11. Acceptance / QA gate before any preview release
1. v0.7.2 direct flow with 10 Starter answers and actual 180 Aura still works; old existing participant and Avengers readback unchanged.
2. First ordinary-created Crew from Aura/Profile reuses name, starts creator guide and seeds exactly 5 distinct formats (one for each of two interests), all shared and visible from second member.
3. Creator answers two, answered move to bottom, no double seed/answer/Aura after refresh or retry; new invite opens sheet from a user gesture.
4. Creator of second/third Crew does not rerun full creator guide and gets invite/create CTA.
5. Crew cards Chat/Recap/Mates work; non-admin doesn't see Admin Settings; server returns 403 for unauthorized mutations; Leave remains available.
6. Recap real/empty state truthful; points label matches backend, no artificial +10.
7. First custom Drop: all 6 explained, Most Likely locked until 2, every option/settings type exercised, publish exactly once despite timeout, share EXACT Drop ID, completed-guide state persists.
8. Crew invite new with 2+ available: correct Crew/member guide/two actual drops without phantom new Crew; normal return; REQUIRED Starter 10/Tenacious/Aura/Profile and original-Crew return tested.
9. Crew invite new empty: full Starter/180, Aura/Profile, return exact Crew, first custom Drop guide.
10. Drop invite new: exact linked Drop answered FIRST, Starter 10 next, return exact Crew, two other Drops or first custom if none; late joiner reveal rules unchanged.
11. Both returning invite cohorts bypass mandatory onboarding, retain correct Crew/Drop; deep links survive refresh, browser back, slow requests, share cancellation.
12. iOS Safari, Android Chrome and WhatsApp in-app on actual devices; desktop narrow/wide; keyboard/VoiceOver focus/no trap; native share and fallback; all 6 Drop formats; media; Admin; Chat; analytics.
13. New feature cannot be called VERIFIED from headless mobile emulation alone, and do not promote this document's SPEC entries to BETA until implemented and read back.

## 12. Explicit scope boundary
This is v0.7.3 (working milestone name) Crew/onboarding hardening, NOT the v0.8 Daily Aura retention project or domain migration. Home page deep redesign remains for later. OTP/verified identity, global photo syncing and genuine verified invitations remain infrastructure-blocked.


## Founder-confirmed D038, 2026-09-23 — MANDATORY onboarding after first two Crew-link answers
For a first-time beta visitor opening a Crew invitation with at least two real unanswered Drops, the required order is: enter the EXACT linked Crew → member-specific Crew welcome/tour → answer TWO REAL unanswered Crew Drops → play all TEN Starter questions → unlock Tenacious → complete guided Aura/Home/Crew/Create/Profile setup → return to the SAME original Crew and resume normal usage. Already earned Crew points and response records are retained; Starter's 180 points count once. Preserve the original crewId across refresh. No new Crew creation, duplicate seed, duplicate answer or forced invitation. If fewer than two unanswered Drops remain, answer any genuine available Drop and proceed with a clearly described fallback without trapping the visitor. This decision supersedes any earlier “optional”, “deferred” or “pending” text about this specific cohort. New DROP-link entrants still answer the exact invited Drop FIRST before Starter. Existing visitors do not repeat Starter. DECIDED / SPEC, NOT IMPLEMENTED.
