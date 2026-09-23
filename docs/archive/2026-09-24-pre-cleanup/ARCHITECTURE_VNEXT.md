# Project Adda — vNext Architecture
Updated: 2026-09-18

## 1. Current beta
Client: vanilla JS SPA.
Backend: Netlify Functions.
State: Netlify Blobs.
Media: Blob objects.
Identity: browser-local participantId.
Analytics: custom event store/dashboard.

This architecture is suitable for the current experiment, not full GTM.

## 2. Target architecture
### Core
- Supabase Postgres
- Supabase Auth
- Supabase Realtime
- Supabase Storage
- Row Level Security (RLS)

### Frontend
Migration path can be decided separately:
- keep web/PWA initially
- later React/Next/Expo/React Native based on validated usage and push/media requirements

### Services
- API/edge functions for privileged operations
- notification worker
- media expiry worker
- Vibe aggregator
- Crew Pulse aggregator
- Arena recommendation service
- moderation pipeline
- analytics/event export pipeline

## 3. Canonical data model

### identity
profiles
- id UUID PK
- handle unique nullable
- display_name
- avatar_path
- bio
- account_visibility public/private
- vibe_visibility
- created_at
- updated_at

devices
- id
- profile_id
- push_token
- platform
- last_seen

follows
- follower_id
- following_id
- status requested/accepted
- created_at

blocks
- blocker_id
- blocked_id

### crews
crews
- id
- name
- avatar/path
- created_by
- visibility private/invite
- created_at

crew_members
- crew_id
- profile_id
- role owner/admin/member
- joined_at
- nickname_override
- notification_level

crew_invites
- id/token
- crew_id
- created_by
- expires_at
- max_uses

### drops
drops
- id
- crew_id nullable for Arena/public
- creator_id
- type
- question
- audience
- reveal_mode
- reveal_threshold
- reveal_at
- show_names
- allow_change
- media
- status
- created_at

drop_options
- id
- drop_id
- label
- media_path
- sort_order

drop_responses
- drop_id
- profile_id
- answer payload/json
- created_at
- updated_at

drop_reactions
- drop_id
- profile_id
- reaction

drop_templates
- id
- creator_id/system
- type
- payload
- public
- usage_count

### vibe
vibe_events
- id
- profile_id
- source_type
- source_id
- event_type
- points
- occurred_at

vibe_daily
- profile_id
- date
- meaningful_actions
- charge
- streak_state
- capsule_count

vibe_profiles
- profile_id
- score
- level
- streak
- longest_streak
- signature_type
- updated_at

achievements
- id
- key
- name
- description
- icon
- category
- rarity
- active_from/to

user_achievements
- profile_id
- achievement_id
- progress
- unlocked_at

daily_deck_items
- id
- profile_id
- date
- source_type
- source_id
- mission_type
- status
- reward_points

capsule_unlocks
- id
- profile_id
- reward_type
- reward_payload
- unlocked_at

### crew pulse
crew_pulse_events
- id
- crew_id
- profile_id
- action_type
- points
- created_at

crew_pulse_state
- crew_id
- period
- score
- threshold
- reveal_id

crew_reveals
- id
- crew_id
- reveal_type
- payload_json
- unlocked_at

### chat and DMs
conversations
- id
- type dm/group
- created_at

conversation_members
- conversation_id
- profile_id
- state active/requested/blocked
- last_read_at
- muted_until

messages
- id
- conversation_id
- sender_id
- type text/drop/profile/moment/image/blink/voice/video
- text
- payload_json
- created_at
- deleted_at

message_reactions
- message_id
- profile_id
- reaction

### ephemeral media
ephemeral_media
- id
- owner_id
- storage_path
- media_type
- audience_type
- expires_at
- max_views
- replay_limit
- consumed_at
- deletion_state

ephemeral_views
- media_id
- viewer_id
- viewed_at
- replay_number

Storage bucket: ephemeral-private.
Use signed URLs; never expose permanent public URLs.

### Moments / Stories
moments
- id
- creator_id
- media_path
- media_type
- caption
- audience_type
- crew_id nullable
- expires_at
- created_at

moment_viewers
- moment_id
- viewer_id
- viewed_at

moment_reactions
- moment_id
- viewer_id
- reaction

### Plans
plans
- id
- crew_id
- creator_id
- title
- description
- starts_at
- location_text
- status
- created_at

plan_options
plan_rsvps
plan_comments

### Memories
memories
- id
- crew_id
- created_by
- source_type
- source_id
- title
- note
- pinned
- created_at

### Challenges
challenges
challenge_members
challenge_progress

### Arena
arena_items
- id
- source_type
- source_id
- creator_id
- publish_state
- language
- category
- created_at

feed_impressions
- id
- profile_id
- arena_item_id
- position
- algorithm_version
- shown_at

feed_actions
- impression_id
- action answer/react/share/follow/hide/report/dwell
- value
- created_at

user_interest_scores
- profile_id
- interest_key
- score
- updated_at

### notifications
notifications
- id
- profile_id
- type
- actor_id
- object_type/id
- read_at
- push_sent_at
- created_at

### safety
reports
moderation_actions
content_labels
rate_limit_events

### experimentation
experiments
experiment_assignments
experiment_events

## 4. Realtime channels
- crew:<crew_id> drops/responses/pulse/chat
- conversation:<id> messages/read
- profile:<id> vibe/notifications
- moment:<id> views/replies if needed

Do not subscribe to global high-volume tables directly.

## 5. Arena recommendation architecture
Stage 1 heuristic:
- candidates from follows/shared context/trending/interests
- recency decay
- answer probability
- novelty
- creator diversity
- safety filters
- exploration quota

Stage 2 learned ranking:
Features only from permissible behavior/context.
Objective combines:
- meaningful answer
- reaction
- share
- follow/profile visit
- return-quality
Negative signals:
- hide/not interested
- immediate bounce
- report
- repetitive creator/category exposure

Never infer sensitive traits for ranking.

## 6. Daily Vibe recommendation
Daily Deck candidate pools:
A. direct social obligations
B. unanswered Crew content
C. profile/DM interactions
D. Arena interests
E. system missions
Select a small finite set, not an endless list.

## 7. Ephemeral deletion architecture
- storage object has DB row
- signed URL created only after authorization
- view transaction increments count atomically
- consumed objects move to deletion queue
- scheduled worker removes storage object and tombstones row
- metadata necessary for abuse reports retained only per policy
- expired Moments cleaned similarly

## 8. Security
RLS is mandatory.
Examples:
- Crew content readable only by members except explicitly public shared objects.
- DM readable only by conversation members.
- private Moment readable only by permitted audience.
- public Vibe returns a safe projection, never internal analytics.
- service-role secrets never exposed to client.
- signed media URLs short-lived.
- server validates all reward/Vibe mutations.

## 9. Analytics
Operational DB is not the long-term analytics warehouse.
Keep event schema stable:
profile_id/session_id/event/object/context/timestamp/experiment.
Eventually export to dedicated analytics tooling/warehouse.
Never expose raw IP/device analytics in public product surfaces.

## 10. Migration strategy
1. Freeze current Netlify field-test data.
2. Create Supabase schema in separate environment.
3. Write migration/import tooling.
4. Shadow-write selected non-critical events if desired.
5. Build vNext client against staging Supabase.
6. QA with synthetic/new Crews.
7. Cut beta testers to new backend only after reconciliation.
8. Keep field-test snapshot as immutable rollback/archive.


## v0.6.1 bridge from beta guest to durable identity
Current link-open creates provisional member under browser participantId; it must not replace an existing named member on retry. The first-time session retains original invited Crew/Drop and finalizes a user-provided display name after Starter. Current lifetime claim is PER BROWSER ONLY. Future verified auth merges guest participantId(s), earned event ledger, Crew roles, Drops and Vibe idempotently to one stable profile, preserving all identifiers.

The Starter Crew route saves new crew ID before performing restartable five-Drop seed writes, uses deterministic seed IDs and recognizes old seeded Crews. The current Netlify field-test store remains unchanged.

For Auth OTP provider, handle uniqueness, avatars, bio, signed Crew invites, explicit optional contact permission/matching and Home/Arena split: docs/ONBOARDING_IDENTITY_CONTACTS.md.
