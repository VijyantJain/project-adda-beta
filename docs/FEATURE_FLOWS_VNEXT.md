# Project Adda — vNext Feature Flows
Updated: 2026-09-18

## 1. Daily Vibe Loop

### Entry
Home top module:
- Daily Vibe card
- Charge meter
- next mission
- streak
- capsule state

### Daily Deck flow
Open Daily Vibe -> finite stack of 5–10 cards:
1. direct social obligation
2. unanswered Crew item
3. personalized Arena Drop
4. creation prompt
5. profile/social action

Each completed action:
- immediate animation/haptic in native client
- +Vibe
- +Charge
- badge/streak progress
- event logged

When Charge threshold reached:
- Capsule button becomes active
- opening reveals one reward
- next Deck card exposed immediately

### Reward classes
Common:
- Vibe points
- badge progress
- profile accent

Uncommon:
- limited card frame
- mission wildcard
- temporary theme

Rare:
- event badge
- collectible profile effect

No money-equivalent rewards.

## 2. Vibe Profile

### Own view
Profile -> Vibe:
- avatar
- name/handle
- Vibe score
- level
- streak
- signature
- badges
- collections
- Crew ranking summaries
- Daily progress
- share/flex

### Other-person view
Tap any identity -> Vibe Profile.
No URL typing.

Identity surfaces:
- mates
- voters
- respondents
- chat
- leaderboards
- Moment viewers
- DMs
- Arena
- reactions
- Reveal subjects

### Public external view
Shared profile deep link -> safe public Vibe projection.
If app installed/native later: deep-link into profile.
If web: render frictionless public page.

## 3. Moments

### Create
+ -> Moment
- photo
- text overlay/caption
- select audience
- post

Audience presets:
- one Crew
- all my Crews
- accepted followers
- custom circle

### Consume
Home/Arena profile ring -> tap -> full-screen Moment sequence.
- tap next
- hold pause
- swipe profile
- react
- reply -> DM

### Expiry
24h default.
Creator may explicitly save to Memory/Highlight.

## 4. Blink / View Once

### Send
DM/Crew composer -> camera/image -> "View once".
Upload encrypted-at-rest/private object.
Recipient sees blurred/locked card.

### Open
Tap -> authorize -> issue short signed URL -> mark opening.
On successful render:
- increment view count
- mark consumed if max views reached
- sender gets opened state

### Delete
Consumed/expired object enters deletion queue.
Worker deletes storage object.
Keep only minimal abuse/safety metadata per policy.

### Replay
Optional one replay. Product decision should be test-driven.

## 5. DMs

### Starting a DM
Tap Vibe profile -> Message.
If shared Crew / accepted follow -> open directly.
Otherwise -> message request.

### Inbox
Tabs:
- Chats
- Requests

Conversation supports:
- text
- emoji
- shared Drop
- shared profile
- Moment reply
- image
- Blink later

Controls:
- mute
- block
- report
- delete own message where supported

## 6. Crew Pulse

Crew Hub shows:
- live Pulse meter
- next Mystery Reveal
- activity required
- latest unlocked Reveal

Action weighting example:
- answer +1
- create +3
- chat/reaction +0.5 capped
- invite converted +4
- plan participation +1

Avoid easy spam farming using per-action caps.

At threshold:
Mystery Reveal unlock animation.
Then next Reveal target seeded.

## 7. Plans

Crew -> Plans:
- Create plan
- title
- date/time
- place/link
- optional choice poll
- RSVP

Crew members receive:
- notification
- RSVP
- comments
- reminders

After event:
prompt "Save this as a Memory?"

## 8. Memories

Sources:
- Drop result
- Mystery Reveal
- Moment
- message
- plan/event
- uploaded photo
- Recap highlight

Crew Memory view:
- timeline
- pinned
- event collections
- anniversaries
- inside-joke tags

## 9. Templates / Remix

Every eligible Drop:
Remix -> prefilled Create screen.
Attributes copied:
- type
- question/template
- default settings
Not copied:
- original responses
- private attribution
- creator-only data

## 10. Notifications

Notification Center sections:
- For you
- Crews
- Messages

Priority:
P0: safety/account
P1: DM/reply/mention/picked
P2: Reveal/Capsule/level
P3: Crew activity
P4: recommendations

Push notifications require:
- explicit user permission
- preference center
- quiet hours
- rate limiting
- bundling

## 11. Arena

### Navigation
Future bottom nav may evolve to:
Home / Crews / + / Arena / Profile
Vibe can live inside profile or remain a primary tab based on testing.

### Feed item
- creator/profile
- content type
- interactive body
- answer/react
- comments or discussion where enabled
- share
- remix
- follow
- hide/not interested

### Feed loop
impression -> interaction -> instant feedback -> next item.

Personal Daily Deck can source Arena content, ensuring personal progression even when Crews are inactive.

## 12. Recommendation controls
User controls:
- not interested
- hide creator
- mute category
- language preference
- reset recommendations eventually

## 13. Safety flow
Every public/DM/Moment object:
overflow menu -> report/block/mute where applicable.
Moderation states:
active / limited / removed / under review.

## 14. Onboarding vNext
Keep friction low:
1. name / account
2. join via incoming object if deep-linked
3. optional 3–5 interest chips only if needed for Arena cold start
4. value immediately

Never force a long onboarding questionnaire before first social action.
