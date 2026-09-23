import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../styles.css',import.meta.url),'utf8');
const starter=readFileSync(new URL('../starter.js',import.meta.url),'utf8');
const analytics=readFileSync(new URL('../analytics.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('../netlify/functions/api.ts',import.meta.url),'utf8');
test('Active tab has no fake notification dot, unread chat remains',()=>{
 assert.match(css,/\.nav5 button\.active::after\{display:none!important;content:none!important\}/);
 assert.match(app,/hasUnreadChat\(\)/);
});
test('Crew header reserves future notification area, genuine member avatar chain appears only once',()=>{
 assert.match(app,/crewHeaderFutureSlot/);
 assert.doesNotMatch(app,/class="peopleCountPill"/);
 assert.match(app,/crewPeoplePreview/);
 assert.match(app,/crewChainAvatar/);
 assert.match(app,/window\._go\('mates'\)/);
});
test('Starter Tenacious completion immediately opens one final showcase',()=>{
 assert.match(starter,/if\(state\.bonusCompleted\)\{onCompleted\?\.\(state\);feedback=null;mode='finish';render\(\);return;\}showFeedback\(\);/);
});
test('Aura shows fast truthful scoped totals without blocking on global scan',()=>{
 assert.match(app,/v=await api\('getAuraStarter'/);
 assert.match(app,/verified so far/);
 assert.match(app,/window\._loadFullAura=async/);
 assert.match(app,/getVibe/);
});
test('Crew sends independent data requests concurrently',()=>{
 assert.match(app,/await Promise\.all\(\[refreshCrew\(\),refreshDrops\(\)\]\)/);
});
test('Analytics raises slow-loading threshold, caches authorized dashboard and parallelizes list scans',()=>{
 assert.match(analytics,/ctl\.abort\(\),55000/);
 assert.match(backend,/const cacheKey=`analytics\/cache\/v073\/dashboard_\$\{days\}`/);
 assert.match(backend,/if\(cached&&Date\.now\(\)-Date\.parse\(cached\.generatedAt\)<120000\)return ok\(cached\)/);
 assert.match(backend,/\[visitorAll,sessionAll,eventAll,legacyAll,memberRows,crewRows/);
 assert.match(backend,/await store\.setJSON\(cacheKey,dashboard\)/);
});
