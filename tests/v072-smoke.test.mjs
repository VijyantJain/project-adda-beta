import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const app=read('app.js'),starter=read('starter.js'),api=read('netlify/functions/api.ts'),css=read('styles.css'),guide=read('personal-guide.js');
const keys=['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10',...['rides','style','music','food','travel','memes','fitness'].flatMap(x=>[x+'7',x+'8'])];
test('Starter v3 photoreal field-test assets are local and non-empty',()=>{
 assert.equal(keys.length,24);for(const key of keys)assert.ok(statSync(new URL('../assets/starter/v3/'+key+'.webp',import.meta.url)).size>1000,key);
 assert.match(starter,/assets\/starter\/v3/);assert.match(starter,/onerror=/);assert.match(guide,/assets\/starter\/v3/);
});
test('real Aura rather than fabricated score after Tenacious',()=>{
 assert.match(api,/action==="getAuraStarter"/);assert.match(api,/score=starter.points\+guidePoints/);
 assert.match(app,/api\('getAuraStarter'/);assert.doesNotMatch(app,/score:\(st.response_submitted\|\|0\)/);
 assert.match(app,/v\.starter\?\.bonusCompleted&&v\.score<180/);
});
test('direct Tenacious activates resumable Aura-first coach',()=>{
 assert.match(app,/addaSoloGuidePending_/);assert.match(app,/function startSoloGuide\(/);assert.match(app,/showAuraIntro\(/);
 assert.match(app,/soloGuidePending\(\)&&!guide.active/);assert.match(app,/const expected=\['vibe','home'/);
 assert.doesNotMatch(app,/id="addaGuideSkip"/);
});
test('legacy Starter options and points survive versioned v3',()=>{
 assert.match(api,/deckVersion:"v3"/);assert.match(api,/STARTER_V2_COMMON/);assert.match(api,/STARTER_DECK/);
 assert.match(api,/state\?\.deckVersion!=="v2"/);assert.match(api,/n===5\?30:0/);assert.match(api,/n===10\?50:0/);
 assert.match(starter,/state\.bonusCompleted\|\|state\.progress===5/);
});
test('profile setup keeps avatar/default and final guided completion',()=>{
 assert.match(app,/Keep default avatar/);assert.match(app,/addaGuideAvatar/);
 assert.match(app,/addaSoloGuideDone_/);assert.match(app,/guideProfileSaved\(/);
});
test('points explained, but no fabricated OTP or friends',()=>{
 assert.match(app,/Build it\. Earn it\. Flex it/);assert.match(app,/Recorded share action/);
 assert.match(app,/no Crew/i);assert.match(app,/awaiting_provider/);assert.match(app,/soloCrewTour/);
});
test('Netlify persistent store identities remain unchanged',()=>{
 assert.match(api,/FIELD_TEST_STORE="adda-v05-fieldtest"/);assert.match(api,/name:"adda-v03"/);
 assert.match(css,/addaAuraBreakdown/);
});
test('feature checklist count remains canonical 115',()=>{
 assert.equal([...read('docs/FEATURE_SPEC_CHECKLIST.md').matchAll(/\*\*[PDCVA]-\d{3}\*\*/g)].length,115);
});
