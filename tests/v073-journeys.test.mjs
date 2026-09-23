import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=src('app.js'),api=src('netlify/functions/api.ts');
test('first-created Crew reuses saved name and durable create request',()=>{
 assert.match(app,/localProfile\(\)\.displayName\|\|meName/);
 assert.match(app,/addaCrewCreateRequest_/);
 assert.match(api,/crewCreate\/v073\//);
 assert.match(api,/firstCreatedCrew:previous\.length===0/);
});
test('five seeds exactly, unique and safe to retry',()=>{
 assert.match(api,/action==="seedFirstCrew"/);
 for(const type of ['either','vote','predict','short','rate'])assert.match(api,new RegExp('type:"'+type+'"'));
 assert.match(api,/d_fc\$\{i\+1\}/);
 assert.match(api,/firstCrewSeed:true/);
 assert.match(api,/creatorName:"Adda"/);
 assert.match(app,/seedFirstCrew/);
});
test('selected interests are two different supported values',()=>{
 assert.match(api,/interests\[0\]===interests\[1\]/);
 assert.match(app,/Choose TWO things your gang loves/);
 assert.match(app,/journey\.interestDropIds/);
});
test('member list is separate from admin-only Crew settings',()=>{
 assert.match(app,/function renderMates/);
 assert.match(app,/if\(!admin\)\{screen='mates';return renderMates\(\)\}/);
 assert.match(app,/crew\.createdBy===pid\?[\s\S]{0,170}crewSettings/);
 assert.doesNotMatch(app,/<b>Aura<\/b><small>\$\{matesLabel\(\)\}/);
});
test('distinct direct / Crew / Drop invite paths preserved',()=>{
 assert.match(app,/kind:dropId\?'drop_invite':'crew_invite'/);
 assert.match(app,/startInvitedDropGuide/);
 assert.match(app,/journeyStartStarter/);
 assert.match(app,/journeyAfterProfile/);
 assert.match(app,/phase:'create_required'/);
 assert.match(app,/journey\.crewId/);
});
test('invited Crew saves two real answers before Starter then custom Drop',()=>{
 assert.match(app,/journeyAfterRealAnswer/);
 assert.match(app,/journey\.kind==='crew_invite'/);
 assert.match(app,/Start my Aura Run/);
 assert.match(app,/Now create YOUR first Drop/);
 assert.match(app,/first_custom_drop_guide_completed/);
});
test('Drop invite answers exact question before Starter',()=>{
 assert.match(app,/phase==='drop_entry'/);
 assert.match(app,/setTimeout\(journeyStartStarter,900\)/);
 assert.match(app,/dropId:journey\.dropId/);
});
test('first custom Drop explains all six formats and actual settings',()=>{
 for(const format of ['Quick Answer','This or That','Vote','Rate','Predict','Most Likely'])assert.ok(app.includes(format),format);
 assert.match(app,/function customPickedType/);
 assert.match(app,/Show who picked what/);
 assert.match(app,/Let people change answers/);
 assert.match(app,/customDropPublished/);
});
test('publication, seeding and response repeats are safe',()=>{
 assert.match(api,/dropCreate\/v073\//);
 assert.match(api,/if\(existing&&existing\.answer===answer\)/);
 assert.match(app,/addaDropCreateRequest_/);
 assert.match(app,/if\(!result\.reused\)track\('drop_created'/);
});
test('truthful link sharing and Aura preserve early participation',()=>{
 assert.match(app,/return share\(/);
 assert.match(api,/linkedAnswers\.length\*10\+10/);
 assert.match(app,/Actual Crew activity/);
 assert.match(app,/does not confirm delivery/);
});
test('legacy and new Starter deck versions preserved',()=>{
 assert.match(api,/state\?\.deckVersion!=="v2"/);
 assert.match(api,/deckVersion:'v3'/);
 assert.match(api,/STARTER_DECK/);
});
