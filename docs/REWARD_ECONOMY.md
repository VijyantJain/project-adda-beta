# Project Adda — Vibe Reward Economy, Gifting and Progression

Status: V1 Starter points/achievements implemented; gifting and commercial mechanics are ONLY proposals pending product, safety, payments and retention validation. 2026-09-22.

## Currency roles
1. Vibe Score: factual activity/experience indicator (like a game account level); should represent earned meaningful participation and experience, not directly how much money a user spent.
2. Vibe Level: long-horizon progression based on earned Score. Beginner levels should unlock relatively often; higher ones space out. Existing beta level threshold change requires versioned migration communication.
3. Daily Charge: short-horizon activity meter with finite earn cap; intended for future daily deck.
4. Badges/trophies: provenance-rich unlocks tied to factual milestones.
5. Cosmetic inventory: optional frames, themes, animations, stickers, collectible visual effects.
6. Gift/Aura: optional future positive interaction history; distinguish from Score and from purchases.

## Current level curve\n0 Fresh; 10 First Spark; 25 Warming Up; 45 On a Roll; 60 Spark; 100 Glow Up; 150 Buzz; 300 Main Character; 600 Vibe Magnet; 1000 Adda Icon; 2000 Legend. Numbers are earned Vibe points, not levels users can buy. Initial steps are deliberately close; later steps broaden. Existing numeric level indexes change but stored scores do not.\n\n## Starter contract
One-time up to 180 Vibe: 10 per answer, bonus 30 on first five, bonus 50 on ten. This is introductory progression, not an infinitely repeatable points exploit.

## Future individual loop
Meaningful action -> immediate feedback -> progress to a clearly defined next threshold -> earned reward/status -> another relevant action. When Crew is quiet, use public/system personalized content. Cap repetitive low-quality actions to protect leaderboard fairness and server cost. Variable cosmetic outcomes need clear rules and a disclosed catalogue; no fake scarcity.

## Proposed future gifting experiments (NOT IMPLEMENTED)
Free/social:
- Send a genuine thanks/congratulations gift (card/emoji/badge reaction) after a meaningful event.
- Sender and receiver may both receive *small capped social-goodwill credit* if a real reciprocal interaction occurs, not one point farm per tap.
- Rate-limit pairwise exchanges and detect duplicate/fake accounts.
- Let receiver decline/mute/report gifts and unwanted attention.

Premium:
- User purchases clearly priced cosmetic gift or themed pack for a friend.
- Receiver receives that item; sender receives gifting-history/badge or cosmetic thank-you, not higher competitive experience.
- Do NOT sell unlimited leaderboard/Vibe score directly: this would convert experience status into pay-to-win and create abuse pressure.
- If a future team tests purchase-linked Vibe, separate paid/unpaid metrics and get explicit user feedback first; avoid random paid prize mechanics.
- No hidden auto-renewals or surprise charges.

Possible gifts:
- Crew anniversary frame
- birthday-themed badge sticker
- private Moment decoration
- limited cultural pack
- profile aura/border
- shared duo achievement that records a real joint action
- "inside joke" collectible created with permission
- premium Crew visual theme

## Anti-abuse / fairness
Server-authoritative ledger; immutable event IDs; idempotent rewards; daily caps; no self-gifting; no repeated point farming by exchanging gifts; refund/reversal handling; moderation/report/block; age and regional payment compliance review before launch.

## Measurements
Free gift receipt-to-return, reciprocal action (not spam), DM/Drop continuation, retained users, purchase conversion, refund/chargeback, hide/report, perceived fairness, paid versus earned status confusion. Prefer genuine friendship signals to nominal time-in-app.

## Decision status
Starter one-time rewards: SHIPPED in preview.
Paid gifts: IDEA, not a locked feature or business model.
Gift points both sides: HYPOTHESIS requiring abuse and economic design.

## v0.7.1 visible Aura vocabulary
The same earned numerical progression is now displayed as Aura Score, with milestone label Aura Builder and level label Aura Magnet. Preserve historical event and internal API names for compatibility. An Aura title is factual participation/game progression, not an inferred personality/mental-state verdict. No rewards may be manufactured from anonymous screen taps.

## v0.7.2 — in-product Aura earning table (actual beta calculation)
| Stored action | Aura | Qualification |
| Distinct Starter answer | +10 | each question ID once; 10 answers =100 |
| First Five trophy | +30 | five distinct answers once |
| Tenacious trophy | +50 | ten distinct answers once |
| Private guide questions | +10, +15 | server-ledger one-time |
| Each guided tab | +5 | Aura/Home/Crew/Create/Profile, once/participant |
| Bio, photo OR emoji avatar, username draft | +10 each | one-time step, visual alternatives mutually exclusive; local beta identity only |
| Crew Drop answer | +10 | stored real response |
| Created Drop | +30 | stored createdBy |
| Crew chat | +4 | stored message |
| Crew membership | +10 | stored member record |
| Recorded share action | +20 | legacy beta counts action/attempt, NOT verified invitation or friend join; anti-farming limits pending |
| Active day streak | +5/day | up to 10 days counted |
Solo getAuraStarter score = starter.points + guide ledger; complete Tenacious=180 before more activity. Full getVibe includes Crew, chat, share and streak records with same level curve. No screen-visit points. Maintain historical score/key compatibility; share scoring hardening must be versioned and tested before launch.

## D042 founder achievement-economy design, NOT YET IMPLEMENTED
Launch exactly three 3-star pathways: Explorer real distinct Crew Drop answers (personal Daily Aura separate), Sparkmaker own actual published Drops + real responses from others (1; 20+30; 200+1000 for stars I/II/III), The Regular cumulative active days plus genuinely completed post-launch Daily Charge; streaks are separate optional sub-milestones, not a fourth active path. Existing participants get historical stars and per-star retroactive Aura once when supported by actual records; never infer historical Charge completions, repeat existing Starter or answer Aura, or invent old activity timestamps. Store an immutable unique (participantId,achievementVersion,star) reward record and source provenance; execute audited backfill and show total score without hidden double-awards. Gems stay internal until real redemption. Creator's own Drop answer and system-seeded Drops cannot be counted as peer/creator milestones. Final target levels, three Aura bonuses, potential extra level tiers and reward/cap ledger schema require founder approval. See D042 in docs/2026-09-24_V08_FOUNDER_DECISIONS.md.

## D043 achievement bonuses — FOUNDER APPROVED values, not shipped
For EACH of exactly 3 live achievement paths: Star I +50 Aura, Star II +300 Aura, Star III +1,500 Aura. Total 1,850/path, max 5,550 across full 3-path Hall of Fame, only for actual qualifying stars; per-milestone unique record. Base existing per-answer/per-created Drop Aura remains separate and is never repaid in backfill. Sparkmaker creator does not earn respondent's personal +10 answer Aura; receives the authored activity Aura and qualifying achievement bonuses, plus separate genuine events only where existing product rules provide them. Gems remain silent/invisible pending approved amounts and a functioning cosmetic shop. Existing Aura curve ending at 2,000 Legend needs a new researched high-horizon extension without resetting levels/data. Explorer/Regular target curves and star earned titles UNAPPROVED. See D043 founder decision spec.

## D044 approved achievement targets / pending full level naming design
Explorer genuine distinct Crew Drop answers 5/300/3000. Sparkmaker 1 authored / 20 authored+30 real peer answers / 200 authored+1000 real peer answers. The Regular 5 active days / 120 active AND 60 verified post-launch Charge completions / 730 active AND 365 verified Charge completions. Per path Star I/II/III +50/+300/+1500 one-time Aura, historical provable stars receive the same bonus once; original earned score/events remain unchanged. Founder wants all Aura displayed level titles reconsidered and three full naming systems compared, not threshold or score migration approved. 3000 Crew answers × existing +10 = at least 30000 base Aura; creation 200 × +30 = at least 6000 base Aura, plus milestone bonuses and other qualifying activity: tune extensions beyond 2000 from real distribution, not guesses. Locked targets do not approve cosmetics/gem amounts/new level thresholds or v0.8 code.

## D045 founder Aura display progression update (DESIGN ONLY)
Intention approved to recalibrate the entire visible Aura level-threshold curve (not merely add tiers above legacy 2,000), alongside renaming all displayed levels. Preserve exact historical earned Aura point records, one-time reward provenance and genuine scores; version the new level definition and evaluate level-label/rank changes transparently. New thresholds, caps, count and names require observed beta score modelling and specific founder approval; never silently grant or withdraw historic activity Aura. All legitimately earned achievement titles form a collection selectable by path; only earned titles display. Future holographic Orb is optional progressive enhancement and not an excuse for slowing Aura load. D043 +50/+300/+1500 per star unchanged.

## D046 pending 25+ level curve and featured title rules — NOT SHIPPED
Founder selected full Aura threshold/name rebalance with an EXPLORATION OF 25+ levels, not the earlier 20-level sample. Preserve all scored events, earned Aura totals, earned badges and legitimate path titles; old user-visible level names are replaced, not kept as mandatory collectibles. Separately select one featured earned profile title and a chosen genuinely unlocked title in each of the three achievements. Aura level naming/thresholds, gem amounts, weekly/daily rewards still unapproved. No direct mutation of score or backfill without source audit and signoff.

## D047 open-ended Aura chapter architecture (design, not shipped)
Levels may be expanded in versioned, published chapter updates without a hard 25/33/40-level lifetime ceiling. Every published finite Aura threshold must be monotonic, inspectable and resolved from real earned scores; above top published level keep accumulating points and label the current published cap truthfully. Founder intends both social and luminous/futuristic language in every chapter; all legacy earned Aura and badges retained while displayed levels are rebalanced and renamed. No final thresholds, future cadence, AI/Orb implementation or score migrations approved.

## D048 pending Charge rule and rolling-seven-day Pulse
Founder confirms seven-day ROLLING factual Crew Pulse, real actions plus unique participating mates; exact weights/payoff and small-Crew fairness open. Daily Charge completion rule NOT approved; a truthful capped daily completion bonus and The Regular completed-Charge-day ledger remain the intent. First Aura release to include 25+ defined levels, count/thresholds after real score and rate analysis. Existing earned Aura and Starter badges preserved, retro star bonuses granted only once on verified eligibility. No implementation permission.

## D049 founder Daily Charge economy (DESIGN, NOT SHIPPED)
Choose among SOLO personal Daily Missions, none depending on or crediting Crew actions, peers, authored Crew Drops or shares; optional real social extras have their usual separate activity awards and Crew Pulse effects. Genuine completed chosen personal mission grants fixed +10 Aura once per day and marks one actual Daily Charge completion day for The Regular. Do not invent daily per-card Aura rate: still pending. Three guaranteed personal daily cards remain available, but final mission requirement and daily card count may differ. Idempotent per-user/day reward, explicit timezone and no fake historical Charge completion. Capsules delayed to v0.8.x, Gem balance hidden until usable catalog.

## D050 approved Daily Aura personal-card economy — DESIGN ONLY
Three guaranteed personal cards +10 genuine unique saved PERSONAL card completion each => at most +30 ordinary Daily Aura card Aura/day; once-per-day genuine chosen SOLO mission Charge completion +10 => at most +40 personal deck plus Charge per day under fixed guaranteed deck. Genuine Crew extras have independent ordinary Crew action reward and are NOT counted as personal cards, solo Charge credit or a duplicate Crew answer award. Three distinct SOLO missions, each with founder-pending exact eligibility/threshold; switch mission before Charge completion with existing authenticated genuine action state preserved, idempotent rewards. Do not turn old Starter answers into daily-card earnings or invent Charge completions before launch. Existing activity rewards and +50/+300/+1500 achievement Star bonuses remain. Full economy modelling should account for potential +40/day before extra Crew participation, verified real data needed before 25+ level thresholds.

## D051 mission criteria/retention safety — founder-confirmed design, not shipped
Charge: Quick Play 2 distinct saved personal cards; Curious 1 curiosity-eligible personal +1 OTHER distinct personal card; Creative Spark 1 genuine saved private creative response. Mission-aware deck and only UNANSWERED personal cards may be replaced before Charge complete; keep answered cards/+10 ordinary card Aura; recompute selected mission progress using existing eligible daily response records. Max THREE reward-bearing personal-card slots (+30) and ONE +10 completed Charge award per participant/day: replacement cannot create extra paid card slots, replace previously answered card, duplicate question IDs/rewards or reopen completed Charge. Exact creative validation and impossible-switch experience are open; no Crew input for Charge, no made-up prelaunch Charge history. Existing scored events, badges and retro achievement bonus protection unchanged.
