-- Project Adda vNext Supabase schema draft
-- Updated 2026-09-18
-- Design draft only. Do not deploy to the current field-test backend.

create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  handle text unique,
  display_name text not null,
  avatar_path text,
  bio text,
  account_visibility text not null default 'private' check (account_visibility in ('public','private')),
  vibe_visibility text not null default 'public' check (vibe_visibility in ('public','followers','crews','private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  status text not null check (status in ('requested','accepted')),
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id)
);

create table blocks (
  blocker_id uuid references profiles(id) on delete cascade,
  blocked_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

create table crews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar_path text,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table crew_members (
  crew_id uuid references crews(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  nickname_override text,
  joined_at timestamptz not null default now(),
  primary key (crew_id, profile_id)
);

create table drops (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid references crews(id) on delete cascade,
  creator_id uuid references profiles(id),
  type text not null,
  question text not null,
  audience text not null default 'crew',
  reveal_mode text not null,
  reveal_threshold integer,
  reveal_at timestamptz,
  show_names boolean not null default false,
  allow_change boolean not null default true,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table drop_options (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid references drops(id) on delete cascade,
  label text not null,
  media_path text,
  sort_order integer not null
);

create table drop_responses (
  drop_id uuid references drops(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  answer jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (drop_id, profile_id)
);

create table vibe_events (
  id bigint generated always as identity primary key,
  profile_id uuid references profiles(id) on delete cascade,
  source_type text,
  source_id uuid,
  event_type text not null,
  points integer not null default 0,
  occurred_at timestamptz not null default now()
);

create table vibe_profiles (
  profile_id uuid primary key references profiles(id) on delete cascade,
  score bigint not null default 0,
  level integer not null default 1,
  streak integer not null default 0,
  longest_streak integer not null default 0,
  signature_type text,
  updated_at timestamptz not null default now()
);

create table vibe_daily (
  profile_id uuid references profiles(id) on delete cascade,
  day date not null,
  meaningful_actions integer not null default 0,
  charge integer not null default 0,
  capsules_opened integer not null default 0,
  primary key (profile_id, day)
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  description text,
  icon text,
  category text,
  rarity text,
  active_from timestamptz,
  active_to timestamptz
);

create table user_achievements (
  profile_id uuid references profiles(id) on delete cascade,
  achievement_id uuid references achievements(id) on delete cascade,
  progress numeric not null default 0,
  unlocked_at timestamptz,
  primary key (profile_id, achievement_id)
);

create table daily_deck_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  day date not null,
  source_type text not null,
  source_id uuid,
  mission_type text not null,
  status text not null default 'pending',
  reward_points integer not null default 0
);

create table capsule_unlocks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  reward_type text not null,
  reward_payload jsonb,
  unlocked_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('dm','group')),
  created_at timestamptz not null default now()
);

create table conversation_members (
  conversation_id uuid references conversations(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  state text not null default 'active' check (state in ('active','requested','blocked')),
  last_read_at timestamptz,
  muted_until timestamptz,
  primary key (conversation_id, profile_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),
  type text not null default 'text',
  text text,
  payload jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table ephemeral_media (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id),
  storage_path text not null,
  media_type text not null,
  audience_type text not null,
  expires_at timestamptz not null,
  max_views integer not null default 1,
  replay_limit integer not null default 0,
  consumed_at timestamptz,
  deletion_state text not null default 'active'
);

create table ephemeral_views (
  media_id uuid references ephemeral_media(id) on delete cascade,
  viewer_id uuid references profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  replay_number integer not null default 0
);

create table moments (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references profiles(id) on delete cascade,
  crew_id uuid references crews(id) on delete cascade,
  media_path text,
  media_type text not null,
  caption text,
  audience_type text not null,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now()
);

create table moment_views (
  moment_id uuid references moments(id) on delete cascade,
  viewer_id uuid references profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (moment_id, viewer_id)
);

create table plans (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid references crews(id) on delete cascade,
  creator_id uuid references profiles(id),
  title text not null,
  description text,
  starts_at timestamptz,
  location_text text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table memories (
  id uuid primary key default gen_random_uuid(),
  crew_id uuid references crews(id) on delete cascade,
  created_by uuid references profiles(id),
  source_type text not null,
  source_id uuid,
  title text,
  note text,
  pinned boolean not null default false,
  created_at timestamptz not null default now()
);

create table arena_items (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_id uuid not null,
  creator_id uuid references profiles(id),
  language text,
  category text,
  publish_state text not null default 'public',
  created_at timestamptz not null default now()
);

create table feed_impressions (
  id bigint generated always as identity primary key,
  profile_id uuid references profiles(id) on delete cascade,
  arena_item_id uuid references arena_items(id) on delete cascade,
  position integer,
  algorithm_version text,
  shown_at timestamptz not null default now()
);

create table feed_actions (
  id bigint generated always as identity primary key,
  impression_id bigint references feed_impressions(id) on delete cascade,
  action text not null,
  value jsonb,
  created_at timestamptz not null default now()
);

create table user_interest_scores (
  profile_id uuid references profiles(id) on delete cascade,
  interest_key text not null,
  score numeric not null default 0,
  updated_at timestamptz not null default now(),
  primary key (profile_id, interest_key)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  type text not null,
  actor_id uuid references profiles(id),
  object_type text,
  object_id uuid,
  read_at timestamptz,
  push_sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id),
  target_type text not null,
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

-- Mandatory before production:
-- 1. Enable RLS on user/content tables.
-- 2. Add policies for Crew membership, conversations, Moments, profile visibility.
-- 3. Keep service-role operations server-side only.
-- 4. Add indexes after query patterns are finalized.
-- 5. Add scheduled cleanup for moments/ephemeral_media.
-- 6. Add audit/moderation retention rules.


-- v0.6.1 PROPOSAL ONLY: do NOT apply this draft to Netlify field-test data.
-- Actual Supabase OTP/email/mobile authentication requires provider configuration and RLS.
create table if not exists guest_identities (
 participant_id text primary key,
 profile_id uuid references profiles(id) on delete cascade,
 linked_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists profile_onboarding (
 profile_id uuid primary key references profiles(id) on delete cascade,
 starter_completed_at timestamptz,
 starter_crew_id uuid references crews(id) on delete set null,
 nickname_saved_at timestamptz,
 handle_saved_at timestamptz,
 avatar_saved_at timestamptz,
 bio_saved_at timestamptz,
 contacts_opt_in_at timestamptz,
 updated_at timestamptz not null default now()
);
create unique index if not exists profiles_handle_lower_unique
 on profiles (lower(handle)) where handle is not null;
create table if not exists crew_invites (
 id uuid primary key default gen_random_uuid(),
 crew_id uuid not null references crews(id) on delete cascade,
 created_by uuid references profiles(id),
 token_hash text not null unique,
 expires_at timestamptz,
 max_uses integer,
 used_count integer not null default 0,
 revoked_at timestamptz,
 created_at timestamptz not null default now()
);
-- If contact discovery is approved, collect explicit revocable consent,
-- use server-held keyed tokens / privacy-reviewed matching;
-- never expose raw contact lists or phone-number lookups publicly.
-- Add profile/dm/crew invite RLS policies and backend abuse throttles before deployment.
