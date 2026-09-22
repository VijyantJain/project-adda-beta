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
