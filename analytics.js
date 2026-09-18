const A=document.getElementById('analyticsApp'),$=s=>document.querySelector(s);
let adminKey=sessionStorage.addaAnalyticsKey||'',D=null,days=30,visitorSearch='';

function esc(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function toast(t){const el=$('#toast');if(!el)return;el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1600)}
function n(v){return Number(v||0).toLocaleString()}
function pct(v){return `${Number(v||0).toFixed(1)}%`}
function fmt(ts){if(!ts)return '—';try{return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(ts))}catch{return ts}}
function ago(ts){if(!ts)return '—';const m=Math.max(0,Math.round((Date.now()-new Date(ts).getTime())/60000));if(m<1)return 'now';if(m<60)return `${m}m`;const h=Math.floor(m/60);if(h<24)return `${h}h`;return `${Math.floor(h/24)}d`}
function keyLabel(k){return String(k||'').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
function screenLabel(screen){
  const map={
    home:'Home',crew:'Crew',create:'Create Drop',vibe:'Vibe',profile:'Profile',
    chat:'Crew Chat',recap:'Recap',crewSettings:'Crew Settings',crewInsights:'Field-test Insights',
    drop:'Drop',join:'Join Crew',start:'Start'
  };
  return map[screen]||keyLabel(screen||'Unknown Screen')
}
function eventLabel(e){
  if(e?.event==='screen_view') return screenLabel(e?.meta?.screen)+' Viewed';
  return keyLabel(e?.event)
}

async function adminApi(action,params={}){
  const q=new URLSearchParams({action,...params});
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),15000);
  try{
    const r=await fetch(`/api?${q}`,{headers:{'x-adda-admin-key':adminKey},signal:ctl.signal});
    const j=await r.json().catch(()=>({}));
    if(r.status===401)throw Object.assign(new Error('Not authorized.'),{unauthorized:true});
    if(!r.ok)throw new Error(j.error||'Could not load analytics.');
    return j
  }finally{clearTimeout(timer)}
}
function renderLogin(msg=''){
  A.innerHTML=`<section class="analyticsLogin"><div class="analyticsBrand">Adda</div><div class="analyticsLoginCard"><div class="tiny">PRIVATE BACKEND</div><h1>Adda Analytics</h1><p>Founder-only field-test dashboard.</p>${msg?`<div class="analyticsError">${esc(msg)}</div>`:''}<label>Admin key</label><input id="analyticsKey" type="password" autocomplete="current-password" placeholder="Enter private analytics key"><button class="btn primary" onclick="loginAnalytics()">Open dashboard</button><small>Key stays in this browser tab only.</small></div></section>`;
}
window.loginAnalytics=async()=>{
  const k=$('#analyticsKey')?.value.trim();if(!k)return;
  adminKey=k;sessionStorage.addaAnalyticsKey=k;
  try{await loadDashboard()}catch(e){if(e.unauthorized){adminKey='';sessionStorage.removeItem('addaAnalyticsKey');renderLogin('Wrong admin key.')}else renderLogin(e.message)}
};
window.logoutAnalytics=()=>{adminKey='';sessionStorage.removeItem('addaAnalyticsKey');D=null;renderLogin()};

async function loadDashboard(){
  A.innerHTML=`<div class="analyticsLoading"><div class="analyticsSpinner"></div><b>Loading analytics…</b><span>Aggregating field-test activity</span></div>`;
  try{D=await adminApi('analyticsDashboard',{days:String(days)});renderDashboard()}
  catch(e){if(e.unauthorized){adminKey='';sessionStorage.removeItem('addaAnalyticsKey');renderLogin('Admin key required.')}else{A.innerHTML=`<div class="analyticsLoading"><b>Couldn’t load analytics</b><span>${esc(e.message)}</span><button class="btn primary" onclick="loadDashboard()">Retry</button></div>`}}
}
window.setDays=d=>{days=d;loadDashboard()};
window.refreshAnalytics=()=>loadDashboard();

function statCard(label,value,sub='',tone=''){
  return `<div class="analyticsStat ${tone}"><span>${label}</span><b>${value}</b>${sub?`<small>${sub}</small>`:''}</div>`
}
function barList(title,rows=[]){
  const max=Math.max(1,...rows.map(x=>Number(x.count)||0));
  return `<div class="analyticsPanel"><h3>${esc(title)}</h3><div class="barList">${rows.length?rows.map(x=>`<div class="barRow"><div class="barLabel"><span>${esc(x.label)}</span><b>${n(x.count)}</b></div><div class="barTrack"><i style="width:${Math.max(3,Math.round((Number(x.count)||0)/max*100))}%"></i></div></div>`).join(''):'<p class="emptyText">No data yet.</p>'}</div></div>`
}
function funnelHtml(rows=[]){
  const max=Math.max(1,rows[0]?.value||1);
  return `<div class="analyticsPanel wide"><div class="panelHead"><div><div class="tiny">CONVERSION</div><h3>Field-test funnel</h3></div><span class="analyticsHint">Unique people per step</span></div><div class="funnel">${rows.map((x,i)=>{const w=Math.max(5,Math.round((x.value/max)*100));const prev=i?rows[i-1].value:max;return `<div class="funnelRow"><div class="funnelText"><span>${esc(x.label)}</span><b>${n(x.value)}</b><small>${i?pct(prev?x.value/prev*100:0):'100.0%'}</small></div><div class="funnelTrack"><i style="width:${w}%"></i></div></div>`}).join('')}</div></div>`
}
function dailyHtml(rows=[]){
  const recent=rows.slice(-14),max=Math.max(1,...recent.map(x=>Number(x.events)||0));
  return `<div class="analyticsPanel wide"><div class="panelHead"><div><div class="tiny">TREND</div><h3>Daily activity</h3></div><span class="analyticsHint">Last ${recent.length||0} active days</span></div><div class="dailyBars">${recent.length?recent.map(x=>`<div class="dailyCol" title="${esc(x.date)} · ${n(x.events)} events"><i style="height:${Math.max(4,Math.round((x.events/max)*120))}px"></i><b>${n(x.answers)}</b><span>${esc(x.date.slice(5))}</span></div>`).join(''):'<p class="emptyText">No activity yet.</p>'}</div><div class="dailyLegend"><span><i class="dot purple"></i> bar = all events</span><span><b>#</b> = answers</span></div></div>`
}
function crewTable(rows=[]){
  return `<div class="analyticsPanel wide"><div class="panelHead"><div><div class="tiny">CREWS</div><h3>Crew health</h3></div><span class="analyticsHint">${n(rows.length)} total</span></div><div class="tableWrap"><table><thead><tr><th>Crew</th><th>Members</th><th>Drops</th><th>Answers</th><th>Chat</th><th>Created</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.name)}</b><small>${esc(x.crewId)}</small></td><td>${n(x.members)}</td><td>${n(x.drops)}</td><td>${n(x.responses)}</td><td>${n(x.chats)}</td><td>${fmt(x.createdAt)}</td></tr>`).join('')}</tbody></table></div></div>`
}
function filteredVisitors(){
  if(!D)return[];const q=visitorSearch.trim().toLowerCase();if(!q)return D.visitors||[];
  return (D.visitors||[]).filter(v=>[v.name,v.participantId,v.ip,v.city,v.region,v.country,v.browser,v.os,v.deviceType,v.source,v.language,v.timezone].join(' ').toLowerCase().includes(q))
}
window.filterVisitors=v=>{visitorSearch=v;const box=$('#visitorTable');if(box)box.innerHTML=visitorTableInner(filteredVisitors())};

function visitorTableInner(rows){
  return `<div class="tableWrap"><table class="visitorTable"><thead><tr><th>Visitor</th><th>Location / IP</th><th>Device</th><th>Sessions</th><th>Answers</th><th>Source</th><th>Last seen</th></tr></thead><tbody>${rows.map(v=>`<tr onclick="showVisitor('${esc(v.participantId)}')"><td><b>${esc(v.name||'Unnamed')}</b><small>${esc(v.participantId)}</small></td><td><b>${esc([v.city,v.region,v.country].filter(Boolean).join(', ')||'Unknown')}</b><small>${esc(v.ip||'No IP')}</small></td><td><b>${esc(v.deviceType||'Unknown')} · ${esc(v.browser||'')}</b><small>${esc(v.os||'')} ${v.platform?`· ${esc(v.platform)}`:''}</small></td><td>${n(v.sessions)}<small>${n(v.visits)} loads</small></td><td>${n(v.answerCount)}<small>${n(v.dropCreates)} created</small></td><td>${esc(v.source||'Direct / unknown')}</td><td>${ago(v.lastSeen)}<small>${fmt(v.lastSeen)}</small></td></tr>`).join('')}</tbody></table></div>`
}
function visitorsPanel(){
  const rows=filteredVisitors();
  return `<div class="analyticsPanel wide"><div class="panelHead"><div><div class="tiny">VISITORS</div><h3>Unique visitor list</h3></div><div class="panelTools"><input class="analyticsSearch" placeholder="Search name, IP, city, device…" value="${esc(visitorSearch)}" oninput="filterVisitors(this.value)"><button onclick="exportVisitors()">Export CSV</button></div></div><div id="visitorTable">${visitorTableInner(rows)}</div></div>`
}
window.showVisitor=id=>{
  const v=(D?.visitors||[]).find(x=>x.participantId===id);if(!v)return;
  const events=(D?.recentEvents||[]).filter(x=>x.participantId===id).slice(0,20);
  const modal=document.createElement('div');modal.className='analyticsModal';
  modal.innerHTML=`<div class="analyticsModalCard"><button class="modalClose" onclick="this.closest('.analyticsModal').remove()">×</button><div class="tiny">VISITOR DETAIL</div><h2>${esc(v.name||'Unnamed visitor')}</h2><p class="mono">${esc(v.participantId)}</p><div class="detailGrid">
  ${detail('First seen',fmt(v.firstSeen))}${detail('Last seen',fmt(v.lastSeen))}${detail('Sessions',n(v.sessions))}${detail('Page loads',n(v.visits))}
  ${detail('IP',v.ip||'—')}${detail('Location',[v.city,v.region,v.country].filter(Boolean).join(', ')||'—')}${detail('Timezone',v.timezone||'—')}${detail('Language',v.language||'—')}
  ${detail('Device',`${v.deviceType||'—'} · ${v.browser||''} · ${v.os||''}`)}${detail('Platform',v.platform||'—')}${detail('Screen',v.screen?.width?`${v.screen.width}×${v.screen.height} @${v.screen.dpr||1}x`:'—')}${detail('Viewport',v.viewport?.width?`${v.viewport.width}×${v.viewport.height}`:'—')}
  ${detail('Network',v.connection?.effectiveType?`${v.connection.effectiveType} · ${v.connection.downlink||0} Mbps · ${v.connection.rtt||0} ms`:'—')}${detail('Device memory',v.deviceMemory?`${v.deviceMemory} GB`:'—')}${detail('CPU threads',v.hardwareConcurrency||'—')}${detail('Source',v.source||'Direct / unknown')}
  ${detail('First referrer',v.referrer||'—')}${detail('Answers',n(v.answerCount))}${detail('Drops created',n(v.dropCreates))}${detail('Chat messages',n(v.chatMessages))}
  </div><div class="sp18"></div><h3>Recent tracked activity</h3><div class="eventMini">${events.length?events.map(e=>`<div><span>${fmt(e.createdAt)}</span><b>${esc(eventLabel(e))}</b><small>${esc(e.crewName||e.crewId||'')}</small></div>`).join(''):'<p class="emptyText">No recent events in the current window.</p>'}</div></div>`;
  modal.onclick=e=>{if(e.target===modal)modal.remove()};document.body.appendChild(modal)
};
function detail(k,v){return `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`}

function eventsPanel(){
  const rows=D?.recentEvents||[];
  return `<div class="analyticsPanel wide"><div class="panelHead"><div><div class="tiny">ACTIVITY</div><h3>Recent events</h3></div><button onclick="exportEvents()">Export CSV</button></div><div class="tableWrap"><table><thead><tr><th>Time</th><th>Event</th><th>Visitor</th><th>Crew</th><th>Location</th><th>Device</th></tr></thead><tbody>${rows.map(e=>`<tr><td>${fmt(e.createdAt)}</td><td><b>${esc(eventLabel(e))}</b>${e.legacy?'<small>legacy</small>':''}</td><td>${esc(e.name||e.participantId||'—')}</td><td>${esc(e.crewName||e.crewId||'—')}</td><td>${esc([e.city,e.country].filter(Boolean).join(', ')||'—')}</td><td>${esc([e.deviceType,e.browser].filter(Boolean).join(' · ')||'—')}</td></tr>`).join('')}</tbody></table></div></div>`
}
function errorsPanel(){
  const rows=(D?.recentEvents||[]).filter(e=>e.event==='client_error');
  return `<div class="analyticsPanel"><h3>Client errors</h3><div class="errorList">${rows.length?rows.slice(0,20).map(e=>`<div><b>${esc(e.meta?.message||'Unknown error')}</b><span>${fmt(e.createdAt)} · ${esc(e.name||e.participantId||'')}</span></div>`).join(''):'<p class="emptyText">No tracked client errors.</p>'}</div></div>`
}

function dropTypesPanel(){
  const rows=D?.dropTypes||[];
  return `<div class="analyticsPanel wide"><div class="panelHead"><div><div class="tiny">DROP ENGINE</div><h3>Format performance</h3></div><span class="analyticsHint">Current Drops + tracked opens/shares</span></div><div class="tableWrap"><table><thead><tr><th>Format</th><th>Drops</th><th>Responses</th><th>Avg / Drop</th><th>Opens</th><th>Share actions</th><th>Media</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(keyLabel(x.type))}</b></td><td>${n(x.drops)}</td><td>${n(x.responses)}</td><td>${x.avgResponses}</td><td>${n(x.opens)}</td><td>${n(x.shares)}</td><td>${n(x.mediaDrops)}</td></tr>`).join('')}</tbody></table></div></div>`
}
function topDropsPanel(){
  const rows=(D?.dropPerformance||[]).slice(0,30);
  return `<div class="analyticsPanel wide"><div class="panelHead"><div><div class="tiny">CONTENT</div><h3>Top Drops</h3></div><button onclick="exportDrops()">Export CSV</button></div><div class="tableWrap"><table><thead><tr><th>Question</th><th>Type</th><th>Crew</th><th>Responses</th><th>Opens</th><th>Shares</th><th>Creator</th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.question)}</b><small>${esc(x.dropId)}</small></td><td>${esc(keyLabel(x.type))}</td><td>${esc(x.crewName||x.crewId||'—')}</td><td>${n(x.responses)}</td><td>${n(x.opens)}</td><td>${n(x.shares)}</td><td>${esc(x.creatorName||'—')}</td></tr>`).join('')}</tbody></table></div></div>`
}
function exportCSV(name,rows){
  if(!rows?.length)return toast('No data to export');
  const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))],cell=v=>{const x=typeof v==='object'&&v!==null?JSON.stringify(v):String(v??'');return `"${x.replace(/"/g,'""')}"`};
  const csv=[keys.map(cell).join(','),...rows.map(r=>keys.map(k=>cell(r[k])).join(','))].join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
window.exportVisitors=()=>exportCSV(`adda-visitors-${new Date().toISOString().slice(0,10)}.csv`,D?.visitors||[]);
window.exportEvents=()=>exportCSV(`adda-events-${new Date().toISOString().slice(0,10)}.csv`,D?.recentEvents||[]);
window.exportCrews=()=>exportCSV(`adda-crews-${new Date().toISOString().slice(0,10)}.csv`,D?.crews||[]);
window.exportDrops=()=>exportCSV(`adda-drops-${new Date().toISOString().slice(0,10)}.csv`,D?.dropPerformance||[]);

function renderDashboard(){
  const s=D.summary,b=D.breakdowns;
  const rangeLabel=days?`Last ${days} days`:'All time';
  A.innerHTML=`<div class="analyticsShell">
    <header class="analyticsTop"><div><div class="analyticsBrand">Adda</div><span>Private Analytics</span></div><div class="analyticsTopActions"><span class="analyticsLive">● LIVE FIELD TEST</span><button onclick="refreshAnalytics()">↻ Refresh</button><button onclick="logoutAnalytics()">Lock</button></div></header>
    <div class="analyticsFilters"><div class="rangeButtons">${[1,7,30,0].map(d=>`<button class="${days===d?'on':''}" onclick="setDays(${d})">${d===0?'All time':d===1?'24 hours':`${d} days`}</button>`).join('')}</div><span>Generated ${fmt(D.generatedAt)} · ${rangeLabel}</span></div>
    <div class="analyticsNotice"><b>Analytics v1:</b> IP/device/location visitor profiles start from this dashboard deployment. Earlier Adda action events are preserved as <b>legacy events</b>, but they cannot be retroactively assigned IP/location data.</div>

    <section class="analyticsStats">
      ${statCard('Unique visitors',n(s.uniqueVisitors),`${n(s.newVisitors)} new · ${n(s.returningVisitors)} returning`,'purple')}
      ${statCard('Sessions',n(s.sessions),`${n(s.pageLoads)} page loads`)}
      ${statCard('Engaged visitors',n(s.engagedVisitors),`${pct(s.engagementRate)} of visitors`,'green')}
      ${statCard('Answered ≥1',n(s.answered),`${n(s.totalAnswers)} total answers`)}
      ${statCard('Answered ≥5',n(s.answered5),'high-intent users','pink')}
      ${statCard('Creators',n(s.creators),`${n(s.totalDropsCreated)} Drops created`)}
      ${statCard('Sharers',n(s.sharers),`${n(s.totalShares)} share actions`)}
      ${statCard('Unique IPs',n(s.uniqueIPs),`${n(s.clientErrors)} client errors`)}
    </section>

    <section class="analyticsGrid">
      ${funnelHtml(s.funnel)}
      ${dailyHtml(D.daily)}
      ${barList('Top cities',b.cities)}
      ${barList('Countries',b.countries)}
      ${barList('Devices',b.devices)}
      ${barList('Browsers',b.browsers)}
      ${barList('Operating systems',b.os)}
      ${barList('Acquisition sources',b.sources)}
      ${barList('Languages',b.languages)}
      ${barList('Network type',b.networks)}
      <div class="analyticsPanel"><h3>Performance</h3><div class="bigMetric"><b>${n(s.performance.avgPageLoadMs)} ms</b><span>average page load</span></div><div class="bigMetric"><b>${n(s.performance.avgTTFBMs)} ms</b><span>average TTFB</span></div></div>
      ${errorsPanel()}
      ${dropTypesPanel()}
      ${topDropsPanel()}
      ${crewTable(D.crews)}
      ${visitorsPanel()}
      ${eventsPanel()}
    </section>
    <footer class="analyticsFooter"><span>Private founder analytics · Adda field test</span><button onclick="exportCrews()">Export Crew CSV</button></footer>
  </div>`;
}
if(adminKey)loadDashboard();else renderLogin();
