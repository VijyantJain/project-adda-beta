export function createStarterController(c){
  let state=null,feedback=null,busy=false,mode='play';
  const {app,shell,top,api,pid,esc,getName,getInvite,onCrewCreated,onEnterInvite,onEnterExistingCrew,onCompleted,toast}=c;
  const art={travel:'🏖️ 🏔️',denim:'👖 🔥',friends:'🫶 😂',roadtrip:'🚙 🎧',chai:'🍵 ☕',night:'🌃 🎬',food:'🍕 ✨'};
  const head=()=>top('');
  const invite=()=>getInvite?.()||null;
  const confetti=()=>'<div class="starterConfetti" aria-hidden="true">'+Array.from({length:32},(_,i)=>'<i style="--i:'+i+';--tx:'+(((i*53)%300)-150)+'px;--ty:'+(((i*37)%380)-190)+'px"></i>').join('')+'</div>';
  function trophySplash(){
    if(typeof document==='undefined'||!document.body)return;
    document.querySelector('.starterTrophySplash')?.remove();
    const overlay=document.createElement('div');overlay.className='starterTrophySplash';
    overlay.setAttribute('role','img');
    overlay.setAttribute('aria-label','Glowing trophy unlocked with electric sparks');
    overlay.innerHTML='<img src="/adda-neon-trophy.webp" onerror="this.onerror=null;this.src=\'/trophy-neon.svg\'" alt="">'
      +'<div class="starterSplashRays" aria-hidden="true">✦ ✧ ✦</div>';
    document.body.appendChild(overlay);
    const dismiss=()=>overlay.remove();
    overlay.addEventListener('click',dismiss,{once:true});
    const prefersReduced=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(dismiss,prefersReduced?350:1650);
  }
  const neonStage=(large=false)=>`<div class="starterNeonStage ${large?'starterNeonLarge':''}" aria-label="Glowing trophy, lightning and sparks">
    <img src="/adda-neon-trophy.webp" onerror="this.onerror=null;this.src='/trophy-neon.svg'" alt="Glowing purple-blue trophy with electric green lightning"/>
    <i class="neonSpark neonSparkA"></i><i class="neonSpark neonSparkB"></i><i class="neonSpark neonSparkC"></i>
  </div>`;
  function render(){
    if(!state){
      const v=invite();
      app.innerHTML=shell(`${head()}<section class="starterIntro">
        <span class="starterKicker">PLAY FIRST · CREW LATER</span>
        <h1>5 quick ones.<br><em>Find your Vibe.</em></h1>
        <p>Pick, rate, guess, laugh. Earn your first trophy before inviting anyone.${v?'<br><b>'+esc(v.crewName)+' is waiting for you after the warm-up. 👀</b>':''}</p>
        <div class="starterIntroOrbs">🏖️ 👖 ☕ 🎧 🔥</div>
        <button class="btn starterCTA" onclick="window._starterBegin()">Play my First Five →</button>
        <small>No login · No permissions · About a minute</small></section>`,false);
      return;
    }
    if(feedback){showFeedback();return}
    if(state.firstFiveCompleted&&((state.progress===5&&mode!=='play')||state.bonusCompleted||mode==='finish')){complete();return}
    const q=state.question;if(!q){mode='finish';complete();return}
    const max=state.progress<5?5:10,progress=state.progress%5;
    app.innerHTML=shell(`${head()}<main class="starterFlow">
      <div class="starterTopline"><span>⚡ ${state.progress<5?'FIRST FIVE':'BONUS ROUND'}</span><b>${state.progress+1} / ${max}</b></div>
      <div class="starterTrack"><i style="width:${progress*20}%"></i></div>
      <div class="starterBalance"><span>✨ ${state.points} Starter Vibe</span><span>${state.nextUnlock?state.nextUnlock.at-state.progress+' to '+esc(state.nextUnlock.name):'All trophies earned'}</span></div>
      <section class="starterQuestion"><span class="starterQuestionTag">${esc(q.icon)} ${esc(q.tag)}</span>
        <div class="starterArt art-${esc(q.art)}">${["travel","denim","friends","roadtrip","chai"].includes(q.art)?`<img class="starterArtImage" src="/starter-${q.art}.svg" alt="">`:`<span>${art[q.art]||'⚡'}</span>`}<i>✦</i></div>
        <h1>${esc(q.question)}</h1><p>Tap your pick 👇</p>
        <div class="starterChoices">${q.options.map((o,i)=>`<button class="starterChoice" onclick="window._starterAnswer(${i})" type="button"><span class="choiceIndex">${i+1}</span><b>${esc(o)}</b><span>↗</span></button>`).join('')}</div>
        <div id="starterSaving" class="starterSaving" aria-live="polite"></div>
      </section><p class="starterFootnote">Your progress is saved automatically.</p></main>`,false);
  }
  async function begin(){
    if(busy)return;
    busy=true;feedback=null;
    app.innerHTML=shell(`${head()}<div class="starterLoading">⚡<h2>Getting your Vibe ready…</h2></div>`,false);
    try{
      state=await api('starterGet',{params:{participantId:pid}});
      if(state.bonusCompleted)onCompleted?.(state);
      mode=state.firstFiveCompleted?'finish':'play';render();
    }catch(e){
      app.innerHTML=shell(`${head()}<div class="starterLoading"><h2>Couldn’t load your Vibe Run.</h2><p>${esc(e.message)}</p><button class="btn primary" onclick="window._starterBegin()">Retry</button></div>`,false);
    }finally{busy=false}
  }
  async function answer(i){
    if(busy||!state?.question)return;
    const q=state.question,answer=q.options[i];if(answer===undefined)return;
    busy=true;document.querySelectorAll('.starterChoice').forEach((el,j)=>{el.disabled=true;el.classList.toggle('picked',j===i)});
    const label=document.getElementById('starterSaving');if(label)label.textContent='Saving your choice…';
    try{
      const r=await api('starterAnswer',{method:'POST',body:{participantId:pid,questionId:q.id,answer}});
      state=r;feedback=r;if(state.bonusCompleted)onCompleted?.(state);showFeedback();
    }catch(e){toast(e.message);render()}finally{busy=false}
  }
  function showFeedback(){
    const r=feedback,m=r.justUnlocked,major=state.progress===5||state.progress===10,next=state.nextUnlock;
    app.innerHTML=shell(`${head()}<section class="starterReward starterRewardV2">
      ${m?confetti():''}
      ${m?neonStage(major):'<div class="starterMiniSpark">⚡</div>'}
      <span class="starterUnlock">${m?'ACHIEVEMENT UNLOCKED':r.alreadyAnswered?'ALREADY COUNTED':'CHOICE SAVED'}</span>
      <h1>${m?esc(m.icon)+' '+esc(m.name)+'!':r.alreadyAnswered?'Your Vibe is safe ✨':'Nice pick! ✨'}</h1>
      <p>${m?esc(m.text):r.alreadyAnswered?'You already earned points for this answer.':'You’re on a roll.'}</p>
      <div class="starterRewardPts">+${r.earnedPoints||0} <small>Vibe</small></div>
      <div class="starterFact"><b>💡 A LITTLE EXTRA</b><p>${esc(r.feedback||'Your answer is saved.')}</p></div>
      <div class="starterRewardTarget"><b>${major?'Your new trophy is yours!':next?'Only '+(next.at-state.progress)+' more to '+esc(next.name):'All Starter trophies unlocked'}</b><div class="starterTrack"><i style="width:${(state.progress%5||5)*20}%"></i></div></div>
      <button class="btn starterCTA" onclick="window._starterNext()">${state.progress===5?'Claim my First Five →':state.progress===10?'See my Tenacious trophy →':'One more? Let’s go →'}</button>
    </section>`,false);
    if(major&&m)trophySplash();
  }
  function next(){feedback=null;if(state.progress===5||state.bonusCompleted)mode='finish';render()}
  function complete(){
    const v=invite(),bonus=state.bonusCompleted,hasCrew=!!state.starterCrewId&&!v;
    const medals=state.earned||[];
    app.innerHTML=shell(`${head()}<main class="starterCompleteV2">
      <section class="starterTrophyShowcase">${confetti()}${neonStage(true)}
        <div class="starterShowcaseKicker">${bonus?'TENACIOUS · STARTER DECK COMPLETE':'FIRST FIVE · TROPHY UNLOCKED'}</div>
        <h1>${bonus?'Tenacious!':'First Five unlocked!'}</h1>
        <p>${bonus?'Ten choices. You cleared the full Starter Deck.':'Five choices. Your first Adda trophy is yours.'}</p>
      </section>
      <section class="starterCompletionDetails"><div class="starterCompleteScore"><b>${state.points}</b><span>STARTER VIBE EARNED ⚡</span></div>
        <span class="starterCollectionTitle">🏆 YOUR STARTER ACHIEVEMENTS · ${medals.length}/6</span>
        <div class="starterMedals">${medals.map(m=>`<span>${esc(m.icon)} ${esc(m.name)}</span>`).join('')}</div>
        <p class="starterFutureHint">${v?'Your next adventure is waiting inside '+esc(v.crewName)+'.':"That was the warm-up. Now discover what your own friends would choose."}</p>
        <button class="btn starterCTA starterFinalCTA" onclick="window._starterPrimary()">${!bonus?'Play my next Five →':v?'Enter '+esc(v.crewName)+' →':hasCrew?'Enter my Crew →':'Start my own Crew →'}</button>
        
      </section>
    </main>`,false);
  }
  function primary(){
    if(!state?.bonusCompleted){mode='play';render();return;}
    if(invite())return onEnterInvite();
    if(state?.starterCrewId)return onEnterExistingCrew?.(state.starterCrewId);
    return showCrewForm();
  }
  function skipBonus(){mode='play';render()}
  function showCrewForm(){
    mode='create';
    app.innerHTML=shell(`${head()}<main class="starterCreateV2">
      <div class="starterCreateTop"><span class="starterKicker">YOUR TROPHIES ARE SAFE 🏆</span>
      <h1>Create Your Own Crew!<br><em>Get Ready To Play With Them!</em></h1>
      <p>You Get 5 Ready-Made Drops In The New Crew To Get The Ball Rolling With Your Friends.</p></div>
      <div class="starterPackPreview"><b>THE FIRST FIVE DROPS IN YOUR CREW</b>
      <span>⚖️ Mountains or beach?</span><span>🎧 Who gets the aux?</span><span>🔮 Will the next plan happen?</span><span>💬 Your Crew’s bucket list</span><span>⭐ Rate your planning skills</span></div>
      <div class="field"><label>Your name</label><input id="starterNick" maxlength="24" value="${esc(getName()||state.nickname||'')}" placeholder="What should your friends call you?"></div>
      <div class="field"><label>Crew name</label><input id="starterCrewName" maxlength="42" placeholder="e.g. Avengers 🦸"></div>
      <button class="btn starterCTA" id="starterCreateBtn" onclick="window._starterCreateCrew()">Create My Crew →</button>
    </main>`,false);
  }
  async function createCrew(){
    if(busy)return;
    const nickname=document.getElementById('starterNick')?.value.trim(),name=document.getElementById('starterCrewName')?.value.trim();
    if(!nickname||!name)return toast('Add your name and Crew name');
    busy=true;const button=document.getElementById('starterCreateBtn');button.disabled=true;button.textContent='Preparing your five Drops…';
    try{const r=await api('starterCreateCrew',{method:'POST',body:{participantId:pid,nickname,name}});await onCrewCreated(r,nickname)}
    catch(e){toast(e.message);button.disabled=false;button.textContent='Create My Crew →'}finally{busy=false}
  }
  window._starterBegin=begin;window._starterAnswer=answer;window._starterNext=next;window._starterBonus=()=>{mode='play';render()};
  window._starterPrimary=primary;window._starterSkipBonus=skipBonus;
  window._starterShowCrewForm=showCrewForm;window._starterCreateCrew=createCrew;
  return{render,begin}
}
