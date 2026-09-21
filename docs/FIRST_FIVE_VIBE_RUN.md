# Project Adda — First Five / Starter Vibe Run v1

Status: implemented in field-test preview (frontend and separate additive backend keys). Date: 2026-09-22.
Owner: Project Adda product + engineering. Working name Adda is not final brand.

## The product problem

A person arriving alone was asked to name/create a Crew, write an unfamiliar Drop, invite friends, then wait. That is asking for work before entertainment. New direct-root visitors should experience instant personal value without an active Crew, permissions, login, fake results or asking anyone to join.

## Distinct entry paths

1. Direct root /: if no known local Crews, show First Five welcome; existing browsers with known Crews keep Home.
2. /?play=1: manually enters First Five from an existing account/browser, useful for testing and sharing.
3. /?crew=<id>&drop=<id>: keep the existing exact Drop answer/join flow; no new welcome gate.
4. /?crew=<id>: keep existing Crew join/open flow.
5. /?profile=<id>: keep public Vibe profile flow.
6. Home: Vibe Run module lets existing users opt in; no rerouting of existing members.

## Starter Deck

10 finite, curated cards; first 5 are activation, second 5 an optional bonus.
s1 free trip: beach/mountains (This or That)
s2 rate a denim fit (Rating, emoji labels)
s3 tell bestie outfit is a miss? (Would You?)
s4 road trip aux controller? (Vote)
s5 guess crowd chai/coffee? (Predict as a *guess*, no fictitious majority result)
s6 perfect evening? (This or That)
s7 group-chat habit? (Vote)
s8 midnight pizza run? (Rate)
s9 weekend mood? (This or That)
s10 one superpower for Crew? (Vote)

Illustrations in v1: colorful CSS gradients and emoji art to avoid external image failures/copyright, no device permissions. Proper original image illustrations can replace CSS art in a design iteration.

## Reward contract

Server-side one-time rewards:
- each distinct Starter answer: +10 Starter Vibe
- five unique first answers: +30 First Five completion bonus
- all ten: additional +50 bonus
- maximum Starter Deck reward: 180 points.
- repeat answers/retries: zero additional points.
- starter points are additive to existing factual Vibe score in getVibe.
- no points for idle scrolling, opening/closing a page, or fake share attempts.

Onboarding achievements:
1 answer: ⚡ First Spark
2: 🎯 Quick Starter
3: 🔥 On a Roll
5: 🏆 First Five
7: 💜 Vibe Builder
10: 👑 Tenacious

Milestones are all real. Show user remaining steps to the next actual unlock. Never display fabricated countdowns/popularity/results. Celebration animation has reduced-motion support.

## Core flow

Welcome → Play my First Five → one obvious choice/card → visually select → saving feedback → server confirms answer/reward → +Vibe + actual milestone + topical trivia → next card → trophy on fifth card → user may:
A. start private Crew pre-seeded with five ready-made Drops;
B. continue optional Bonus 5;
C. return to known Crews if already a participant.

Name and Crew name requested ONLY on choosing Create Crew, not before first play.

New Crew pack (five real Drops, not fake users):
- weekend mountains/beach, This/That
- who controls road trip music, Vote
- next Crew plan happens?, Predict
- one thing Crew should do this year, Quick Answer
- rate Crew plan-making, Rate

Starter Pack results for count-based Drops require two real answers; they don't use manufactured votes. Nomination/Most Likely format must wait for second person to join. Pre-seeding does not mutate existing Crews.

## Storage/API

Current Netlify field-test store preserved.
New per-browser record only: starter/v1/<participantId>
  createdAt, startedAt, updatedAt, answers map (s1..s10), nickname optional, starterCrewId optional.
Routes:
GET starterGet
POST starterAnswer
POST starterName (reserved for profile naming; currently Create Crew handles name)
POST starterCreateCrew

Starter questions are intentionally a curated catalog within backend source. All Vibe rewards are computed server-side from answer keys, never trusted from the client. Sequential answers validated; retries idempotent. One Crew per Starter state once created. Any separate Crew can still be created through existing product.

Analytics events:
starter_started, starter_answered, starter_first_five_completed, starter_bonus_completed, starter_crew_created.
These are analytics-event records (not fake Drop responses), so initial solo onboarding must be measured separately from private Crew answer funnel.
Baseline metrics:
arrival → begin; begin → first answer; answers 1/2/3/5/7/10; time-to-first-action;
first-five → create Crew; Crew → own first Drop answer; invitation intent; friend joins; return after day.
Monitor errors/latency alongside conversion.

## Explicit non-goals in v1

Not yet:
- persistent infinite Arena
- daily rotating missions/deck
- full cosmetic inventory
- purchase/gift redemption
- public ranking of solo Starter answers
- fabricated social aggregates
- user-image upload as part of onboarding
- transition to Supabase in current field-test wave.

## Safety/product quality

Reward actual meaningful actions, not any repeated tap; transparent progress; optional bonus; honest figures; no cash-like random rewards; no monetized Vibe buying; no phone permissions. A person can leave without losing earned progress. Friendly praise should not imply a real friendship or diagnose personality.

## Implementation source files

starter.js — standalone First Five UI controller
app.js — entry routing, Home access, transition to Crew
styles.css — visuals and celebrations
netlify/functions/api.ts — authoritative deck, answers, rewards and Starter Crew
docs/REWARD_ECONOMY.md — future gifts + long-term economy

## QA before mass exposure

Open /?play=1 as a new browser; finish 5; refresh; verify progress persists; hit answer twice; verify no duplicate reward; finish bonus 5; create Crew; confirm five real drops; open old Avengers URL unchanged; test slow network/retry, mobile fixed top, result navigation, Vibe score/badges, reduced motion. Netlify build success alone is not a real mobile E2E result.
