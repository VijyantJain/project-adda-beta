import { createStarterController } from './starter.js';
import { createPersonalGuide } from './personal-guide.js';
const $=s=>document.querySelector(s);const app=document.getElementById('app');
const API='/api';
const qs=new URLSearchParams(location.search);let crewId=qs.get('crew')||'';let dropId=qs.get('drop')||'';let profileId=qs.get('profile')||'';const playFirstFive=qs.get('play')==='1';
const pid=localStorage.addaPid||(`p_${crypto.randomUUID().replace(/-/g,'').slice(0,10)}`);localStorage.addaPid=pid;
const sid=sessionStorage.addaSid||(`s_${crypto.randomUUID().replace(/-/g,'').slice(0,14)}`);sessionStorage.addaSid=sid;
const firstLocalSeen=localStorage.addaFirstSeen||new Date().toISOString();const returningLocal=!!localStorage.addaFirstSeen;localStorage.addaFirstSeen=firstLocalSeen;
let meName=localStorage.addaName||'';
const journeyKey='addaJourneyV073_'+pid;
function loadJourney(){try{return JSON.parse(localStorage.getItem(journeyKey)||'null')}catch{return null}}
let journey=loadJourney();
function saveJourney(next){journey=next;if(next)localStorage.setItem(journeyKey,JSON.stringify(next));else localStorage.removeItem(journeyKey)}
const initialInviteKind=dropId?'drop_invite':crewId?'crew_invite':'direct';let crew=null,members=[],drops=[],screen='boot',tab='drops',selected=null,guestAnswer=null,activeDropType='',pollTimer=null,chatTimer=null,pendingInvite=null;
function needsFirstJourney(){return localStorage.addaStarterFinished!=='1'&&!getKnownCrews().length&&!meName}

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
function track(event,meta={}){bumpStat(event);api('track',{method:'POST',body:{crewId:crewId||'anon',dropId:dropId||meta?.dropId||'',participantId:pid,sessionId:sid,event,meta}}).catch(()=>{})}
function clientFacts(){
  const nav=performance.getEntriesByType?.('navigation')?.[0],conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection||{};
  return {
    platform:navigator.userAgentData?.platform||navigator.platform||'',language:navigator.language||'',languages:navigator.languages||[],
    timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||'',
    viewport:{width:innerWidth,height:innerHeight},screen:{width:screen.width,height:screen.height,dpr:devicePixelRatio||1},
    touchPoints:navigator.maxTouchPoints||0,hardwareConcurrency:navigator.hardwareConcurrency||0,deviceMemory:navigator.deviceMemory||0,
    connection:{effectiveType:conn.effectiveType||'',downlink:conn.downlink||0,rtt:conn.rtt||0,saveData:!!conn.saveData},
    displayMode:matchMedia('(display-mode: standalone)').matches?'standalone':'browser',
    colorScheme:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light',reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,
    performance:nav?{duration:nav.duration||0,domContentLoaded:(nav.domContentLoadedEventEnd||0),loadEvent:(nav.loadEventEnd||0),ttfb:(nav.responseStart||0)}:{}
  }
}
function analyticsSource(){
  const u=new URLSearchParams(location.search);
  return {source:u.get('utm_source')||u.get('source')||'',medium:u.get('utm_medium')||'',campaign:u.get('utm_campaign')||''}
}
function sendVisitAnalytics(){
  if(location.pathname.includes('analytics.html'))return;
  const src=analyticsSource();
  api('analyticsVisit',{method:'POST',body:{participantId:pid,sessionId:sid,crewId,dropId,path:location.pathname,referrer:document.referrer||'',source:src.source,medium:src.medium,campaign:src.campaign,firstLocalSeen,returningLocal,knownCrewCount:getKnownCrews().length,client:clientFacts()}}).catch(()=>{})
}
window.addEventListener('load',()=>setTimeout(sendVisitAnalytics,250),{once:true});
window.addEventListener('error',e=>track('client_error',{message:String(e.message||'').slice(0,180),source:String(e.filename||'').slice(0,120),line:e.lineno||0,column:e.colno||0}),true);
window.addEventListener('unhandledrejection',e=>track('client_error',{message:String(e.reason?.message||e.reason||'Unhandled rejection').slice(0,180),kind:'promise'}));
function brandLogo(cls='brandLogo'){return `<img class="${cls}" src="/adda-logo.svg" alt="Adda">`}
function navIcon(name){
  const icons={
    home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-5v-6h-5v6h-5A1.5 1.5 0 0 1 3 19.5z"/></svg>',
    crew:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="9" r="3"/><circle cx="16.5" cy="8" r="2.5"/><path d="M2.5 19c.4-4 2.5-6 5.5-6s5.1 2 5.5 6"/><path d="M13.5 18.5c.4-3.1 2-4.8 4.5-4.8 2.1 0 3.4 1.2 3.8 3.8"/></svg>',
    vibe:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5 14.2 8l5.3 2.2-5.3 2.2L12 18l-2.2-5.6-5.3-2.2L9.8 8z"/><path d="m18.3 15.2.9 2.2 2.3.9-2.3 1-.9 2.2-.9-2.2-2.3-1 2.3-.9z"/></svg>',
    profile:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21c.6-4.5 3.2-7 7.5-7s6.9 2.5 7.5 7"/></svg>'
  };return icons[name]||''
}
function shell(inner,nav=true){return `<section class="app"><div class="view">${inner}</div>${nav?navHtml():''}</section>`}
function top(title='',back=''){
  return `<header class="appStickyHeader ${title?'hasContext':'compact'}">
    <div class="appTopRow"><button class="appBrand" onclick="window._home()">${brandLogo()}</button></div>
    ${title?`<div class="appContextRow">${back?`<button class="contextBack" onclick="window._go('${back}')">←</button>`:''}<h3>${esc(title)}</h3></div>`:''}
  </header><div class="appHeaderSpacer ${title?'context':''}" aria-hidden="true"></div>`
}
function homeStickyHeader(){
  return `<header class="homeStickyHeader">
    <div class="appTopRow"><button class="appBrand" onclick="window._home()">${brandLogo()}</button></div>
    <div class="homeGreeting"><h1>${meName?`Hey ${esc(meName)} 👋`:'Hey 👋'}</h1><span>Your people, one place.</span></div>
  </header><div class="homeHeaderSpacer" aria-hidden="true"></div>`
}
function matesLabel(n=members.length){return `${n} ${n===1?'mate':'mates'}`}
function crewStickyHeader(){
  return `<header class="crewStickyHeader">
    <div class="crewTopRow">
      <button class="crewBrand" onclick="window._home()">${brandLogo("crewBrandLogo")}</button>
      <button class="peopleCountPill" onclick="window._go('mates')" aria-label="Open Crew mates"><b>${members.length}</b><span aria-hidden="true">👥</span></button>
    </div>
    <div class="crewTitleRow">
      <button class="crewStickyName" onclick="window._openCurrentCrew()" title="${esc(crew?.name||'Crew')}">${esc(crew?.name||'Crew')}</button>
      <button class="invitePill" onclick="window._shareCrew()">↗ Invite</button>
    </div>
  </header><div class="crewHeaderSpacer" aria-hidden="true"></div>`
}
function navHtml(){const a=x=>screen===x?'active':'';return `<nav class="nav nav5"><button aria-label="Home" title="Home" class="${a('home')}" onclick="window._home()">${navIcon('home')}</button><button aria-label="Crew" title="Crew" class="${screen==='crew'||screen==='soloCrewTour'?'active':''}" onclick="window._openCurrentCrew()">${navIcon('crew')}</button><button aria-label="Create" title="Create" class="create" onclick="window._createAction()">+</button><button aria-label="Aura" title="Aura" class="${a('vibe')}" onclick="window._go('vibe')">${navIcon('vibe')}</button><button aria-label="Profile" title="Profile" class="${a('profile')}" onclick="window._go('profile')">${navIcon('profile')}</button></nav>`}
window._go=s=>{track('screen_view',{screen:s});screen=s;stopPolling();render()};window._tab=t=>{const next=t==='chat'?'chat':'crew';track('screen_view',{screen:next});screen=next;stopPolling();render()};
window._home=()=>{stopPolling();if(!getKnownCrews().length&&localStorage.addaStarterFinished!=='1'){screen='starter';renderStarter();starterController?.begin();return}crewId='';dropId='';crew=null;members=[];drops=[];pendingInvite=null;history.replaceState({},'','/');screen='home';render()};
window._openCurrentCrew=()=>{if(crewId&&crew){screen='crew';render()}else{const first=getKnownCrews()[0];if(first)window._openKnownCrew(first.id);else{screen='soloCrewTour';render()}}};
window._createAction=()=>{if(crewId&&crew){screen='create';render()}else if(!getKnownCrews().length&&localStorage.addaStarterFinished!=='1'){window._home()}else{screen='start';render()}};
window._openKnownCrew=id=>{track('crew_opened',{targetCrewId:id});crewId=id;dropId='';history.replaceState({},'',`/?crew=${id}`);screen='boot';return boot()};
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
function identityLink(id,name,{avatar=true,extra=''}={}){
  if(!id)return `<span class="identityStatic">${avatar?avatarHtml(name):''}<span>${esc(name)}${extra?esc(extra):''}</span></span>`;
  return `<button type="button" class="identityLink" onclick="event.stopPropagation();window._openUserProfile('${esc(id)}')">${avatar?avatarHtml(name):''}<span>${esc(name)}${extra?esc(extra):''}</span></button>`
}
window._openUserProfile=id=>{
  if(!id)return;
  window._profileBackScreen=screen&&screen!=='publicVibe'?screen:'crew';
  profileId=id;
  const q=new URLSearchParams();
  if(crewId)q.set('crew',crewId);
  q.set('profile',id);
  history.pushState({},'',`/?${q.toString()}`);
  track('profile_opened',{targetParticipantId:id});
  screen='publicVibe';stopPolling();render()
};
window._returnFromUserProfile=()=>{
  profileId='';
  const back=window._profileBackScreen||'crew';
  const q=new URLSearchParams();if(crewId)q.set('crew',crewId);if(dropId)q.set('drop',dropId);
  history.replaceState({},'',q.toString()?`/?${q.toString()}`:'/');
  screen=back;render()
};

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

function mediaUrl(ref){return ref?API+'?'+new URLSearchParams({action:'media',key:ref}).toString():''}
function mediaState(slot){const k='_media'+slot;window[k]=window[k]||{ref:'',preview:'',uploading:false};return window[k]}
function resetMedia(){['A','B'].forEach(slot=>{const st=mediaState(slot);if(st.preview?.startsWith('blob:'))URL.revokeObjectURL(st.preview);window['_media'+slot]={ref:'',preview:'',uploading:false}})}
async function imageToDataUrl(file){
  if(!file?.type?.startsWith('image/'))throw new Error('Choose an image file.');
  const src=URL.createObjectURL(file),img=new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Could not read that image.'));img.src=src});
  const max=1100,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
  canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(src);
  let out=canvas.toDataURL('image/webp',.76);if(!out.startsWith('data:image/webp'))out=canvas.toDataURL('image/jpeg',.78);
  if(out.length>900000)out=canvas.toDataURL('image/jpeg',.62);
  return out
}
function updateMediaUi(slot){
  const st=mediaState(slot),wrap=$('#mediaWrap'+slot),status=$('#mediaStatus'+slot),img=$('#mediaPreview'+slot);
  if(img){img.src=st.preview||'';img.style.display=st.preview?'block':'none'}
  if(status)status.textContent=st.uploading?'Uploading…':st.ref?'Ready ✓':''
  wrap?.classList.toggle('hasMedia',!!st.preview)
}
window._pickMedia=async(slot,input)=>{
  const file=input?.files?.[0];if(!file)return;const st=mediaState(slot);
  if(st.preview?.startsWith('blob:'))URL.revokeObjectURL(st.preview);st.preview=URL.createObjectURL(file);st.uploading=true;st.ref='';updateMediaUi(slot);
  try{const dataUrl=await imageToDataUrl(file);const j=await api('uploadMedia',{method:'POST',body:{crewId,participantId:pid,dataUrl}});st.ref=j.mediaRef;st.uploading=false;updateMediaUi(slot)}
  catch(e){st.uploading=false;st.ref='';toast(e.message);updateMediaUi(slot)}
};
window._removeMedia=slot=>{const st=mediaState(slot);if(st.preview?.startsWith('blob:'))URL.revokeObjectURL(st.preview);window['_media'+slot]={ref:'',preview:'',uploading:false};const input=$('#mediaInput'+slot);if(input)input.value='';updateMediaUi(slot)};
function mediaPickerHtml(slot,label){
  const st=mediaState(slot);return `<div id="mediaWrap${slot}" class="mediaPickerBox ${st.preview?'hasMedia':''}"><img id="mediaPreview${slot}" class="mediaCreatePreview" src="${st.preview||''}" style="${st.preview?'':'display:none'}"><div class="mediaPickerActions"><label class="mediaAdd">📷 ${st.preview?'Change image':label}<input id="mediaInput${slot}" type="file" accept="image/*" hidden onchange="window._pickMedia('${slot}',this)"></label><button type="button" class="mediaRemove" onclick="window._removeMedia('${slot}')" style="${st.preview?'':'display:none'}">Remove</button><span id="mediaStatus${slot}" class="mediaStatus">${st.uploading?'Uploading…':st.ref?'Ready ✓':''}</span></div></div>`
}
function optionMediaRef(d,o){if(d.type!=='either')return '';return String(o.id)==='o1'?(d.mediaA||''):(d.mediaB||'')}
function choiceMarkup(d,o,current,guest=false){
  const ref=optionMediaRef(d,o),handler=guest?'window._selectGuest':'window._select';
  return `<button data-answer="${o.id}" class="choice ${ref?'choiceWithMedia ':''}${current===o.id?'selected':''}" aria-pressed="${current===o.id}" onclick="${handler}('${o.id}')">${ref?`<img class="choiceMedia" src="${mediaUrl(ref)}" alt="">`:''}${d.type==='rate'?`<span class="ratingNum">${o.id}★</span>`:''}<span class="choiceLabel">${esc(o.label)}</span></button>`
}
function dropLeadMedia(d){return d.type==='rate'&&d.mediaA?`<div class="dropMediaFrame"><img class="dropMedia" src="${mediaUrl(d.mediaA)}" alt=""></div><div class="sp12"></div>`:''}
function resultMediaRef(d,answer){if(d.type==='rate')return d.mediaA||'';if(d.type==='either')return String(answer)==='o1'?(d.mediaA||''):(d.mediaB||'');return ''}

window._editRatingLabel=(i,btn)=>{const input=$('#ratingLabel'+i);if(!input)return;const editing=!input.readOnly;document.querySelectorAll('.ratingInlineInput').forEach(x=>x.readOnly=true);document.querySelectorAll('.ratingEditBtn').forEach(x=>x.textContent='✎');if(editing){input.blur();return}input.readOnly=false;input.focus();input.select();if(btn)btn.textContent='✓'};
window._surprise=t=>{
  const bank={
    short:[['What should we actually do this weekend?'],['What is everyone craving right now?'],['One plan we should finally make?']],
    likely:[['Who’s most likely to disappear from the group chat for 3 days?'],['Who’s most likely to make everyone late?'],['Who would survive a zombie apocalypse longest?']],
    either:[['Pick one','Mountains','Beach'],['Pick one','Late-night chai','Early breakfast'],['Pick one','House party','Go out']],
    vote:[['What should we do this weekend?','Movie','Food','Road trip'],['What do we need right now?','Chai','Coffee','Sleep']],
    rate:[['Rate the Aura of this plan'],['Rate this look'],['How good is this idea?']],
    predict:[['Will this Crew actually meet this weekend?'],['Will the plan survive till Saturday?'],['Will everyone arrive on time?']]
  };
  const arr=bank[t]||bank.short,item=arr[Math.floor(Math.random()*arr.length)];const q=$('#q');if(q)q.value=item[0]||'';
  if(t==='either'){if($('#a'))$('#a').value=item[1]||'';if($('#b'))$('#b').value=item[2]||''}
  if(t==='vote'){['#o1','#o2','#o3'].forEach((id,i)=>{if($(id))$(id).value=item[i+1]||''})}
};

window._shareCrew=()=>{if(!crewId||!crew)return;track('crew_shared',{crewId});return share(`${location.origin}/?crew=${crewId}&utm_source=adda&utm_medium=share&utm_campaign=crew`,`Oye! ${crew.name} ka Adda khul gaya 😂🔥 Gang ke sawaal ready hain, ab tere legendary answers ka wait hai! Aaja dekhte hain kaun kitna shareef hai 👀`)};
window._shareDrop=(id)=>{track('drop_shared',{dropId:id});return share(`${location.origin}/?crew=${crewId}&drop=${id}&utm_source=adda&utm_medium=share&utm_campaign=drop`,`Bhai ek sawaal hai aur tera answer jaan-na zaroori hai 😂 Pehle answer kar, phir dekhte hain ${crew?.name||'gang'} ka scene 👀🔥`)};

async function boot(){try{
 if(profileId){screen='publicVibe';render();return}
 if(!crewId&&journey?.phase==='starter'){screen='starter';renderStarter();return}
 if(!crewId&&journey?.phase==='aura'){screen='vibe';render();return}
 if(!crewId){const noCrews=!getKnownCrews().length,soloPending=localStorage.getItem('addaSoloGuidePending_'+pid)==='1'&&localStorage.getItem('addaSoloGuideDone_'+pid)!=='1',legacySolo=noCrews&&localStorage.addaStarterFinished==='1'&&localStorage.getItem('addaSoloGuideDone_'+pid)!=='1'&&localStorage.getItem('addaGuideTourDone_'+pid)!=='1';screen=playFirstFive?'starter':soloPending||legacySolo?'vibe':noCrews&&localStorage.addaStarterFinished!=='1'?'starter':'home';render();return}
 const c=await api('getCrew',{params:{crewId}});crew=c.crew;members=c.members;
 let member=members.find(m=>m.id===pid);
 const firstVisit=needsFirstJourney();
 if(!member&&firstVisit){
   const guestName=meName||'New mate '+pid.slice(-4);
   const joined=await api('joinCrew',{method:'POST',body:{crewId,participantId:pid,nickname:guestName,provisional:true}});
   member=joined.member;members.push(member);
   if(!journey)saveJourney({kind:dropId?'drop_invite':'crew_invite',phase:dropId?'drop_entry':'member_intro',crewId,dropId,answers:[],startedAt:Date.now()});
   track('crew_joined',{crewId,entry:'new_invite_provisional'});
 }
 if(member?.provisional){
   pendingInvite={crewId,crewName:crew.name,dropId:journey?.dropId||dropId};
   if(!journey)saveJourney({kind:dropId?'drop_invite':'crew_invite',phase:dropId?'drop_entry':'member_intro',crewId,dropId,answers:[],startedAt:Date.now()});
   if(journey?.phase==='starter'){screen='starter';renderStarter();return}
   if(journey?.phase==='aura'){screen='vibe';render();return}
   screen=journey?.phase==='drop_entry'?'drop':'crew';await render();if(screen==='drop')setTimeout(startInvitedDropGuide,120);return;
 }
 if(!member){
   if(!firstVisit&&meName){
     const joined=await api('joinCrew',{method:'POST',body:{crewId,participantId:pid,nickname:meName,provisional:false}});member=joined.member;members.push(member);
   }else{screen=dropId?'joinDrop':'join';render();return}
 }
 meName=member.nickname;localStorage.addaName=meName;rememberCrew(crew);
 if(dropId){screen='drop';render();return}
 screen='crew';await render();
 if(!journey&&localStorage.getItem('addaGuideStarted_'+crewId)==='1'&&localStorage.getItem('addaGuideDone_'+crewId)!=='1'&&!guide.active)setTimeout(startFirstCrewGuide,220);
}catch(e){screen='notfound';render(e.message)}}

function render(err=''){stopPolling();
 if(screen==='home')return renderHome();
 if(screen==='soloCrewTour')return renderSoloCrewTour();
 if(screen==='soloCreateTour')return renderSoloCreateTour();
 if(screen==='profile')return renderProfile();
 if(screen==='mates')return renderMates();
 if(screen==='vibe')return renderVibe();
 if(screen==='publicVibe')return renderPublicVibe();
 if(screen==='crewSettings')return renderCrewSettings();
 if(screen==='recap')return renderRecap();
 if(screen==='crewInsights')return renderCrewInsights();
 if(screen==='chat')return renderChat();
 if(screen==='starter')return renderStarter();
 if(screen==='start')return renderStart();
 if(screen==='join')return renderJoin();
 if(screen==='joinDrop')return renderJoinDrop();
 if(screen==='notfound')return app.innerHTML=shell(`${top('')}<div class="empty"><div><div style="font-size:42px">↻</div><h1>Couldn’t load Adda</h1><p class="sub" style="margin-top:8px">${esc(err||'The connection may be slow. Try again.')}</p><div class="sp18"></div><button class="btn primary" onclick="boot()">Retry</button><div class="sp12"></div><button class="btn ghost" onclick="location.href='/'">Go Home</button></div></div>`,false);
 if(screen==='crew')return renderCrew();
 if(screen==='create')return renderCreate();
 if(screen==='drop')return renderDrop();
}
function renderSoloCrewTour(){app.innerHTML=shell(`${top('Crew')}<section class="card addaSoloTeach"><span class="soloTeachEyebrow">👥 YOUR PEOPLE</span><h1>Your Crew is your private circle.</h1><p>A Crew brings friends into one place. Everyone sees the same Drops; real answers unlock shared results and conversations.</p><div class="addaSoloDiagram"><span>YOU</span><b>＋</b><span>MATES</span><b>→</b><span>DROPS</span></div><p>Starting one is optional. Explore first, invite when there's a question you genuinely want answered.</p><button class="btn primary" onclick="window._newCrew()">Create my first Crew →</button><button class="btn ghost" onclick="window._home()">Not now — Home →</button></section>`)}
function renderSoloCreateTour(){app.innerHTML=shell(`${top('Create +')}<section class="card addaSoloTeach"><span class="soloTeachEyebrow">⚡ YOUR NEXT IDEA</span><h1>Turn any question into a Drop.</h1><p>Pick a format, add a question, share in a Crew when you're ready. No need to publish anything during this tour.</p><div class="addaFormatsPreview"><span>⚖️ This or That</span><span>🗳️ Vote</span><span>⭐ Rate</span><span>🔮 Predict</span><span>💬 Quick Answer</span><span>👀 Most Likely</span></div><button class="btn primary" onclick="window._newCrew()">Create a Crew when ready →</button></section>`)}
function renderHome(){
 const crews=getKnownCrews(),stats=localStats(),finished=localStorage.addaStarterFinished==='1';
 app.innerHTML=shell(`${homeStickyHeader()}
 <section class="homeWelcomeV2">
  <span class="homeRailTitle" style="color:#dfff80">⚡ ${finished?'YOUR AURA IS GROWING':'YOUR FIRST AURA RUN'}</span>
  <h2>${finished?'Your people. Your next story.':'Fun starts with one tap. 👀'}</h2>
  <p>${finished?'Open a Crew, answer something unexpected, and give your Aura another reason to grow.':'Five fast questions, tiny victories, your first trophy. No Crew required.'}</p>
  <button onclick="${finished?"window._go('vibe')":"window._startFirstFive()"}">${finished?'🏆 See my Aura & trophies →':'⚡ Play First Five →'}</button>
 </section>
 <div class="row between"><div><div class="homeRailTitle">👥 YOUR SOCIAL SPACES</div><h2>Your Crews</h2></div><button class="chip chipBtn" onclick="window._newCrew()">+ New Crew</button></div>
 <p class="sub" style="margin:8px 0 13px">Open a Crew to see what your mates are up to.</p>
 ${!crews.length&&finished?`<div class="card addaSoloNext"><h2>There’s more to Adda 💜</h2><p>Explore your Aura and make your profile yours. Start a Crew whenever you like. No invites needed to continue.</p><button class="btn primary" onclick="window._editProfile()">Make my profile →</button><button class="btn ghost" onclick="window._newCrew()">Start a Crew when ready</button></div><div class="sp12"></div>`:''}
  ${crews.length?`<div class="crewGrid">${crews.map(c=>`<button class="crewTile" onclick="window._openKnownCrew('${c.id}')"><div class="crewEmoji">👥</div><b>${esc(c.name)}</b><span>Play with your mates →</span></button>`).join('')}</div>`:`<div class="card center"><h2>No Crews yet</h2><p class="sub" style="margin-top:6px">Your Aura is already yours. When you want to play with friends, start a Crew with five ready-made Drops.</p><button class="btn primary" onclick="window._newCrew()">Start a Crew →</button></div>`}
 <div class="sp18"></div>
 <div class="homeRailTitle">✨ YOUR CORNER</div>
 <div class="homeModules">
  <button onclick="window._go('vibe')"><span>✦</span><b>Your Aura</b><small>Trophies, score & badges</small></button>
  <button onclick="window._go('profile')"><span>☺</span><b>Profile</b><small>Your identity & Crews</small></button>
 </div>
 <div class="card" style="margin-top:16px"><h3>🌍 What’s next for Adda?</h3><p class="sub" style="margin-top:7px">A personal Home feed will later bring together Crew activity, Moments and recommendations from Arena. For now, this is your private doorway into real Crews.</p></div>
 `)
}
window._newCrew=()=>{if(!getKnownCrews().length&&localStorage.addaStarterFinished!=='1'){return window._home()}crewId='';dropId='';crew=null;members=[];drops=[];history.replaceState({},'','/');screen='start';render()};

function localProfile(){try{return JSON.parse(localStorage.addaLocalProfile||'{}')}catch{return {}}}
function ownAvatar(){return localProfile().avatar||''}
function profileAvatarMarkup(){const p=localProfile();return ownAvatar()?`<img src="${ownAvatar()}" class="addaOwnAvatar" alt="Your profile photo">`:p.avatarEmoji?`<span class="addaAvatarEmoji" role="img" aria-label="Chosen avatar">${esc(p.avatarEmoji)}</span>`:'☺'}
function renderProfile(){
 const crews=getKnownCrews(),stats=localStats(),p=localProfile();
 app.innerHTML=shell(`${top('')}<div class="profileCard"><div class="profileBig">${profileAvatarMarkup()}</div>
 <h1>${esc(p.displayName||meName||'You')}</h1>${p.handleDraft?`<p class="sub">@${esc(p.handleDraft)} <small>· local draft</small></p>`:''}
 ${p.bio?`<p class="sub">${esc(p.bio)}</p>`:''}
 <p class="sub">${crews.length} Crew${crews.length===1?'':'s'} · ${stats.response_submitted||0} Crew answers · ${stats.drop_created||0} Drops made</p>
 <div class="sp12"></div><button class="btn primary" onclick="window._editProfile()">✏️ Edit my profile & photo</button></div>
 <div class="sp18"></div>
 <div class="card"><h3>💾 Save progress across devices</h3>
 ${localStorage.getItem('addaGuideAuthStatus_'+pid)==='awaiting_provider'?'<span class="chip" style="margin-top:9px;background:#fff0ce;color:#73501e">GUIDED ACCOUNT STEP · WAITING FOR REAL OTP SERVICE</span>':''}
 <p class="sub" style="margin-top:9px">Your current test profile is tied to this browser. Verified email/phone signup and a globally unique @username will arrive with the account database; they are not active in this field test.</p>
 <p class="sub" style="margin-top:7px">You can keep playing while this final account-verification mission is pending; it is NOT marked verified.</p></div>
 <div class="sp12"></div><button class="btn ghost" onclick="window._sharePublicProfile()">Share my Aura profile</button>
 <div class="sp12"></div><button class="btn ghost" onclick="window._newCrew()">${crews.length?'Start another Crew':'Start a Crew whenever you like'}</button>
 <div class="sp12"></div><button class="btn ghost" onclick="window._replayGuide()">⚡ Replay my welcome tour</button>
 <div class="sp12"></div><div class="card"><h3>Your Crews</h3><div class="sp12"></div>${crews.length?crews.map(c=>`<button class="settingsRow" onclick="window._openKnownCrew('${c.id}')"><span>👥 ${esc(c.name)}</span><b>›</b></button>`).join(''):'<p class="sub">No Crews yet.</p>'}</div>`)
}
window._replayGuide=async()=>{
 const id=crewId||getKnownCrews()[0]?.id;if(!id)return toast('Join a Crew first');
 localStorage.removeItem('addaGuideDone_'+id);localStorage.removeItem('addaGuideStarted_'+id);localStorage.removeItem('addaGuideState_'+id);
 localStorage.removeItem('addaPersonalGuideDone_'+pid);localStorage.removeItem('addaPersonalGuide_'+pid);
 guide={active:false,step:0,answers:0,lastDrop:'',originCrewId:id,tour:0};
 await window._openKnownCrew(id);
 setTimeout(startFirstCrewGuide,350);
};
window._editProfile=()=>{
 const p=localProfile();
 app.innerHTML=shell(`${top('Edit profile','profile')}<main class="card addaProfileEditor">
 <h2>Your profile 💜</h2><p class="sub">Test version: saved on this device. Photo and bio are not public or synced yet.</p>
 <div class="addaEditAvatar">${profileAvatarMarkup()}</div>
 ${!guideActive()?`<div class="addaProfileAvatarChoices"><p class="sub">Or use an avatar (change any time):</p><div class="addaAvatarTray">${['😎','🦊','🐼','👾','🦄','🤠'].map(emoji=>`<button type="button" aria-label="Choose ${emoji} avatar" onclick="window._chooseLocalAvatar('${emoji}')">${emoji}</button>`).join('')}</div></div>`:''}
 <label class="btn ghost addaPhotoPick" for="addaPhotoFile">📷 Add or change profile photo</label>
 <input id="addaPhotoFile" type="file" accept="image/*" style="position:absolute;opacity:0;width:1px;height:1px" onchange="window._localProfilePhoto(this)">
 <div class="field"><label>Display name</label><input id="addaEditName" maxlength="24" value="${esc(p.displayName||meName)}" placeholder="Your name"></div>
 <div class="field"><label>About me</label><textarea id="addaEditBio" maxlength="140" placeholder="A line your mates will recognize...">${esc(p.bio||'')}</textarea></div>
 <div class="field"><label>Username draft <small>(not globally reserved yet)</small></label><input id="addaEditHandle" maxlength="20" value="${esc(p.handleDraft||'')}" placeholder="e.g. mumbo_jain"><small class="sub">Your future @handle — availability will be checked after real signup.</small></div>
 <div class="field"><label>Your main interest</label><select id="addaEditInterest">${[['','Pick later'],['rides','Wheels & rides'],['style','Fashion & looks'],['music','Music & concerts'],['food','Food & cafés'],['travel','Travel'],['memes','Memes & chaos'],['fitness','Sports & fitness']].map(([v,l])=>`<option value="${v}" ${p.interest===v?'selected':''}>${l}</option>`).join('')}</select></div>
 <div class="field"><label>Gender (optional, private)</label><select id="addaEditGender">${[['','Prefer not to say'],['man','Man'],['woman','Woman'],['nonbinary','Nonbinary / another identity']].map(([v,l])=>`<option value="${v}" ${p.gender===v?'selected':''}>${l}</option>`).join('')}</select></div>
 <button class="btn primary addaProfileSave" onclick="window._saveLocalProfile()">Save changes</button>${guideActive()?'':'<button class="btn ghost" onclick="window._go(\'profile\')">Cancel</button>'}
 </main>`)
};
window._chooseLocalAvatar=emoji=>{if(!['😎','🦊','🐼','👾','🦄','🤠'].includes(emoji))return;const p=localProfile();p.avatar='';p.avatarEmoji=emoji;try{localStorage.addaLocalProfile=JSON.stringify(p);document.querySelector('.addaEditAvatar').innerHTML=profileAvatarMarkup();toast('Avatar saved on this device');track('profile_avatar_selected',{kind:'emoji'})}catch(e){toast('Could not save avatar')}};
window._localProfilePhoto=async el=>{
 const file=el.files?.[0];if(!file)return;
 if(file.size>8000000)return toast('Use a photo under 8 MB.');
 try{
   const image=new Image(),url=URL.createObjectURL(file);
   image.src=url;await image.decode();
   const c=document.createElement('canvas'),size=160;c.width=size;c.height=size;
   const g=c.getContext('2d'),crop=Math.min(image.naturalWidth,image.naturalHeight);
   g.drawImage(image,(image.naturalWidth-crop)/2,(image.naturalHeight-crop)/2,crop,crop,0,0,size,size);
   const avatar=c.toDataURL('image/jpeg',.68);URL.revokeObjectURL(url);
   const p=localProfile();p.avatar=avatar;p.avatarEmoji='';localStorage.addaLocalProfile=JSON.stringify(p);
   document.querySelector('.addaEditAvatar').innerHTML=profileAvatarMarkup();toast('Photo saved on this device');if(guideActive()&&guide.tour===5&&guide.profileStage===0)setTimeout(()=>profileGuideStep(1),150);
 }catch(e){toast('Could not process photo. Try JPEG or PNG.')}
};
window._skipGuidePhoto=()=>{if(guideActive()&&guide.tour===5)profileGuideStep(1)};
window._saveLocalProfile=()=>{
 const name=$('#addaEditName')?.value.trim(),bio=$('#addaEditBio')?.value.trim(),handleDraft=$('#addaEditHandle')?.value.trim().replace(/^@/,'').toLowerCase();
 if(handleDraft&&!/^[a-z][a-z0-9_.]{2,19}$/.test(handleDraft))return toast('Username draft: 3–20 letters, digits, _ or ., starting with a letter.');
 if(!name)return toast('Enter your display name');
 const p=localProfile();p.displayName=name;p.bio=bio||'';p.handleDraft=handleDraft||'';p.interest=$('#addaEditInterest')?.value||'';p.gender=$('#addaEditGender')?.value||'';
 try{localStorage.addaLocalProfile=JSON.stringify(p);meName=name;localStorage.addaName=name;track('profile_edited',{hasBio:!!p.bio,hasAvatar:!!p.avatar});screen='profile';render();toast('Profile saved on this device');guideProfileSaved(p)}
 catch(e){toast('Device storage is full. Try a smaller photo.')}
};

async function renderVibe(){
 app.innerHTML=shell(`${top('')}<section class="card addaAuraError" aria-live="polite"><h2>⚡ Loading your earned Aura…</h2><p>Checking your saved points and trophies.</p></section>`);
 let v,partial=false;
 try{
  if(!getKnownCrews().length||journey?.phase==='aura')v=await api('getAuraStarter',{params:{participantId:pid,crewId:journey?.crewId||''}});
  else try{v=await api('getVibe',{params:{participantId:pid,crewId:crewId||''}})}
  catch(fullError){partial=true;v=await api('getAuraStarter',{params:{participantId:pid}});track('aura_full_fallback',{reason:String(fullError.message||'').slice(0,90)})}
  if(v.starter?.bonusCompleted&&v.score<180)throw Error('Your Starter Aura is still syncing. Retry to load your earned points.');
 }catch(e){
  app.innerHTML=shell(`${top('')}<section class="card addaAuraError"><h1>Your Aura is still loading ⚡</h1><p>${esc(e.message||'Could not load saved Aura. Try again.')}</p><button class="btn primary" onclick="window._go('vibe')">Retry my Aura →</button></section>`);
  track('aura_load_error',{reason:String(e.message||'').slice(0,120)});return
 }
  const unlocked=(v.badges||[]).filter(b=>b.unlocked);
  const signature=v.signature?labelType(v.signature):v.starterAnswers?'Your picks are in':'Still forming';
  const rank=v.crewRank?`#${v.crewRank.rank} of ${v.crewRank.total}`:'—';
  const rankSub=v.crewRank?.crewName?`in ${esc(v.crewRank.crewName)}`:'Open a Crew to rank';
  app.innerHTML=shell(`${top('')}
    <section class="vibeIdentity">
      <div class="vibeIdentityTop"><div><span class="vibeEyebrow">YOUR AURA</span><h1>${esc(meName||'You')}</h1></div><button class="vibeShare" onclick="window._shareVibe()">↗ Flex</button></div>
      <div class="vibeLevelRow">
        <div class="vibeLevelOrb"><span>${v.level?.icon||'✨'}</span><b>${v.level?.index||1}</b></div>
        <div class="vibeLevelCopy"><small>LEVEL ${v.level?.index||1}</small><h2>${esc(v.level?.name||'Fresh')}</h2><p><b>${v.score||0}</b> Aura</p></div>
        <div class="vibeStreak"><span>🔥</span><b>${v.streak||0}</b><small>day streak</small></div>
      </div>
      <div class="vibeProgress"><i style="width:${v.progress||0}%"></i></div>
      <div class="vibeProgressCopy">${v.nextLevel?`<span>${v.pointsToNext} Aura to ${esc(v.nextLevel.name)}</span><b>${v.progress}%</b>`:'<span>Top level unlocked</span><b>100%</b>'}</div>
    </section>
    <section class="card addaAuraBreakdown"><div class="row between"><h2>Your earned Aura</h2><b>⚡ ${v.score} total</b></div>
      <p>Your Starter picks already count. No Crew needed to get started.</p>
      <div class="addaAuraSplit"><span>Starter choices & trophies</span><strong>${v.starter?.points||0}</strong><span>Guided milestones</span><strong>${v.guided?.points||0}</strong>${v.score>(v.starter?.points||0)+(v.guided?.points||0)?`<span>Actual Crew activity</span><strong>${v.score-(v.starter?.points||0)-(v.guided?.points||0)}</strong>`:""}</div>
      ${partial?'<small class="addaAuraWarning">Crew activity is temporarily unavailable. Starter points are shown; retry for the full total.</small>':''}</section>
    <section class="card addaAuraHow"><div class="soloTeachEyebrow">MAKE IT YOURS</div><h2>Build it. Earn it. Flex it. ✨</h2>
      <p>Aura grows from real participation, not scrolling. Unlock badges and levels through choices, shared Drops and meaningful activity. Start solo; build with friends when you are ready.</p>
      <div class="addaAuraActions"><span>⚡ Starter answer</span><b>+10</b><span>🏆 First Five completion</span><b>+30</b><span>👑 Tenacious completion</span><b>+50</b><span>🗳️ Crew Drop answer</span><b>+10</b><span>✍️ Create a Drop</span><b>+30</b><span>💬 Crew chat message</span><b>+4</b><span>👥 Join or create Crew</span><b>+10</b><span>↗ Recorded share action</span><b>+20*</b><span>🔥 Active-day streak</span><b>+5/day†</b></div>
      <small>* Recorded share actions are not confirmed friend joins; beta anti-farming limits remain under review. † Up to ten streak days contribute to the score. Starter and guided rewards award once.</small></section>
    ${!getKnownCrews().length?`<section class="card addaSoloNext"><h2>Your Aura starts here 💜</h2><p>You’ve earned your first trophies. Make your profile yours — no Crew needed.</p><button class="btn primary" onclick="window._editProfile()">Personalize my Aura →</button><button class="btn ghost" onclick="window._home()">Explore Adda →</button></section>`:''}

    <div class="vibeFlexGrid">
      <div class="vibeFlex"><span>🏆</span><small>Crew rank</small><b>${rank}</b><em>${rankSub}</em></div>
      <div class="vibeFlex"><span>🧬</span><small>Signature</small><b>${esc(signature)}</b><em>your most-played format</em></div>
      <div class="vibeFlex"><span>👥</span><small>Crews</small><b>${v.crews||0}</b><em>social circles</em></div>
      <div class="vibeFlex"><span>📣</span><small>Shares</small><b>${v.shares||0}</b><em>sent out</em></div>
    </div>

    <div class="vibeStatStrip">
      <div><b>${v.answers||0}</b><span>Answers</span></div>
      <div><b>${v.dropsMade||0}</b><span>Drops made</span></div>
      <div><b>${v.chatsSent||0}</b><span>Chats sent</span></div>
    </div>

    ${v.nextUnlock?`<section class="vibeNext"><div><span>🎯 NEXT UNLOCK</span><h3>${esc(v.nextUnlock.icon)} ${esc(v.nextUnlock.name)}</h3><p>${esc(v.nextUnlock.desc)}</p></div><div class="unlockMeter"><i style="width:${v.nextUnlock.progress}%"></i></div><small>${v.nextUnlock.current}/${v.nextUnlock.target}</small></section>`:''}

    <section class="vibeBadgesCard">
      <div class="row between"><div><span class="vibeEyebrow">TROPHY CASE</span><h2>Badges</h2></div><b class="badgeCount">${unlocked.length}/${(v.badges||[]).length}</b></div>
      <div class="vibeBadgeGrid">${(v.badges||[]).map(b=>`<div class="vibeAchievement ${b.unlocked?'unlocked':'locked'}"><span>${b.unlocked?b.icon:'🔒'}</span><b>${esc(b.name)}</b><small>${b.unlocked?'Unlocked':esc(b.desc)}</small></div>`).join('')}</div>
    </section>
  `)
  window._currentVibe=v;
  if((!getKnownCrews().length||journey?.phase==='aura')&&v.starter?.bonusCompleted&&localStorage.getItem('addaSoloGuideDone_'+pid)!=='1'&&localStorage.getItem('addaGuideTourDone_'+pid)!=='1'&&!soloGuidePending())localStorage.setItem('addaSoloGuidePending_'+pid,'1');
  if(soloGuidePending()&&!guide.active)setTimeout(startSoloGuide,130);
}
window._shareVibe=()=>{
  const v=window._currentVibe;if(!v)return;
  const rank=v.crewRank?` · #${v.crewRank.rank} in ${v.crewRank.crewName}`:'';
  const text=`${meName||'My'} Adda Aura: ${v.level?.icon||'✨'} ${v.level?.name||'Fresh'} · ${v.score||0} Aura · 🔥 ${v.streak||0}-day streak${rank}`;
  track('vibe_shared',{score:v.score,level:v.level?.name,streak:v.streak});
  share(`${location.origin}/?profile=${pid}&utm_source=adda&utm_medium=share&utm_campaign=vibe_profile`,text)
};
window._sharePublicProfile=()=>window._shareVibe();
async function renderPublicVibe(){
  const inApp=!!(crew&&members.some(m=>m.id===pid));
  const profileTop=inApp?`<header class="appStickyHeader hasContext"><div class="appTopRow"><button class="appBrand" onclick="window._home()">${brandLogo()}</button></div><div class="appContextRow"><button class="contextBack" onclick="window._returnFromUserProfile()">←</button><h3>Aura profile</h3></div></header><div class="appHeaderSpacer context" aria-hidden="true"></div>`:top('');
  let v;try{v=await api('getVibe',{params:{participantId:profileId}})}catch(e){return app.innerHTML=shell(`${profileTop}<div class="empty"><div><h1>Aura not found</h1><p class="sub">This profile may no longer be available.</p></div></div>`,false)}
  const unlocked=(v.badges||[]).filter(b=>b.unlocked),signature=v.signature?labelType(v.signature):'Still forming';
  app.innerHTML=shell(`${profileTop}
    <section class="publicVibeIntro"><span>PUBLIC AURA</span><h1>${esc(v.displayName||'Adda mate')}</h1><p>See the energy they have built on Adda.</p></section>
    <section class="vibeIdentity public">
      <div class="vibeLevelRow">
        <div class="vibeLevelOrb"><span>${v.level?.icon||'✨'}</span><b>${v.level?.index||1}</b></div>
        <div class="vibeLevelCopy"><small>LEVEL ${v.level?.index||1}</small><h2>${esc(v.level?.name||'Fresh')}</h2><p><b>${v.score||0}</b> Aura</p></div>
        <div class="vibeStreak"><span>🔥</span><b>${v.streak||0}</b><small>day streak</small></div>
      </div>
    </section>
    <div class="vibeFlexGrid">
      <div class="vibeFlex"><span>🧬</span><small>Signature</small><b>${esc(signature)}</b><em>most-played format</em></div>
      <div class="vibeFlex"><span>👥</span><small>Crews</small><b>${v.crews||0}</b><em>social circles</em></div>
    </div>
    <div class="vibeStatStrip"><div><b>${v.answers||0}</b><span>Answers</span></div><div><b>${v.dropsMade||0}</b><span>Drops made</span></div><div><b>${v.chatsSent||0}</b><span>Chats sent</span></div></div>
    <section class="vibeBadgesCard"><div class="row between"><div><span class="vibeEyebrow trophyLabel">TROPHY CASE</span><h2>Top badges</h2></div><b class="badgeCount">${unlocked.length}</b></div><div class="vibeBadgeGrid">${unlocked.slice(0,6).map(b=>`<div class="vibeAchievement unlocked"><span>${b.icon}</span><b>${esc(b.name)}</b><small>Unlocked</small></div>`).join('')||'<p class="sub">Still building their Aura.</p>'}</div></section>
    <div class="sp12"></div><button class="btn primary" onclick="location.href='/'">Open Adda</button>
  `,inApp)
}

function renderMates(){
 if(!crew)return window._home();
 app.innerHTML=shell(`${top('Crew mates','crew')}<section class="card"><span class="tiny">YOUR PEOPLE</span><h1>${esc(crew.name)}</h1><p class="sub">${matesLabel()} in this Crew.</p><div class="sp18"></div>${members.map(m=>`<div class="settingsRow memberRow">${identityLink(m.id,m.nickname,{avatar:true,extra:m.id===crew.createdBy?' · Admin':''})}</div>`).join('')}</section><div class="sp12"></div><button class="btn ghost" onclick="window._shareCrew()">↗ Invite mates</button>${crew.createdBy===pid?'':'<div class="sp12"></div><button class="btn dangerBtn" onclick="window._leaveCrew()">Leave this Crew</button>'}`);
}
async function renderCrewSettings(){
  if(!crewId||!crew){return window._home()}
  await refreshCrew();const admin=crew.createdBy===pid;
  if(!admin){screen='mates';return renderMates()}
  app.innerHTML=shell(`${top('Crew settings','crew')}<div class="card"><div class="row between"><div><div class="tiny">CREW</div><h2>${esc(crew.name)}</h2></div><span class="chip">${admin?'Admin':'Mate'}</span></div>${admin?`<div class="sp12"></div><div class="field"><label>Rename Crew</label><div class="row"><input id="renameCrew" value="${esc(crew.name)}"><button class="miniPrimary" onclick="window._renameCrew()">Save</button></div></div>`:''}</div><div class="sp12"></div><div class="card"><div class="row between"><h3>Crew mates</h3><span class="chip">${matesLabel()}</span></div><div class="sp12"></div>${members.map(m=>`<div class="settingsRow memberRow">${identityLink(m.id,m.nickname,{avatar:true,extra:m.id===crew.createdBy?' · Admin':''})}${admin&&m.id!==pid?`<button class="dangerMini" onclick="window._removeMember('${m.id}')">Remove</button>`:''}</div>`).join('')}</div><div class="sp12"></div><button class="btn ghost" onclick="window._shareCrew()">Share Crew invite</button><div class="sp12"></div>${admin?`<button class="btn ghost" onclick="window._go('crewInsights')">Field-test insights</button><div class="sp12"></div><button class="btn dangerBtn" onclick="window._deleteCrew()">Delete Crew</button>`:`<button class="btn dangerBtn" onclick="window._leaveCrew()">Leave Crew</button>`}`)
}
window._renameCrew=async()=>{const name=$('#renameCrew')?.value.trim();if(!name)return;try{const j=await api('renameCrew',{method:'POST',body:{crewId,participantId:pid,name}});crew=j.crew;rememberCrew(crew);toast('Crew renamed');renderCrewSettings()}catch(e){toast(e.message)}};
window._removeMember=async targetId=>{if(!confirm('Remove this mate from the Crew?'))return;try{await api('removeMember',{method:'POST',body:{crewId,participantId:pid,targetId}});await refreshCrew();renderCrewSettings()}catch(e){toast(e.message)}};
window._leaveCrew=async()=>{if(!confirm('Leave this Crew?'))return;try{await api('leaveCrew',{method:'POST',body:{crewId,participantId:pid}});forgetCrew(crewId);window._home()}catch(e){toast(e.message)}};
window._deleteCrew=async()=>{if(!confirm('Delete this Crew and all its activity?'))return;try{await api('deleteCrew',{method:'POST',body:{crewId,participantId:pid}});forgetCrew(crewId);window._home()}catch(e){toast(e.message)}};



async function renderCrewInsights(){
  if(!crewId||!crew)return window._home();
  let j;try{j=await api('crewMetrics',{params:{crewId,participantId:pid}})}
  catch(e){toast(e.message);screen='crewSettings';return render()}
  const mix=Object.entries(j.byType||{}).map(([k,v])=>`${labelType(k)} × ${v}`).join(' · ')||'No Drops yet';
  app.innerHTML=shell(`${top('Field-test insights','crewSettings')}<div class="insightHero"><span>BEHAVIOR</span><h1>${esc(crew.name)}</h1><p>What people actually did inside this Crew.</p></div><div class="sp12"></div><div class="statGrid"><div><b>${j.memberCount}</b><span>Mates</span></div><div><b>${j.responseCount}</b><span>Answers</span></div><div><b>${j.dropCount}</b><span>Drops</span></div></div><div class="sp12"></div><div class="card"><div class="settingsRow"><span>Unique responders</span><b>${j.uniqueRespondents}</b></div><div class="settingsRow"><span>Chat messages</span><b>${j.chatCount}</b></div><div class="settingsRow"><span>Feedback responses</span><b>${j.feedbackCount||0}</b></div></div><div class="sp12"></div><div class="card"><h3>Drop mix</h3><p class="sub" style="margin-top:8px">${mix}</p></div>${j.feedbackCount?`<div class="sp12"></div><div class="card"><h3>Feedback snapshot</h3><div class="sp12"></div><div class="settingsRow"><span>Clarity</span><b>${j.avgClarity??'—'} / 5</b></div><div class="settingsRow"><span>Fun</span><b>${j.avgFun??'—'} / 5</b></div><div class="settingsRow"><span>Would share</span><b>${j.wouldShare.yes} yes · ${j.wouldShare.maybe} maybe · ${j.wouldShare.no} no</b></div></div>`:''}`)
}

async function renderRecap(){
  if(!crewId||!crew)return window._home();
  await refreshCrew();await refreshDrops();
  const responses=drops.reduce((n,d)=>n+(d.responseCount||0),0);
  const ready=drops.filter(d=>d.revealed||d.type==='short').length;
  const counts=drops.reduce((a,d)=>(a[d.type]=(a[d.type]||0)+1,a),{});
  const topType=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const topDrop=[...drops].sort((a,b)=>(b.responseCount||0)-(a.responseCount||0))[0];
  app.innerHTML=shell(`${top('Recap','crew')}<div class="recapHero"><span>THIS CREW</span><h1>${esc(crew.name)}</h1><p>A lightweight recap built from real activity.</p></div><div class="sp12"></div><div class="statGrid"><div><b>${drops.length}</b><span>Drops</span></div><div><b>${responses}</b><span>Answers</span></div><div><b>${members.length}</b><span>Mates</span></div></div><div class="sp12"></div><div class="card"><h3>Highlights</h3><div class="sp12"></div><div class="recapLine"><span>✨</span><div><b>${ready} active result${ready===1?'':'s'}</b><small>revealed or live</small></div></div>${topType?`<div class="recapLine"><span>⚡</span><div><b>${labelType(topType)}</b><small>most-used format</small></div></div>`:''}${topDrop?`<div class="recapLine"><span>🔥</span><div><b>${esc(topDrop.question)}</b><small>${topDrop.responseCount||0} responses</small></div></div>`:''}</div><div class="sp12"></div><button class="btn primary" onclick="window._shareCrew()">Bring someone into the Crew</button>`)
}

let starterController=null;
function renderStarter(){
 if(!starterController){
  starterController=createStarterController({
   app,shell,top,api,pid,esc,getKnownCrews,getName:()=>meName,toast,
   getInvite:()=>journey?.kind?null:pendingInvite,
   onCompleted:()=>{localStorage.addaStarterFinished='1'},
   onEnterInvite:()=>renderInvitedName(),
   onEnterExistingCrew:async id=>window._openKnownCrew(id),
   onExploreSolo:()=>{if(journey&&['crew_invite','drop_invite'].includes(journey.kind))saveJourney({...journey,phase:'aura'});localStorage.addaStarterFinished='1';localStorage.setItem('addaSoloGuidePending_'+pid,'1');crewId='';dropId='';crew=null;members=[];drops=[];history.replaceState({},'','/');track('starter_solo_explore',{step:10});screen='vibe';render()},
   onCrewCreated:async(j,nickname)=>{
    crewId=j.crew.id;crew=j.crew;meName=nickname;localStorage.addaName=nickname;
    localStorage.addaStarterFinished='1';rememberCrew(crew);
    profileId='';dropId='';pendingInvite=null;
    history.replaceState({},'',`/?crew=${crewId}`);
    await refreshCrew();await refreshDrops();
    if(drops.filter(x=>x.starterPack).length!==5)throw Error('Crew was created, but its five Drops are still preparing. Please retry.');
    track('crew_created',{crewId:j.crew.id,entry:'first_five'});
    screen='crew';await render();showStarterInvitePrompt();
   }
  });
 }
 return starterController.render()
}
window._startFirstFive=()=>{
 profileId='';crewId='';dropId='';crew=null;members=[];drops=[];pendingInvite=null;
 history.pushState({},'','/?play=1');screen='starter';stopPolling();renderStarter();
 return starterController.begin()
};
// One-time, lightweight in-app learning: explain the Crew, guide two real answers,
// then release navigation. Stored locally during beta; account-based sync is M1.
let guide={active:false,step:0,answers:0,lastDrop:'',originCrewId:'',tour:0};
let personalGuide=null,personalGuideActive=false;
function guideKey(){return 'addaGuideDone_'+(guide.originCrewId||crewId)}
function soloGuideKey(){return 'addaSoloGuideState_'+pid}
function soloGuidePending(){return localStorage.getItem('addaSoloGuidePending_'+pid)==='1'&&localStorage.getItem('addaSoloGuideDone_'+pid)!=='1'}
function startSoloGuide(){
 if(!soloGuidePending()||guide.active)return;
 let saved={};try{saved=JSON.parse(localStorage.getItem(soloGuideKey())||'{}')}catch(e){}
 guide={active:true,solo:true,mode:'transition',step:0,answers:0,lastDrop:'',originCrewId:'solo_'+pid,tour:Number(saved.tour)||0,profileStage:-1};
 track('solo_aura_guide_started',{resume:!!saved.tour,step:guide.tour});
 tourStep(Math.max(0,Math.min(4,guide.tour?guide.tour-1:0)))
}
function showAuraIntro(part){
 if(!guideActive()||screen!=='vibe')return;
 const blocks=[
 ['Your Aura begins here ✨','Your personal Adda progress. Ten Starter picks earned real Aura already, even without friends here.','Show my points →','.vibeIdentity'],
 ['Build it with real moves ⚡','Starter choices, trophies, real Crew answers, Drops and chats add points. Your Aura grows from what you DO, not what you scroll.','Show my milestones →','.addaAuraBreakdown'],
 ['Earn it. Flex it. 🏆','See your levels, earned badges and next unlock. This is your progress to build over time.','Take me to Home →','.vibeBadgesCard']
 ];
 guide.tour=1;guide.step=part;guide.mode='transition';
 localStorage.setItem(soloGuideKey(),JSON.stringify({tour:1,auraPart:part}));
 const [title,body,cta,target]=blocks[part];
 guideDisplay(title,body,cta,()=>{if(part<2)showAuraIntro(part+1);else{guideAward('tour_vibe');tourStep(1)}},target)
}

function guideActive(){return guide.active&&(guide.originCrewId||crewId)&&localStorage.getItem(guideKey())!=='1'}
// While coached, block navigation/background taps; answer input is open only for the active real Drop.
function guardGuideInteraction(e){
 if(!guideActive())return;
 const target=e.target;if(!(target instanceof Element))return;
 // The interest-led private two-card warm-up is part of onboarding, not background UI.
 if(personalGuideActive){
   if(target.closest('.addaPersonalOverlay button,.addaPersonalOverlay input,.addaPersonalOverlay select,.addaPersonalOverlay textarea'))return;
   e.preventDefault();e.stopImmediatePropagation();return;
 }
 const modal=document.querySelector('.addaGuidedLayer');
 const withinGuide=target.closest('.addaGuidedLayer .addaGuideCard button,.addaGuidedLayer .addaGuideCard input,.addaGuidedLayer .addaGuideCard textarea,.addaGuidedLayer .addaGuideCard select');
 const photoInput=guide.profileStage===0&&target.matches('#addaPhotoFile');
 const answer=guide.mode==='answer'&&!modal&&target.closest('.choice,#submitAnswer,#shortAnswer');
 const retry=screen==='vibe'&&target.closest('.addaAuraError button');
 const formatPick=guide.mode==='create_pick'&&target.closest('.formats .format');
 const createEdit=guide.mode==='create_edit'&&target.closest('.createCard button,.createCard input,.createCard textarea,.createCard label,.createCard select,.createCard .mediaPicker,.createCard .mediaPick');
 const shareModal=guide.mode==='share'&&target.closest('.shareOverlay,.shareOverlay *');
 if(withinGuide||photoInput||answer||retry||formatPick||createEdit||shareModal)return;
 e.preventDefault();e.stopImmediatePropagation();
}
document.addEventListener('pointerdown',guardGuideInteraction,true);
document.addEventListener('click',guardGuideInteraction,true);
document.addEventListener('keydown',e=>{if(guideActive()&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation()}},true);
function removeGuide(){document.querySelector('.addaGuidedLayer')?.remove();document.querySelectorAll('.addaGuideSpot').forEach(x=>x.classList.remove('addaGuideSpot'))}
function guideDisplay(title,body,cta,action,selector){
 guide.mode='transition';removeGuide();
 const target=selector?document.querySelector(selector):null;
 if(target)target.classList.add('addaGuideSpot');
 const layer=document.createElement('div');layer.className='addaGuidedLayer';
 layer.innerHTML=`<div class="addaGuideShade"></div><section class="addaGuideCard" role="dialog" aria-label="Adda quick tour">
 <div class="addaGuideStep">⚡ YOUR ADDA TOUR</div><h2>${esc(title)}</h2><p>${esc(body)}</p>
 <button class="btn primary" id="addaGuideAction">${esc(cta)}</button></section>`;
 document.body.appendChild(layer);
 layer.querySelector('#addaGuideAction').addEventListener('click',()=>{
  // The wizard's inputs live IN this card. Read them before any replacement.
  // Keep photo choices visible if the user cancels the native file picker.
  if(guide.tour===5&&guide.profileStage>=0){action?.();return}
  removeGuide();action?.()
 });
}
function startFirstCrewGuide(){
 if(!crewId||localStorage.getItem('addaGuideDone_'+crewId)==='1'||guide.active)return;
 const saved=JSON.parse(localStorage.getItem('addaGuideState_'+crewId)||'{}');
 guide={active:true,solo:false,mode:'transition',step:0,answers:Number(saved.answers)||0,lastDrop:saved.lastDrop||'',originCrewId:crewId,tour:Number(saved.tour)||0,profileStage:-1};
 localStorage.setItem('addaGuideStarted_'+crewId,'1');
 track('crew_guide_started',{crewId,resume:!!saved.answers||!!saved.tour});
 if(!personalGuide)personalGuide=createPersonalGuide({api,pid,esc,toast,track,getCrewId:()=>guide.originCrewId,getProfile:localProfile,saveProfile:p=>localStorage.addaLocalProfile=JSON.stringify(p),onDone:()=>{personalGuideActive=false;
   // Never demand two new answers from a Crew that has fewer than two available Drops.
   const open=drops.filter(d=>!d.myResponse).length;
   if(guide.answers+open<2){track('crew_guide_no_more_drops',{answered:guide.answers,available:open});startFiveTabTour();return}
   setTimeout(()=>{if(screen==='drop'&&!drops.some(d=>d.id===dropId&&!d.myResponse)){dropId='';screen='crew';render();setTimeout(guideCrew,120)}else if(screen==='drop')guideDrop();else guideCrew()},120)
 }});
 if(guide.tour>0){personalGuideActive=false;tourStep(Math.min(4,guide.tour-1));return}
 if(guide.answers>=2){personalGuideActive=false;startFiveTabTour();return}
 personalGuideActive=true;personalGuide.start()
}
function guideCrew(){
 if(!guideActive()||screen!=='crew')return;
 if(!drops.length)return;
 guide.step=0;
 guideDisplay('Your Crew 👥','Your private space with friends.','Show me a Drop →',()=>{
  guide.step=1;guideDisplay('One quick Drop ⚡','Pick an answer and see what your friends choose.','Try the first Drop →',()=>{
    const first=drops.find(d=>!d.myResponse)||drops[0];if(first)window._openDrop(first.id)
  },'.drop')
 },'.crewStickyHeader')
}
function guideDrop(){
 if(!guideActive()||screen!=='drop')return;
 guide.step=2;guide.mode='transition';
 guideDisplay('Your turn 👀','Pick or type an answer, then send it.','I’ll answer →',()=>{guide.mode='answer'},'#submitAnswer')
}
function guideAfterAnswer(){
 if(!guideActive())return;guide.mode='transition';
 if(journey?.phase==='crew_answers'){journeyAfterRealAnswer();return}
 guide.answers++;
 localStorage.setItem('addaGuideState_'+guide.originCrewId,JSON.stringify({answers:guide.answers,lastDrop:guide.lastDrop,tour:guide.tour}));
 track('crew_guide_answered',{number:guide.answers,crewId,dropId:guide.lastDrop});
 if(guide.answers>=2){
   guide.step=3;
   guideDisplay('Two Drops done! 🏆','Take a quick look around Adda.','Show me around →',()=>startFiveTabTour(),'.appStickyHeader');
   return
 }
 guide.step=3;
 guideDisplay('First answer in! 🎉','One more Drop and you’re ready.','Try another Drop →',()=>{
   const other=drops.find(d=>d.id!==guide.lastDrop&&!d.myResponse);
   if(other)window._openDrop(other.id);
   else {track('crew_guide_no_more_drops',{answered:guide.answers,available:0});startFiveTabTour()}
 },'.appStickyHeader')
}


function guideAward(step){
 api('guideStep',{method:'POST',body:{participantId:pid,step,crewId:guide.originCrewId}})
 .then(r=>{if(r.earnedPoints)toast('⚡ +'+r.earnedPoints+' Aura')})
 .catch(e=>console.warn('guide points',e.message))
}
function startFiveTabTour(){guide.tour=1;track('guide_five_tabs_started',{crewId:guide.solo?'':guide.originCrewId});tourStep(0)}
function tourStep(i){
 if(!guideActive())return;guide.mode='transition';guide.tour=i+1;guide.step=4+i;guide.profileStage=-1;
 const previous={answers:guide.answers,lastDrop:guide.lastDrop,tour:guide.tour};
 if(guide.solo){let old={};try{old=JSON.parse(localStorage.getItem(soloGuideKey())||'{}')}catch(e){}if(i===0)previous.auraPart=Number(old.auraPart)||0;localStorage.setItem(soloGuideKey(),JSON.stringify(previous))}
 else localStorage.setItem('addaGuideState_'+guide.originCrewId,JSON.stringify(previous));
 if(i===0)window._go('vibe');
 if(i===1){dropId='';window._home()}
 if(i===2){if(guide.solo){screen='soloCrewTour';render()}else window._openKnownCrew(guide.originCrewId)}
 if(i===3){if(guide.solo){screen='soloCreateTour';render()}else window._createAction()}
 if(i===4)window._go('profile');
 const steps=[
 ['Aura ✨','Your personal progress and earned trophies.','Open Home →','tour_vibe',4],
 ['Home 🏠','Your starting point: Aura, Crews and what to do next.','Explore Crew →','tour_home',0],
 ['Crew 👥','Shared Drops, friends, chats and results. No need to create one now.','Show Create + →','tour_crew',1],
 ['Create +','Turn a fun question into a shared Drop when you have a Crew.','Set up Profile →','tour_create',2],
 ['Profile ☺','Give your Aura a name and a look. Real photos are optional.','Make it mine →','tour_profile',4]
 ];
 const show=(tries=0)=>{
  if(!guideActive()||guide.tour!==i+1)return;
  const expected=['vibe','home',guide.solo?'soloCrewTour':'crew',guide.solo?'soloCreateTour':'create','profile'][i];
  if(screen!==expected||(i===0&&!document.querySelector('.vibeIdentity'))){
   if(tries<60){setTimeout(()=>show(tries+1),250);return}
   guideDisplay('Still loading…','Your tour is saved. Check the connection and retry.','Retry →',()=>tourStep(i),'.appStickyHeader');return
  }
  if(i===0&&guide.solo){let saved={};try{saved=JSON.parse(localStorage.getItem(soloGuideKey())||'{}')}catch(e){}showAuraIntro(Math.min(2,Math.max(0,Number(saved.auraPart)||0)));return}
  const [title,body,cta,step,navIndex]=steps[i];track('guide_tab_seen',{tab:step.slice(5),step:i+1,entry:guide.solo?'solo':'crew'});
  guideDisplay(title,body,cta,()=>{
   guideAward(step);
   if(i===4){window._editProfile();setTimeout(()=>profileGuideStep(0),180)}
   else tourStep(i+1)
  },'.nav5 button:nth-child('+(navIndex+1)+')');
 };
 setTimeout(()=>show(),i===2&&!guide.solo?230:120)
}
function profileGuideStep(i){
 if(!guideActive())return;guide.step=9+i;guide.profileStage=i;guide.mode='transition';
 if(i===0){
  guideDisplay('Pick your look 👀','Choose a photo, use an avatar or keep the default. Change it any time.','Choose a photo →',()=>document.getElementById('addaPhotoFile')?.click(),'.addaPhotoPick');
  const card=document.querySelector('.addaGuideCard');if(!card)return;
  const row=document.createElement('div');row.className='addaGuideAvatars';
  ['😎','🦊','🐼','👾','🦄','🤠'].forEach(emoji=>{const b=document.createElement('button');b.type='button';b.className='addaGuideAvatar';b.textContent=emoji;b.setAttribute('aria-label','Use avatar '+emoji);b.addEventListener('click',()=>{const p=localProfile();p.avatar='';p.avatarEmoji=emoji;localStorage.addaLocalProfile=JSON.stringify(p);const a=document.querySelector('.addaEditAvatar');if(a)a.innerHTML=profileAvatarMarkup();track('profile_avatar_selected',{kind:'emoji'});profileGuideStep(1)});row.appendChild(b)});
  card.appendChild(row);const next=document.createElement('button');next.type='button';next.className='addaGuideDefault';next.textContent='Keep default avatar →';next.addEventListener('click',()=>profileGuideStep(1));card.appendChild(next);return
 }
 if(i===1){
  guideDisplay('A line about you 💬','Short bio or leave blank.','Continue →',()=>{const f=document.getElementById('addaEditBio');if(f)f.value=document.getElementById('addaGuideBio')?.value||'';profileGuideStep(2)},'#addaEditBio');
  const f=document.createElement('textarea');f.id='addaGuideBio';f.maxLength=140;f.rows=3;f.placeholder='A little about me (optional)';f.value=document.getElementById('addaEditBio')?.value||'';f.setAttribute('aria-label','Optional bio');document.querySelector('.addaGuideCard')?.insertBefore(f,document.getElementById('addaGuideAction'));return
 }
 if(i===2){
  guideDisplay('Pick a future @name ✨','Optional draft. Not reserved or public yet.','Continue →',()=>{const v=document.getElementById('addaGuideHandle')?.value.trim().replace(/^@/,'').toLowerCase()||'';if(v&&!/^[a-z][a-z0-9_.]{2,19}$/.test(v)){toast('3–20 letters, digits, _ or ., starting with a letter');return}const f=document.getElementById('addaEditHandle');if(f)f.value=v;profileGuideStep(3)},'#addaEditHandle');
  const f=document.createElement('input');f.id='addaGuideHandle';f.maxLength=20;f.placeholder='your_future_name';f.value=document.getElementById('addaEditHandle')?.value||'';f.setAttribute('aria-label','Username draft');document.querySelector('.addaGuideCard')?.insertBefore(f,document.getElementById('addaGuideAction'));return
 }
 guideDisplay('Make it yours 💜','Check your name. Your beta profile stays on this device.','Save my profile →',()=>{const f=document.getElementById('addaEditName');if(f)f.value=document.getElementById('addaGuideName')?.value.trim()||'';window._saveLocalProfile()},'#addaEditName');
 const f=document.createElement('input');f.id='addaGuideName';f.maxLength=24;f.placeholder='What should we call you?';f.value=document.getElementById('addaEditName')?.value||'';f.setAttribute('aria-label','Display name');document.querySelector('.addaGuideCard')?.insertBefore(f,document.getElementById('addaGuideAction'));
}
function guideProfileSaved(p){
 if(!guideActive()||guide.tour!==5)return;
 if(p.bio)guideAward('profile_bio');
 if(p.avatar)guideAward('profile_photo');else if(p.avatarEmoji)guideAward('profile_avatar');
 if(p.handleDraft)guideAward('profile_handle_draft');
 const id=guide.originCrewId;
 localStorage.setItem('addaGuideTourDone_'+pid,'1');
 localStorage.setItem('addaGuideAuthStatus_'+pid,'awaiting_provider');
 track('guide_profile_ready',{hasPhoto:!!p.avatar,hasBio:!!p.bio,hasHandleDraft:!!p.handleDraft});
 setTimeout(()=>{
  guideDisplay('Your Aura is ready 🏆','Saved on this device. Verified account and sync are coming later.','Explore Adda →',()=>{
   guide.active=false;localStorage.setItem('addaGuideDone_'+id,'1');removeGuide();
   if(guide.solo){localStorage.setItem('addaSoloGuideDone_'+pid,'1');localStorage.removeItem('addaSoloGuidePending_'+pid);localStorage.removeItem(soloGuideKey())}
   else localStorage.removeItem('addaGuideState_'+id);
   track('guide_beta_handoff',{authStatus:'awaiting_provider',entry:guide.solo?'solo':'crew'});if(journey?.phase==='aura'&&['crew_invite','drop_invite'].includes(journey.kind))journeyAfterProfile();else window._home()
  },'.profileCard')
 },160)
}


/* v0.7.3 resumable Crew-specific activation. The first-time Aura guide remains separate. */
function journeyGuideOn(){
 if(!journey||!crewId||journey.crewId!==crewId)return false;
 guide={active:true,solo:false,journey:true,mode:'transition',step:0,answers:0,lastDrop:'',originCrewId:crewId,tour:11,profileStage:-1};
 return true;
}
function resumeJourney(){
 if(!journey||journey.crewId!==crewId||guideActive()||screen!=='crew')return;
 if(!journeyGuideOn())return;
 if(['crew_intro','member_intro'].includes(journey.phase))return journeyCrewWelcome();
 if(journey.phase==='seed_interests'||journey.phase==='seeding')return journeyChooseInterests();
 if(journey.phase==='crew_answers')return journeyNextDrop();
 if(journey.phase==='create_required')return journeyCreateCTA();
 guide.active=false;
}
function journeyCrewWelcome(){
 if(!journey||!guideActive())return;
 const creator=journey.kind==='creator';
 const steps=[
  [creator?'Your first Crew is LIVE! 👥':'Welcome to '+crew.name+'! 👥',creator?'Your very own gang now has a place on Adda. Your real Crew membership adds Aura.':'You are in the real Crew your friend invited you to. Let us show you around.','.crewStickyName'],
  ['This Crew has a name and invite ↗','Invite people when you want their REAL choices. Only actual mates can answer its Drops.','.invitePill'],
  ['Chat 💬','Group chat for this Crew. Every Crew has its own conversations.','.chatModule'],
  ['Recap ✨','The Crew’s real Drops, answers and highlights—not made-up stats.','.crewModules button:nth-child(2)'],
  ['Your mates 👥','See every person in this Crew and who created it.','.crewModules button:nth-child(3)']
 ];
 if(creator)steps.push(['Crew Settings ⚙','As this Crew’s creator, you can manage its name, membership and settings.','.crewModules button:nth-child(4)']);
 steps.push(['Drops ⚡','Fun questions you actually answer together. Your unanswered Drops stay above those you have already answered.','.drop']);
 steps.push(['Create +','A Drop is a question you create for your own Crew. We will show you how to make your first one.','.nav5 button:nth-child(3)']);
 const walk=i=>{
  if(!guideActive())return;
  if(i>=steps.length){
   if(creator){saveJourney({...journey,phase:'seed_interests'});journeyChooseInterests()}
   else if(drops.some(d=>!d.myResponse)){saveJourney({...journey,phase:'crew_answers',answers:journey.answers||[]});journeyNextDrop()}
   else journeyStartStarter();
   return;
  }
  const [title,body,target]=steps[i];guideDisplay(title,body,'Next →',()=>walk(i+1),target);
 };
 walk(0);
}
function journeyChooseInterests(){
 if(!journey||journey.kind!=='creator'||!journeyGuideOn())return;
 const list=[['rides','🏍️ Wheels'],['style','✨ Style'],['music','🎧 Music'],['food','🍕 Food'],['travel','🏖️ Travel'],['memes','😂 Memes'],['fitness','🏏 Sports']];
 const picked=Array.isArray(journey.interests)?journey.interests.slice(0,2):[];
 if(!picked.length&&localProfile().interest)picked.push(localProfile().interest);
 guideDisplay('Pick TWO things your gang loves 🔥','Your top two picks will inspire two of your five real shared Drops.','Create my five Drops →',async()=>{
   if(picked.length!==2){toast('Choose two interests');journeyChooseInterests();return}
   saveJourney({...journey,phase:'seeding',interests:picked});
   guideDisplay('Preparing your Crew ⚡','Saving five real, different Drops. Your choices will survive a retry.','Retry if needed →',()=>journeyChooseInterests(),'.crewModules');
   try{
    const result=await api('seedFirstCrew',{method:'POST',body:{crewId:journey.crewId,participantId:pid,interests:picked}});
    crew=result.crew;saveJourney({...journey,phase:'crew_answers',interestDropIds:result.interestDropIds||[],answers:journey.answers||[]});
    removeGuide();await refreshDrops();await renderCrew();journeyNextDrop();
   }catch(e){toast(e.message);saveJourney({...journey,phase:'seed_interests',interests:picked});journeyChooseInterests()}
 },'.crewModules');
 const card=document.querySelector('.addaGuideCard'),next=document.getElementById('addaGuideAction');if(!card||!next)return;
 const grid=document.createElement('div');grid.className='addaInterestGrid addaCrewInterestGrid';
 list.forEach(([key,label])=>{const btn=document.createElement('button');btn.type='button';btn.className='addaInterestPick';btn.textContent=label;const sync=()=>{btn.classList.toggle('selected',picked.includes(key));btn.setAttribute('aria-pressed',String(picked.includes(key)))};sync();btn.addEventListener('click',()=>{const ix=picked.indexOf(key);if(ix>=0)picked.splice(ix,1);else{if(picked.length===2)picked.shift();picked.push(key)}grid.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',picked.includes(b.dataset.interest)));next.disabled=picked.length!==2});btn.dataset.interest=key;grid.appendChild(btn)});
 card.insertBefore(grid,next);next.disabled=picked.length!==2;
}
function journeyNextDrop(){
 if(!journey||journey.phase!=='crew_answers'||!guideActive())return;
 const answered=new Set(journey.answers||[]);
 const available=drops.filter(d=>!d.myResponse&&d.id!==journey.dropId&&!answered.has(d.id));
 const interest=journey.kind==='creator'&&Array.isArray(journey.interestDropIds)?journey.interestDropIds:[];
 const candidates=journey.kind==='creator'?interest.map(id=>available.find(d=>d.id===id)).filter(Boolean):available;
 if(answered.size>=2||!candidates.length)return journeyAnswersDone();
 const target=candidates[0],number=answered.size+1;
 guideDisplay(number===1?'This is a real Drop ⚡':'One more Drop! 👀','Answer this genuine Crew question. After you answer, it moves below unanswered Drops.','Answer Drop '+number+' →',()=>window._openDrop(target.id),'.drop');
}
async function journeyAfterRealAnswer(){
 if(!journey||journey.phase!=='crew_answers')return;
 const answerId=guide.lastDrop;const answers=[...new Set([...(journey.answers||[]),answerId])];
 saveJourney({...journey,answers});
 try{await refreshDrops()}catch(e){toast('Could not load the next Drop. Retry.');return}
 if(answers.length>=2||!drops.some(d=>!d.myResponse&&d.id!==journey.dropId&&!answers.includes(d.id)))return journeyAnswersDone();
 guideDisplay('Your answer is in! ⚡','One more genuine Drop, then we will continue your Adda journey.','Next Drop →',async()=>{dropId='';screen='crew';await renderCrew();journeyNextDrop()},'.appStickyHeader');
}
function journeyAnswersDone(){
 if(!journey)return;
 if(journey.kind==='creator')return journeyInviteCrew();
 if(journey.kind==='crew_invite')return guideDisplay('Your Crew picks are saved 🏆','Now unlock your personal Aura with ten quick Starter Drops. We will bring you back here.','Start my Aura Run →',journeyStartStarter,'.appStickyHeader');
 if(journey.kind==='drop_invite'){
  if((journey.answers||[]).length<2){saveJourney({...journey,phase:'create_required'});return journeyCreateCTA()}
  return journeyFinish('You are ready to play with your Crew. 💜')
 }
}
function journeyStartStarter(){
 if(!journey)return;
 saveJourney({...journey,phase:'starter'});guide.active=false;removeGuide();dropId='';
 history.replaceState({},'','/?play=1');screen='starter';renderStarter();starterController.begin();
}
async function journeyAfterProfile(){
 if(!journey||!['crew_invite','drop_invite'].includes(journey.kind))return window._home();
 const target=journey.crewId;
 saveJourney({...journey,phase:journey.kind==='crew_invite'?'create_required':'member_intro',answers:journey.kind==='drop_invite'?[]:(journey.answers||[])});
 try{
  await api('joinCrew',{method:'POST',body:{crewId:target,participantId:pid,nickname:meName||localProfile().displayName||'Adda mate',provisional:false}});
  pendingInvite=null;await window._openKnownCrew(target);
 }catch(e){
  guide.active=true;guide.originCrewId=target;guide.tour=11;
  guideDisplay('Your Crew is waiting','Your profile is safe; the Crew is taking a little longer to load.','Retry return →',journeyAfterProfile,'.appStickyHeader');
 }
}
function journeyCreateCTA(){
 if(!journey||journey.phase!=='create_required'||!guideActive())return;
 guideDisplay('Now create YOUR first Drop ⚡','Time to add your own question inside '+(crew?.name||'your Crew')+'. We will guide every step.','Let’s create a Drop →',()=>{screen='create';render();startCustomDropGuide()},'.nav5 button:nth-child(3)');
}
function waitForShareSheet(done){
 const overlay=document.querySelector('.shareOverlay');
 if(!overlay){done();return}
 removeGuide();guide.mode='share';
 const observer=new MutationObserver(()=>{
  if(!document.querySelector('.shareOverlay')){observer.disconnect();done()}
 });
 observer.observe(document.body,{childList:true,subtree:true});
}
function journeyInviteCrew(){
 guideDisplay('You answered your first TWO! 🏆','More real mates mean more real answers. Invite your friends to '+crew.name+'!','Invite my gang ↗',()=>{
  guide.mode='share';Promise.resolve(window._shareCrew()).finally(()=>waitForShareSheet(()=>guideDisplay('Your Crew is ready 💜','Your link is available any time. Opening the sharing menu does not confirm a message was delivered.','Finish Crew tour →',()=>{localStorage.setItem('addaFirstCreatedCrewGuideDone_'+pid,'1');journeyFinish('Your Crew is ready!')},'.invitePill')))
 },'.invitePill');
}
function journeyFinish(message){
 guide.active=false;removeGuide();const target=journey?.crewId||crewId;saveJourney(null);pendingInvite=null;track('journey_v073_completed',{crewId:target});if(target)window._openKnownCrew(target);else window._home();if(message)toast(message);
}
function startInvitedDropGuide(){
 if(!journey||journey.phase!=='drop_entry'||!journeyGuideOn())return;
 const run=async()=>{
  let existing=null;try{existing=await api('getDrop',{params:{crewId:journey.crewId,dropId:journey.dropId,participantId:pid}})}catch(e){toast(e.message)}
  if(existing?.myResponse)return journeyStartStarter();
  guideDisplay('This is the Drop your friend sent 👀','A Drop is a question you answer with real Crew mates. Answer this one FIRST, then we will show you Adda.','I’ll answer this Drop →',()=>{guide.mode='answer'},'.appStickyHeader');
 };
 const current=meName||localProfile().displayName;
 if(current)return run();
 let draft='';
 guideDisplay('First, what should mates call you? 👋','One quick name for your REAL answer. Your full profile comes after Tenacious.','Save name & see my Drop →',async()=>{
  if(!draft.trim()){toast('Add your name');startInvitedDropGuide();return}
  try{
   await api('joinCrew',{method:'POST',body:{crewId:journey.crewId,participantId:pid,nickname:draft.trim(),provisional:false}});
   meName=draft.trim();localStorage.addaName=meName;await refreshCrew();run();
  }catch(e){toast(e.message);startInvitedDropGuide()}
 },'.appStickyHeader');
 const card=document.querySelector('.addaGuideCard'),b=document.createElement('input');b.placeholder='Your display name';b.maxLength=24;b.setAttribute('aria-label','Display name');b.addEventListener('input',()=>{draft=b.value});card?.insertBefore(b,document.getElementById('addaGuideAction'));
}


/* First custom Drop: triggered once by any real Crew Create action, never by system seeds. */
function startCustomDropGuide(){
 if(!crewId||!crew)return;
 if(localStorage.getItem('addaCustomDropGuideDone_'+pid)==='1'&&journey?.phase!=='create_required')return;
 if(guideActive()&&journey?.phase==='create_tour'&&guide.tour===12)return;
 if(!journey)saveJourney({kind:'custom',phase:'create_tour',crewId,answers:[],startedAt:Date.now()});
 else saveJourney({...journey,phase:'create_tour'});
 guide={active:true,solo:false,journey:true,mode:'transition',originCrewId:crewId,tour:12,profileStage:-1,answers:0,step:0};
 track('first_custom_drop_guide_started',{crewId,entry:journey.kind});
 const formats=[
  ['Quick Answer 💬','Let friends write a short answer—perfect for plans, inside jokes and confessions.'],
  ['This or That ⚖️','Two choices, one difficult decision. Add two images if you want.'],
  ['Vote 🗳️','Multiple choices. Watch the real Crew decide together.'],
  ['Rate ⭐','Five editable labels. Give a plan, look or idea an honest rating.'],
  ['Predict 🔮','Ask what the Crew thinks will actually happen.'],
  ["Who’s Most Likely 👀",members.length<2?'Pick a real mate. This unlocks when one more person joins your Crew.':'Pick real mates for an inside joke; everyone must actually be in this Crew.']
 ];
 const walk=i=>{
  if(!guideActive()||journey?.phase!=='create_tour')return;
  if(i>=formats.length)return guideDisplay('Now pick your format ⚡','Tap one of the six formats below. Who’s Most Likely needs two real mates.','Choose a format →',()=>{guide.mode='create_pick'},'.formats');
  guideDisplay(formats[i][0],formats[i][1],'Next format →',()=>walk(i+1),'.formats');
 };
 walk(0);
}
function customPickedType(){
 if(!journey||journey.phase!=='create_tour'||!guideActive())return;
 guideDisplay('Ask your Crew something 👀','Write a relatable question. Add options or media if this format needs them. You can edit Rate labels too.','Explain the settings →',()=>{
  guideDisplay('Reveal & privacy ⚙','Choose when answers reveal, whether names show after reveal, and if mates can change their answers. Each format has its own options.','Build my first Drop →',()=>{
   guide.mode='create_edit';toast('Fill the real form, then tap Create & share ⚡')
  },'.createCard')
 },'.createCard');
}
function customDropPublished(id){
 if(!journey||journey.phase!=='create_tour'||!guideActive())return;
 guide.mode='publish';
 guideDisplay('Your first Drop is LIVE! 🔥','You published this real question inside '+crew.name+'. Now invite your friends to answer THIS Drop.','Invite friends to this Drop ↗',()=>{
  guide.mode='share';
  const promise=window._shareDrop(id);
  Promise.resolve(promise).finally(()=>waitForShareSheet(()=>{
   if(!journey||journey.phase!=='create_tour')return;
   guideDisplay('Your Drop is safe 💜','The link is yours to share again any time. A share sheet opening does not confirm delivery.','Finish tutorial →',()=>{
    localStorage.setItem('addaCustomDropGuideDone_'+pid,'1');track('first_custom_drop_guide_completed',{crewId,dropId:id});journeyFinish('Your first custom Drop is live!')
   },'.appStickyHeader');
  }));
 },'.appStickyHeader');
}

function renderInvitedName(){
 if(!pendingInvite)return window._home();
 app.innerHTML=shell(`${top('')}<main class="starterInvitedName">
   <span class="starterKicker">ONE LAST THING 👀</span>
   <h1>What should your mates call you?</h1>
   <p>Your place in <b>${esc(pendingInvite.crewName)}</b> is ready. Give the gang a name to recognize.</p>
   <div class="field"><label>Your name</label><input maxlength="24" id="invitedName" value="${esc(meName)}" placeholder="e.g. Vijyant"></div>
   <button class="btn starterCTA" id="invitedGoBtn" onclick="window._finishInvitedJourney()">Enter ${esc(pendingInvite.crewName)} →</button>
 </main>`,false)
}
window._finishInvitedJourney=async()=>{
 if(!pendingInvite)return;
 const nickname=$('#invitedName')?.value.trim();if(!nickname)return toast('Add your name');
 const btn=$('#invitedGoBtn');if(btn){btn.disabled=true;btn.textContent='Taking you to your Crew…'}
 try{
   const v=pendingInvite;
   await api('joinCrew',{method:'POST',body:{crewId:v.crewId,participantId:pid,nickname,provisional:false}});
   crewId=v.crewId;dropId=v.dropId||'';meName=nickname;localStorage.addaName=nickname;localStorage.addaStarterFinished='1';
   rememberCrew(crew);pendingInvite=null;await refreshCrew();await refreshDrops();
   history.replaceState({},'',dropId?`/?crew=${crewId}&drop=${dropId}`:`/?crew=${crewId}`);
   screen=dropId?'drop':'crew';await render();startFirstCrewGuide();
 }catch(e){toast(e.message);if(btn){btn.disabled=false;btn.textContent='Enter Crew →'}}
};
function showStarterInvitePrompt(){
 document.querySelector('.starterInviteOverlay')?.remove();
 const overlay=document.createElement('div');overlay.className='shareOverlay starterInviteOverlay';
 overlay.innerHTML=`<section class="starterInviteSheet" role="dialog" aria-label="Invite your friends">
  <div class="starterInviteGraphic">🎉👥</div>
  <span class="starterKicker">YOUR CREW IS READY!</span>
  <h2>Time to bring in the gang 👀</h2>
  <p><b>${esc(crew?.name||'Your Crew')}</b> has 5 Drops waiting. Your friends join from this invite and get their own first-time welcome.</p>
  <div class="starterInvitePreview">Oye! ${esc(crew?.name||'Our Crew')} ka Adda ready hai 😂<br>5 fun questions waiting. Come expose the gang! 🔥</div>
  <button id="starterInviteNow" class="btn starterCTA">↗ Invite my friends</button>
  <button id="starterInviteLater" class="starterTextLink">I'll invite them later</button>
 </section>`;
 document.body.appendChild(overlay);
 track('starter_invite_prompt_shown',{crewId});
 overlay.querySelector('#starterInviteNow').addEventListener('click',()=>{overlay.remove();track('starter_invite_share_opened',{crewId});window._shareCrew();setTimeout(startFirstCrewGuide,1000)});
 overlay.querySelector('#starterInviteLater').addEventListener('click',()=>{overlay.remove();startFirstCrewGuide()});
 overlay.addEventListener('click',e=>{if(e.target===overlay){overlay.remove();startFirstCrewGuide()}});
}

function renderStart(){
 const name=localProfile().displayName||meName||'';
 app.innerHTML=shell(`${top('')}<div class="hero"><span class="chip darkchip">YOUR PRIVATE CIRCLE</span><div class="sp18"></div><h1>${name?'Hey '+esc(name)+'! 👋':'Start with your people.'}</h1><p style="color:#cbc5d2;margin-top:9px">${name?'Ab apni gang ko naam do! 😂':'A Crew is your private friend group on Adda.'}</p></div><div class="sp18"></div><div class="card">${name?'':'<div class="field"><label>What should your mates call you?</label><input id="name" maxlength="24" placeholder="Your name"></div><div class="sp12"></div>'}<div class="field"><label>Your Crew name</label><input id="crewName" maxlength="42" placeholder="e.g. Changu Mangu 😂"></div><div class="sp18"></div><button id="createCrewBtn" class="btn primary" onclick="window._createCrew()">Start my Crew →</button></div>`);
}
window._createCrew=async()=>{
 const nickname=(localProfile().displayName||meName||$('#name')?.value||'').trim(),name=$('#crewName')?.value.trim();
 if(!nickname||!name)return toast('Add your name and Crew name');
 const btn=$('#createCrewBtn');if(btn?.disabled)return;if(btn){btn.disabled=true;btn.textContent='Preparing your Crew…'}
 const key='addaCrewCreateRequest_'+pid,requestId=localStorage.getItem(key)||crypto.randomUUID();localStorage.setItem(key,requestId);
 try{
  const j=await api('createCrew',{method:'POST',body:{nickname,name,participantId:pid,requestId}});
  localStorage.removeItem(key);crewId=j.crew.id;crew=j.crew;meName=nickname;localStorage.addaName=nickname;
  if(!localProfile().displayName){const p=localProfile();p.displayName=nickname;localStorage.addaLocalProfile=JSON.stringify(p)}
  rememberCrew(crew);history.replaceState({},'',`/?crew=${crewId}`);
  if(!j.reused)track('crew_created',{crewId:j.crew.id,firstCreated:!!j.firstCreatedCrew});
  if(j.firstCreatedCrew&&!localStorage.getItem('addaFirstCreatedCrewGuideDone_'+pid))saveJourney({kind:'creator',phase:'crew_intro',crewId,startedAt:Date.now(),answers:[]});
  await refreshCrew();screen='crew';render();
 }catch(e){toast(e.message);if(btn){btn.disabled=false;btn.textContent='Start my Crew →'}}
};

function renderJoin(){app.innerHTML=shell(`${top('Join Crew')}<div class="hero"><span class="chip darkchip">INVITE ONLY</span><div class="sp18"></div><h1>${esc(crew.name)}</h1><p style="color:#cbc5d2;margin-top:8px">${matesLabel()} are here.</p></div><div class="sp18"></div><div class="card"><div class="field"><label>What should your Crew call you?</label><input id="joinName" maxlength="24" value="${esc(meName)}" placeholder="Your name"></div><div class="sp18"></div><button class="btn primary" onclick="window._joinCrew()" >Join the Crew</button><p class="sub center" style="margin-top:9px">Become a mate and jump in.</p></div>`,!!getKnownCrews().length)}
window._joinCrew=async()=>{const nickname=$('#joinName').value.trim();if(!nickname)return toast('Add your name');try{await api('joinCrew',{method:'POST',body:{crewId,nickname,participantId:pid}});meName=nickname;localStorage.addaName=nickname;track('crew_joined',{crewId});await refreshCrew();rememberCrew(crew);screen=dropId?'drop':'crew';render()}catch(e){toast(e.message)}};
async function renderJoinDrop(){
  let j;try{j=await api('getDrop',{params:{crewId,dropId,participantId:pid}})}catch(e){screen='notfound';return render(e.message)}
  const d=j.drop;activeDropType=d.type;
  const answerUi=d.type==='short'
    ? `<div class="field"><label>Your answer</label><input id="guestShort" maxlength="160" placeholder="Type a short reply…"></div>`
    : d.options.map(o=>choiceMarkup(d,o,guestAnswer,true)).join('');
  app.innerHTML=shell(`${top('Answer Drop')}<div class="tiny">${labelType(d.type).toUpperCase()}</div><h1 style="margin-top:5px">${esc(d.question)}</h1><div class="sp12"></div>${dropLeadMedia(d)}${answerUi}<div class="sp12"></div><div class="field"><label>Your name</label><input id="guestName" maxlength="24" value="${esc(meName)}" placeholder="What should your Crew call you?"></div><div class="sp18"></div><button id="guestSubmit" class="btn primary" style="font-size:18px" onclick="window._answerAndJoin()" ${d.type!=='short'&&!guestAnswer?'disabled style="opacity:.45;font-size:18px"':''}>Answer →</button><p class="sub center" style="margin-top:9px">Answering joins you to ${esc(crew.name)} as a mate.</p>`,!!getKnownCrews().length)
}
window._selectGuest=id=>{guestAnswer=id;document.querySelectorAll('.choice').forEach(el=>{const on=el.dataset.answer===id;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',on?'true':'false')});const b=$('#guestSubmit');if(b){b.disabled=false;b.style.opacity='1'}};
window._answerAndJoin=async()=>{const nickname=$('#guestName')?.value.trim();if(!nickname)return toast('Add your name');const answer=activeDropType==='short'?$('#guestShort')?.value.trim():guestAnswer;if(!answer)return toast('Add your answer');const btn=$('#guestSubmit');if(btn){btn.disabled=true;btn.textContent='Joining…'}try{await api('joinCrew',{method:'POST',body:{crewId,nickname,participantId:pid}});meName=nickname;localStorage.addaName=nickname;track('crew_joined_via_drop',{crewId,dropId});rememberCrew(crew);await api('answerDrop',{method:'POST',body:{crewId,dropId,participantId:pid,answer}});track('response_submitted',{dropId,type:activeDropType,entry:'shared_drop'});await refreshCrew();dropId='';history.replaceState({},'',`/?crew=${crewId}`);screen='crew';render();toast(`You’re now a mate in ${crew.name} 👋`)}catch(e){toast(e.message);if(btn){btn.disabled=false;btn.textContent='Answer →'}}};
async function refreshCrew(){const c=await api('getCrew',{params:{crewId}});crew=c.crew;members=c.members}
async function refreshDrops(){const j=await api('listDrops',{params:{crewId,participantId:pid}});drops=j.drops}
async function renderCrew(){
  clearTimeout(pollTimer);await refreshCrew();rememberCrew(crew);await refreshDrops();
  const totalResponses=drops.reduce((n,d)=>n+(d.responseCount||0),0);
  app.innerHTML=shell(`${crewStickyHeader()}${crew?.starterPack&&crew.createdBy===pid&&totalResponses<2?`<div class="starterCrewBanner"><b>🎉 Your 5 Drops are ready!</b><p>Answer one and invite your mates to compare their picks.</p><button onclick="window._shareCrew()">↗ Invite friends</button></div>`:''}<div class="crewModules"><button onclick="window._go('chat')" class="chatModule"><span class="moduleIcon">💬${hasUnreadChat()?'<i class="unreadDot"></i>':''}</span><b>Chat</b><small>${hasUnreadChat()?'New messages':'Talk here'}</small></button><button onclick="window._go('recap')"><span>✨</span><b>Recap</b><small>${totalResponses} real answers</small></button><button onclick="window._go('mates')"><span>👥</span><b>Mates</b><small>${matesLabel()}</small></button>${crew.createdBy===pid?`<button onclick="window._go('crewSettings')"><span>⚙</span><b>Settings</b><small>Admin only</small></button>`:''}</div><div class="sp18"></div><div class="row between"><h2>Drops</h2><button class="chip chipBtn" onclick="window._go('create')">+ Create</button></div><div class="sp12"></div>${drops.length?drops.slice().sort((a,b)=>Number(!!a.myResponse)-Number(!!b.myResponse)).map(d=>`<button class="drop drop-${d.type} ${d.myResponse?'dropHasAnswer':'dropNeedsAnswer'}" aria-label="${d.myResponse?'Answered':'Not answered'}: ${esc(d.question)}" style="width:100%;text-align:left" onclick="window._openDrop('${d.id}')"><div class="row between"><span class="chip">${labelType(d.type)}</span><span class="dropStatus ${d.myResponse?'isAnswered':'isPending'}">${d.myResponse?d.revealed?'✨ Result ready':'✓ Answered':'○ Your turn'}</span></div><div class="meta" style="margin-top:5px">${dropProgress(d)}</div>${d.mediaA?`<img class="dropThumb" src="${mediaUrl(d.mediaA)}" alt="">`:``}<div class="q">${esc(d.question)}</div><div class="meta">${d.type==='short'?(d.responseCount?`${d.responseCount} repl${d.responseCount===1?'y':'ies'} · live`:'Be first to reply'):d.revealed&&d.myResponse?'Result ready ✨':d.myResponse?'Waiting for friends…':'Tap to answer'}</div></button>`).join(''):`<div class="empty"><div><div style="font-size:44px">⚡</div><h2 style="margin-top:8px">No Drops yet</h2><p class="sub" style="margin-top:6px">Create one, then share it. Friends join when they answer.</p><div class="sp18"></div><button class="btn primary" onclick="window._go('create')">Create first Drop</button></div></div>`}`);
  if(!journey&&crew.createdBy===pid&&!drops.length&&getKnownCrews().length===1&&!localStorage.getItem('addaFirstCreatedCrewGuideDone_'+pid))saveJourney({kind:'creator',phase:'crew_intro',crewId,answers:[],startedAt:Date.now(),legacyEmpty:true});
  if(journey?.crewId===crewId&&['crew_intro','member_intro','crew_answers','create_required','seed_interests'].includes(journey.phase)&&!guideActive())setTimeout(resumeJourney,130);
  if(!guideActive())schedulePoll('poll',()=>{if(screen==='crew')return renderCrew()},30000);
  if(guideActive()&&!journey&&!personalGuideActive&&guide.tour===0&&!document.querySelector('.addaGuidedLayer'))setTimeout(guideCrew,120)
}
window._openDrop=id=>{removeGuide();dropId=id;history.replaceState({},'',`/?crew=${crewId}&drop=${id}`);screen='drop';render()};
function labelType(t){return ({short:'💬 Quick Answer',likely:'👀 Who’s most likely',either:'⚖️ This or That',vote:'🗳️ Vote',rate:'⭐ Rate',predict:'🔮 Predict'})[t]||'Drop'}
function dropProgress(d){if(d.type==='short')return d.responseCount+' repl'+(d.responseCount===1?'y':'ies');if(d.thresholdMode==='manual')return d.responseCount+' answered · creator reveal';return d.responseCount+'/'+d.threshold}
function dynamicRevealOptions(){
  const n=Math.max(1,members.length),opts=[];
  if(n===1)opts.push({mode:'count',count:2,label:'You + 1 friend'});
  else if(n===2)opts.push({mode:'everyone',count:null,label:'All 2 mates'});
  else{opts.push({mode:'count',count:2,label:'Fast · 2 answers'});const majority=Math.floor(n/2)+1;if(majority>2&&majority<n)opts.push({mode:'count',count:majority,label:'Majority · '+majority});opts.push({mode:'everyone',count:null,label:'All '+n+' mates'});}
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
  app.innerHTML=shell(`${top('Create a Drop','crew')}<div class="createHero"><div><h1>What do you want from the Crew?</h1></div><span class="sparkle">✦</span></div><div class="sp12"></div><div class="formats">${cards.map(x=>`<button data-type="${x[0]}" class="format ${type===x[0]?'on':''} ${x[0]==='likely'&&members.length<2?'locked':''}" onclick="window._type('${x[0]}')"><span class="fic">${x[1]}</span><span class="ftxt"><b>${x[2]}</b><small>${x[3]}</small></span></button>`).join('')}</div>${members.length<2?'<p class="sub" style="margin-top:7px">Most Likely unlocks after one mate joins.</p>':''}<div class="sp12"></div><div class="card createCard"><div class="field"><div class="row between"><label>${questionLabel(type)}</label><button type="button" class="surpriseBtn" onclick="window._surprise('${type}')">🎲 Surprise me</button></div><textarea id="q" maxlength="120" placeholder="${placeholder(type)}">${esc(selected?.question||'')}</textarea></div>${extraFields(type)}${settings}<div class="sp18"></div><button class="btn primary" onclick="window._publish()">Create & share</button></div>`);
 if(!guideActive()&&!localStorage.getItem('addaCustomDropGuideDone_'+pid)&&(journey?.phase==='create_tour'||(!journey&&!(localStats().drop_created>0))))setTimeout(startCustomDropGuide,120);
}
function questionLabel(t){if(t==='short')return 'Ask your Crew';if(t==='rate')return 'What should your Crew rate?';if(t==='predict')return 'What should they predict?';return 'What do you want to ask?'}
function placeholder(t){return t==='short'?'What’s the plan for tonight?':t==='likely'?"Who’s most likely to cancel the plan?":t==='either'?'Chai or coffee?':t==='vote'?'Where should we go this weekend?':t==='predict'?'Will we actually meet this weekend?':'Rate our last hangout'}
function extraFields(t){
  if(t==='either')return `<div class="sp12"></div><div class="compareCreate"><div class="compareSide"><div class="field"><label>Choice 1</label><input id="a" maxlength="40" placeholder="Chai"></div>${mediaPickerHtml('A','Add image')}</div><div class="versusBubble">VS</div><div class="compareSide"><div class="field"><label>Choice 2</label><input id="b" maxlength="40" placeholder="Coffee"></div>${mediaPickerHtml('B','Add image')}</div></div>`;
  if(t==='predict')return `<div class="sp12"></div><div class="predictNote"><b>Yes / No prediction</b><span>Best for something that will happen later.</span></div>`;
  if(t==='vote')return `<div class="sp12"></div><div class="field"><label>Choices</label><input id="o1" maxlength="40" placeholder="Option 1"><input id="o2" maxlength="40" placeholder="Option 2"><input id="o3" maxlength="40" placeholder="Option 3 (optional)"></div>`;
  if(t==='rate'){
    const defs=window._ratingLabels||['😬 Not for me','😕 Meh','🙂 Decent','😍 Love it','🔥 Obsessed'];window._ratingLabels=defs;
    return `<div class="sp12"></div>${mediaPickerHtml('A','Add image to rate')}<div class="sp12"></div><div class="ratingPreview">${defs.map((x,i)=>`<div class="ratingRow"><b>${i+1}★</b><input id="ratingLabel${i}" class="ratingInlineInput" maxlength="28" value="${esc(x)}" readonly oninput="window._ratingLabels[${i}]=this.value"><button type="button" class="ratingEditBtn" onclick="window._editRatingLabel(${i},this)">✎</button></div>`).join('')}</div>`;
  }
  return ''
}
window._type=t=>{if(t==='likely'&&members.length<2)return toast('Most Likely unlocks after one mate joins');const tutorial=guideActive()&&journey?.phase==='create_tour'&&guide.mode==='create_pick';const prev=selected?.type||(members.length<2?'short':'likely');if(prev!==t)resetMedia();selected={type:t,question:$('#q')?.value||''};if(tutorial)guide.mode='transition';renderCreate();if(tutorial)setTimeout(customPickedType,120)};
window._setReveal=(mode,count)=>{window._thresholdMode=mode;window._thresholdCount=count;renderCreate()};
window._toggleDropSettings=()=>{window._showDropSettings=!window._showDropSettings;renderCreate()};
window._publish=async()=>{
 const type=selected?.type||(members.length<2?'short':'likely'),question=$('#q')?.value.trim();
 const firstReveal=dynamicRevealOptions()[0],aState=mediaState('A'),bState=mediaState('B');
 if(aState.uploading||bState.uploading)return toast('Let the image finish uploading first');
 const requestKey='addaDropCreateRequest_'+pid+'_'+crewId,requestId=localStorage.getItem(requestKey)||crypto.randomUUID();localStorage.setItem(requestKey,requestId);
 const body={crewId,participantId:pid,requestId,type,question,thresholdMode:window._thresholdMode||firstReveal.mode,
  thresholdCount:window._thresholdCount??firstReveal.count??2,showNames:window._showNames===true,
  allowChange:window._allowChange!==false,mediaA:aState.ref||'',mediaB:type==='either'?(bState.ref||''):''};
 if(type==='either'){body.optionA=$('#a')?.value;body.optionB=$('#b')?.value}
 if(type==='vote'){body.options=[$('#o1')?.value,$('#o2')?.value,$('#o3')?.value]}
 if(type==='rate')body.ratingLabels=window._ratingLabels||undefined;
 const button=document.querySelector('.createCard .btn.primary');if(button?.disabled)return;
 if(button){button.disabled=true;button.textContent='Publishing your Drop…'}
 try{
  const result=await api('createDrop',{method:'POST',body});
  if(!result.reused)track('drop_created',{type});
  localStorage.removeItem(requestKey);
  const newId=result.drop.id,tutorial=journey?.phase==='create_tour';
  dropId=newId;history.replaceState({},'',`/?crew=${crewId}&drop=${newId}`);screen='drop';
  selected=null;window._thresholdMode=null;window._thresholdCount=null;window._showNames=false;
  window._allowChange=true;window._showDropSettings=false;window._showRatingLabels=false;window._ratingLabels=null;resetMedia();
  if(tutorial)guide.mode='publish';
  await render();
  if(tutorial)customDropPublished(newId);
  else toast('Your Drop is live! Tap Share Drop to invite mates.');
 }catch(e){toast(e.message);if(button){button.disabled=false;button.textContent='Create & share'}}
};

function creatorTools(d){return d.createdBy===pid||(d.firstCrewSeed&&crew?.createdBy===pid)?`<button class="deleteLink" onclick="window._deleteDrop('${d.id}')">Delete Drop</button><button class="chip chipBtn" onclick="window._shareDrop('${d.id}')">↗ Share Drop</button>`:''}
window._deleteDrop=async id=>{if(!confirm('Delete this Drop for everyone?'))return;try{await api('deleteDrop',{method:'POST',body:{crewId,dropId:id,participantId:pid}});track('drop_deleted',{dropId:id});dropId='';selected=null;history.replaceState({},'',`/?crew=${crewId}`);screen='crew';render();toast('Drop deleted')}catch(e){toast(e.message)}};

async function renderDrop(){
  const requestedCrewId=crewId,requestedDropId=dropId;
  clearTimeout(pollTimer);
  if(!crew)await refreshCrew();
  if(screen!=='drop'||crewId!==requestedCrewId||dropId!==requestedDropId)return;
  let j;try{j=await api('getDrop',{params:{crewId:requestedCrewId,dropId:requestedDropId,participantId:pid}})}catch(e){if(screen==='drop')toast(e.message);return}
  if(screen!=='drop'||crewId!==requestedCrewId||dropId!==requestedDropId)return;
  const d=j.drop;activeDropType=d.type;
  if(d.type==='short'){
    if(j.myResponse)return renderShortResult(d,j);
    app.innerHTML=shell(`${top(labelType(d.type),'crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><h1>${esc(d.question)}</h1><p class="sub" style="margin-top:7px">${j.responsesCount?j.responsesCount+' repl'+(j.responsesCount===1?'y':'ies')+' already':'Be the first to reply'}</p><div class="sp12"></div><div class="field"><label>Your answer</label><input id="shortAnswer" maxlength="160" placeholder="Type a short reply…"></div><div class="sp18"></div><button id="submitAnswer" class="btn primary" style="font-size:18px" onclick="window._submitAnswer()">Send answer</button>`);
    if(guideActive()&&!j.myResponse&&guide.mode!=='publish'&&journey?.phase!=='drop_entry')setTimeout(guideDrop,80);
    return
  }
  selected=j.myResponse?.answer||selected;
  if(j.revealed&&j.myResponse&&!sessionStorage.getItem(`seen_${dropId}`)){sessionStorage.setItem(`seen_${dropId}`,'1');return revealCountdown(d,j)}
  if(j.revealed&&j.myResponse)return renderResult(d,j);
  if(j.myResponse)return renderWaiting(d,j);
  app.innerHTML=shell(`${top(labelType(d.type),'crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><h1>${esc(d.question)}</h1><p class="sub" style="margin-top:7px">${d.thresholdMode==='manual'?j.responsesCount+' answered · creator reveal':j.responsesCount+'/'+j.threshold+' answered'}</p><div class="sp12"></div>${dropLeadMedia(d)}${d.options.map(o=>choiceMarkup(d,o,selected,false)).join('')}<div class="sp12"></div><button id="submitAnswer" class="btn primary" style="font-size:18px" onclick="window._submitAnswer()" ${!selected?'disabled style="opacity:.45;font-size:18px"':''}>Submit answer</button>`);
  if(guideActive()&&guide.mode!=='publish'&&journey?.phase!=='drop_entry')setTimeout(guideDrop,80)
}
window._select=id=>{selected=id;document.querySelectorAll('.choice').forEach(el=>{const on=el.dataset.answer===id;el.classList.toggle('selected',on);el.setAttribute('aria-pressed',on?'true':'false')});const b=$('#submitAnswer');if(b){b.disabled=false;b.style.opacity='1'}};
window._submitAnswer=async()=>{const answer=activeDropType==='short'?$('#shortAnswer')?.value.trim():selected;if(!answer)return toast('Add your answer');const btn=$('#submitAnswer');if(btn){btn.disabled=true;btn.textContent='Sending…'}try{await api('answerDrop',{method:'POST',body:{crewId,dropId,participantId:pid,answer}});track('response_submitted',{dropId,type:activeDropType,entry:'crew'});if(guideActive()){guide.mode='transition';guide.lastDrop=dropId;removeGuide();if(journey?.phase==='drop_entry')setTimeout(journeyStartStarter,900);else setTimeout(guideAfterAnswer,1100)}selected=null;app.innerHTML=shell(`${top(labelType(activeDropType),'crew')}<div class="sentState"><div class="sentTick">✓</div><h1>Answer sent</h1><p class="sub">Updating the Crew…</p></div>`);setTimeout(()=>{if(screen==='drop')renderDrop()},350)}catch(e){toast(e.message);if(btn){btn.disabled=false;btn.textContent=activeDropType==='short'?'Send answer':'Submit answer'}}};
function renderWaiting(d,j){
  clearTimeout(pollTimer);
  if(d.thresholdMode==='manual'){
    const canReveal=d.createdBy===pid;
    app.innerHTML=shell(`${top('Waiting','crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><div class="hero center"><div style="font-size:44px">⏳</div><div class="sp12"></div><h1>${j.responsesCount} answer${j.responsesCount===1?'':'s'} in</h1><p style="color:#cbc5d2;margin-top:8px">${canReveal?'Reveal whenever the moment feels right.':'The creator will reveal the result.'}</p></div><div class="sp18"></div>${canReveal?'<button class="btn primary" onclick="window._revealNow()">Reveal result now</button><div class="sp12"></div>':''}<button class="btn ghost" onclick="window._shareDrop(\'${d.id}\')">Share with friends</button>`);
    schedulePoll('poll',()=>{if(screen==='drop')return renderDrop()},8000);return
  }
  const left=Math.max(0,j.threshold-j.responsesCount);
  app.innerHTML=shell(`${top('Waiting','crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><div class="hero center"><div style="font-size:44px">⏳</div><div class="sp12"></div><h1>Waiting for ${left} friend${left===1?'':'s'}</h1><p style="color:#cbc5d2;margin-top:8px">Your answer is in.</p><div class="sp18"></div><div class="progress"><span style="width:${Math.min(100,j.responsesCount/j.threshold*100)}%"></span></div></div><div class="sp18"></div><button class="btn primary" onclick="window._shareDrop('${d.id}')">Share with friends</button><div class="sp12"></div><button class="btn ghost" onclick="window._go('chat')">Open Crew chat</button>`);
  schedulePoll('poll',()=>{if(screen==='drop')return renderDrop()},5000)
}
window._revealNow=async()=>{try{await api('revealDrop',{method:'POST',body:{crewId,dropId,participantId:pid}});sessionStorage.removeItem(`seen_${dropId}`);renderDrop()}catch(e){toast(e.message)}};
async function revealCountdown(d,j){const live=()=>screen==='drop'&&dropId===d.id&&crewId===d.crewId;if(!live())return;if(reduced)return renderResult(d,j);for(let n=3;n>=1;n--){if(!live())return;app.innerHTML=shell(`${top('Result','crew')}<div class="hero center" style="min-height:420px;display:grid;place-items:center"><div><div class="countdown">${n}</div><h2 style="margin-top:10px">Result ready</h2></div></div>`);await new Promise(r=>setTimeout(r,650))}if(live())renderResult(d,j)}
function renderShortResult(d,j){clearTimeout(pollTimer);const entries=j.result?.entries||[];app.innerHTML=shell(`${top('Live answers','crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div><div class="questionHero"><span>💬 LIVE ANSWERS</span><h1>${esc(d.question)}</h1><p>${entries.length} repl${entries.length===1?'y':'ies'} so far</p></div><div class="sp12"></div><div class="answerStack">${entries.map(r=>`<div class="answerCard">${identityLink(r.participantId,r.nickname,{avatar:true})}<p>${esc(r.answer)}</p></div>`).join('')}</div><div class="sp12"></div><button class="btn primary" onclick="window._shareDrop('${d.id}')">Share with friends</button>`);schedulePoll('poll',()=>{if(screen==='drop')return renderDrop()},8000)}
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
  const byId=Object.fromEntries(d.options.map(o=>[o.id,o.label])),first=j.result?.ranked?.[0],pct=first?Math.round(first.count/j.result.total*100):0,insights=resultInsights(d,j,byId),heroMedia=resultMediaRef(d,first?.answer);
  const named=d.showNames&&j.voters?.length?`<div class="card"><h3>Who picked what</h3><div class="sp12"></div>${j.voters.map(v=>`<div class="settingsRow">${identityLink(v.participantId,v.nickname,{avatar:true})}<b>${esc(byId[v.answer]||v.answer)}</b></div>`).join('')}</div><div class="sp12"></div>`:'';
  app.innerHTML=shell(`${top('Result','crew')}<div class="row between"><span class="chip">${labelType(d.type)}</span>${creatorTools(d)}</div><div class="sp12"></div>${heroMedia?`<div class="resultImageWrap"><img class="resultImage" src="${mediaUrl(heroMedia)}" alt=""></div><div class="sp12"></div>`:''}<div class="hero center"><div style="font-size:44px">✨</div><div class="sp12"></div><div class="resultNum">${pct}%</div><h1>${esc(byId[first?.answer]||'Result')}</h1><p style="color:#cbc5d2;margin-top:8px">${esc(d.question)}</p></div><div class="sp12"></div><div class="insightGrid">${insights.map(x=>`<div class="insight"><span>${x.icon}</span><div><b>${esc(x.title)}</b><p>${esc(x.text)}</p></div></div>`).join('')}</div><div class="sp12"></div>${j.result.ranked.map(r=>`<div class="resultRow"><div>${d.type==='likely'?identityLink(String(r.answer),byId[r.answer]||r.answer,{avatar:true}):`<b>${esc(byId[r.answer]||r.answer)}</b>`}<small>${Math.round(r.count/j.result.total*100)}%</small></div><strong>${r.count}</strong></div>`).join('')}<div class="sp12"></div>${named}<button class="btn primary" onclick="window._shareDrop('${d.id}')">Share result</button><div class="sp12"></div><button class="btn ghost" onclick="window._go('create')">Make the next Drop</button>`)
}

function chatHtml(messages){return messages.length?messages.map(m=>`<div class="msg ${m.participantId===pid?'me':''}"><div class="who">${identityLink(m.participantId,m.nickname,{avatar:false})}</div>${esc(m.text)}</div>`).join(''):`<div class="empty"><div><div style="font-size:40px">💬</div><h3>Start the chat</h3><p class="sub" style="margin-top:5px">Only your Crew can see this.</p></div></div>`}
async function refreshChatMessages(){try{const j=await api('chatList',{params:{crewId}});const box=$('#chat');if(!box)return;const nearBottom=box.scrollHeight-box.scrollTop-box.clientHeight<80;box.innerHTML=chatHtml(j.messages);const last=j.messages?.[j.messages.length-1];if(last?.createdAt)localStorage.setItem(chatSeenKey(),last.createdAt);if(nearBottom)box.scrollTop=box.scrollHeight}catch{}}
async function pollChat(){if(screen!=='chat')return;await refreshChatMessages();schedulePoll('chat',pollChat,6000)}
async function renderChat(){
  clearTimeout(chatTimer);await refreshCrew();const j=await api('chatList',{params:{crewId}});
  const emojis=['😂','😭','🔥','👀','❤️','🤣','😍','😎','🤡','💀','🙄','😤','🥳','🤝','👍','👎','🍻','☕','🏏','🎉','🤔','😴','😈','✨'];
  app.innerHTML=shell(`${top('Crew Chat','crew')}<div id="chat" class="chat">${chatHtml(j.messages)}</div><div class="composer"><button class="emojiToggle" onclick="window._toggleEmoji()">😀</button><input id="chatInput" maxlength="240" placeholder="Message your Crew…" onkeydown="if(event.key==='Enter')window._sendChat()"><button onclick="window._sendChat()">Send</button></div><div id="emojiPicker" class="emojiPicker">${emojis.map(e=>`<button onclick="window._emoji('${e}')">${e}</button>`).join('')}</div>`);
  const box=$('#chat');if(box)box.scrollTop=box.scrollHeight;markChatSeen();
  schedulePoll('chat',pollChat,6000)
}
window._toggleEmoji=()=>{$('#emojiPicker')?.classList.toggle('open');$('#chatInput')?.focus()};
window._emoji=x=>{const i=$('#chatInput');if(!i)return;const start=i.selectionStart??i.value.length,end=i.selectionEnd??i.value.length;i.value=i.value.slice(0,start)+x+i.value.slice(end);i.focus();i.selectionStart=i.selectionEnd=start+x.length};
window._quick=window._emoji;
window._sendChat=async()=>{const i=$('#chatInput');const text=i?.value.trim();if(!text)return;try{const j=await api('chatSend',{method:'POST',body:{crewId,participantId:pid,text}});track('chat_message_sent');if(j.latestChatAt){crew.latestChatAt=j.latestChatAt;localStorage.setItem(chatSeenKey(),j.latestChatAt)}i.value='';await refreshChatMessages();i.focus()}catch(e){toast(e.message)}};



boot();
