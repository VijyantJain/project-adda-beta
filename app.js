const $=s=>document.querySelector(s);const app=document.getElementById('app');
const API='/api';
const qs=new URLSearchParams(location.search);let crewId=qs.get('crew')||'';let dropId=qs.get('drop')||'';
const pid=localStorage.addaPid||(`p_${crypto.randomUUID().replace(/-/g,'').slice(0,10)}`);localStorage.addaPid=pid;
let meName=localStorage.addaName||'';let crew=null,members=[],drops=[],screen='boot',tab='drops',selected=null,guestAnswer=null,activeDropType='',pollTimer=null,chatTimer=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function esc(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1400)}
async function api(action,opts={}){
  const method=opts.method||'GET',params=new URLSearchParams({action,...(opts.params||{})});
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),9000);
  try{
    const r=await fetch(`${API}?${params}`,{method,headers:{'content-type':'application/json'},body:method==='POST'?JSON.stringify(opts.body||{}):undefined,signal:ctl.signal});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'Something went wrong');
    return j
  }catch(e){
    if(e?.name==='AbortError')throw new Error('Connection is taking too long. Please retry.');
    if(!navigator.onLine)throw new Error('You appear to be offline. Check your connection and retry.');
    throw e
  }finally{clearTimeout(timer)}
}
function localStats(){try{return JSON.parse(localStorage.addaStats||'{}')}catch{return {}}}
function bumpStat(k){const x=localStats();x[k]=(x[k]||0)+1;localStorage.addaStats=JSON.stringify(x)}
function getKnownCrews(){try{return JSON.parse(localStorage.addaCrews||'[]')}catch{return []}}
function rememberCrew(c){if(!c?.id)return;const list=getKnownCrews().filter(x=>x.id!==c.id);list.unshift({id:c.id,name:c.name,lastSeen:Date.now()});localStorage.addaCrews=JSON.stringify(list.slice(0,20))}
function forgetCrew(id){localStorage.addaCrews=JSON.stringify(getKnownCrews().filter(x=>x.id!==id))}
const IS_PREVIEW=location.hostname.includes('deploy-preview-')||location.hostname.includes('--project-adda-field-test');
function track(event,meta={}){bumpStat(event);if(IS_PREVIEW)return;api('track',{method:'POST',body:{crewId:crewId||'anon',participantId:pid,event,meta}}).catch(()=>{})}
function shell(inner,nav=true){return `<section class="app"><div class="view">${inner}</div>${nav?navHtml():''}</section>`}
function top(title=crew?.name||'Adda',back=''){return `<div class="top">${back?`<button class="linkbtn" onclick="window._go('${back}')">←</button>`:`<button class="brand brandBtn" onclick="window._home()">Adda</button>`}<div class="grow"><h3>${esc(title)}</h3></div>${crew?`<button class="chip chipBtn" onclick="window._go('crewSettings')">${members.length} 👥</button>`:''}</div>`}
function navHtml(){const a=x=>screen===x?'active':'';return `<nav class="nav nav5"><button class="${a('home')}" onclick="window._home()">⌂<br>Home</button><button class="${screen==='crew'?'active':''}" onclick="window._openCurrentCrew()">⚡<br>Crew</button><button class="create" onclick="window._createAction()">+</button><button class="${a('vibe')}" onclick="window._go('vibe')">✦<br>Vibe</button><button class="${a('profile')}" onclick="window._go('profile')">☺<br>Profile</button></nav>`}
window._go=s=>{screen=s;stopPolling();render()};window._tab=t=>{screen=t==='chat'?'chat':'crew';stopPolling();render()};
window._home=()=>{stopPolling();crewId='';dropId='';crew=null;members=[];drops=[];history.replaceState({},'','/');screen='home';render()};
window._openCurrentCrew=()=>{if(crewId&&crew){screen='crew';render()}else{const first=getKnownCrews()[0];if(first)window._openKnownCrew(first.id);else{screen='start';render()}}};
window._createAction=()=>{if(crewId&&crew){screen='create';render()}else{screen='start';render()}};
window._openKnownCrew=id=>{crewId=id;dropId='';history.replaceState({},'',`/?crew=${id}`);screen='boot';boot()};
function stopPolling(){clearTimeout(pollTimer);clearTimeout(chatTimer)}
function schedulePoll(kind,fn,ms){
  const hiddenDelay=Math.max(ms,30000);
  const runner=async()=>{if(document.hidden){schedulePoll(kind,fn,hiddenDelay);return}try{await fn()}catch(e){console.warn('sync',e?.message||e)}};
  if(kind==='chat'){clearTimeout(chatTimer);chatTimer=setTimeout(runner,ms)}else{clearTimeout(pollTimer);pollTimer=setTimeout(runner,ms)}
}
function chatSeenKey(){return 'addaChatSeen_'+crewId}
function hasUnreadChat(){const seen=localStorage.getItem(chatSeenKey())||'';return !!(crew?.latestChatAt&&crew.latestChatAt>seen)}
function markChatSeen(){if(crew?.latestChatAt)localStorage.setItem(chatSeenKey(),crew.latestChatAt)}
function avatarHtml(name='?'){const initial=esc(String(name).trim().charAt(0).toUpperCase()||'?');return `<span class="avatar">${initial}</span>`}
function closeShare(){document.querySelector('.shareOverlay')?.remove()}
function fallbackShare(url,text){
  closeShare();
  const el=document.createElement('div');el.className='shareOverlay';
  const wa='https://wa.me/?text='+encodeURIComponent(text+' '+url);
  const tg='https://t.me/share/url?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(text);
  const mail='mailto:?subject='+encodeURIComponent('Adda')+'&body='+encodeURIComponent(text+'\n\n'+url);
  el.innerHTML=`<div class="shareSheet"><div class="sheetHandle"></div><div class="row between"><h2>Share</h2><button class="sheetClose" onclick="closeShare()">×</button></div><div class="shareApps"><a href="${wa}" target="_blank"><span>🟢</span><b>WhatsApp</b></a><a href="${tg}" target="_blank"><span>✈️</span><b>Telegram</b></a><a href="${mail}"><span>✉️</span><b>Email</b></a><button onclick="navigator.clipboard?.writeText('${url.replace(/'/g,"\\'")}').then(()=>{toast('Link copied');closeShare()})"><span>🔗</span><b>Copy link</b></button></div><p class="sub">On supported phones, <b>More apps</b> opens your system share sheet — including apps such as Instagram when available.</p>${navigator.share?`<div class="sp12"></div><button class="btn primary" onclick="navigator.share({title:'Adda',text:'${text.replace(/'/g,"\\'")}',url:'${url.replace(/'/g,"\\'")}'})">More apps</button>`:''}</div>`;
  el.addEventListener('click',e=>{if(e.target===el)closeShare()});document.body.appendChild(el)
}
async function share(url,text='Join my Adda Crew 👀'){
  if(navigator.share){try{await navigator.share({title:'Adda',text,url});return}catch(e){if(e?.name==='AbortError')return}}
  fallbackShare(url,text)
}
window.closeShare=closeShare;
window._shareCrew=()=>share(`${location.origin}/?crew=${crewId}`,`Join ${crew.name} on Adda 👀`);
window._shareDrop=(id)=>share(`${location.origin}/?crew=${crewId}&drop=${id}`,`Answer this Drop in ${crew.name} 👀`);

async function boot(){try{
 if(!crewId){screen=getKnownCrews().length?'home':'start';render();return}
 const c=await api('getCrew',{params:{crewId}});crew=c.crew;members=c.members;
 const member=members.find(m=>m.id===pid);
 if(!member){screen=dropId?'joinDrop':'join';render();return}
 meName=member.nickname;localStorage.addaName=meName;rememberCrew(crew);
 if(dropId){screen='drop';render();return}
 screen='crew';render();
}catch(e){screen='notfound';render(e.message)}}

function render(err=''){stopPolling();
 if(screen==='home')return renderHome();
 if(screen==='profile')return renderProfile();
 if(screen==='vibe')return renderVibe();
 if(screen==='crewSettings')return renderCrewSettings();
 if(screen==='recap')return renderRecap();
 if(screen==='chat')return renderChat();
 if(screen==='start')return renderStart();
 if(screen==='join')return renderJoin();
 if(screen==='joinDrop')return renderJoinDrop();
 if(screen==='notfound')return app.innerHTML=shell(`<div class="empty"><div><div style="font-size:42px">↻</div><h1>Couldn’t load Adda</h1><p class="sub" style="margin-top:8px">${esc(err||'The connection may be slow. Try again.')}</p><div class="sp18"></div><button class="btn primary" onclick="boot()">Retry</button><div class="sp12"></div><button class="btn ghost" onclick="location.href='/'">Go Home</button></div></div>`,false);
 if(screen==='crew')return renderCrew();
 if(screen==='create')return renderCreate();
 if(screen==='drop')return renderDrop();
}
function renderHome(){
  const crews=getKnownCrews();
  const stats=localStats();
  app.innerHTML=shell(`<div class="homeHero"><div><div class="tiny">YOUR ADDA</div><h1>${meName?`Hey ${esc(meName)} 👋`:'Your people, one place.'}</h1><p class="sub" style="margin-top:6px">Jump back into a Crew or start a new one.</p></div><button class="profileOrb" onclick="window._go('profile')">☺</button></div><div class="sp18"></div><div class="row between"><h2>Your Crews</h2><button class="chip chipBtn" onclick="window._newCrew()">+ New Crew</button></div><div class="sp12"></div>${crews.length?`<div class="crewGrid">${crews.map(c=>`<button class="crewTile" onclick="window._openKnownCrew('${c.id}')"><div class="crewEmoji">👥</div><b>${esc(c.name)}</b><span>Open Crew →</span></button>`).join('')}</div>`:`<div class="card center"><h2>No Crews yet</h2><p class="sub" style="margin-top:6px">Start with one group you already talk to.</p></div>`}<div class="sp18"></div><div class="homeModules"><button onclick="window._go('vibe')"><span>✦</span><b>Your Vibe</b><small>${stats.response_submitted||0} answers so far</small></button><button onclick="window._go('profile')"><span>☺</span><b>Profile</b><small>Crews & settings</small></button></div>`)
}
window._newCrew=()=>{crewId='';dropId='';crew=null;members=[];drops=[];history.replaceState({},'','/');screen='start';render()};

function renderProfile(){
  const crews=getKnownCrews(),stats=localStats();
  app.innerHTML=shell(`${top('Profile','home')}<div class="profileCard"><div class="profileBig">☺</div><h1>${esc(meName||'You')}</h1><p class="sub">${crews.length} Crew${crews.length===1?'':'s'} · ${stats.response_submitted||0} answers · ${stats.drop_created||0} Drops made</p></div><div class="sp18"></div><button class="btn primary" onclick="window._newCrew()">Start another Crew</button><div class="sp12"></div><div class="card"><h3>Your Crews</h3><div class="sp12"></div>${crews.length?crews.map(c=>`<button class="settingsRow" onclick="window._openKnownCrew('${c.id}')"><span>👥 ${esc(c.name)}</span><b>›</b></button>`).join(''):'<p class="sub">No Crews yet.</p>'}</div>`)
}

async function renderVibe(){
  const stats=localStats();
  if(crewId&&crew){await refreshCrew();await refreshDrops()}
  const made=stats.drop_created||0,answered=stats.response_submitted||0,chatted=stats.chat_message_sent||0;
  const badges=[];if(made)badges.push('⚡ Drop Maker');if(answered>=2)badges.push('🎯 Responder');if(chatted>=2)badges.push('💬 Chatty');if(getKnownCrews().length>=2)badges.push('👥 Multi-Crew');
  const topType=drops.length?Object.entries(drops.reduce((a,d)=>(a[d.type]=(a[d.type]||0)+1,a),{})).sort((a,b)=>b[1]-a[1])[0]?.[0]:null;
  app.innerHTML=shell(`${top(crew?`${crew.name} Vibe`:'Your Vibe','home')}<div class="vibeHero"><span>✦ VIBE</span><h1>${crew?esc(crew.name):'Your Adda energy'}</h1><p>${crew?`${members.length} people · ${drops.length} Drops`:`Built from what you actually do — not a personality test.`}</p></div><div class="sp12"></div><div class="statGrid"><div><b>${answered}</b><span>Answers</span></div><div><b>${made}</b><span>Drops made</span></div><div><b>${chatted}</b><span>Chats sent</span></div></div><div class="sp12"></div><div class="card"><h3>Badges</h3><div class="badgeWrap">${badges.length?badges.map(b=>`<span class="vibeBadge">${b}</span>`).join(''):'<span class="sub">Use Adda a little more and your Vibe will build.</span>'}</div>${topType?`<p class="sub" style="margin-top:12px">Crew favorite so far: <b>${labelType(topType)}</b></p>`:''}</div>`)
}

async function renderCrewSettings(){
  if(!crewId||!crew){return window._home()}
  await refreshCrew();const admin=crew.createdBy===pid;
  app.innerHTML=shell(`${top('Crew settings','crew')}<div class="card"><div class="row between"><div><div class="tiny">CREW</div><h2>${esc(crew.name)}</h2></div><span class="chip">${admin?'Admin':'Member'}</span></div>${admin?`<div class="sp12"></div><div class="field"><label>Rename Crew</label><div class="row"><input id="renameCrew" value="${esc(crew.name)}"><button class="miniPrimary" onclick="window._renameCrew()">Save</button></div></div>`:''}</div><div class="sp12"></div><div class="card"><div class="row between"><h3>Members</h3><span class="chip">${members.length}</span></div><div class="sp12"></div>${members.map(m=>`<div class="settingsRow memberRow"><span class="memberName">${avatarHtml(m.nickname)}<span>${esc(m.nickname)}${m.id===crew.createdBy?' · Admin':''}</span></span>${admin&&m.id!==pid?`<button class="dangerMini" onclick="window._removeMember('${m.id}')">Remove</button>`:''}</div>`).join('')}</div><div class="sp12"></div><button class="btn ghost" onclick="window._shareCrew()">Share Crew invite</button><div class="sp12"></div>${admin?`<button class="btn dangerBtn" onclick="window._deleteCrew()">Delete Crew</button>`:`<button class="btn dangerBtn" onclick="window._leaveCrew()">Leave Crew</button>`}`)
}
window._renameCrew=async()=>{const name=$('#renameCrew')?.value.trim();if(!name)return;try{const j=await api('renameCrew',{method:'POST',body:{crewId,participantId:pid,name}});crew=j.crew;rememberCrew(crew);toast('Crew renamed');renderCrewSettings()}catch(e){toast(e.message)}};
window._removeMember=async targetId=>{if(!confirm('Remove this member from the Crew?'))return;try{await api('removeMember',{method:'POST',body:{crewId,participantId:pid,targetId}});await refreshCrew();renderCrewSettings()}catch(e){toast(e.message)}};
window._leaveCrew=async()=>{if(!confirm('Leave this Crew?'))return;try{await api('leaveCrew',{method:'POST',body:{crewId,participantId:pid}});forgetCrew(crewId);window._home()}catch(e){toast(e.message)}};
window._deleteCrew=async()=>{if(!confirm('Delete this Crew and all its activity?'))return;try{await api('deleteCrew',{method:'POST',body:{crewId,participantId:pid}});forgetCrew(crewId);window._home()}catch(e){toast(e.message)}};


async function renderRecap(){
  if(!crewId||!crew)return window._home();
  await refreshCrew();await refreshDrops();
  const responses=drops.reduce((n,d)=>n+(d.responseCount||0),0);
  const ready=drops.filter(d=>d.revealed||d.type==='short').length;
  const counts=drops.reduce((a,d)=>(a[d.type]=(a[d.type]||0)+1,a),{});
  const topType=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const topDrop=[...drops].sort((a,b)=>(b.responseCount||0)-(a.responseCount||0))[0];
  app.innerHTML=shell(`${top('Weekly Recap','crew')}<div class="recapHero"><span>THIS CREW</span><h1>${esc(crew.name)}</h1><p>A lightweight recap built from real activity.</p></div><div class="sp12"></div><div class="statGrid"><div><b>${drops.length}</b><span>Drops</span></div><div><b>${responses}</b><span>Answers</span></div><div><b>${members.length}</b><span>People</span></div></div><div class="sp12"></div><div class="card"><h3>Highlights</h3><div class="sp12"></div><div class="recapLine"><span>✨</span><div><b>${ready} active result${ready===1?'':'s'}</b><small>revealed or live</small></div></div>${topType?`<div class="recapLine"><span>⚡</span><div><b>${labelType(topType)}</b><small>most-used format</small></div></div>`:''}${topDrop?`<div class="recapLine"><span>🔥</span><div><b>${esc(topDrop.question)}</b><small>${topDrop.responseCount||0} responses</small></div></div>`:''}</div><div class="sp12"></div><button class="btn primary" onclick="window._shareCrew()">Bring someone into the Crew</button>`)
}

function renderStart(){app.innerHTML=shell(`<div class="hero"><span class="chip darkchip">YOUR PRIVATE CIRCLE</span><div class="sp18"></div><h1>Start with your people.</h1><p style="color:#cbc5d2;margin-top:9px">A Crew is your private friend group on Adda.</p></div><div class="sp18"></div><div class="card"><div class="field"><label>Your name</label><input id="name" maxlength="24" placeholder="e.g. Vijyant"></div><div class="sp12"></div><div class="field"><label>Name your Crew</label><input id="crewName" maxlength="42" placeholder="e.g. Weekend Crew"></div><div class="sp18"></div><button class="btn primary" onclick="window._createCrew()">Start Crew</button></div>`,false)}
window._createCrew=async()=>{const nickname=$('#name').value.trim(),name=$('#crewName').value.trim();if(!nickname||!name)return toast('Add your name and Crew name');try{const j=await api('createCrew',{method:'POST',body:{nickname,name,participantId:pid}});crewId=j.crew.id;crew=j.crew;meName=nickname;localStorage.addaName=nickname;rememberCrew(crew);history.replaceState({},'',`/?crew=${crewId}`);track('crew_created');await refreshCrew();screen='crew';render()}catch(e){toast(e.message)}};
function renderJoin(){app.innerHTML=shell(`${top(crew?.name||'Join Crew')}<div class="hero"><span class="chip darkchip">INVITE ONLY</span><div class="sp18"></div><h1>${esc(crew.name)}</h1><p style="color:#cbc5d2;margin-top:8px">${members.length} friends are here.</p></div><div class="sp18"></div><div class="card"><div class="field"><label>What should your Crew call you?</label><input id="joinName" maxlength="24" value="${esc(meName)}" placeholder="Your name"></div><div class="sp18"></div><button class="btn primary" onclick="window._joinCrew()">Join Crew</button></div>`,false)}
window._joinCrew=async()=>{const nickname=$('#joinName').value.trim();if(!nickname)return toast('Add your name');try{await api('joinCrew',{method:'POST',body:{crewId,nickname,participantId:pid}});meName=nickname;localStorage.addaName=nickname;track('crew_joined');await refreshCrew();rememberCrew(crew);screen=dropId?'drop':'crew';render()}catch(e){toast(e.message)}};
async function renderJoinDrop(){
  let j;try{j=await api('getDrop',{params:{crewId,dropId,participantId:pid}})}catch(e){screen='notfound';return render(e.message)}
  const d=j.drop;activeDropType=d.type;
  const answerUi=d.type==='short'
    ? `<div class="field"><label>Your answer</label><input id="guestShort" maxlength="160" placeholder="Type a short reply…"></div>`
    : d.options.map(o=>`<button data-answer="${o.id}" class="choice ${guestAnswer===o.id?'selected':''}" aria-pressed="${guestAnswer===o.id}" onclick="window._selectGuest('${o.id}')"><span>${esc(o.label)}</span></button>`).join('');
  app.innerHTML=shell(`${top(crew?.name||'Adda')}<div class="tiny">${labelType(d.type).toUpperCase()}</div><h1 style="margin-top:5px">${esc(d.question)}</h1><div class="sp12"></div>${answerUi}<div class="sp12"></div><div class="field"><label>Your name</label><input id="guestName" maxlength="24" value="${esc(meName)}" placeholder="What should friends call you?"></div><div class="sp18"></div><button id="guestSubmit" class="btn primary" style="font-size:18px" onclick="window._answerAndJoin()" ${d.type!=='short'&&!guestAnswer?'disabled style="opacity:.45;font-size:18px"':''}>Answer →</button><p class="sub center" style="margin-top:9px">Answering adds you to ${esc(crew.name)}.</p>`,false)
}
window._selectGuest=id=>{guestAnswer=id;document.querySelectorAll('.choice').forEach(el=>{const on=el.dataset.answer===id;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',on?'true':'false')});const b=$('#guestSubmit');if(b){b.disabled=false;b.style.opacity='1'}};
window._answerAndJoin=async()=>{const nickname=$('#guestName')?.value.trim();if(!nickname)return toast('Add your name');const answer=activeDropType==='short'?$('#guestShort')?.value.trim():guestAnswer;if(!answer)return toast('Add your answer');try{await api('joinCrew',{method:'POST',body:{crewId,nickname,participantId:pid}});meName=nickname;localStorage.addaName=nickname;track('crew_joined_via_drop');rememberCrew(crew);await api('answerDrop',{method:'POST',body:{crewId,dropId,participantId:pid,answer}});track('response_submitted');await refreshCrew();screen='drop';render()}catch(e){toast(e.message)}};
async function refreshCrew(){const c=await api('getCrew',{params:{crewId}});crew=c.crew;members=c.members}
async function refreshDrops(){const j=await api('listDrops',{params:{crewId,participantId:pid}});drops=j.drops}
async function renderCrew(){
  clearTimeout(pollTimer);await refreshCrew();rememberCrew(crew);await refreshDrops();
  const totalResponses=drops.reduce((n,d)=>n+(d.responseCount||0),0);
  app.innerHTML=shell(`${top()}<div class="row between"><div><div class="tiny">YOUR CREW</div><h1>${esc(crew.name)}</h1></div><button class="chip shareChip" onclick="window._shareCrew()">↗ Invite</button></div><div class="sp12"></div><div class="crewModules"><button onclick="window._go('chat')" class="chatModule"><span class="moduleIcon">💬${hasUnreadChat()?'<i class="unreadDot"></i>':''}</span><b>Chat</b><small>${hasUnreadChat()?'New messages':'Talk here'}</small></button><button onclick="window._go('vibe')"><span>✦</span><b>Vibe</b><small>${members.length} people</small></button><button onclick="window._go('recap')"><span>✨</span><b>Recap</b><small>${totalResponses} answers</small></button><button onclick="window._go('crewSettings')"><span>⚙</span><b>Members</b><small>Manage Crew</small></button></div><div class="sp18"></div><div class="row between"><h2>Drops</h2><button class="chip chipBtn" onclick="window._go('create')">+ Create</button></div><div class="sp12"></div>${drops.length?drops.map(d=>`<button class="drop drop-${d.type}" style="width:100%;text-align:left" onclick="window._openDrop('${d.id}')"><div class="row between"><span class="chip">${labelType(d.type)}</span><span class="meta">${dropProgress(d)}</span></div><div class="q">${esc(d.question)}</div><div class="meta">${d.type==='short'?(d.responseCount?`${d.responseCount} repl${d.responseCount===1?'y':'ies'} · live`:'Be first to reply'):d.revealed?'Result ready ✨':d.myResponse?'Waiting for friends…':'Tap to answer'}</div></button>`).join(''):`<div class="empty"><div><div style="font-size:44px">⚡</div><h2 style="margin-top:8px">No Drops yet</h2><p class="sub" style="margin-top:6px">Create one, then share it. Friends join when they answer.</p><div class="sp18"></div><button class="btn primary" onclick="window._go('create')">Create first Drop</button></div></div>`}`);
  schedulePoll('poll',()=>{if(screen==='crew')return renderCrew()},20000)
}
window._openDrop=id=>{dropId=id;history.replaceState({},'',`/?crew=${crewId}&drop=${id}`);screen='drop';render()};
function labelType(t){return ({short:'💬 Quick Answer',likely:'👀 Who’s most likely',either:'⚖️ This or That',vote:'🗳️ Vote',rate:'⭐ Rate',predict:'🔮 Predict'})[t]||'Drop'}
function dropProgress(d){if(d.type==='short')return d.responseCount+' repl'+(d.responseCount===1?'y':'ies');if(d.thresholdMode==='manual')return d.responseCount+' answered · creator reveal';return d.responseCount+'/'+d.threshold}
function dynamicRevealOptions(){
  const n=Math.max(1,members.length),opts=[];
  if(n===1)opts.push({mode:'count',count:2,label:'You + 1 friend'});
  else if(n===2)opts.push({mode:'everyone',count:null,label:'All 2 members'});
  else{opts.push({mode:'count',count:2,label:'Fast · 2 answers'});const majority=Math.floor(n/2)+1;if(majority>2&&majority<n)opts.push({mode:'count',count:majority,label:'Majority · '+majority});opts.push({mode:'everyone',count:null,label:'All '+n+' members'});}
  opts.push({mode:'manual',count:null,label:'Creator reveals'});return opts
}
function revealSettingsHtml(type){
  if(type==='short')return '';const opts=dynamicRevealOptions();
  let mode=window._thresholdMode||opts[0].mode,count=window._thresholdCount??opts[0].count;
  const valid=opts.some(o=>o.mode===mode&&(o.mode!=='count'||o.count===count));if(!valid){mode=opts[0].mode;count=opts[0].count;window._thresholdMode=mode;window._thresholdCount=count}
  return `<div class="sp12"></div><div class="field"><label>Reveal when…</label><div class="revealChoices">${opts.map(o=>`<button class="${mode===o.mode&&(o.mode!=='count'||count===o.count)?'on':''}" onclick="window._setReveal('${o.mode}',${o.count===null?'null':o.count})">${o.label}</button>`).join('')}</div><button class="moreSettingsBtn" onclick="window._toggleDropSettings()">⚙ More settings</button><div id="dropSettings" class="dropSettings ${window._showDropSettings?'open':''}"><label class="toggleRow"><span><b>Show who picked what</b><small>Names become visible only after reveal.</small></span><input id="showNames" type="checkbox" ${window._showNames?'checked':''} onchange="window._showNames=this.checked"></label><label class="toggleRow"><span><b>Let people change answers</b><small>Until the result is revealed.</small></span><input id="allowChange" type="checkbox" ${window._allowChange===false?'':'checked'} onchange="window._allowChange=this.checked"></label></div></div>`
}

function renderCreate(){
  const type=selected?.type||(members.length<2?'short':'likely');
  const cards=[
    ['short','💬','Quick Answer','Type a short reply'],
    ['likely','👀','Most Likely','Pick a friend'],
    ['either','⚖️','This / That','Choose between two'],
    ['vote','🗳️','Vote','Pick from options'],
    ['rate','⭐','Rate','Score it 1–5'],
    ['predict','🔮','Predict','Guess what happens']
  ];
  const settings=revealSettingsHtml(type);
  app.innerHTML=shell(`${top('Create a Drop','crew')}<div class="createHero"><div><h1>What do you want from the Crew?</h1></div><span class="sparkle">✦</span></div><div class="sp12"></div><div class="formats">${cards.map(x=>`<button data-type="${x[0]}" class="format ${type===x[0]?'on':''} ${x[0]==='likely'&&members.length<2?'locked':''}" onclick="window._type('${x[0]}')"><span class="fic">${x[1]}</span><span class="ftxt"><b>${x[2]}</b><small>${x[3]}</small></span></button>`).join('')}</div>${members.length<2?'<p class="sub" style="margin-top:7px">Most Likely unlocks after one friend joins.</p>':''}<div class="sp12"></div><div class="card createCard"><div class="field"><label>${questionLabel(type)}</label><textarea id="q" maxlength="120" placeholder="${placeholder(type)}">${esc(selected?.question||'')}</textarea></div>${extraFields(type)}${settings}<div class="sp18"></div><button class="btn primary" onclick="window._publish()">Create & share</button></div>`);
}
function questionLabel(t){if(t==='short')return 'Ask your Crew';if(t==='rate')return 'What should your Crew rate?';if(t==='predict')return 'What should they predict?';return 'What do you want to ask?'}
function placeholder(t){return t==='short'?'What’s the plan for tonight?':t==='likely'?"Who’s most likely to cancel the plan?":t==='either'?'Chai or coffee?':t==='vote'?'Where should we go this weekend?':t==='predict'?'Will we actually meet this weekend?':'Rate our last hangout'}
function extraFields(t){
  if(t==='either')return `<div class="sp12"></div><div class="row"><div class="field grow"><label>Choice 1</label><input id="a" maxlength="40" placeholder="Chai"></div><div class="field grow"><label>Choice 2</label><input id="b" maxlength="40" placeholder="Coffee"></div></div>`;
  if(t==='predict')return `<div class="sp12"></div><div class="predictNote"><b>Yes / No prediction</b><span>Use Predict for something that will actually happen later.</span></div>`;
  if(t==='vote')return `<div class="sp12"></div><div class="field"><label>Choices</label><input id="o1" maxlength="40" placeholder="Option 1"><input id="o2" maxlength="40" placeholder="Option 2"><input id="o3" maxlength="40" placeholder="Option 3 (optional)"></div>`;
  if(t==='rate'){
    const defs=window._ratingLabels||['😬 Not for me','😕 Meh','🙂 Decent','😍 Love it','🔥 Obsessed'];window._ratingLabels=defs;
    return `<div class="sp12"></div><div class="ratingPreview">${defs.map((x,i)=>`<div><b>${i+1}★</b><span>${esc(x)}</span></div>`).join('')}</div><button class="moreSettingsBtn" onclick="window._toggleRatingLabels()">✎ Edit rating labels</button><div class="dropSettings ${window._showRatingLabels?'open':''}">${defs.map((x,i)=>`<div class="field ratingEdit"><label>${i+1}★ label</label><input maxlength="28" value="${esc(x)}" oninput="window._ratingLabels[${i}]=this.value"></div>`).join('')}</div>`
  }
  return ''
}
window._type=t=>{if(t==='likely'&&members.length<2)return toast('Most Likely unlocks after one friend joins');selected={type:t,question:$('#q')?.value||''};renderCreate()};
window._setReveal=(mode,count)=>{window._thresholdMode=mode;window._thresholdCount=count;renderCreate()};
window._toggleDropSettings=()=>{window._showDropSettings=!window._showDropSettings;renderCreate()};
window._toggleRatingLabels=()=>{window._showRatingLabels=!window._showRatingLabels;renderCreate()};
window._publish=async()=>{
  const type=selected?.type||(members.length<2?'short':'likely'),question=$('#q').value.trim();
  const firstReveal=dynamicRevealOptions()[0];const body={crewId,participantId:pid,type,question,thresholdMode:window._thresholdMode||firstReveal.mode,thresholdCount:window._thresholdCount??firstReveal.count??2,showNames:window._showNames===true,allowChange:window._allowChange!==false};
  if(type==='either'){body.optionA=$('#a')?.value;body.optionB=$('#b')?.value}
  if(type==='vote'){body.options=[$('#o1')?.value,$('#o2')?.value,$('#o3')?.value]}
  if(type==='rate'){body.ratingLabels=window._ratingLabels||undefined}
  try{const j=await api('createDrop',{method:'POST',body});track('drop_created',{type});dropId=j.drop.id;history.replaceState({},'',`/?crew=${crewId}&drop=${dropId}`);screen='drop';selected=null;window._thresholdMode=null;window._thresholdCount=null;window._showNames=false;window._allowChange=true;window._showDropSettings=false;window._showRatingLabels=false;window._ratingLabels=null;render();setTimeout(()=>window._shareDrop(dropId),500)}catch(e){toast(e.message)}
};

function creatorTools(d){return d.createdBy===pid?`<button class="deleteLink" onclick="window._deleteDrop('${d.id}')">Delete Drop</button>`:''}
window._deleteDrop=async id=>{if(!confirm('Delete this Drop for everyone?'))return;try{await api('deleteDrop',{method:'POST',body:{crewId,dropId:id,participantId:pid}});track('drop_deleted',{dropId:id});dropId='';selected=null;history.replaceState({},'',`/?crew=${crewId}`);screen='crew';render();toast('Drop deleted')}catch(e){toast(e.message)}};

async function renderDrop(){
  clearTimeout(pollTimer);
  if(!crew)await refreshCrew();
  let j;try{j=await api('getDrop',{params:{crewId,dropId,participantId:pid}})}catch(e){toast(e.message);return}
  const d=j.drop;activeDropType=d.type;
  if(d.type==='short'){
    if(j.myResponse)return renderShortResult(d,j);
    app.innerHTML=shell(`${top(crew.name,'crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><h1>${esc(d.question)}</h1><p class="sub" style="margin-top:7px">${j.responsesCount?j.responsesCount+' repl'+(j.responsesCount===1?'y':'ies')+' already':'Be the first to reply'}</p><div class="sp12"></div><div class="field"><label>Your answer</label><input id="shortAnswer" maxlength="160" placeholder="Type a short reply…"></div><div class="sp18"></div><button id="submitAnswer" class="btn primary" style="font-size:18px" onclick="window._submitAnswer()">Send answer</button>`);
    return
  }
  selected=j.myResponse?.answer||selected;
  if(j.revealed&&!sessionStorage.getItem(`seen_${dropId}`)){sessionStorage.setItem(`seen_${dropId}`,'1');return revealCountdown(d,j)}
  if(j.revealed)return renderResult(d,j);
  if(j.myResponse)return renderWaiting(d,j);
  app.innerHTML=shell(`${top(crew.name,'crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><h1>${esc(d.question)}</h1><p class="sub" style="margin-top:7px">${d.thresholdMode==='manual'?j.responsesCount+' answered · creator reveal':j.responsesCount+'/'+j.threshold+' answered'}</p><div class="sp12"></div>${d.options.map(o=>`<button data-answer="${o.id}" class="choice ${selected===o.id?'selected':''}" aria-pressed="${selected===o.id}" onclick="window._select('${o.id}')">${d.type==='rate'?`<span class="ratingNum">${o.id}★</span>`:''}<span>${esc(o.label)}</span></button>`).join('')}<div class="sp12"></div><button id="submitAnswer" class="btn primary" style="font-size:18px" onclick="window._submitAnswer()" ${!selected?'disabled style="opacity:.45;font-size:18px"':''}>Submit answer</button>`)
}
window._select=id=>{selected=id;document.querySelectorAll('.choice').forEach(el=>{const on=el.dataset.answer===id;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',on?'true':'false')});const b=$('#submitAnswer');if(b){b.disabled=false;b.style.opacity='1'}};
window._submitAnswer=async()=>{const answer=activeDropType==='short'?$('#shortAnswer')?.value.trim():selected;if(!answer)return toast('Add your answer');const btn=$('#submitAnswer');if(btn){btn.disabled=true;btn.textContent='Sending…'}try{await api('answerDrop',{method:'POST',body:{crewId,dropId,participantId:pid,answer}});track('response_submitted');selected=null;app.innerHTML=shell(`${top(crew.name,'crew')}<div class="sentState"><div class="sentTick">✓</div><h1>Answer sent</h1><p class="sub">Updating the Crew…</p></div>`);setTimeout(()=>{if(screen==='drop')renderDrop()},350)}catch(e){toast(e.message);if(btn){btn.disabled=false;btn.textContent=activeDropType==='short'?'Send answer':'Submit answer'}}};
function renderWaiting(d,j){
  clearTimeout(pollTimer);
  if(d.thresholdMode==='manual'){
    const canReveal=d.createdBy===pid;
    app.innerHTML=shell(`${top(crew.name,'crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><div class="hero center"><div style="font-size:44px">⏳</div><div class="sp12"></div><h1>${j.responsesCount} answer${j.responsesCount===1?'':'s'} in</h1><p style="color:#cbc5d2;margin-top:8px">${canReveal?'Reveal whenever the moment feels right.':'The creator will reveal the result.'}</p></div><div class="sp18"></div>${canReveal?'<button class="btn primary" onclick="window._revealNow()">Reveal result now</button><div class="sp12"></div>':''}<button class="btn ghost" onclick="window._shareDrop(\'${d.id}\')">Share with friends</button>`);
    schedulePoll('poll',()=>{if(screen==='drop')return renderDrop()},8000);return
  }
  const left=Math.max(0,j.threshold-j.responsesCount);
  app.innerHTML=shell(`${top(crew.name,'crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><div class="hero center"><div style="font-size:44px">⏳</div><div class="sp12"></div><h1>Waiting for ${left} friend${left===1?'':'s'}</h1><p style="color:#cbc5d2;margin-top:8px">Your answer is in.</p><div class="sp18"></div><div class="progress"><span style="width:${Math.min(100,j.responsesCount/j.threshold*100)}%"></span></div></div><div class="sp18"></div><button class="btn primary" onclick="window._shareDrop('${d.id}')">Share with friends</button><div class="sp12"></div><button class="btn ghost" onclick="window._go('chat')">Open Crew chat</button>`);
  schedulePoll('poll',()=>{if(screen==='drop')return renderDrop()},5000)
}
window._revealNow=async()=>{try{await api('revealDrop',{method:'POST',body:{crewId,dropId,participantId:pid}});sessionStorage.removeItem(`seen_${dropId}`);renderDrop()}catch(e){toast(e.message)}};
async function revealCountdown(d,j){if(reduced)return renderResult(d,j);for(let n=3;n>=1;n--){app.innerHTML=shell(`<div class="hero center" style="min-height:520px;display:grid;place-items:center"><div><div class="countdown">${n}</div><h2 style="margin-top:10px">Result ready</h2></div></div>`,false);await new Promise(r=>setTimeout(r,650))}renderResult(d,j)}
function renderShortResult(d,j){clearTimeout(pollTimer);const entries=j.result?.entries||[];app.innerHTML=shell(`${top(crew.name,'crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><div class="questionHero"><span>💬 LIVE ANSWERS</span><h1>${esc(d.question)}</h1><p>${entries.length} repl${entries.length===1?'y':'ies'} so far</p></div><div class="sp12"></div><div class="answerStack">${entries.map(r=>`<div class="answerCard"><b>${esc(r.nickname)}</b><p>${esc(r.answer)}</p></div>`).join('')}</div><div class="sp12"></div><button class="btn primary" onclick="window._shareDrop('${d.id}')">Share with friends</button>`);schedulePoll('poll',()=>{if(screen==='drop')return renderDrop()},8000)}
function resultInsights(d,j,byId){
  const ranked=j.result?.ranked||[],total=j.result?.total||0,out=[];
  const first=ranked[0],second=ranked[1];
  if(first&&first.count===total&&total>1)out.push({icon:'🤝',title:'Full consensus',text:`Everyone picked ${byId[first.answer]||first.answer}.`});
  else if(first&&second&&first.count===second.count)out.push({icon:'⚖️',title:'Split Crew',text:'The top choices are tied.'});
  else if(first&&second&&first.count-second.count===1)out.push({icon:'🔥',title:'Close call',text:'Only one answer separates the top two.'});
  if(j.myResponse){
    const mine=ranked.find(r=>String(r.answer)===String(j.myResponse.answer));
    const matches=Math.max(0,(mine?.count||1)-1);
    out.push({icon:'👀',title:'Your match',text:matches?`You matched ${matches} friend${matches===1?'':'s'}.`:'You went your own way.'});
  }
  if(d.showNames&&Array.isArray(j.voters)&&d.type==='likely'){
    const selfVotes=j.voters.filter(v=>String(v.participantId)===String(v.answer));
    selfVotes.slice(0,2).forEach(v=>out.push({icon:'😂',title:'Plot twist',text:`${v.nickname} picked themselves.`}));
  }
  if(!out.length&&first)out.push({icon:'✨',title:'Crew pick',text:`${first.count} of ${total} chose ${byId[first.answer]||first.answer}.`});
  return out.slice(0,3)
}
function renderResult(d,j){
  const byId=Object.fromEntries(d.options.map(o=>[o.id,o.label])),first=j.result?.ranked?.[0],pct=first?Math.round(first.count/j.result.total*100):0,insights=resultInsights(d,j,byId);
  const named=d.showNames&&j.voters?.length?`<div class="card"><h3>Who picked what</h3><div class="sp12"></div>${j.voters.map(v=>`<div class="settingsRow"><span>${esc(v.nickname)}</span><b>${esc(byId[v.answer]||v.answer)}</b></div>`).join('')}</div><div class="sp12"></div>`:'';
  app.innerHTML=shell(`${topbarResult()}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><div class="hero center"><div style="font-size:44px">✨</div><div class="sp12"></div><div class="resultNum">${pct}%</div><h1>${esc(byId[first?.answer]||'Result')}</h1><p style="color:#cbc5d2;margin-top:8px">${esc(d.question)}</p></div><div class="sp12"></div><div class="insightGrid">${insights.map(x=>`<div class="insight"><span>${x.icon}</span><div><b>${esc(x.title)}</b><p>${esc(x.text)}</p></div></div>`).join('')}</div><div class="sp12"></div>${j.result.ranked.map(r=>`<div class="resultRow"><div><b>${esc(byId[r.answer]||r.answer)}</b><small>${Math.round(r.count/j.result.total*100)}%</small></div><strong>${r.count}</strong></div>`).join('')}<div class="sp12"></div>${named}<button class="btn primary" onclick="window._shareDrop('${d.id}')">Share result</button><div class="sp12"></div><button class="btn ghost" onclick="window._go('create')">Make the next Drop</button>`)
}
function topbarResult(){return `<div class="top"><button class="linkbtn" onclick="window._go('crew')">←</button><div class="grow"><h3>${esc(crew.name)}</h3></div><span class="chip">Result</span></div>`}

function chatHtml(messages){return messages.length?messages.map(m=>`<div class="msg ${m.participantId===pid?'me':''}"><div class="who">${esc(m.nickname)}</div>${esc(m.text)}</div>`).join(''):`<div class="empty"><div><div style="font-size:40px">💬</div><h3>Start the chat</h3><p class="sub" style="margin-top:5px">Only your Crew can see this.</p></div></div>`}
async function refreshChatMessages(){try{const j=await api('chatList',{params:{crewId}});const box=$('#chat');if(!box)return;const nearBottom=box.scrollHeight-box.scrollTop-box.clientHeight<80;box.innerHTML=chatHtml(j.messages);const last=j.messages?.[j.messages.length-1];if(last?.createdAt)localStorage.setItem(chatSeenKey(),last.createdAt);if(nearBottom)box.scrollTop=box.scrollHeight}catch{}}
async function pollChat(){if(screen!=='chat')return;await refreshChatMessages();schedulePoll('chat',pollChat,6000)}
async function renderChat(){
  clearTimeout(chatTimer);await refreshCrew();const j=await api('chatList',{params:{crewId}});
  const emojis=['😂','😭','🔥','👀','❤️','🤣','😍','😎','🤡','💀','🙄','😤','🥳','🤝','👍','👎','🍻','☕','🏏','🎉','🤔','😴','😈','✨'];
  app.innerHTML=shell(`${top(crew.name,'crew')}<div class="row between"><div><div class="tiny">CREW CHAT</div><h1>Chat</h1></div><span class="chip">${members.length} people</span></div><div class="sp12"></div><div id="chat" class="chat">${chatHtml(j.messages)}</div><div class="composer"><button class="emojiToggle" onclick="window._toggleEmoji()">😀</button><input id="chatInput" maxlength="240" placeholder="Message your Crew…" onkeydown="if(event.key==='Enter')window._sendChat()"><button onclick="window._sendChat()">Send</button></div><div id="emojiPicker" class="emojiPicker">${emojis.map(e=>`<button onclick="window._emoji('${e}')">${e}</button>`).join('')}</div>`);
  const box=$('#chat');if(box)box.scrollTop=box.scrollHeight;markChatSeen();
  schedulePoll('chat',pollChat,6000)
}
window._toggleEmoji=()=>{$('#emojiPicker')?.classList.toggle('open');$('#chatInput')?.focus()};
window._emoji=x=>{const i=$('#chatInput');if(!i)return;const start=i.selectionStart??i.value.length,end=i.selectionEnd??i.value.length;i.value=i.value.slice(0,start)+x+i.value.slice(end);i.focus();i.selectionStart=i.selectionEnd=start+x.length};
window._quick=window._emoji;
window._sendChat=async()=>{const i=$('#chatInput');const text=i?.value.trim();if(!text)return;try{const j=await api('chatSend',{method:'POST',body:{crewId,participantId:pid,text}});track('chat_message_sent');if(j.latestChatAt){crew.latestChatAt=j.latestChatAt;localStorage.setItem(chatSeenKey(),j.latestChatAt)}i.value='';await refreshChatMessages();i.focus()}catch(e){toast(e.message)}};



boot();
