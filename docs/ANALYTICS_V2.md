# Adda Founder Analytics v2 — Dictionary, Cohorts, Quality & Action Plan
Updated 2026-09-22. PREVIEW code on v0.5-full-experience. Private /analytics.html route protected by ADDA_ADMIN_KEY. Original field-test data preserved; no retroactive IP/location exists for events recorded before capture started.

## Dashboard inventory (implemented)
- Browser visitor identities, new/returning browser IDs, sessions, page loads, unique observed IPs, engaged visitors/engagement rate, ≥1/≥2/≥5 distinct Drop answers, Drop creators, sharers, chatters, errors.
- Human-like / flagged-review visitor counts, traffic-class breakdown and visitor-level labels. No location-only blocking or erasure.
- First Five step-by-step funnel (1–10), First Five, Tenacious, starter-Crew conversion, cohort comparison for direct arrivals versus Crew/Drop invites.
- First answer latency median/p95, first-to-fifth completion median; D1 and D7 UTC-calendar-day return among eligible browser IDs.
- Crew members/Drops/responses/chat and Drop-format responses/opens/shares/media, top Drops and respondents.
- Country, city, browser, OS, language, connection type, acquisition source, landing paths, screen views, hourly UTC, detailed client errors, visitors list, visitor detail, recent event viewer, CSV exports.
- Quality notes presented alongside metrics so traffic from proxy/datacenter and limited data windows is not interpreted as verified audience demographics.

## Definitions and limitations
**Browser identity**: localStorage addaPid; NOT real unique people. Clearing browser storage, private mode, changing browsers/devices creates new IDs. Do not use as verified user count.
**Session**: sessionStorage addaSid; refresh in same browser tab reuses session; new tab may be another session. Not a universal 30-minute analytics session.
**Page load**: successful analyticsVisit POST by running client JS. Netlify infrastructure/static requests are not automatically registered as product visitors; JS-capable bots, scripts and remote-browser previews may register.
**Human-like**: no obvious automation UA or missing signals heuristic; not proof of humanity.
**Suspected automation**: explicit automation crawler/headless/tool UA, or missing expected browser telemetry in repeated nonstandard requests; inspect manually. Linux/USA/Ashburn does NOT automatically qualify.
**New visitor**: browser ID whose firstSeen is inside chosen period; returning = >1 recorded session in selected period and/or all-time visitor record. Period filter is visitor lastSeen so not all visits for period imply new.
**Engaged**: observed answers, Drop creation or chat; a solo Starter response should be evaluated in separate Starter funnel and not confused with Crew answers.
**Drop answers ≥N**: distinct tracked Drop IDs (fallback tracked submission counts where old data lacks Drop IDs).
**D1/D7**: active on UTC calendar day first seen +1/+7; exclude visitors whose observation horizon cannot include that day. Small/partial cohorts unstable.
**First answer**: time from earliest recorded visit to first Starter answer; may be missing due to old event instrumentation.
**First Five → Ten**: number of unique browser IDs who reach step 10 ÷ number reaching step 5; in the current flow required ten to convert.
**IP/location**: Netlify edge view (context IP/geo); may be VPN, forwarded proxy, hosting, privacy relay, or remote browser. Not verified residence, do not infer personal identity.
**Opens/shares**: tracked client actions; share button or share sheet opened does not prove a message was delivered or viewed.
**Screen view**: screen_view event for named SPA route; unlike a whole document page load, an in-app screen can be viewed many times.
**Client error**: explicit JS or API error tracking; not an unknown action. A known error is counted regardless of whether the user recovered. Group by message and investigate.
**Recent event export**: current endpoint sends latest 250 rows to screen/CSV; historical totals/breakdowns use larger loaded event collection. Do not call this export a full raw-event dump.
**Geographic charts**: include possibly automated browser identities and unknown values; human-like comparison is shown separately.

## Ashburn/USA/Linux triage
An entry marked Virginia/Ashburn, Linux or desktop is not automatically a real US prospect, bot, or Netlify internal activity. Possibilities: cloud-rendered browser/test/preview, automation that executes app JS, VPN/proxy exit, user browser routed through remote gateway, or a genuine visitor. Inspect client UA, screen dimensions, session/answer behavior, first referrer, entry path and event timeline. If needed, inspect the IP's public ASN/hosting owner through an authorized IP-information provider; IP ownership still does not identify a person. Do not delete suspicious records; compare flagged and all/browser-like cohorts.
Netlify Observability **requests** measure HTTP traffic to functions/assets, not unique human visitors and can include polling, analytic POSTs, retries and automated access.

## Recommended founder weekly review
1. All traffic vs review-flagged; direct vs invite segment.
2. First Five start → answer 1 → step 5 → step 10, median completion time.
3. Invite cohort: actual joined Crew → first Crew answer → second answer → shared a Drop.
4. Drop formats by responses per Drop, unique respondents, average answer latency and share rate (some are partial historical stats).
5. New Crews with ≥2 humans and ≥5 real answers, not merely created Crews.
6. D1/D7 by entry channel and test period; allow cohorts to mature.
7. All errors and P95 latency, prioritized by frequency and ability to block core conversion.
8. Feedback sample linked to anonymized browser participant ID where consented; do not try to reverse-identify a visitor from IP.

## Architecture follow-up
Current dashboard computes large aggregates directly from Blob lists and returns first 1,000 visitors + latest 250 events. This is beta-grade and can be slow/costly. On Supabase/Postgres move to indexed append-only events and materialized/daily aggregates, anonymization/retention policy, access controls, event schema versioning and robust traffic-source tagging. Do not claim full historic backfill of missing geo or visitor identity.


## Guided M0.7 activation (new preview events)
`personal_guide_started` browser enters interest warm-up; `personal_pack_selected` explicit chosen pack; `personal_pack_skipped` Surprise Me; `personal_card_answered` PRIVATE warm-up step (1/2) and pack identifier; `personal_guide_completed` second private card answered; `guide_five_tabs_started`; `guide_tab_seen` (home,crew,create,vibe,profile); `guide_step_completed` *server-authoritative once-per-step reward*, not every screen-view; `guide_profile_ready` after local form Save; `guide_beta_handoff` marks awaiting_provider, NOT verified user signup. Current dashboard includes interest pack distribution and per-tab guided step counts. Analytics does NOT receive optional gender or private text picks; source-of-truth personal answers remain device-only and Crew result counts exclude them.

Important denominator: not every existing legacy user experiences v2; compare v2 browser cohorts by version/date and entry channel. Event totals are not verified unique individuals. Historic events never acquire retroactive country/device information.
