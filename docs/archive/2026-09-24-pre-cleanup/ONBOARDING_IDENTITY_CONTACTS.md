# Project Adda — Onboarding, Verified Identity, Profiles & Contacts

Updated: 2026-09-22. Product specification and staged technical plan.
Implemented in field-test PREVIEW: direct/guest invite first-time journeys, provisional Crew membership and local Starter progress.
NOT implemented: email/mobile OTP, verified account/profile sync, contact permission/sync, user-uploaded DP or public handle reservations.

## Cohort A — New direct user
Direct landing -> five curated Starter choices -> genuine Vibe reward and trophy -> optional Bonus Five -> one Tenacious primary CTA ("Start my own Crew") -> name + Crew name -> five idempotently seeded real Drops -> in-app invitation card -> explicit OS share/WhatsApp send action. No empty Crew diversion or duplicate exit buttons. “Once” is currently once per browser-local participant identity.

## Cohort B — New person from a Crew/Drop invite
Opening a Crew/Drop URL explicitly expresses intent to join; backend creates a provisional member only for a fresh browser identity with a temporary "New mate ####" nickname and preserves the exact linked Crew/Drop. First Five runs, then the one primary CTA is "Enter <Crew>". One name step updates this exact provisional membership; the user lands inside the invited Crew or exact originally linked Drop. A previously named member retains direct invite behavior; no repeated newcomer journey. Repeated provisional join must not erase the real nickname or joinedAt.

## Signup / Save My Progress — M1, only when real providers are configured
Ask AFTER immediate gameplay/social value, not as a first-visit gate. Example: "Your Vibe, trophies and Crew are ready. Save them across devices." Offer verified email OTP or mobile OTP using Supabase Auth plus configured mail/SMS. Enforce expiry, resend throttling, attempt caps, replay prevention and account recovery. Do not render a fake working OTP dialog in the beta.

Merge browser participantId to verified user safely:
- assert ownership of both identities before linking;
- create stable auth_user_id/profile_id, map guest participant aliases;
- merge real Starter accomplishments, Vibe event IDs, Crew memberships, Drop answers, badge inventory with deduplicated event IDs;
- preserve existing Crew/Drop deep links and creator/admin privileges;
- disallow points re-awarded through guest account farming;
- support sign-out, revoke, recovery and privacy controls.
Once-per-lifetime onboarding must be enforced by verified profile ID AFTER this migration. Browser-local storage cannot guarantee it across devices.

## Guided profile
1. Display name, editable separately from Crew nickname.
2. Unique case-insensitive @username/handle, server-side availability and atomic reservation.
3. DP/avatar upload from gallery/camera only when intentionally chosen, with permissions at the moment of upload.
4. Short bio (optional), language, interests (optional, explicitly chosen).
5. Vibe profile visibility, which Crews appear, badges pinned, DMs allowed, follow approval.
6. Show-off features: collectible profile frames, earned level/title, signature activity, best answers shared with audience consent, rare badge case, mutually agreed shared inside-joke memories, personal highlights.
No sensitive inference presented as a “personality verdict”; no fake follower counts.

## Friends/contact discovery and Crew invites — later
1. Existing Adda friend: tap their Vibe profile -> follow/connect -> invite to specific Crew (no typed link).
2. External friends: OS share sheet and WhatsApp, no address-book access.
3. Find Friends from Contacts: optional AFTER account setup; user must initiate this feature and see plain-language explanation BEFORE OS permission.
4. Contact matching uses privacy-reviewed normalized tokens/server keyed hashing or another privacy-preserving design, not a public phone-number lookup or naive unsalted hashes.
5. Store/revoke consent, allow skip/remove, honor block/quiet hours, rate-limit invites, allow private accounts to opt out of discoverability.
6. GTM invites should use unguessable/signed tokens with expiry, revocation, rate limits and invite-use tracking, not permanent public Crew IDs alone.

## Home versus Arena
Current Home: actual saved Crews, personal Vibe, Next Action, user greeting, clear create/open links. No fabricated public content in the field test.
Future Home "For You": unanswered interactions, messages, direct friend activity, Crew Moments, Daily Deck, timely plans and selected Arena recommendations.
Arena: separate dedicated rolling public feed / discovery inventory with learned interest controls and "Not interested"; not a duplicate of private Crew listing.

## Analytics/QA
Direct: arrival -> first response -> First Five -> Bonus Five -> Crew form -> seeded Crew created -> invite prompt -> share launched -> real friend joined -> Crew answer.
Invite: link open -> provisional membership -> First Five/Bonus -> name -> original Crew/Drop opened -> answered -> later verified signup.
Share sheet opened ≠ message delivered. Consent/permissions and OTP must be separately trackable when live.

## Canonical implementation contract
Current: starter/v1/<participantId>, member/<crewId>/<participantId> provisional, crew/, drop/, dropIndex/, existing analytics; no backend reset.
Later: Supabase profiles/auth, guest_identities, profile_onboarding, crew_invites, account-vibe ledger, contact-discoverability & consent tables with RLS; see ARCHITECTURE_VNEXT and SUPABASE_SCHEMA_DRAFT.
