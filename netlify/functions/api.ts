import type { Context, Config } from "@netlify/functions";
import { getStore, getDeployStore } from "@netlify/blobs";
import { createHash, timingSafeEqual } from "node:crypto";

const FIELD_TEST_STORE="adda-v05-fieldtest";
const LEGACY_PREVIEW_DEPLOY_ID="6aad2b6751428f000883e731";
const MIGRATION_MARKER="__migration/from-"+LEGACY_PREVIEW_DEPLOY_ID;
let previewMigration:any=null;

async function migratePreviewData(target:any){
  const already=await target.get(MIGRATION_MARKER);
  if(already) return;
  const source=getDeployStore({ name:"adda-v05-preview", deployID:LEGACY_PREVIEW_DEPLOY_ID, consistency:"strong" } as any);
  const { blobs }=await source.list();
  for(const b of blobs){
    const raw=await source.get(b.key,{type:"arrayBuffer"});
    if(raw) await target.set(b.key,raw);
  }
  await target.set(MIGRATION_MARKER,"migrated:"+new Date().toISOString());
}

async function makeStore(context:any){
  if(context?.deploy?.context==="production") return getStore({ name:"adda-v03", consistency:"strong" });
  const target=getStore({ name:FIELD_TEST_STORE, consistency:"strong" });
  const marker=await target.get(MIGRATION_MARKER);
  if(!marker){
    if(!previewMigration) previewMigration=migratePreviewData(target).finally(()=>{previewMigration=null});
    await previewMigration;
  }
  return target;
}
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const ok = (data:any, status=200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
const bad = (message:string, status=400) => ok({ error: message }, status);
const clean = (v:any, max=120) => String(v ?? "").trim().slice(0,max);
const id = (prefix="") => prefix + crypto.randomUUID().replace(/-/g,"").slice(0,10);
const now = () => new Date().toISOString();
const safeMediaRef=(v:any,crewId:string)=>{const x=clean(v,180);return x.startsWith(`media/${crewId}/`)?x:""};
const mediaMime=(key:string)=>key.endsWith(".webp")?"image/webp":key.endsWith(".png")?"image/png":"image/jpeg";

const ANALYTICS_STARTED_AT="2026-09-18T14:00:00.000Z";
const ANALYTICS_ADMIN_KEY_SHA256="8bd875312eca9b0767e93edec8eef779acc066e4dc22d20b633df6da53938878";
const adminOK=(req:Request)=>{
  const supplied=req.headers.get("x-adda-admin-key")||"";
  if(!supplied)return false;
  const actual=createHash("sha256").update(supplied).digest();
  const expected=Buffer.from(ANALYTICS_ADMIN_KEY_SHA256,"hex");
  return actual.length===expected.length&&timingSafeEqual(actual,expected)
};
const trimArray=(xs:any[],n=8)=>xs.filter(Boolean).slice(-n);
const uniqPush=(xs:any[],v:any,n=8)=>{const arr=(xs||[]).filter((x:any)=>JSON.stringify(x)!==JSON.stringify(v));if(v!==undefined&&v!==null&&v!=="")arr.push(v);return trimArray(arr,n)};
function parseUA(ua:string){
  const u=ua||""; let browser="Other",os="Other",device="Desktop";
  if(/Edg\//i.test(u))browser="Edge"; else if(/OPR\//i.test(u))browser="Opera"; else if(/SamsungBrowser\//i.test(u))browser="Samsung Internet"; else if(/CriOS|Chrome\//i.test(u))browser="Chrome"; else if(/FxiOS|Firefox\//i.test(u))browser="Firefox"; else if(/Safari\//i.test(u)&&!/Chrome|CriOS|Android/i.test(u))browser="Safari";
  if(/Android/i.test(u))os="Android"; else if(/iPhone|iPad|iPod/i.test(u))os="iOS"; else if(/Windows NT/i.test(u))os="Windows"; else if(/Mac OS X|Macintosh/i.test(u))os="macOS"; else if(/Linux/i.test(u))os="Linux";
  if(/iPad|Tablet|Android(?!.*Mobile)/i.test(u))device="Tablet"; else if(/Mobi|iPhone|iPod|Android/i.test(u))device="Mobile";
  return {browser,os,deviceType:device};
}
function requestFacts(req:Request,context:any){
  const ua=req.headers.get("user-agent")||"",g=context?.geo||{},p=parseUA(ua);
  return {
    ip:clean(context?.ip||"",80),
    userAgent:clean(ua,500),
    browser:p.browser,os:p.os,deviceType:p.deviceType,
    geo:{
      city:clean(g?.city||"",80),
      region:clean(g?.subdivision?.name||"",80),
      regionCode:clean(g?.subdivision?.code||"",20),
      country:clean(g?.country?.name||"",80),
      countryCode:clean(g?.country?.code||"",10),
      timezone:clean(g?.timezone||"",80)
    }
  };
}
function sanitizeClient(raw:any){
  const x=raw||{}, conn=x.connection||{}, perf=x.performance||{};
  return {
    platform:clean(x.platform,80),language:clean(x.language,40),languages:Array.isArray(x.languages)?x.languages.slice(0,8).map((v:any)=>clean(v,30)):[],
    timezone:clean(x.timezone,80),viewport:{width:Number(x.viewport?.width)||0,height:Number(x.viewport?.height)||0},
    screen:{width:Number(x.screen?.width)||0,height:Number(x.screen?.height)||0,dpr:Number(x.screen?.dpr)||0},
    touchPoints:Number(x.touchPoints)||0,hardwareConcurrency:Number(x.hardwareConcurrency)||0,deviceMemory:Number(x.deviceMemory)||0,
    connection:{effectiveType:clean(conn.effectiveType,20),downlink:Number(conn.downlink)||0,rtt:Number(conn.rtt)||0,saveData:!!conn.saveData},
    displayMode:clean(x.displayMode,30),colorScheme:clean(x.colorScheme,20),reducedMotion:!!x.reducedMotion,
    performance:{duration:Math.round(Number(perf.duration)||0),domContentLoaded:Math.round(Number(perf.domContentLoaded)||0),loadEvent:Math.round(Number(perf.loadEvent)||0),ttfb:Math.round(Number(perf.ttfb)||0)}
  };
}
async function analyticsEvent(store:any,event:string,participantId:string,crewId:string,dropId:string,meta:any,req:Request,context:any,sessionId=""){
  const createdAt=now(),server=requestFacts(req,context);
  const rec={id:id("ae_"),event:clean(event,60),participantId:clean(participantId||"anon",40),sessionId:clean(sessionId,60),crewId:clean(crewId||"",40),dropId:clean(dropId||"",40),meta:meta&&typeof meta==="object"?meta:{},createdAt,server};
  await store.setJSON(`analytics/event/${createdAt}-${rec.id}`,rec);
  return rec;
}
async function touchVisitor(store:any,participantId:string,sessionId:string,client:any,entry:any,req:Request,context:any){
  const pid=clean(participantId||"anon",40),sid=clean(sessionId,60),ts=now(),server=requestFacts(req,context),safe=sanitizeClient(client);
  const key=`analytics/visitor/${pid}`,prev=await getJSON(store,key)||{};
  const sessions=Array.isArray(prev.sessionIds)?prev.sessionIds:[],isNewSession=!!sid&&!sessions.includes(sid);
  const ipHistory=uniqPush(prev.ipHistory||[],server.ip,6);
  const geoKey=[server.geo.city,server.geo.region,server.geo.country].filter(Boolean).join(", ");
  const geoHistory=uniqPush(prev.geoHistory||[],geoKey,6);
  const rec={
    participantId:pid,firstSeen:prev.firstSeen||ts,lastSeen:ts,
    visitCount:(Number(prev.visitCount)||0)+1,sessionCount:(Number(prev.sessionCount)||0)+(isNewSession?1:0),
    sessionIds:isNewSession?uniqPush(sessions,sid,20):sessions,
    firstEntry:prev.firstEntry||entry,lastEntry:entry,
    firstServer:prev.firstServer||server,lastServer:server,firstClient:prev.firstClient||safe,lastClient:safe,
    firstReferrer:prev.firstReferrer||clean(entry?.referrer,300),lastReferrer:clean(entry?.referrer,300),
    firstSource:prev.firstSource||clean(entry?.source,80),lastSource:clean(entry?.source,80),
    ipHistory,geoHistory,actionCount:Number(prev.actionCount)||0,names:prev.names||[]
  };
  await store.setJSON(key,rec);
  if(sid){
    const sk=`analytics/session/${sid}`,old=await getJSON(store,sk)||{};
    await store.setJSON(sk,{sessionId:sid,participantId:pid,firstSeen:old.firstSeen||ts,lastSeen:ts,pageLoads:(Number(old.pageLoads)||0)+1,entry:old.entry||entry,lastEntry:entry,server:old.server||server,client:old.client||safe});
  }
  return rec;
}
async function touchVisitorAction(store:any,participantId:string,req:Request,context:any,crewId="",dropId=""){
  const pid=clean(participantId||"anon",40),key=`analytics/visitor/${pid}`,prev=await getJSON(store,key);
  if(!prev)return;
  prev.lastSeen=now();prev.actionCount=(Number(prev.actionCount)||0)+1;prev.lastServer=requestFacts(req,context);
  if(crewId||dropId)prev.lastEntry={...(prev.lastEntry||{}),crewId:clean(crewId,40),dropId:clean(dropId,40)};
  await store.setJSON(key,prev);
}
function topCounts(rows:any[],keyFn:(x:any)=>string,limit=12){
  const m:any={};rows.forEach(x=>{const k=keyFn(x)||"Unknown";m[k]=(m[k]||0)+1});
  return Object.entries(m).map(([label,count])=>({label,count:Number(count)})).sort((a,b)=>b.count-a.count).slice(0,limit);
}
function pct(n:number,d:number){return d?Math.round(n/d*1000)/10:0}



async function getJSON(store:any,key:string){ return await store.get(key, { type:"json" }) as any; }
async function listJSON(store:any,prefix:string, limit=100){
  const { blobs } = await store.list({ prefix });
  const chosen = blobs.slice(-limit);
  const rows = await Promise.all(chosen.map(async b => ({ key:b.key, data: await getJSON(store,b.key) })));
  return rows.filter(x=>x.data).map(x=>x.data);
}

export default async (req: Request, context: Context) => {
  try {
    const store = await makeStore(context);
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "";
    const body = req.method === "POST" ? await req.json().catch(()=>({})) : {};


    if (action === "analyticsVisit" && req.method === "POST") {
      const participantId=clean(body.participantId||"anon",40),sessionId=clean(body.sessionId,60);
      const entry={
        crewId:clean(body.crewId,40),dropId:clean(body.dropId,40),path:clean(body.path,160),
        referrer:clean(body.referrer,300),source:clean(body.source,80),medium:clean(body.medium,80),campaign:clean(body.campaign,120),
        firstLocalSeen:clean(body.firstLocalSeen,60),returningLocal:!!body.returningLocal,knownCrewCount:Number(body.knownCrewCount)||0
      };
      const visitor=await touchVisitor(store,participantId,sessionId,body.client||{},entry,req,context);
      await analyticsEvent(store,"visit_started",participantId,entry.crewId,entry.dropId,{entry,client:sanitizeClient(body.client||{})},req,context,sessionId);
      if(entry.dropId)await analyticsEvent(store,"drop_link_opened",participantId,entry.crewId,entry.dropId,{source:entry.source,referrer:entry.referrer},req,context,sessionId);
      else if(entry.crewId)await analyticsEvent(store,"crew_link_opened",participantId,entry.crewId,"",{source:entry.source,referrer:entry.referrer},req,context,sessionId);
      return ok({saved:true,firstSeen:visitor.firstSeen,visitCount:visitor.visitCount,sessionCount:visitor.sessionCount});
    }

    if (action === "analyticsDashboard") {
      if(!adminOK(req))return bad("Not authorized.",401);
      const days=Math.max(0,Math.min(3650,Number(url.searchParams.get("days"))||30));
      const since=days?new Date(Date.now()-days*86400000).toISOString():"";
      const inRange=(ts:any)=>!since||String(ts||"")>=since;

      const visitors=(await listJSON(store,"analytics/visitor/",100000)).filter((v:any)=>inRange(v.lastSeen));
      const sessions=(await listJSON(store,"analytics/session/",100000)).filter((v:any)=>inRange(v.lastSeen));
      const analyticsEvents=(await listJSON(store,"analytics/event/",100000)).filter((e:any)=>inRange(e.createdAt));
      const legacyEvents=(await listJSON(store,"event/",100000)).filter((e:any)=>String(e.createdAt||"")<ANALYTICS_STARTED_AT&&inRange(e.createdAt));
      const events=[...legacyEvents.map((e:any)=>({...e,legacy:true,server:{userAgent:e.ua||""}})),...analyticsEvents].sort((a:any,b:any)=>String(a.createdAt).localeCompare(String(b.createdAt)));

      const memberRows=await listJSON(store,"member/",100000),nameMap:any={},crewNamesByPerson:any={};
      memberRows.forEach((m:any)=>{if(!m?.id)return;if(!nameMap[m.id]||String(m.joinedAt)>String(nameMap[m.id].joinedAt||""))nameMap[m.id]={name:m.nickname||"",joinedAt:m.joinedAt||""};});
      const crewRows=await listJSON(store,"crew/",100000),crewMap:any={};crewRows.forEach((c:any)=>crewMap[c.id]=c);
      const memberKeys=(await store.list({prefix:"member/"})).blobs.map((b:any)=>b.key);
      const dropKeys=(await store.list({prefix:"dropIndex/"})).blobs.map((b:any)=>b.key);
      const responseKeys=(await store.list({prefix:"response/"})).blobs.map((b:any)=>b.key);
      const chatKeys=(await store.list({prefix:"chat/"})).blobs.map((b:any)=>b.key);
      const currentDrops=await listJSON(store,"drop/",100000);
      const responseCountByDrop:any={};responseKeys.forEach((k:string)=>{const p=k.split("/");if(p[1]&&p[2]){const dk=p[1]+"/"+p[2];responseCountByDrop[dk]=(responseCountByDrop[dk]||0)+1}});

      const crewAgg:any={};
      const ensureCrew=(id:string)=>crewAgg[id]||(crewAgg[id]={crewId:id,name:crewMap[id]?.name||id,createdAt:crewMap[id]?.createdAt||"",members:0,drops:0,responses:0,chats:0});
      memberKeys.forEach((k:string)=>{const p=k.split("/");if(p[1])ensureCrew(p[1]).members++});
      dropKeys.forEach((k:string)=>{const p=k.split("/");if(p[1])ensureCrew(p[1]).drops++});
      responseKeys.forEach((k:string)=>{const p=k.split("/");if(p[1])ensureCrew(p[1]).responses++});
      chatKeys.forEach((k:string)=>{const p=k.split("/");if(p[1])ensureCrew(p[1]).chats++});

      const participantActions:any={},participantDrops:any={},eventCounts:any={},uniqueByEvent:any={},dropEventCounts:any={};
      events.forEach((e:any)=>{
        const ev=e.event||"unknown";eventCounts[ev]=(eventCounts[ev]||0)+1;
        if(!uniqueByEvent[ev])uniqueByEvent[ev]=new Set();if(e.participantId&&e.participantId!=="anon")uniqueByEvent[ev].add(e.participantId);
        if(e.participantId&&e.participantId!=="anon"){participantActions[e.participantId]=participantActions[e.participantId]||{};participantActions[e.participantId][ev]=(participantActions[e.participantId][ev]||0)+1;}
        if(e.event==="response_submitted"&&e.participantId&&e.participantId!=="anon"){
          participantDrops[e.participantId]=participantDrops[e.participantId]||new Set();
          const dk=e.dropId||e.meta?.dropId||"";if(dk)participantDrops[e.participantId].add(dk);
        }
        const dk=e.dropId||e.meta?.dropId||"";if(dk){dropEventCounts[dk]=dropEventCounts[dk]||{};dropEventCounts[dk][ev]=(dropEventCounts[dk][ev]||0)+1}
      });
      const ids=(ev:string)=>new Set((events.filter((e:any)=>e.event===ev&&e.participantId&&e.participantId!=="anon")).map((e:any)=>e.participantId));
      const joined=new Set([...ids("crew_joined"),...ids("crew_joined_via_drop"),...ids("crew_created")]);
      const answered=ids("response_submitted"),creators=ids("drop_created"),sharers=new Set([...ids("drop_shared"),...ids("crew_shared"),...ids("share_attempted")]),chatters=ids("chat_message_sent");
      let answered2=0,answered5=0;Object.keys(participantActions).forEach((pid:string)=>{const distinct=participantDrops[pid]?.size||0;const fallback=Number(participantActions[pid]?.response_submitted)||0;const n=distinct||fallback;if(n>=2)answered2++;if(n>=5)answered5++});

      const visitorRows=visitors.map((v:any)=>{
        const a=participantActions[v.participantId]||{},n=nameMap[v.participantId]?.name||"";
        return {
          participantId:v.participantId,name:n,firstSeen:v.firstSeen,lastSeen:v.lastSeen,visits:v.visitCount||0,sessions:v.sessionCount||0,actions:v.actionCount||0,
          ip:v.lastServer?.ip||"",city:v.lastServer?.geo?.city||"",region:v.lastServer?.geo?.region||"",country:v.lastServer?.geo?.country||"",countryCode:v.lastServer?.geo?.countryCode||"",
          browser:v.lastServer?.browser||"",os:v.lastServer?.os||"",deviceType:v.lastServer?.deviceType||"",
          platform:v.lastClient?.platform||"",language:v.lastClient?.language||"",timezone:v.lastClient?.timezone||v.lastServer?.geo?.timezone||"",
          viewport:v.lastClient?.viewport||{},screen:v.lastClient?.screen||{},connection:v.lastClient?.connection||{},hardwareConcurrency:v.lastClient?.hardwareConcurrency||0,deviceMemory:v.lastClient?.deviceMemory||0,
          source:v.firstSource||"",referrer:v.firstReferrer||"",firstEntry:v.firstEntry||{},lastEntry:v.lastEntry||{},answerCount:(participantDrops[v.participantId]?.size||a.response_submitted||0),dropCreates:a.drop_created||0,chatMessages:a.chat_message_sent||0,shares:(a.drop_shared||0)+(a.crew_shared||0)+(a.share_attempted||0)
        }
      }).sort((a:any,b:any)=>String(b.lastSeen).localeCompare(String(a.lastSeen)));

      const uniqueVisitorIds=new Set(visitors.map((v:any)=>v.participantId));
      const newVisitors=visitors.filter((v:any)=>inRange(v.firstSeen)).length;
      const returningVisitors=visitors.filter((v:any)=>(Number(v.sessionCount)||0)>1).length;
      const engaged=visitorRows.filter((v:any)=>v.answerCount>0||v.dropCreates>0||v.chatMessages>0).length;
      const dropEntryVisitors=new Set(analyticsEvents.filter((e:any)=>e.event==="drop_link_opened").map((e:any)=>e.participantId)).size;
      const visitEvents=analyticsEvents.filter((e:any)=>e.event==="visit_started");
      const ipSet=new Set(visitors.map((v:any)=>v.lastServer?.ip).filter(Boolean));
      const perf=visitors.map((v:any)=>v.lastClient?.performance).filter((x:any)=>x&&x.duration);
      const avg=(arr:number[])=>arr.length?Math.round(arr.reduce((a,b)=>a+b,0)/arr.length):0;

      const dayMap:any={};events.forEach((e:any)=>{const d=String(e.createdAt||"").slice(0,10);if(!d)return;dayMap[d]=dayMap[d]||{date:d,events:0,answers:0,joins:0,creates:0,shares:0};dayMap[d].events++;if(e.event==="response_submitted")dayMap[d].answers++;if(["crew_joined","crew_joined_via_drop","crew_created"].includes(e.event))dayMap[d].joins++;if(e.event==="drop_created")dayMap[d].creates++;if(["drop_shared","crew_shared","share_attempted"].includes(e.event))dayMap[d].shares++;});
      const recentEvents=events.slice(-250).reverse().map((e:any)=>({createdAt:e.createdAt,event:e.event,participantId:e.participantId,name:nameMap[e.participantId]?.name||"",crewId:e.crewId||"",crewName:crewMap[e.crewId]?.name||"",dropId:e.dropId||"",meta:e.meta||{},legacy:!!e.legacy,ip:e.server?.ip||"",city:e.server?.geo?.city||"",country:e.server?.geo?.country||"",deviceType:e.server?.deviceType||"",browser:e.server?.browser||""}));
      const dropPerformance=currentDrops.map((d:any)=>{const ev=dropEventCounts[d.id]||{},responses=responseCountByDrop[(d.crewId||"")+"/"+d.id]||0,opens=(ev.drop_opened||0)+(ev.drop_link_opened||0),shares=ev.drop_shared||0;return {dropId:d.id,crewId:d.crewId||"",crewName:crewMap[d.crewId]?.name||"",type:d.type||"",question:d.question||"",createdAt:d.createdAt||"",creatorName:d.creatorName||nameMap[d.createdBy]?.name||"",responses,opens,shares,answerRate:pct(responses,opens),hasMedia:!!(d.mediaA||d.mediaB)}}).sort((a:any,b:any)=>b.responses-a.responses);
      const typeMap:any={};dropPerformance.forEach((d:any)=>{const t=d.type||"unknown";typeMap[t]=typeMap[t]||{type:t,drops:0,responses:0,opens:0,shares:0,mediaDrops:0};const x=typeMap[t];x.drops++;x.responses+=d.responses;x.opens+=d.opens;x.shares+=d.shares;if(d.hasMedia)x.mediaDrops++});Object.values(typeMap).forEach((x:any)=>{x.avgResponses=x.drops?Math.round(x.responses/x.drops*10)/10:0;x.answerRate=pct(x.responses,x.opens)});

      return ok({
        generatedAt:now(),days,analyticsStartedAt:ANALYTICS_STARTED_AT,
        summary:{
          uniqueVisitors:uniqueVisitorIds.size,newVisitors,returningVisitors,sessions:sessions.length,pageLoads:visitEvents.length,uniqueIPs:ipSet.size,
          engagedVisitors:engaged,engagementRate:pct(engaged,uniqueVisitorIds.size),dropEntryVisitors,
          joined:joined.size,answered:answered.size,answered2,answered5,creators:creators.size,sharers:sharers.size,chatters:chatters.size,
          totalAnswers:eventCounts.response_submitted||0,totalDropsCreated:eventCounts.drop_created||0,totalChats:eventCounts.chat_message_sent||0,totalShares:(eventCounts.drop_shared||0)+(eventCounts.crew_shared||0)+(eventCounts.share_attempted||0),
          clientErrors:eventCounts.client_error||0,legacyEvents:legacyEvents.length,
          funnel:[
            {label:"Visited",value:uniqueVisitorIds.size},
            {label:"Opened shared Drop",value:dropEntryVisitors},
            {label:"Joined/created Crew",value:joined.size},
            {label:"Answered ≥1 Drop",value:answered.size},
            {label:"Answered ≥2 Drops",value:answered2},
            {label:"Answered ≥5 Drops",value:answered5},
            {label:"Created a Drop",value:creators.size},
            {label:"Shared",value:sharers.size}
          ],
          performance:{avgPageLoadMs:avg(perf.map((x:any)=>Number(x.duration)||0)),avgTTFBMs:avg(perf.map((x:any)=>Number(x.ttfb)||0))}
        },
        breakdowns:{
          countries:topCounts(visitors,(v:any)=>v.lastServer?.geo?.country||"Unknown",20),
          cities:topCounts(visitors,(v:any)=>[v.lastServer?.geo?.city,v.lastServer?.geo?.region].filter(Boolean).join(", ")||"Unknown",25),
          devices:topCounts(visitors,(v:any)=>v.lastServer?.deviceType||"Unknown"),
          browsers:topCounts(visitors,(v:any)=>v.lastServer?.browser||"Unknown"),
          os:topCounts(visitors,(v:any)=>v.lastServer?.os||"Unknown"),
          languages:topCounts(visitors,(v:any)=>v.lastClient?.language||"Unknown"),
          timezones:topCounts(visitors,(v:any)=>v.lastClient?.timezone||v.lastServer?.geo?.timezone||"Unknown"),
          sources:topCounts(visitors,(v:any)=>v.firstSource||(/^https?:/.test(v.firstReferrer||"")?"Referral":"Direct / unknown"),20),
          networks:topCounts(visitors,(v:any)=>v.lastClient?.connection?.effectiveType||"Unknown")
        },
        daily:Object.values(dayMap).sort((a:any,b:any)=>a.date.localeCompare(b.date)),
        crews:Object.values(crewAgg).sort((a:any,b:any)=>b.responses-a.responses),
        dropPerformance:dropPerformance.slice(0,500),dropTypes:Object.values(typeMap).sort((a:any,b:any)=>b.responses-a.responses),
        visitors:visitorRows.slice(0,1000),
        recentEvents,eventCounts
      });
    }

    if (action === "createCrew" && req.method === "POST") {
      const name = clean(body.name, 42);
      const nickname = clean(body.nickname, 24);
      if (!name || !nickname) return bad("Crew name and your name are required.");
      const crewId = id("c_");
      const participantId = clean(body.participantId, 40) || id("p_");
      const crew = { id:crewId, name, createdAt:now(), createdBy:participantId };
      await store.setJSON(`crew/${crewId}`, crew);
      await store.setJSON(`member/${crewId}/${participantId}`, { id:participantId, nickname, joinedAt:now() });
      return ok({ crew, participantId });
    }

    if (action === "joinCrew" && req.method === "POST") {
      const crewId = clean(body.crewId, 40), nickname = clean(body.nickname,24);
      const participantId = clean(body.participantId,40) || id("p_");
      const crew = await getJSON(store,`crew/${crewId}`);
      if (!crew) return bad("Crew not found.",404);
      if (!nickname) return bad("Your name is required.");
      await store.setJSON(`member/${crewId}/${participantId}`, { id:participantId, nickname, joinedAt:now() });
      return ok({ crew, participantId });
    }

    if (action === "getCrew") {
      const crewId = clean(url.searchParams.get("crewId"),40);
      const crew = await getJSON(store,`crew/${crewId}`);
      if (!crew) return bad("Crew not found.",404);
      const members = await listJSON(store,`member/${crewId}/`, 100);
      return ok({ crew, members });
    }

    if (action === "uploadMedia" && req.method === "POST") {
      const crewId=clean(body.crewId,40), participantId=clean(body.participantId,40);
      const member=await getJSON(store,`member/${crewId}/${participantId}`); if(!member) return bad("Join the Crew first.",403);
      const dataUrl=String(body.dataUrl||"");
      const m=dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
      if(!m) return bad("Please choose a JPG, PNG or WebP image.");
      const mime=m[1],buf=Buffer.from(m[2],"base64");
      if(!buf.length) return bad("Image is empty.");
      if(buf.length>700000) return bad("Image is too large after compression. Try another image.");
      const ext=mime==="image/png"?"png":mime==="image/webp"?"webp":"jpg";
      const key=`media/${crewId}/${participantId}/${id("img_")}.${ext}`;
      await store.set(key,buf.buffer.slice(buf.byteOffset,buf.byteOffset+buf.byteLength));
      return ok({mediaRef:key,mediaUrl:`/api?action=media&key=${encodeURIComponent(key)}`});
    }

    if (action === "media") {
      const key=clean(url.searchParams.get("key"),180);
      if(!key.startsWith("media/")) return new Response("Not found",{status:404});
      const data=await store.get(key,{type:"arrayBuffer"}); if(!data) return new Response("Not found",{status:404});
      return new Response(data,{status:200,headers:{"content-type":mediaMime(key),"cache-control":"public, max-age=86400"}});
    }

    if (action === "createDrop" && req.method === "POST") {
      const crewId=clean(body.crewId,40), participantId=clean(body.participantId,40);
      const crew=await getJSON(store,`crew/${crewId}`);
      const member=await getJSON(store,`member/${crewId}/${participantId}`);
      if(!crew||!member) return bad("Join the Crew first.",403);
      const type=["short","likely","either","vote","rate","predict"].includes(body.type)?body.type:"vote";
      const question=clean(body.question,120);
      if(!question) return bad("Add a question.");
      let options:any[]=[];
      if(type==="short"){
        options=[];
      } else if(type==="likely"){
        const members=await listJSON(store,`member/${crewId}/`,100);
        options=members.map((m:any)=>({id:m.id,label:m.nickname}));
        if(options.length<2) return bad("At least 2 Crew members are needed for this Drop.");
      } else if(type==="either") {
        options=[clean(body.optionA,40),clean(body.optionB,40)].filter(Boolean).map((x,i)=>({id:`o${i+1}`,label:x}));
        if(options.length!==2) return bad("Add both choices.");
      } else if(type==="predict") {
        const a=clean(body.optionA,40)||"Yes"; const b=clean(body.optionB,40)||"No";
        options=[{id:"o1",label:a},{id:"o2",label:b}];
      } else if(type==="vote") {
        options=(Array.isArray(body.options)?body.options:[]).map((x:any)=>clean(x,40)).filter(Boolean).slice(0,4).map((x:string,i:number)=>({id:`o${i+1}`,label:x}));
        if(options.length<2) return bad("Add at least 2 choices.");
      } else {
        const defaults=["😬 Not for me","😕 Meh","🙂 Decent","😍 Love it","🔥 Obsessed"];
        const custom=Array.isArray(body.ratingLabels)?body.ratingLabels.map((x:any)=>clean(x,28)).slice(0,5):[];
        const labels=defaults.map((d,i)=>custom[i]||d);
        options=labels.map((label,i)=>({id:String(i+1),label}));
      }
      const dropId=id("d_");
      const thresholdMode = body.thresholdMode === "everyone" ? "everyone" : body.thresholdMode === "manual" ? "manual" : "count";
      const thresholdCount = Math.max(2, Math.min(20, Number(body.thresholdCount)||3));
      const currentMembers = await listJSON(store,`member/${crewId}/`,100);
      const memberCountAtCreate = Math.max(1,currentMembers.length);
      const showNames=body.showNames===true; const allowChange=body.allowChange!==false;
      const mediaA=safeMediaRef(body.mediaA,crewId), mediaB=safeMediaRef(body.mediaB,crewId);
      if(mediaB && type!=="either") return bad("Second image is only supported for This / That.");
      const drop={id:dropId,crewId,type,question,options,mediaA,mediaB,createdBy:participantId,creatorName:member.nickname,createdAt:now(),thresholdMode,thresholdCount,memberCountAtCreate,showNames,allowChange,status:"open"};
      await store.setJSON(`drop/${crewId}/${dropId}`,drop);
      await store.setJSON(`dropIndex/${crewId}/${drop.createdAt}-${dropId}`,{dropId,createdAt:drop.createdAt});
      return ok({drop});
    }

    if (action === "listDrops") {
      const crewId=clean(url.searchParams.get("crewId"),40), participantId=clean(url.searchParams.get("participantId"),40);
      const indexes=await listJSON(store,`dropIndex/${crewId}/`,50);
      indexes.sort((a:any,b:any)=>String(b.createdAt).localeCompare(String(a.createdAt)));
      const members=await listJSON(store,`member/${crewId}/`,100);
      const drops=await Promise.all(indexes.map(async (i:any)=>{
        const d=await getJSON(store,`drop/${crewId}/${i.dropId}`); if(!d) return null;
        const responses=await listJSON(store,`response/${crewId}/${d.id}/`,100);
        const mine=responses.find((r:any)=>r.participantId===participantId)||null;
        const threshold=d.thresholdMode==="everyone"?Math.max(1,d.memberCountAtCreate||members.length):d.thresholdMode==="manual"?null:d.thresholdCount;
        const revealed=d.type==="short"?responses.length>0:d.thresholdMode==="manual"?d.manualRevealed===true:responses.length>=Number(threshold||9999);
        return {...d,responseCount:responses.length,threshold,revealed,myResponse:mine};
      }));
      return ok({drops:drops.filter(Boolean),memberCount:members.length});
    }

    if (action === "getDrop") {
      const crewId=clean(url.searchParams.get("crewId"),40), dropId=clean(url.searchParams.get("dropId"),40), participantId=clean(url.searchParams.get("participantId"),40);
      const drop=await getJSON(store,`drop/${crewId}/${dropId}`); if(!drop) return bad("Drop not found.",404);
      const responses=await listJSON(store,`response/${crewId}/${dropId}/`,100);
      const members=await listJSON(store,`member/${crewId}/`,100);
      const threshold=drop.thresholdMode==="everyone"?Math.max(1,drop.memberCountAtCreate||members.length):drop.thresholdMode==="manual"?null:drop.thresholdCount;
      const revealed=drop.type==="short"?responses.length>0:drop.thresholdMode==="manual"?drop.manualRevealed===true:responses.length>=Number(threshold||9999);
      const mine=responses.find((r:any)=>r.participantId===participantId)||null;
      let result:any=null;
      if(revealed){
        if(drop.type==="short"){
          result={entries:responses.map((r:any)=>({nickname:r.nickname,answer:r.answer,answeredAt:r.answeredAt})),total:responses.length};
        } else {
          const counts:any={}; responses.forEach((r:any)=>counts[r.answer]=(counts[r.answer]||0)+1);
          const ranked=Object.entries(counts).map(([answer,count])=>({answer,count:Number(count)})).sort((a,b)=>b.count-a.count);
          result={ranked,total:responses.length};
        }
      }
      const voters=(revealed&&drop.showNames)?responses.map((r:any)=>({participantId:r.participantId,nickname:r.nickname,answer:r.answer})):[];
      return ok({drop,responsesCount:responses.length,threshold,revealed,myResponse:mine,result,members,voters});
    }

    if (action === "answerDrop" && req.method === "POST") {
      const crewId=clean(body.crewId,40), dropId=clean(body.dropId,40), participantId=clean(body.participantId,40), answer=clean(body.answer,160);
      const drop=await getJSON(store,`drop/${crewId}/${dropId}`); const member=await getJSON(store,`member/${crewId}/${participantId}`);
      if(!drop||!member) return bad("Drop or member not found.",404);
      const valid=drop.type==="short" ? answer.length>0 : drop.options.some((o:any)=>String(o.id)===answer); if(!valid) return bad("Invalid answer.");
      const existing=await getJSON(store,`response/${crewId}/${dropId}/${participantId}`);
      if(existing && drop.allowChange===false) return bad("Your answer is already locked.");
      const saved={participantId,nickname:member.nickname,answer,answeredAt:now()};
      await store.setJSON(`response/${crewId}/${dropId}/${participantId}`,saved);
      const responses=await listJSON(store,`response/${crewId}/${dropId}/`,100);
      const threshold=drop.thresholdMode==="everyone"?Math.max(1,drop.memberCountAtCreate||1):drop.thresholdMode==="manual"?null:drop.thresholdCount;
      const revealed=drop.type==="short"?true:drop.thresholdMode==="manual"?drop.manualRevealed===true:responses.length>=Number(threshold||9999);
      return ok({saved:true,myResponse:saved,responsesCount:responses.length,threshold,revealed});
    }

    if (action === "revealDrop" && req.method === "POST") {
      const crewId=clean(body.crewId,40), dropId=clean(body.dropId,40), participantId=clean(body.participantId,40);
      const drop=await getJSON(store,`drop/${crewId}/${dropId}`); if(!drop) return bad("Drop not found.",404);
      if(drop.createdBy!==participantId) return bad("Only the creator can reveal this Drop.",403);
      drop.manualRevealed=true; drop.revealedAt=now(); await store.setJSON(`drop/${crewId}/${dropId}`,drop);
      return ok({drop});
    }

    if (action === "deleteDrop" && req.method === "POST") {
      const crewId=clean(body.crewId,40), dropId=clean(body.dropId,40), participantId=clean(body.participantId,40);
      const drop=await getJSON(store,`drop/${crewId}/${dropId}`);
      if(!drop) return bad("Drop not found.",404);
      if(drop.createdBy!==participantId) return bad("Only the creator can delete this Drop.",403);
      const { blobs:responseBlobs } = await store.list({ prefix:`response/${crewId}/${dropId}/` });
      await Promise.all(responseBlobs.map((b:any)=>store.delete(b.key)));
      if(drop.mediaA) await store.delete(drop.mediaA); if(drop.mediaB) await store.delete(drop.mediaB);
      await store.delete(`drop/${crewId}/${dropId}`);
      await store.delete(`dropIndex/${crewId}/${drop.createdAt}-${dropId}`);
      return ok({deleted:true});
    }


    if (action === "renameCrew" && req.method === "POST") {
      const crewId=clean(body.crewId,40), participantId=clean(body.participantId,40), name=clean(body.name,42);
      const crew=await getJSON(store,`crew/${crewId}`); if(!crew) return bad("Crew not found.",404);
      if(crew.createdBy!==participantId) return bad("Only the Crew admin can rename it.",403);
      if(!name) return bad("Add a Crew name.");
      crew.name=name; crew.updatedAt=now(); await store.setJSON(`crew/${crewId}`,crew); return ok({crew});
    }

    if (action === "removeMember" && req.method === "POST") {
      const crewId=clean(body.crewId,40), participantId=clean(body.participantId,40), targetId=clean(body.targetId,40);
      const crew=await getJSON(store,`crew/${crewId}`); if(!crew) return bad("Crew not found.",404);
      if(crew.createdBy!==participantId) return bad("Only the Crew admin can remove members.",403);
      if(targetId===crew.createdBy) return bad("The Crew admin cannot remove themselves.");
      await store.delete(`member/${crewId}/${targetId}`); return ok({removed:true});
    }

    if (action === "leaveCrew" && req.method === "POST") {
      const crewId=clean(body.crewId,40), participantId=clean(body.participantId,40);
      const crew=await getJSON(store,`crew/${crewId}`); if(!crew) return bad("Crew not found.",404);
      if(crew.createdBy===participantId) return bad("Admin must transfer ownership or delete the Crew.");
      await store.delete(`member/${crewId}/${participantId}`); return ok({left:true});
    }

    if (action === "deleteCrew" && req.method === "POST") {
      const crewId=clean(body.crewId,40), participantId=clean(body.participantId,40);
      const crew=await getJSON(store,`crew/${crewId}`); if(!crew) return bad("Crew not found.",404);
      if(crew.createdBy!==participantId) return bad("Only the Crew admin can delete it.",403);
      const prefixes=[`member/${crewId}/`,`drop/${crewId}/`,`dropIndex/${crewId}/`,`response/${crewId}/`,`chat/${crewId}/`,`event/${crewId}/`,`feedback/${crewId}/`];
      for(const prefix of prefixes){ const {blobs}=await store.list({prefix}); await Promise.all(blobs.map((b:any)=>store.delete(b.key))); }
      await store.delete(`crew/${crewId}`); return ok({deleted:true});
    }


    if (action === "submitFeedback" && req.method === "POST") {
      const crewId=clean(body.crewId,40),participantId=clean(body.participantId,40);
      const member=await getJSON(store,`member/${crewId}/${participantId}`); if(!member) return bad("Join the Crew first.",403);
      const clarity=Math.max(1,Math.min(5,Number(body.clarity)||0)),fun=Math.max(1,Math.min(5,Number(body.fun)||0));
      if(!clarity||!fun) return bad("Please rate clarity and fun.");
      const wouldShare=["yes","maybe","no"].includes(body.wouldShare)?body.wouldShare:"maybe";
      const rec={id:id("f_"),crewId,participantId,nickname:member.nickname,clarity,fun,wouldShare,confusing:clean(body.confusing,240),returnReason:clean(body.returnReason,240),createdAt:now()};
      await store.setJSON(`feedback/${crewId}/${rec.createdAt}-${rec.id}`,rec);
      return ok({saved:true});
    }

    if (action === "crewMetrics") {
      const crewId=clean(url.searchParams.get("crewId"),40),participantId=clean(url.searchParams.get("participantId"),40);
      const crew=await getJSON(store,`crew/${crewId}`); if(!crew) return bad("Crew not found.",404);
      if(crew.createdBy!==participantId) return bad("Only the Crew admin can view test insights.",403);
      const members=await listJSON(store,`member/${crewId}/`,100);
      const indexes=await listJSON(store,`dropIndex/${crewId}/`,100);
      let responseCount=0; const respondentIds=new Set<string>(); const byType:any={};
      for(const i of indexes){const d=await getJSON(store,`drop/${crewId}/${i.dropId}`);if(!d)continue;byType[d.type]=(byType[d.type]||0)+1;const rs=await listJSON(store,`response/${crewId}/${d.id}/`,100);responseCount+=rs.length;rs.forEach((r:any)=>respondentIds.add(r.participantId))}
      const chats=await listJSON(store,`chat/${crewId}/`,500);
      const feedback=await listJSON(store,`feedback/${crewId}/`,100);
      const avg=(key:string)=>feedback.length?Math.round(feedback.reduce((n:number,x:any)=>n+(Number(x[key])||0),0)/feedback.length*10)/10:null;
      return ok({memberCount:members.length,dropCount:indexes.length,responseCount,uniqueRespondents:respondentIds.size,chatCount:chats.length,byType,feedbackCount:feedback.length,avgClarity:avg("clarity"),avgFun:avg("fun"),wouldShare:{yes:feedback.filter((x:any)=>x.wouldShare==="yes").length,maybe:feedback.filter((x:any)=>x.wouldShare==="maybe").length,no:feedback.filter((x:any)=>x.wouldShare==="no").length},feedback:feedback.slice(-20)});
    }

    if (action === "chatList") {
      const crewId=clean(url.searchParams.get("crewId"),40);
      const rows=await listJSON(store,`chat/${crewId}/`,80);
      rows.sort((a:any,b:any)=>String(a.createdAt).localeCompare(String(b.createdAt)));
      return ok({messages:rows.slice(-50)});
    }

    if (action === "chatSend" && req.method === "POST") {
      const crewId=clean(body.crewId,40), participantId=clean(body.participantId,40), text=clean(body.text,240);
      const member=await getJSON(store,`member/${crewId}/${participantId}`); if(!member) return bad("Join the Crew first.",403);
      if(!text) return bad("Message is empty.");
      const message={id:id("m_"),participantId,nickname:member.nickname,text,createdAt:now()};
      await store.setJSON(`chat/${crewId}/${message.createdAt}-${message.id}`,message);
      const crew=await getJSON(store,`crew/${crewId}`);
      if(crew){crew.latestChatAt=message.createdAt;crew.chatCount=(Number(crew.chatCount)||0)+1;await store.setJSON(`crew/${crewId}`,crew)}
      return ok({message,latestChatAt:message.createdAt});
    }

    if (action === "stats") {
      const researchKey = Netlify.env.get("ADDA_RESEARCH_KEY") || "";
      const supplied = req.headers.get("x-research-key") || "";
      if(!researchKey || supplied !== researchKey) return bad("Not authorized.",401);
      const crewId=clean(url.searchParams.get("crewId"),40);
      if(!crewId) return bad("Crew ID required.");
      const crew=await getJSON(store,`crew/${crewId}`); if(!crew) return bad("Crew not found.",404);
      const members=await listJSON(store,`member/${crewId}/`,100);
      const indexes=await listJSON(store,`dropIndex/${crewId}/`,100);
      const dropRows=[];
      for(const i of indexes){ const d=await getJSON(store,`drop/${crewId}/${i.dropId}`); if(!d) continue; const responses=await listJSON(store,`response/${crewId}/${d.id}/`,100); dropRows.push({...d,responseCount:responses.length}); }
      const chats=await listJSON(store,`chat/${crewId}/`,500);
      const events=await listJSON(store,`event/${crewId}/`,1000);
      const counts:any={}; events.forEach((e:any)=>counts[e.event]=(counts[e.event]||0)+1);
      return ok({crew,members,drops:dropRows,chats:chats.length,eventCounts:counts,events:events.slice(-200)});
    }

    if (action === "track" && req.method === "POST") {
      const crewId=clean(body.crewId||"anon",40), participantId=clean(body.participantId||"anon",40),dropId=clean(body.dropId||body.meta?.dropId||"",40),sessionId=clean(body.sessionId,60);
      const event=clean(body.event,60); if(!event) return bad("Missing event.");
      const rec={event,crewId,participantId,meta:body.meta||{},createdAt:now(),ua:req.headers.get("user-agent")||""};
      await store.setJSON(`event/${crewId}/${rec.createdAt}-${id("e_")}`,rec);
      await analyticsEvent(store,event,participantId,crewId,dropId,body.meta||{},req,context,sessionId);
      await touchVisitorAction(store,participantId,req,context,crewId,dropId);
      return ok({saved:true});
    }

    return bad("Unknown action.",404);
  } catch (e:any) {
    console.error(e);
    return bad("Something went wrong. Try again.",500);
  }
};

export const config: Config = { path: "/api" };
