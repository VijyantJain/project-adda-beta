import type { Context, Config } from "@netlify/functions";
import { getStore, getDeployStore } from "@netlify/blobs";

function makeStore(context:any){ return context?.deploy?.context==="production" ? getStore({ name:"adda-v03", consistency:"strong" }) : getDeployStore({ name:"adda-v05-preview", consistency:"strong" } as any); }
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const ok = (data:any, status=200) => new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
const bad = (message:string, status=400) => ok({ error: message }, status);
const clean = (v:any, max=120) => String(v ?? "").trim().slice(0,max);
const id = (prefix="") => prefix + crypto.randomUUID().replace(/-/g,"").slice(0,10);
const now = () => new Date().toISOString();

async function getJSON(store:any,key:string){ return await store.get(key, { type:"json" }) as any; }
async function listJSON(store:any,prefix:string, limit=100){
  const { blobs } = await store.list({ prefix });
  const chosen = blobs.slice(-limit);
  const rows = await Promise.all(chosen.map(async b => ({ key:b.key, data: await getJSON(store,b.key) })));
  return rows.filter(x=>x.data).map(x=>x.data);
}

export default async (req: Request, context: Context) => {
  try {
    const store = makeStore(context);
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "";
    const body = req.method === "POST" ? await req.json().catch(()=>({})) : {};

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
        options=[1,2,3,4,5].map(n=>({id:String(n),label:String(n)}));
      }
      const dropId=id("d_");
      const thresholdMode = body.thresholdMode === "everyone" ? "everyone" : body.thresholdMode === "manual" ? "manual" : "count";
      const thresholdCount = Math.max(2, Math.min(20, Number(body.thresholdCount)||3));
      const currentMembers = await listJSON(store,`member/${crewId}/`,100);
      const memberCountAtCreate = Math.max(1,currentMembers.length);
      const showNames=body.showNames===true; const allowChange=body.allowChange!==false;
      const drop={id:dropId,crewId,type,question,options,createdBy:participantId,creatorName:member.nickname,createdAt:now(),thresholdMode,thresholdCount,memberCountAtCreate,showNames,allowChange,status:"open"};
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
      const prefixes=[`member/${crewId}/`,`drop/${crewId}/`,`dropIndex/${crewId}/`,`response/${crewId}/`,`chat/${crewId}/`,`event/${crewId}/`];
      for(const prefix of prefixes){ const {blobs}=await store.list({prefix}); await Promise.all(blobs.map((b:any)=>store.delete(b.key))); }
      await store.delete(`crew/${crewId}`); return ok({deleted:true});
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
      const crewId=clean(body.crewId||"anon",40), participantId=clean(body.participantId||"anon",40);
      const event=clean(body.event,60); if(!event) return bad("Missing event.");
      const rec={event,crewId,participantId,meta:body.meta||{},createdAt:now(),ua:req.headers.get("user-agent")||""};
      await store.setJSON(`event/${crewId}/${rec.createdAt}-${id("e_")}`,rec);
      return ok({saved:true});
    }

    return bad("Unknown action.",404);
  } catch (e:any) {
    console.error(e);
    return bad("Something went wrong. Try again.",500);
  }
};

export const config: Config = { path: "/api" };
