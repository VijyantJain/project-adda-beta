# Adda v0.7.3 — Field-test preview release and acceptance

Date: 2026-09-23. **Status: PREVIEW BETA / FIELD TEST, not production-stable or device-VERIFIED.** Latest development branch: v0.5-full-experience. Production main remains unchanged. v0.7.2 recovery SHA: 8b1da1789c2e7bad6110c6bdafbf911b1b11b377.

Preview: https://deploy-preview-1--project-adda-field-test.netlify.app

## Locked founder-designed journeys
- Direct new → original 10 Starter / Tenacious / earned Aura guided / Home-Crew-Create explanations / optional photo-or-avatar Profile; later FIRST created Crew triggers own tour. Reuse saved name, five per-Crew shared seeding (two distinct chosen interests + three varied, exactly five types: either/vote/predict/short/rate), guide two REAL answers, offer Crew share; second-or-later created Crew has invite/create contextual actions without first-time tour.
- New Crew invite → exact invited Crew/member tour → two real unsubmitted Drops if present (never invent responses) → mandatory Starter 10/Tenacious/Aura/Profile → exact original Crew → full guided first CUSTOM Drop creation/publish and exact Drop invitation; no phantom extra Crew or seed. Zero/one available Drop has honest available-activity fallback.
- New Drop invite → explain/answer exact invited Drop FIRST, before Starter; then Starter/Tenacious/Aura/Profile → original Crew/member tour and two OTHER real answers if available; if insufficient, guided first custom Drop in original Crew and exact Drop share. Returning visitors open original Crew/Drop without compulsory replay.
- Separate member-list page, Crew-specific Chat/Recap, admin-only Crew Settings and retained Leave. Personal Aura belongs in global nav. Unanswered Drop cards first, answered below. Non-admin changes remain server rejected.

## Safety and persistence
- One-time guide state in browser scoped to beta participant and Crew; exact invite target preserved through Starter/Aura/Profile. Real cross-device identity/verified registration is NOT shipped, so “new vs returning” refers to browser-local identity.
- Retry-safe createCrew and createDrop request tokens and deterministic Drop ID; first-created Crew seeding uses deterministic five IDs and keeps existing indexes/answers. No accidental repeated shared seed, repeated answers, or duplicated rewards from replay intended; do not clear persisted browser/Blob identities to reproduce a bug.
- Native Web Share when available; fallback menu if not. Opening or cancelling share menu does not prove invite delivery.
- 24 bundled Starter photo WebPs retained; individual photography usage-rights/high-resolution master review is a separate launch gate.
- No Netlify Blob store reset, no edit to Avengers, no main merge, no verified OTP or native-app claim.

## Evidence actually collected
1. Node syntax of app.js and esbuild transpilation of netlify/functions/api.ts PASS.
2. \`npm test\` static/source regression tests: 19/19 PASS.
3. Actual live preview API, on a NEW isolated QA Crew \`c_5e6d2e27bb\` using synthetic participant \`p_qav07320260923b\`: first Crew created once; identical request returns SAME Crew ID. Two selected interests (music/food); seeded five real Drops exactly once, types either/predict/rate/short/vote, two interest-led IDs. Repeat seed retains five.
4. Two real Drop answers persisted in same Crew. Original unanswered and answered states confirmed independently from listDrops.
5. One real custom authored Drop published: repeated request returns SAME Drop ID \`d_41cfff111f\`, Crew total exactly six (5 seeded + 1 custom).
6. Ten real sequential Starter POSTs for same QA participant: First Five 80, Tenacious 180, six Starter milestones. Fast getAuraStarter with linked Crew returns 210 (180 Starter + 20 for two real answers + 10 linked-Crew membership).
7. Full getVibe global aggregate was attempted but TIME OUT on this QA participant; frontend has fast scoped-Aura fallback that preserves live linked-Crew points. This is a performance limitation, not a passing global aggregate test.

## Still needing acceptance, do not conceal
Real iPhone Safari, Android Chrome and WhatsApp in-app browser journeys have NOT been run by the assistant end-to-end. Headless full UI E2E of every v0.7.3 branch and actual OS share sheet is NOT verified. The 19 automated tests check source contracts; they do not establish screen-by-screen behaviour. Production-stable is BLOCKED until direct/new Crew invite/new Drop invite/returning users, optional profile controls, narrow-device lock, refresh/resume at each stage, all six Create formats, share cancel/fallback and permission gates are accepted by field testers.

## Suggested field-test protocol
Use three genuinely separate incognito/new browser identities; do not reset existing accounts, Avengers or the shared field-test store. First direct newcomer: all ten → Aura/Profile → first created Crew → two interests/five real shared Drops → two answers → invite. Second fresh identity: visit the first Crew’s invite, answer two existing Drops → ten Starter → Aura/Profile → return original Crew → create and share FIRST custom Drop. Third fresh identity: follow a specific Drop link, answer THAT Drop before Starter → Aura/Profile → same Crew → other real answers or Create fallback. Separately use an existing browser user to verify no forced repeat. Document screenshots, device/browser, exact URL and steps to reproduce problems. Do not expose live private friend data in issue reports.

No v0.8 retention features or domain cutover in this release.
