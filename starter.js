
export function createStarterController(c){
 let state=null,feedback=null,busy=false,mode='play';
 const {app,shell,top,api,pid,esc,getKnownCrews,getName,onCrewCreated,toast}=c;
 const art={travel:'🏖️ 🏔️',denim:'👖 🔥',friends:'🫶 😂',roadtrip:'🚙 🎧',chai:'🍵 ☕',night:'🌃 🎬',food:'🍕 ✨'};
 const head=()=>top('');
 const confetti=()=>'<div class="starterConfetti" aria-hidden="true">'+Array.from({length:20},(_,i)=>'<i style="--i:'+i+';--tx:'+(((i*47)%170)-85)+'px;--ty:'+(((i*29)%120)-60)+'px"></i>').join('')+'</div>';
 function render(){
  if(!state){app.innerHTML=shell(`${head()}<section class="starterIntro"><div class="starterIntroIcon">⚡</div><span class="starterKicker">PLAY FIRST · CREW LATER</span><h1>5 quick ones.<br><em>Find your Vibe.</em></h1><p>Pick, rate, guess, laugh. Earn a trophy before you invite anyone.</p><div class="starterIntroOrbs">🏖️ 👖 ☕ 🎧 🔥</div><button class="btn starterCTA" onclick="window._starterBegin()">Play my First Five →</button><small>About a minute · No login · No permissions</small></section>${getKnownCrews().length?'<button class="btn ghost" onclick="window._home()">Back to my Crews</button>':''}`,false);return}
  if(feedback){showFeedback();return}
  if(state.firstFiveCompleted&&((state.progress===5&&mode!=='play')||state.bonusCompleted||mode==='finish')){complete();return}
  const q=state.question;if(!q){mode='finish';complete();return}
  const max=state.progress<5?5:10,progress=state.progress%5;
  app.innerHTML=shell(`${head()}<div class="starterTopline"><span>⚡ ${state.progress<5?'FIRST FIVE':'BONUS ROUND'}</span><b>${state.progress+1} / ${max}</b></div><div class="starterTrack"><i style="width:${progress*20}%"></i></div>
  <div class="starterBalance"><span>✨ ${state.points} Vibe earned</span><span>${5-progress} to next trophy</span></div>
  <section class="starterQuestion"><span class="starterQuestionTag">${esc(q.icon)} ${esc(q.tag)}</span><div class="starterArt art-${esc(q.art)}"><span>${art[q.art]||'⚡'}</span><i>✦</i></div><h1>${esc(q.question)}</h1><p>Tap your pick 👇</p>
  <div class="starterChoices">${q.options.map((o,i)=>`<button class="starterChoice" onclick="window._starterAnswer(${i})"><span class="choiceIndex">${i+1}</span><b>${esc(o)}</b><span>↗</span></button>`).join('')}</div><div id="starterSaving" class="starterSaving" aria-live="polite"></div></section><p class="starterFootnote">Your progress is saved automatically.</p>`,false)
 }
 async function begin(){
  if(busy)return;busy=true;feedback=null;
  app.innerHTML=shell(`${head()}<div class="starterLoading">⚡<h2>Getting your Vibe ready…</h2></div>`,false);
  try{state=await api('starterGet',{params:{participantId:pid}});mode=state.firstFiveCompleted?'finish':'play';render()}
  catch(e){app.innerHTML=shell(`${head()}<div class="starterLoading"><h2>Couldn't load your Vibe Run.</h2><p>${esc(e.message)}</p><button class="btn primary" onclick="window._starterBegin()">Retry</button></div>`,false)}
  finally{busy=false}
 }
 async function answer(i){
  if(busy||!state?.question)return;
  const q=state.question,answer=q.options[i];if(answer===undefined)return;busy=true;
  document.querySelectorAll('.starterChoice').forEach((el,j)=>{el.disabled=true;el.classList.toggle('picked',i===j)});
  const n=document.getElementById('starterSaving');if(n)n.textContent='Saving your pick…';
  try{const r=await api('starterAnswer',{method:'POST',body:{participantId:pid,questionId:q.id,answer}});state=r;feedback=r;showFeedback()}
  catch(e){toast(e.message);render()}finally{busy=false}
 }
 function showFeedback(){
  const f=feedback,m=f.justUnlocked,done=state.progress===5,last=state.progress===10,next=state.nextUnlock;
  app.innerHTML=shell(`${head()}<section class="starterReward">
   ${m?confetti():''}<div class="starterTrophyIcon">${m?m.icon:'⚡'}</div><span class="starterUnlock">${m?'ACHIEVEMENT UNLOCKED':'CHOICE SAVED'}</span><h1>${m?esc(m.name)+'!':'Nice pick! ✨'}</h1><p>${m?esc(m.text):'You’re on a roll.'}</p>
   <div class="starterRewardPts">+${f.earnedPoints||0} <small>Vibe</small></div><div class="starterScoreTotal">${state.points} total Starter Vibe</div>
   <div class="starterFact"><b>💡 A LITTLE EXTRA</b><p>${esc(f.feedback||'Your choice is saved.')}</p></div>
   <div class="starterRewardTarget"><b>${done?'First Five complete!':last?'Starter Deck complete!':next?'Only '+(next.at-state.progress)+' more to '+esc(next.name):'All trophies unlocked'}</b><div class="starterTrack"><i style="width:${(state.progress%5||5)*20}%"></i></div></div>
   <button class="btn starterCTA" onclick="window._starterNext()">${done?'Claim my trophy →':last?'See my trophies →':'One more? Let’s go →'}</button></section>`,false)
 }
 function next(){feedback=null;if(state.progress===5||state.bonusCompleted)mode='finish';render()}
 function complete(){
  const bonus=state.bonusCompleted;
  app.innerHTML=shell(`${head()}<section class="starterComplete">${confetti()}<div class="starterCompleteTrophy">${bonus?'👑':'🏆'}</div><span class="starterKicker">YOU EARNED THIS</span><h1>${bonus?'Tenacious!':'First Five unlocked!'}</h1><p>${bonus?'Ten choices. You cleared the full Starter Deck.':'Five choices. Your first Adda trophy is yours.'}</p>
  <div class="starterCompleteScore"><b>${state.points}</b><span>Starter Vibe ⚡</span></div><div class="starterMedals">${(state.earned||[]).map(m=>`<span>${m.icon} ${esc(m.name)}</span>`).join('')}</div>
  <section class="starterCrewOffer"><b>👀 NOW MAKE IT ABOUT YOUR FRIENDS</b><h2>What would your gang answer?</h2><p>We prepare 5 Drops. You only give your Crew a name.</p><button class="btn starterCTA" onclick="window._starterShowCrewForm()">Start my Crew with 5 Drops →</button></section>
  ${!bonus?'<button class="btn starterBonus" onclick="window._starterBonus()">Bonus 5 · Keep earning Vibe →</button>':''}
  ${getKnownCrews().length?'<button class="btn ghost" onclick="window._home()">Back to my Crews</button>':''}
  </section>`,false)
 }
 function bonus(){mode='play';render()}
 function showCrewForm(){
  app.innerHTML=shell(`${head()}<section class="starterCreate"><span class="starterKicker">YOUR TROPHIES ARE SAFE 🏆</span><h1>Your own Crew, ready to play.</h1><p>Five ready-made Drops. No questions to write.</p>
  <div class="starterPackPreview"><b>YOUR STARTER PACK</b><span>⚖️ Mountains or beach?</span><span>🎧 Who gets the aux?</span><span>🔮 Will the next plan happen?</span><span>💬 Crew bucket list</span><span>⭐ Rate your planning skills</span></div>
  <div class="field"><label>Your name</label><input id="starterNick" maxlength="24" value="${esc(getName()||state.nickname||'')}" placeholder="What should your Crew call you?"></div>
  <div class="field"><label>Crew name</label><input id="starterCrewName" maxlength="42" placeholder="e.g. Avengers 🦸"></div>
  <button class="btn starterCTA" id="starterCreateBtn" onclick="window._starterCreateCrew()">Create my Crew →</button><button class="btn ghost" onclick="window._starterBackToTrophies()">Not now · Keep my trophies</button></section>`,false)
 }
 async function createCrew(){
  if(busy)return;const nickname=document.getElementById('starterNick')?.value.trim(),name=document.getElementById('starterCrewName')?.value.trim();
  if(!nickname||!name)return toast('Add your name and Crew name');
  busy=true;const btn=document.getElementById('starterCreateBtn');btn.disabled=true;btn.textContent='Preparing your 5 Drops…';
  try{const r=await api('starterCreateCrew',{method:'POST',body:{participantId:pid,nickname,name}});await onCrewCreated(r,nickname)}
  catch(e){toast(e.message);btn.disabled=false;btn.textContent='Create my Crew →'}finally{busy=false}
 }
 window._starterBegin=begin;window._starterAnswer=answer;window._starterNext=next;window._starterBonus=bonus;
 window._starterShowCrewForm=showCrewForm;window._starterBackToTrophies=()=>{mode='finish';complete()};
 window._starterCreateCrew=createCrew;
 return {render,begin}
}
