# Project Adda — AI opportunity map, brainstorm ONLY (2026-09-24)

Objective: meaningful AI which lets two real humans have a better conversation. Do not say AI everywhere because of hype. Start with AI as a user-invoked COPILOT, not a phantom friend, fake votes or expensive every-scroll LLM call. Everything below is proposed, unshipped and subject to safety/cost/privacy acceptance.

| AI possibility | User action / outcome | Phase | Difficulty/cost |
|---|---|---|---|
| Drop Copilot | “Make a funny quiz about our college mess” → suggests 3 editable prompts across correct six formats, ready-to-edit answer options and Reveal defaults | v0.8.x/v0.9 | low-moderate, pay ONLY per invocation, one short model call, cache generic prompts |
| Context-aware templates | User chooses travel/sports/music → curated non-LLM template bank adapted to Crew size and type constraints; optional AI remix | v0.8 first WITHOUT inference | nearly free, first test if users want it |
| Recap Writer | Uses authenticated, already revealed/consented Crew aggregate stats to produce shareable week summary; cites “4/6 picked…”, avoids unreviewed private chat ingestion | v0.9 | opt-in, precompute weekly, review draft before share |
| AI vibe stylist | Converts user's chosen tone (“wholesome/meme/savage”) into edit suggestions for first Drop, preserves chosen intent | v0.9 | short per-request model |
| Multilingual Bridge | Suggest Hindi, English, Hinglish/local-language variants with user review; no wrong-person auto-post | v0.9 | token-based or offline phrasebank initially |
| Aura personal coach | “What can I do next?” returns real next achievement progress and chosen Deck options; deterministic rules first, AI only for friendly optional explanation | v0.8 deterministic, AI later | low if cached, no bogus therapeutic/personality inference |
| Factual Crew Insight | “3 of 5 chose beach; 2 want mountains” with data provenance; deterministic code, AI optional headline only | v0.8.x | free if rules based |
| Visual avatar/Drop decoration | Opt-in art styles for user-provided/self-owned media, clear “AI-stylized” label; human consent and storage limits | v1.0+ | expensive media + rights/privacy |
| Moderation helper | Detect risky insults, harassment, unwanted personal data and toxic DMs, routes to user controls/human review | with DMs/public growth | high-stakes false positives, must not auto-expose private text |
| Conversation connector | Suggest neutral question for a stale private Crew without inventing real mate activity | v0.9 | bank first, AI optional |
| AI Scene / Glow Orb | Palette and motion based on real Aura tier; visual shader doesn't need a new model query per frame | v0.8.x–v1.0 | one-time asset/CSS/WebGL; fallback needed |
| “Compatibility score” | Opt-in shared-interest overlap explained from chosen tags, no romance/business aptitude claims or inference from private conversations | v1.1+ | consent, identity, calibration needed |
| Nearby event suggestion | User requests city/location → public organizer feeds + map, ranking explanation and “not interested”; not private location background collection | v1.1+ | supplier/API/map fees; no AI requirement |

## First AI proof-of-value experiment
Recommend a LIMITED, explicit “Help me write a Drop ✨” button on Create screen, only after first-drop guided tour is stable:
1. Crew member taps AI helper and chooses one of six eligible formats and a tone.
2. Backend receives short typed prompt, optional explicit interests, no chats/contact list/member profile without opt-in.
3. LLM returns strict validated structured fields, options count/type constraints and safety checks; retries harmless.
4. The result is a DRAFT. Person edits then manually publishes one real Drop via existing idempotent API.
5. Track AI_suggested / editor_accept / actual published / actual friend answers and per-request cost; distinguish from no-AI cohort.

If AI-assisted Drops are no more appealing than hand-curated templates, don't pay inference costs. Use a paid Gemini or other suitable API behind the backend only if explicit operator chooses; never put API keys in app.js or GitHub, never make core Starter/answer/score logic depend on LLM uptime.

## 3 ways AI can hurt Adda (avoid)
1. AI bots voting in a Crew or fake “your friends chose…” counts: breaks Adda's real-people promise.
2. Sending entire private chats/photos into provider API silently: violates expectation of a private Crew, can create privacy/child-safety issues.
3. Default unlimited inference on every scroll or image: burns free-tier budget and latency, especially for Indian mobile data users.

## Cost gates
Founder sets a hard maximum cost/user/day and absolute API quota. Prompt length/rate limiting, cache repeated templates, failure fallback to curated prompts, content moderation. Strict provider retention/training terms review and user consent for personal-content upload. Audit model hallucinations, grammar/Hinglish, copyright and brand risks before any production integration.
