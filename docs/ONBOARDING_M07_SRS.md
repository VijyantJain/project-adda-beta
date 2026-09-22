# Project Adda — M0.7 Onboarding, Personalization & Guided Identity SRS

Updated 2026-09-22. Status: implementation plus staged dependencies. Source of truth: FEATURE_SPEC_CHECKLIST.md, FIRST_FIVE_VIBE_RUN.md, ONBOARDING_IDENTITY_CONTACTS.md and code on v0.5-full-experience.

## 1. Scope / preservation contract
This is ADDa, the private-friend-group-first project; do not merge with the separate global adult digital/social strategy project. No existing Crew, Drop, option, answer, Chat, member, image or score may be reset. No new frontend can replace working multi-Crew, Vibe, Recap, creator settings, live engagement, photo rating or analytics without backward-compatible migration. Every new reward is server-authoritative/idempotent.

## 2. Entry cohorts
A. Direct first-time browser: exact welcome > Starter questions 1–5 > five trophy > questions 6–10 > Tenacious (six starter achievements and earned score) > optional new Crew creation with 5 real preseeded common Drops > user-initiated invite popup > private interest warm-up > real first Crew Drop tutorial > five tabs > profile setup > verified signup LAST when real provider exists.
B. Invited first-time browser: provisional join to exact linked Crew/Drop > SAME welcome and ten cards > Tenacious one Enter <Crew> CTA > one nickname > exact original Crew/Drop > private interest warm-up > first two Crew interactions > five-tab tour > profile and signup LAST. No blank secondary Crew.
C. Returning named user: linked Crew/Drop directly. No forced repeat intro. Existing Vibe, answers, shared Crew content unchanged. Replay guide available in Profile; no repeat point farming.

## 3. Starter content / personalization
New users begin versioned Starter v2, old in-progress users continue legacy v1 from exact stored answers under starter/v1/<pid>.
s1 “We leave at 6 sharp” / lateness. s2 nine-minute voice note rating. s3 phone 2% cab arriving. s4 bill-splitting one chai vs whole menu. s5 group-chat red flags. s6 explicit personal interest selection. s7/s8 served by selected private interest pack. s9 group-plan role. s10 friend-group superpower.
Seven interest packs: Wheels & rides, Fashion & looks, Music & concerts, Food & cafés, Travel & escapes, Memes & chaos, Sports & fitness.
After the 10 cards, the two private guide cards match the interest selected in the personal guide, with optional secondary self-described gender selection. Fashion style offers explicit alternatives for man/woman when chosen; all interests are available to all genders, nonbinary or undisclosed. Gender is never inferred and not used as an access restriction or public Crew label.
These two picks are PRIVATE; they do not appear in the common five Crew seeded Drops, vote totals, Creator reveal, Recap or Crew Chat. The five seeded shared Drops remain visible for all Crew members and are identical within the Crew.

## 4. Realistic/premium graphics acceptance
Current beta ships five original local SVG card illustrations and original neon-trophy screenshot asset. Starter v2 has redesigned copy but still reuses existing art categories. This is NOT the final realistic photograph/animation pack; FEATURE_SPEC_CHECKLIST D-020 remains IN_PROGRESS.
Production art acceptance: 10 universal + 14 interest-pack card images (or composited visual equivalents), >720px effective width, mobile crop safe, visual meaning matches exact prompt, no inappropriate person/brand endorsement, color-graded purple Adda overlays, compressed WebP/AVIF with fallback image, alt text, source/photographer/license/release manifest, animation with reduced-motion fallback. No copyrighted image scraping, broken external hotlinks or personally identifying/sensitive inference from pictures. Distinct cards must not repeatedly reuse the same generic illustration.

## 5. Guided interactive mission engine
After entering first Crew, first show private interest selector: seven packs, optional gender, Surprise Me branch; two private rapid-fire cards (one-time 10 and 15 Vibe on server). User sees real first shared Crew Drop(s), a highlighted Crew explanation, Drop explanation, one answer and one more answer (actual Crew data, no fake votes). Then a five-tab ordered tour: Home → Crew → + Create → Vibe → Profile. Each step highlights actual bottom icon and opens actual screen. Create tab is demonstrated without forcing public posting. Each first tab visit grants one-time 5 Vibe, stored at guide/v1/<pid>. Real photo/bio/username draft steps may grant 10 once, but never points merely for opening a file chooser.

## 6. Profile steps
Profile editor locally supports display name, compressed DP/gallery photo (only after click), optional short bio, username draft validation, interest and optional gender. User must be told clearly username is NOT globally reserved, DP/bio are NOT yet public or synced. Photo permission is optional; offer explicit Skip. Auth setup must never become a dead end if infrastructure is unavailable.
When configured, guide continues with Sign up / Save progress button -> mobile or email selection -> real send OTP -> verify OTP -> transactional guest merge -> globally unique @handle server reservation -> profile media upload -> completion badge/mission. Do not mark verified onboarding finished on local profile save. During current beta tour ends in `awaiting_provider` and app remains usable, status displayed honestly.

## 7. Data/security design
Client local keys: addaLocalProfile (temporary DP/name/bio/handleDraft/interest/gender/privateVibePicks), addaPersonalGuide_<pid>, addaPersonalGuideDone_<pid>, addaGuideDone_<crewId>, addaGuideTourDone_<pid>, addaGuideAuthStatus_<pid>.
Backend additive key guide/v1/<participantId>, each allowed step recorded once with earned points; score additive on getVibe. Existing starter/v1 with deckVersion v1/v2, member/<crew>/provisional unchanged. Verified uniqueness/merges blocked pending database/auth. Never expose personal gender/private picks on Crew results or analytics; record interest pack label only with user-approved legitimate purposes.

## 8. Analytics
Events: personal_pack_selected / personal_pack_skipped / personal_card_answered / personal_guide_completed / guide_five_tabs_started / guide_tab_seen / guide_step_completed / guide_profile_ready / profile_edited / guide_beta_handoff; existing starter, crew, invite and guide events retained. Evaluate conversion for first ten, personal pack, private two, two Crew answers, 5 tabs, photo/bio/handle and when real OTP exists, verified account. Underlying founder analytics dictionary ANALYTICS_V2.md.

## 9. Functional QA gate
Direct + invite (fresh + returning), legacy v1 resume, new v2 personalized s7/s8, each interest including optional gender variants and Surprise Me; refresh after card 6 and during guided Step 3; solo Starter seeded shared five count stable, no duplicate Score; no broken navbar/animations; Crew first two real answers, five tabs actual clickable, Profile optional photo skip/name/bio/handle save, saved locally, no fake OTP, guide cannot trap browser. Test on at least one iPhone/Safari (WhatsApp in-app browser where available) and one Android/Chrome plus desktop narrow/wide; confirm old Avengers and media state.
