# v0.8 — discussion brief, NOT authorised as code yet

Goal: real value on days when nobody replies in a Crew, while deepening real-friend interactions. The user explicitly wants to discuss first and decide after 2–3 days of v0.7.3 field testing. Do not silently combine every long-term idea in v0.8.

## v0.8 candidate A — Daily Aura
- Three to five OPTIONAL daily prompts (one opinion/This-or-That, one prediction or rating, one creative short response, one optional real Crew challenge, and one surprise from chosen interests). No invented friend votes or fabricated percentage.
- First useful action in under 15 seconds; resuming yesterday does not force all 5. Outcomes and explanations show actual saved choices; for predictions, no falsely claimed objectively correct answer when the event is unresolved.
- Daily cards have an editorial bank and dedup/relevance constraints. Allow skip, hide topic, change interests and Hindi/Hinglish/English choice. Personal streak counts genuine active days, not mere page loads.
- Progress must be server-authoritative, one earned event per day/card and reasonable earning cap. Browser-local guest limitations remain visible until real identity. Calendar day semantics and timezone must be documented.

## v0.8 candidate B — three-star Achievement Paths (start SMALL)
Starter's six milestones are the first chapter, NOT the lifetime achievement system. Every long-term path has Star I (quick and emotionally meaningful), Star II (weeks/months), Star III (months/year or longer). Proposed titles/targets/rewards for founder calibration only:

| Path | Star I | Star II | Star III | What counts |
|---|---:|---:|---:|---|
| Drop Explorer | 5 Crew Drop answers | 150 distinct Crew Drop answers | 3,000 distinct Crew Drop answers | Stored real distinct responses, excluding Starter/repeated edits/bots |
| Dropsmith | 1 user-authored Drop | 40 | 500 | Persistent real authored Drops, not Adda-seeded pack or retry duplicates |
| Still Here | 3 genuine active days | 60 distinct active days | 730 distinct active days | Genuine saved interaction, NOT page view; need not be uninterrupted streak |
| Crew Spark | 1 genuinely new joined mate | 15 | 100 | Actual unique invited members, NOT share sheet opens; guard referral farming |
| Shared Memories | 2 genuine friend responses on authored Drops | 100 | 2,000 | Distinct other humans and stored replies, no sockpuppets |

Suggested tier names: First Spark ✦ / Rising Star ✦✦ / Legend ✦✦✦, but choose brand voice in founder review. Sample Aura bonuses +20 / +150 / +2000 and gems 1 / 8 / 80 are ILLUSTRATIVE, not approved economy. Bigger bonus must coincide with extended level curve so existing level 2,000 does not become instantly meaningless.
- Gems are separate from Aura XP and purely cosmetic/access-to-themes/3D orb finishes for beta. No cash, loot boxes, random paid rewards, trading or paid tier advantages. Existing users receive retroactive earned stars after trusted backfill but NEVER multiply historical score accidentally. Maintain a reward ledger with UNIQUE(participant,achievement,star) and versioned target definitions.
- User should see “3/5 to Star I” and “next meaningful step”, not 50 unattainable locked tiles. Celebrate rare milestones without notification pressure/fake FOMO.

## v0.8 candidate C — visual coherence from original Adda board
- Adda hand-lettered brand, lilac/purple/lime, photo-led Drop cards, glass accent in limited key surfaces, member avatar chains and clean mobile hierarchy.
- Quick changes: avatar chain in Crew body using real stored member names and OWN local photo, no counterfeit members' photos; single Mates button; no active nav dots.
- More involved: global photo syncing after verified profile/auth; tasteful Reveal animation; share card matching current Crew/Drop; soft pulsing Aura orb, static CSS fallback on low-end devices.
- Imported render references are inspiration, not functioning screens and not automatically approved commercial assets.

## Candidate v0.8 RELEASE CUT
1. Stabilise v0.7.3 field-test defects and analytics baseline.
2. Ship 3-card minimum Daily Aura loop with explicit skip.
3. Ship ONLY three testable Achievement Paths: Drop Explorer, Dropsmith, Still Here, with 3 visible stars each and a non-purchasable cosmetic-gem ledger; delay social-referral rewards until identity/abuse safeguards.
4. Integrate avatar-chain and designed share card/reveal polish without changing APIs.
5. Instrument next-day retention and “solo person returns without Crew”. Compare actual return quality, not just screen views.

## Defer
Full Arena public feed, DMs, external event maps, compatibility percentages, group AI agents, music distribution, paid gems, expansive leaderboards and heavy GPU 3D by default. These are later projects only when existing Crew and Daily Aura loops survive small-cohort tests.

## Founder decisions required before coding
Which three achievement paths? Should gems be displayed before cosmetic redemption exists? Preferred Daily Aura cadence and reward caps? Existing local Starter + Crew points preservation policy? Should weekly recap be plain factual now or AI assisted in v0.9? This brief is an option menu, not final approval.

## FOUNDER DECISION UPDATE — 2026-09-24 (supersedes earlier candidate language)
D040: variable 3–5 Daily Aura cards based on interests and genuine activity; Daily Charge in first v0.8, Capsules v0.8.x; three functioning 3-star paths with two Coming Soon; gems earned invisibly until usable cosmetic redemption; small real-metric Crew Pulse experiment first v0.8. The earlier “defer Crew Pulse” and “3-card minimum only” are no longer the complete proposed release cut. Specific economy thresholds, Charge payoff and Pulse experiment are STILL under discussion; no code permission. See docs/2026-09-24_V08_FOUNDER_DECISIONS.md.

## D041 updated founder mechanics — supersedes optional model choices (2026-09-24)
Daily deck = 3 guaranteed PERSONAL cards plus up to 2 genuinely available activity extras; Charge = one-time actual Aura completion bonus + progress toward long-term achievement (Capsules v0.8.x); three launch achievement paths but labels/thresholds remain open; distinct cumulative active-day and consecutive-streak measurement (no fourth path implicitly approved); Gems earned silently in ledger and only stars/Aura shown until working cosmetic store; SMALL Crew Pulse must combine meaningful genuine actions and unique real mate participation. No v0.8 code permission, amounts/windows/phase still review. See D041 and docs/2026-09-24_V08_FOUNDER_DECISIONS.md.

## D052 superseding central Orb release cut
Founder decided core evolving Orb must be permanent and CENTRAL on first v0.8 Aura/brand/app icon, with real score-linked visual stage, static/reduced-motion/performance fallbacks. Deferral in this older brief applies ONLY to advanced/heavy interactive WebGL and richer skins; cannot move the core Orb to v0.8.x. Three achievement path earned titles selected except Sparkmaker Star III. Complete release scope and replacement matrix: docs/2026-09-24_V08_RELEASE_SCOPE_LEDGER.md. NO CODE APPROVAL.
