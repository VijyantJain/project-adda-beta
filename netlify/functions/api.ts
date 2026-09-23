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


// Fixed, hand-curated first-session questions. Not part of any private Crew.
const STARTER_DECK=[
 {id:"s1",type:"either",tag:"THIS OR THAT",icon:"🏖️",art:"travel",question:"Free trip tomorrow. Where are we going? 👀",options:["Beach 🏖️","Mountains 🏔️"],fact:"Travel mood unlocked: whichever you pick, the best trips are the ones you actually take."},
 {id:"s2",type:"rate",tag:"RATE",icon:"👖",art:"denim",question:"Rate the denim fit 🔥",options:["😬 Not for me","😕 Meh","🙂 Decent","😍 Love it","🔥 Obsessed"],fact:"Denim's signature blue is traditionally made using indigo dye."},
 {id:"s3",type:"vote",tag:"WOULD YOU?",icon:"🫣",art:"friends",question:"Would you tell your bestie their outfit is a miss? 😂",options:["Of course 😭","Maybe privately 👀","Never! 🤐"],fact:"There's no correct answer here—your pick is part of your Aura."},
 {id:"s4",type:"vote",tag:"CREW CHAOS",icon:"🎧",art:"roadtrip",question:"Road trip! Who gets control of the aux? 🎶",options:["Me, obviously","The driver","The DJ friend","Pure shuffle"],fact:"The aux is shorthand for the auxiliary audio input—now it's also slang for playlist control."},
 {id:"s5",type:"predict",tag:"GUESS THE CROWD",icon:"☕",art:"chai",question:"Guess the crowd: chai or coffee? 🔮",options:["Chai ☕","Coffee ☕"],fact:"Tea and coffee both naturally contain caffeine, though amounts vary by drink."},
 {id:"s6",type:"either",tag:"THIS OR THAT",icon:"🌃",art:"night",question:"Perfect evening? ✨",options:["Rooftop hangout","Movie marathon"],fact:"A strong preference is a useful starting point for your next Crew plan."},
 {id:"s7",type:"vote",tag:"PICK AN AURA",icon:"⚡",art:"friends",question:"Your most dangerous group chat habit? 😂",options:["Replying after 3 days","10 voice notes","Sending 57 reels","Reading everything silently"],fact:"Nothing to diagnose here—just a very relatable group-chat habit."},
 {id:"s8",type:"rate",tag:"RATE",icon:"🍕",art:"food",question:"Rate the idea: midnight pizza run 🍕",options:["😬 Pass","😕 Meh","🙂 Maybe","😍 I'm in","🔥 Already outside"],fact:"Collect a few tastes like this and Adda can offer better Drop suggestions."},
 {id:"s9",type:"either",tag:"THIS OR THAT",icon:"🌦️",art:"travel",question:"Weekend mood?",options:["Rain + chai","Sun + road trip"],fact:"Neither side wins—it's your taste, and that's what makes comparison fun."},
 {id:"s10",type:"vote",tag:"CREW CHAOS",icon:"🏆",art:"friends",question:"You can pick ONE superpower for your Crew:",options:["Everyone on time","Endless holiday budget","No group-chat ghosting","Always agree on food"],fact:"You finished ten real choices. Bring your friends and see where they disagree."}
];
// Versioned Starter content; existing in-flight v1 answers are not rewritten.
const STARTER_V2_COMMON=[
 {id:"s1",type:"either",tag:"REALITY CHECK",icon:"😂",art:"friends",question:"‘We leave at 6 sharp.’ What time does your gang ACTUALLY leave?",options:["6:00. We are built different 😎","8:47 and someone's still showering 💀"],fact:"Group-plan punctuality is a surprisingly universal argument. Your Crew can settle it with an actual Drop."},
 {id:"s2",type:"rate",tag:"THE GROUP CHAT",icon:"🎤",art:"friends",question:"Rate a NINE-MINUTE voice note that starts with ‘Bro, listen...’",options:["😬 Blocked","😕 At 2× speed","🙂 Okay fine","😍 Tell me EVERYTHING","🔥 Put it on Spotify"],fact:"Audio messages help people share tone, but text can be easier to skim in a hurry."},
 {id:"s3",type:"vote",tag:"NOBODY IS INNOCENT",icon:"📱",art:"friends",question:"Phone at 2%. Cab arriving in 5 min. Your move?",options:["Screenshot the OTP","Charge for 30 seconds","Ask the gang to call","Manifest battery 🔋"],fact:"Planning under pressure feels different for every person. There is no right answer to your Aura."},
 {id:"s4",type:"either",tag:"TOO REAL",icon:"🍕",art:"chai",question:"Your mates say ‘Let's split the bill equally’ but you ordered...",options:["One chai. JUST ONE. 😭","The entire menu 😌"],fact:"The bill-splitting dilemma gets funnier when friends have wildly different orders."},
 {id:"s5",type:"vote",tag:"DANGEROUS WORDS",icon:"👀",art:"roadtrip",question:"Which group-chat message is the BIGGEST red flag?",options:["‘On my way’ 🚿","‘We should plan something’","‘Quick question…’","‘I have news’ 🫢"],fact:"Tiny phrases can become giant inside jokes; the best Crew Drops often start with one."},
 {id:"s6",type:"vote",tag:"MAKE IT YOURS",icon:"⚡",art:"friends",question:"Your next two Drops should match YOUR Aura. Pick one:",options:["Wheels & rides 🏍️","Fashion & looks ✨","Music & concerts 🎧","Food & cafés 🍕","Travel & escapes 🏖️","Memes & chaos 😂","Sports & fitness 🏏"],fact:"Your choice tunes only your private warm-up. Shared Crew Drops remain the same for everyone."}
];
const STARTER_V2_INTERESTS:any={
 "Wheels & rides 🏍️":[
  {id:"s7",type:"either",tag:"WHEELS",icon:"🏍️",art:"roadtrip",question:"Two keys. ONE dream ride. Which are you taking?",options:["Full-send sportbike 🏍️","Cruiser, leather & sunsets 🛣️"],fact:"Sportbikes emphasize agility and performance; cruisers generally emphasize relaxed riding."},
  {id:"s8",type:"vote",tag:"ROAD TRIP",icon:"🚗",art:"roadtrip",question:"The gang leaves tomorrow. What's YOUR job?",options:["Driver/AUX dictator","Snack manager","The lost navigator","I packed three fits"],fact:"Pick a Crew road-trip Drop next and find out whose actual role matches yours."}],
 "Fashion & looks ✨":[
  {id:"s7",type:"either",tag:"STYLE BATTLE",icon:"💅",art:"denim",question:"You walk in and everybody turns. Which LOOK are you?",options:["Bold glam + statement pieces ✨","Quiet luxury + clean tailoring 🖤"],fact:"Personal style is not a gender rule. It's how you choose to present yourself."},
  {id:"s8",type:"rate",tag:"OUTFIT CHECK",icon:"👟",art:"denim",question:"Rate the idea: dressing up JUST for a coffee run.",options:["😬 No way","😕 A little much","🙂 Cute","😍 Of course","🔥 It's my runway"],fact:"Style is subjective—your friends may rate the same outfit very differently."}],
 "Music & concerts 🎧":[
  {id:"s7",type:"either",tag:"AUX WARS",icon:"🎤",art:"friends",question:"ONE concert ticket. Where's the better night?",options:["Front-row chaos 🔥","Intimate rooftop gig 🌃"],fact:"Big crowds and tiny venues create very different kinds of energy."},
  {id:"s8",type:"vote",tag:"EXPOSED",icon:"🎧",art:"friends",question:"Your most criminal AUX habit?",options:["Same track, 9 times","Skip everyone else's song","Playlist named ‘Untitled’","Only sad songs at parties"],fact:"A playlist is a great way to start a Crew argument without taking it seriously."}],
 "Food & cafés 🍕":[
  {id:"s7",type:"either",tag:"MIDNIGHT HUNGER",icon:"🍕",art:"chai",question:"It's 12:45 AM. The gang is hungry. Where to?",options:["Street-food mission 🌮","Dessert café, maximum gossip 🍰"],fact:"A simple food poll makes an easy first Crew Plan."},
  {id:"s8",type:"rate",tag:"FRIENDSHIP TEST",icon:"🍟",art:"chai",question:"Rate someone who steals your LAST fry.",options:["😬 Criminal","😕 Rude","🙂 One is fine","😍 Take it","🔥 I'd buy them more"],fact:"Snack preferences can be surprisingly good inside-joke material."}],
 "Travel & escapes 🏖️":[
  {id:"s7",type:"either",tag:"JUST PACK",icon:"🌊",art:"travel",question:"48 hours free. ZERO itinerary. You choose...",options:["Mountains & mist 🏔️","Beach & night sky 🏝️"],fact:"The trip that actually happens beats the perfect plan stuck in chat."},
  {id:"s8",type:"vote",tag:"GROUP TRIP",icon:"🧳",art:"travel",question:"Your role on a group holiday?",options:["Excel sheet boss","Late packer","Photos or it didn't happen","I book the food"],fact:"Plans can bring these real roles into your private Crew."}],
 "Memes & chaos 😂":[
  {id:"s7",type:"vote",tag:"CHAT CRIMES",icon:"🫣",art:"friends",question:"When the chat gets serious, YOU...",options:["Drop the worst meme","Disappear 🫥","Send a 12-min voice note","Change the topic"],fact:"Group humor is often context: the same meme is funnier when your friends know why."},
  {id:"s8",type:"either",tag:"PLOT TWIST",icon:"💀",art:"friends",question:"Which is the bigger betrayal?",options:["Left on read for 3 days","Sent the reel to EVERYONE else"],fact:"These are social jokes, not predictions about any specific person."}],
 "Sports & fitness 🏏":[
  {id:"s7",type:"either",tag:"MATCH DAY",icon:"🏏",art:"roadtrip",question:"One perfect Saturday. Choose the mood.",options:["Stadium with the gang 🏟️","Playing a match ourselves 🏏"],fact:"Being a fan and being a player can bring people together differently."},
  {id:"s8",type:"rate",tag:"GYM BUDDY",icon:"💪",art:"friends",question:"Rate the friend who says ‘Gym tomorrow pakka.’",options:["😬 Ghost","😕 Never comes","🙂 Occasionally","😍 Pretty solid","🔥 Wakes ME up"],fact:"A real Crew challenge works better than a fake leaderboard."}]
};
const STARTER_V2_TAIL=[
 {id:"s9",type:"vote",tag:"SELF-EXPOSE",icon:"🫣",art:"friends",question:"When the whole Crew finally makes a plan, YOU are the one who...",options:["Shows up early somehow","Calls to cancel","Brings three extra people","Asks ‘where are we going?’"],fact:"Your private answers help you pick which Crew jokes to start with."},
 {id:"s10",type:"either",tag:"ONE LAST THING",icon:"🏆",art:"friends",question:"Your dream friend-group superpower?",options:["Every plan ACTUALLY happens ✅","Nobody EVER leaves the chat on read 👀"],fact:"Ten honest picks down. The real fun is seeing what your friends choose."}
];
// New-user only curated v3: v1/v2 progress and exact answer keys remain unchanged.
const STARTER_V3_COMMON=STARTER_V2_COMMON.map((q:any)=>({...q,...({"s1":{"question":"Your friend says 'bas 5 minutes' while you're waiting outside. Your move? 😂","options":["Send a dramatic 'I'm leaving' selfie 📸","Order food. We've got TIME 🍟"],"fact":"The perfect first Crew Drop: find out who is always late and who pretends not to mind."},"s2":{"question":"A 9-MINUTE voice note arrives at 1 AM. What do you do? 🎤","options":["😬 Muted forever","😕 Listen tomorrow","🙂 2× speed","😍 Full headphones","🔥 Reply with a 12-minute note"],"fact":"Your answers can inspire a real voice-note challenge with your friends."},"s3":{"question":"Phone on 2%. Cab says 'arriving in 2 min.' What's the panic move? 🔋","options":["Screenshot everything IMMEDIATELY","Ask a stranger for a charger","Call the gang: SEND HELP","Trust the universe 💀"],"fact":"Your survival plan is now a private pick, not a prediction about anyone else."},"s4":{"question":"The gang wants to split the bill equally. You only had a CHAI. Your reaction? ☕","options":["Open the calculator like a CA 📊","Pay and remember this forever 😭"],"fact":"Food and money decisions make surprisingly easy conversation starters."},"s5":{"question":"Which message is the biggest group-chat LIE? 👀","options":["'Just reached' (still at home)","'Let's plan Goa' (again)","'Will call in 2 minutes'","'I'm not taking screenshots'"],"fact":"Ask the gang this question together once there's a Crew — their real votes will count."},"s6":{"question":"Enough about the gang. What's YOUR actual obsession? Pick your lane 🔥","fact":"You just chose your own private interest path. Nobody else's Crew questions change."},"s9":{"question":"Your group FINALLY agrees on a plan. What happens next? 🍿","options":["I book it before anyone changes their mind","Someone ghosts and we start again","The plan becomes 47 reels","I'm already at the location 😎"],"fact":"The best group stories usually start when somebody actually follows through."},"s10":{"question":"Choose ONE power for your future Crew. What's the dream? 👑","options":["Plans magically happen every weekend ✨","The group chat never leaves anyone on read 👀"],"fact":"Ten Starter choices done. Your Aura is yours — friends can join the story later."}} as any)[q.id],art:q.id}));
const STARTER_V3_TAIL=STARTER_V2_TAIL.map((q:any)=>({...q,...({"s1":{"question":"Your friend says 'bas 5 minutes' while you're waiting outside. Your move? 😂","options":["Send a dramatic 'I'm leaving' selfie 📸","Order food. We've got TIME 🍟"],"fact":"The perfect first Crew Drop: find out who is always late and who pretends not to mind."},"s2":{"question":"A 9-MINUTE voice note arrives at 1 AM. What do you do? 🎤","options":["😬 Muted forever","😕 Listen tomorrow","🙂 2× speed","😍 Full headphones","🔥 Reply with a 12-minute note"],"fact":"Your answers can inspire a real voice-note challenge with your friends."},"s3":{"question":"Phone on 2%. Cab says 'arriving in 2 min.' What's the panic move? 🔋","options":["Screenshot everything IMMEDIATELY","Ask a stranger for a charger","Call the gang: SEND HELP","Trust the universe 💀"],"fact":"Your survival plan is now a private pick, not a prediction about anyone else."},"s4":{"question":"The gang wants to split the bill equally. You only had a CHAI. Your reaction? ☕","options":["Open the calculator like a CA 📊","Pay and remember this forever 😭"],"fact":"Food and money decisions make surprisingly easy conversation starters."},"s5":{"question":"Which message is the biggest group-chat LIE? 👀","options":["'Just reached' (still at home)","'Let's plan Goa' (again)","'Will call in 2 minutes'","'I'm not taking screenshots'"],"fact":"Ask the gang this question together once there's a Crew — their real votes will count."},"s6":{"question":"Enough about the gang. What's YOUR actual obsession? Pick your lane 🔥","fact":"You just chose your own private interest path. Nobody else's Crew questions change."},"s9":{"question":"Your group FINALLY agrees on a plan. What happens next? 🍿","options":["I book it before anyone changes their mind","Someone ghosts and we start again","The plan becomes 47 reels","I'm already at the location 😎"],"fact":"The best group stories usually start when somebody actually follows through."},"s10":{"question":"Choose ONE power for your future Crew. What's the dream? 👑","options":["Plans magically happen every weekend ✨","The group chat never leaves anyone on read 👀"],"fact":"Ten Starter choices done. Your Aura is yours — friends can join the story later."}} as any)[q.id],art:q.id}));
const STARTER_V3_INTERESTS:any=Object.fromEntries(Object.entries(STARTER_V2_INTERESTS).map(([key,pack]:any)=>{
 const names:any={"Wheels & rides 🏍️":"rides","Fashion & looks ✨":"style","Music & concerts 🎧":"music","Food & cafés 🍕":"food","Travel & escapes 🏖️":"travel","Memes & chaos 😂":"memes","Sports & fitness 🏏":"fitness"};
 const variants:any={"Wheels & rides 🏍️":[{"question":"A free dream ride for one day. Which keys are you grabbing? 🏍️","options":["Track-ready sportbike ⚡","Sunset highway cruiser 🌅"],"fact":"Your private pick becomes part of your own interests, not a public Crew vote."},{"question":"Road trip tomorrow. Your unofficial title? 🚗","options":["AUX dictator 🎧","Snack operations lead 🍟","Wrong-turn legend 📍","The one still packing 👕"],"fact":"A Crew road-trip Drop could reveal everyone's real role."}],"Fashion & looks ✨":[{"question":"Big entrance tonight. Which look feels like YOU? ✨","options":["Statement pieces, extra drama 💎","Clean tailoring, effortless energy 🖤"],"fact":"Style is personal; the same outfit can spark totally different reactions."},{"question":"Outfit planned for a 15-minute coffee stop. Rate the commitment. ☕","options":["😬 Too much","😕 Maybe not","🙂 Fair play","😍 Respect","🔥 It's a runway"],"fact":"Your friends could rate the very same idea differently."}],"Music & concerts 🎧":[{"question":"ONE free concert pass. What kind of night are you taking? 🎶","options":["Scream every word in the front row 🔥","Tiny rooftop gig, main-character moment 🌃"],"fact":"Different music settings bring very different memories."},{"question":"Which AUX crime are you guilty of? 👀","options":["Replay my song nine times","Skip other people's requests","Only sad songs at parties","I actually make playlists"],"fact":"A real shared Crew Drop could settle your music arguments."}],"Food & cafés 🍕":[{"question":"It's 12:45 AM and everyone's hungry. What's the mission? 🌮","options":["Street-food crawl with the gang 🌯","Dessert café and three hours of gossip 🍰"],"fact":"Food preferences are a quick way to plan something together."},{"question":"Your mate takes the LAST bite from your plate. How big is the crime? 🍟","options":["😬 Unfriend","😕 I'm annoyed","🙂 Fine, one","😍 Take it","🔥 I'll buy more"],"fact":"This is the kind of tiny inside joke that makes a Crew feel real."}],"Travel & escapes 🏖️":[{"question":"A surprise 48-hour escape. No itinerary. Pick your scene. 🌊","options":["Mountain mist and hoodie weather 🏔️","Beach sunset and music 🎶"],"fact":"Choosing is fun; actually taking the trip makes the memory."},{"question":"Group trip unlocked. What's your assignment? 🧳","options":["The bookings spreadsheet","The chronic late packer","Photographer of EVERYTHING","I just find food"],"fact":"Shared Crew plans could turn these roles into actual outcomes."}],"Memes & chaos 😂":[{"question":"The group chat goes DEAD serious. Your first reaction? 💀","options":["Drop a cursed meme","Disappear quietly","Voice note that never ends","Actually give real advice"],"fact":"Inside jokes have context — real friends know why a meme hits."},{"question":"Which betrayal hurts the most? 😭","options":["Left on read for THREE days","They sent MY reel to the entire internet"],"fact":"One person's joke is another person's entire group-chat history."}],"Sports & fitness 🏏":[{"question":"Dream Saturday — which one are you booking? 🏏","options":["Stadium, live crowd, full noise 🏟️","Playing the match yourself ⚡"],"fact":"Watching and playing can be equally memorable in very different ways."},{"question":"Rate 'gym tomorrow pakka' from your most unreliable mate 💪","options":["😬 Who?","😕 Always cancels","🙂 Sometimes","😍 Consistent","🔥 Drags me out of bed"],"fact":"The funniest Crew ratings come from real shared history."}]};
 return [key,pack.map((q:any,i:number)=>({...q,...variants[key][i],art:names[key]+(i+7)}))];
}));
const AURA_LEVELS=[{min:0,name:"Fresh",icon:"✨"},{min:10,name:"First Spark",icon:"⚡"},{min:25,name:"Warming Up",icon:"🌟"},{min:45,name:"On a Roll",icon:"🔥"},{min:60,name:"Spark",icon:"💜"},{min:100,name:"Glow Up",icon:"🌈"},{min:150,name:"Buzz",icon:"⚡"},{min:300,name:"Main Character",icon:"😎"},{min:600,name:"Aura Magnet",icon:"🧲"},{min:1000,name:"Adda Icon",icon:"👑"},{min:2000,name:"Legend",icon:"🏆"}];
function auraTier(score:number){let pos=0;while(pos+1<AURA_LEVELS.length&&score>=AURA_LEVELS[pos+1].min)pos++;const next=AURA_LEVELS[pos+1]||null,level=AURA_LEVELS[pos];return {level:{...level,index:pos+1},nextLevel:next,pointsToNext:next?next.min-score:0,progress:next?Math.max(0,Math.min(100,Math.round((score-level.min)/(next.min-level.min)*100))):100}}
function activeStarterDeck(state:any){
 if(state?.deckVersion==="v3"){const chosen=state.answers?.s6;return [...STARTER_V3_COMMON,...(STARTER_V3_INTERESTS[chosen]||STARTER_V3_INTERESTS["Memes & chaos 😂"]),...STARTER_V3_TAIL]}
 if(state?.deckVersion!=="v2")return STARTER_DECK;
 const choice=state.answers?.s6;
 const pack=STARTER_V2_INTERESTS[choice]||STARTER_V2_INTERESTS["Memes & chaos 😂"];
 return [...STARTER_V2_COMMON,...pack,...STARTER_V2_TAIL];
}

const STARTER_MILESTONES=[
 {at:1,name:"First Spark",icon:"⚡",text:"Your first choice is in!"},
 {at:2,name:"Quick Starter",icon:"🎯",text:"You're finding your rhythm."},
 {at:3,name:"On a Roll",icon:"🔥",text:"Three down—you're rolling."},
 {at:5,name:"First Five",icon:"🏆",text:"Your first Adda trophy is yours."},
 {at:7,name:"Aura Builder",icon:"💜",text:"The bonus round is heating up."},
 {at:10,name:"Tenacious",icon:"👑",text:"You cleared the entire Starter Deck."}
];
function starterPayload(state:any){
 const deck=activeStarterDeck(state),answers=state?.answers||{},completed=Object.keys(answers).length,firstFiveCompleted=deck.slice(0,5).every((q:any)=>answers[q.id]!==undefined),
 bonusCompleted=deck.every((q:any)=>answers[q.id]!==undefined),points=completed*10+(firstFiveCompleted?30:0)+(bonusCompleted?50:0),
 index=deck.findIndex((q:any)=>answers[q.id]===undefined),next=STARTER_MILESTONES.find(x=>x.at>completed)||null;
 return {progress:completed,total:deck.length,points,firstFiveCompleted,bonusCompleted,nextUnlock:next,earned:STARTER_MILESTONES.filter(x=>completed>=x.at),
   answers,deckVersion:state?.deckVersion||"v1",question:index<0?null:deck[index],lastQuestion:completed?deck.find((q:any)=>q.id===Object.keys(answers)[completed-1])||null:null,
   nickname:state?.nickname||"",starterCrewId:state?.starterCrewId||""};
}

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
      const starterEventIds=(event:string)=>new Set(analyticsEvents.filter((e:any)=>e.event===event).map((e:any)=>e.participantId).filter(Boolean));
      const starterStarted=starterEventIds("starter_started"),starterFirst=starterEventIds("starter_answered");
      const starterFive=starterEventIds("starter_first_five_completed"),starterTen=starterEventIds("starter_bonus_completed"),starterCrews=starterEventIds("starter_crew_created");
      const starterStepCounts:any={};
      analyticsEvents.filter((e:any)=>e.event==="starter_answered").forEach((e:any)=>{
        const step=Number(e.meta?.step)||0;
        if(step>0&&step<=10){starterStepCounts[step]=starterStepCounts[step]||new Set();starterStepCounts[step].add(e.participantId)}
      });
      const starterFunnel=[{label:"Opened First Five",value:starterStarted.size},
        ...[1,2,3,4,5,6,7,8,9,10].map(n=>({label:n===5?"🏆 First Five":n===10?"👑 Tenacious":"Answered "+n,value:starterStepCounts[n]?.size||0})),
        {label:"Created Starter Crew",value:starterCrews.size}];

      // A browser-based visitor ID is not an authenticated unique person. Distinguish
      // strongly suspicious automation from merely US/Linux/proxy geography.
      const agentOf=(v:any)=>String(v.lastServer?.userAgent||"");
      const botRule=(v:any)=>{
        const ua=agentOf(v),browser=String(v.lastServer?.browser||""),screen=v.lastClient?.viewport||{};
        if(/bot\b|crawler|spider|headless|lighthouse|pagespeed|pingdom|uptimerobot|wget|curl|python-requests|go-http-client|node-fetch|axios\/|scrapy|playwright|puppeteer/i.test(ua))return "Automation signature";
        if(!Number(screen.width)&&!Number(screen.height)&&!/^(Mobile|Desktop|Tablet)$/i.test(String(v.lastServer?.deviceType||""))&&v.visitCount>1)return "Review: missing browser signals";
        return "Unclassified browser";
      };
      visitorRows.forEach((v:any)=>{
        const original=visitors.find((x:any)=>x.participantId===v.participantId);
        v.trafficClass=original?botRule(original):"Unclassified browser";
        v.automatedSuspected=v.trafficClass!=="Unclassified browser";
        v.engagementClass=v.answerCount>=5?"5+ Crew answers":v.answerCount>=1?"Crew responder":v.dropCreates>0?"Creator":v.chatMessages>0?"Chatter":v.actions>0?"Exploring":"No tracked action";
        v.daysObserved=Math.max(0,Math.floor((Date.parse(v.lastSeen)-Date.parse(v.firstSeen))/86400000))||0;
        v.entryType=v.firstEntry?.dropId?"Shared Drop":v.firstEntry?.crewId?"Crew invite":v.firstEntry?.source?"Campaign/Referral":"Direct / unknown";
      });
      const suspected=visitorRows.filter((v:any)=>v.automatedSuspected);
      const humanLike=visitorRows.filter((v:any)=>!v.automatedSuspected);
      const visitorMap:any=Object.fromEntries(visitors.map((v:any)=>[v.participantId,v]));
      const sessionsByPerson:any={};
      sessions.forEach((x:any)=>{if(!x.participantId)return;(sessionsByPerson[x.participantId]??=[]).push(x)});
      const activeDates:any={};
      analyticsEvents.forEach((e:any)=>{if(!e.participantId)return;(activeDates[e.participantId]??=new Set()).add(String(e.createdAt).slice(0,10))});
      const cohortRows=visitorRows.filter((v:any)=>inRange(v.firstSeen)&&!v.automatedSuspected);
      const hasDay=(v:any,offset:number)=>{
        const first=String(v.firstSeen||"").slice(0,10),d=Date.parse(first+"T00:00:00Z");
        if(!Number.isFinite(d))return false;
        return Array.from(activeDates[v.participantId]||[]).some((date:any)=>Math.round((Date.parse(String(date)+"T00:00:00Z")-d)/86400000)===offset);
      };
      const cohortEligible=(day:number)=>cohortRows.filter((v:any)=>Date.now()-Date.parse(v.firstSeen)>=(day+1)*86400000);
      const firstAns:any={},firstArrival:any={},firstFiveAt:any={},tenAt:any={};
      analyticsEvents.forEach((e:any)=>{
        if(!e.participantId)return;
        if(e.event==="visit_started"&&!firstArrival[e.participantId])firstArrival[e.participantId]=e.createdAt;
        if(e.event==="starter_answered"&&Number(e.meta?.step)===1&&!firstAns[e.participantId])firstAns[e.participantId]=e.createdAt;
        if(e.event==="starter_first_five_completed"&&!firstFiveAt[e.participantId])firstFiveAt[e.participantId]=e.createdAt;
        if(e.event==="starter_bonus_completed"&&!tenAt[e.participantId])tenAt[e.participantId]=e.createdAt;
      });
      const activationTimes=Object.keys(firstAns).map((p:string)=>Date.parse(firstAns[p])-Date.parse(firstArrival[p]||visitorMap[p]?.firstSeen||"")).filter((x:number)=>Number.isFinite(x)&&x>=0&&x<86400000);
      const stepSpeed=Object.keys(firstFiveAt).map((p:string)=>Date.parse(firstFiveAt[p])-Date.parse(firstAns[p]||"")).filter((x:number)=>Number.isFinite(x)&&x>=0&&x<86400000);
      const quantile=(nums:number[],q:number)=>{if(!nums.length)return 0;const x=[...nums].sort((a,b)=>a-b);return Math.round(x[Math.min(x.length-1,Math.floor((x.length-1)*q))])};
      const responsesByPerson:any={};
      responseKeys.forEach((k:string)=>{const pid=k.split("/")[3];if(pid)(responsesByPerson[pid]??=new Set()).add(k.split("/").slice(1,3).join("/"))});
      const measuredVisitors=visitorRows.map((v:any)=>({...v,verifiedCrewAnswers:responsesByPerson[v.participantId]?.size||0}));
      const visitFromInvite=cohortRows.filter((v:any)=>v.entryType==="Crew invite"||v.entryType==="Shared Drop");
      const visitDirect=cohortRows.filter((v:any)=>v.entryType!=="Crew invite"&&v.entryType!=="Shared Drop");
      const countOf=(rows:any[],ids:Set<any>)=>rows.filter((v:any)=>ids.has(v.participantId)).length;
      const starterByGroup=(rows:any[])=>({arrivals:rows.length,started:countOf(rows,starterStarted),five:countOf(rows,starterFive),ten:countOf(rows,starterTen),crewCreated:countOf(rows,starterCrews)});
      const entryCohorts={direct:starterByGroup(visitDirect),invited:starterByGroup(visitFromInvite)};
      const errorsByMessage:any={},screenByName:any={},hours:any={},paths:any={};
      events.forEach((e:any)=>{
        if(e.event==="client_error"){const k=String(e.meta?.message||"Unspecified client error").slice(0,130);errorsByMessage[k]=(errorsByMessage[k]||0)+1}
        if(e.event==="screen_view"){const k=String(e.meta?.screen||"Unknown");screenByName[k]=(screenByName[k]||0)+1}
        const h=String(e.createdAt||"").slice(11,13);if(h)hours[h]=(hours[h]||0)+1;
        if(e.event==="visit_started"){const k=String(e.meta?.entry?.path||"/").slice(0,120);paths[k]=(paths[k]||0)+1}
      });
      const asRows=(obj:any,limit=30)=>Object.entries(obj).map(([label,count])=>({label,count:Number(count)})).sort((a,b)=>b.count-a.count).slice(0,limit);
      const rankedVisit=visitorRows.filter((v:any)=>!v.automatedSuspected).sort((a:any,b:any)=>b.answerCount-a.answerCount||b.sessions-a.sessions);
      const d1eligible=cohortEligible(1),d7eligible=cohortEligible(7);
      const guideAnswerEvents=events.filter((e:any)=>e.event==="crew_guide_answered");
      const guideAnswers={
        one:guideAnswerEvents.filter((e:any)=>Number(e.meta?.number)===1).length,
        two:guideAnswerEvents.filter((e:any)=>Number(e.meta?.number)===2).length
      };
      const personalPackCounts:any={},guidedTabCounts:any={},rewardStepCounts:any={};
      events.forEach((e:any)=>{
        if(e.event==="personal_pack_selected"){
          const k=String(e.meta?.interest||"unknown").slice(0,36);
          personalPackCounts[k]=(personalPackCounts[k]||0)+1
        }
        if(e.event==="guide_tab_seen"){
          const k=String(e.meta?.tab||"unknown").slice(0,36);
          guidedTabCounts[k]=(guidedTabCounts[k]||0)+1
        }
        if(e.event==="guide_step_completed"){
          const k=String(e.meta?.step||"unknown").slice(0,48);
          rewardStepCounts[k]=(rewardStepCounts[k]||0)+1
        }
      });
      const guidedPersonal={
        started:eventCounts.personal_guide_started||0,
        interestChosen:eventCounts.personal_pack_selected||0,
        surpriseMe:eventCounts.personal_pack_skipped||0,
        privateCards:eventCounts.personal_card_answered||0,
        personalCompleted:eventCounts.personal_guide_completed||0,
        tabsStarted:eventCounts.guide_five_tabs_started||0,
        localProfileReady:eventCounts.guide_profile_ready||0,
        betaHandoff:eventCounts.guide_beta_handoff||0,
        packCounts:asRows(personalPackCounts),
        tabs:asRows(guidedTabCounts),
        rewards:asRows(rewardStepCounts)
      };
      const deepDive={
        guidedPersonal,guideAnswers,
        audience:{browserIdentities:visitors.length,suspectedAutomated:suspected.length,humanLike:humanLike.length,engagedHumanLike:humanLike.filter((v:any)=>v.answerCount||v.dropCreates||v.chatMessages).length,returningHumanLike:humanLike.filter((v:any)=>v.sessions>1).length,fromInvites:visitFromInvite.length,direct:visitDirect.length,provisionalMembers:memberRows.filter((m:any)=>m.provisional).length},
        retention:{d1Eligible:d1eligible.length,d1Returned:d1eligible.filter((v:any)=>hasDay(v,1)).length,d7Eligible:d7eligible.length,d7Returned:d7eligible.filter((v:any)=>hasDay(v,7)).length,multiDayHumanLike:humanLike.filter((v:any)=>((activeDates[v.participantId]?.size||0)>1)).length},
        activation:{medianFirstAnswerMs:quantile(activationTimes,.5),p95FirstAnswerMs:quantile(activationTimes,.95),medianFirstFiveMs:quantile(stepSpeed,.5),started:starterStarted.size,firstAnswer:starterFirst.size,five:starterFive.size,ten:starterTen.size,fiveToTenPct:pct(starterTen.size,starterFive.size),startedToFivePct:pct(starterFive.size,starterStarted.size),startedToTenPct:pct(starterTen.size,starterStarted.size)},
        entryCohorts,screenViews:asRows(screenByName),errors:asRows(errorsByMessage),hourlyUTC:asRows(hours,24),landingPaths:asRows(paths),
        engagement:asRows(measuredVisitors.reduce((x:any,v:any)=>{x[v.engagementClass]=(x[v.engagementClass]||0)+1;return x},{})),
        trafficClasses:asRows(visitorRows.reduce((x:any,v:any)=>{x[v.trafficClass]=(x[v.trafficClass]||0)+1;return x},{})),
        topResponders:rankedVisit.slice(0,20).map((v:any)=>({participantId:v.participantId,name:v.name,answers:v.answerCount,sessions:v.sessions,crewCreates:v.dropCreates,lastSeen:v.lastSeen})),
        health:{eventRecords:events.length,legacyRecords:legacyEvents.length,trackedClientErrors:eventCounts.client_error||0,sampledEventsReturned:Math.min(events.length,250),allEventsExportAvailable:false},
        qualityNotes:[
          "Visitor count measures browser participant IDs, not verified unique people; clearing storage creates a new ID.",
          "Ashburn/USA and Linux alone do not prove bot or Netlify-origin traffic. Only known user-agent automation signatures are flagged; review others manually.",
          "IP and geolocation may describe VPN, proxies or hosting egress rather than visitor residence.",
          "D1/D7 cohorts use UTC calendar dates for tracked app activity; require enough elapsed time and should be compared within the same traffic cohorts.",
          "Only the most recent 250 events are returned in the event table/CSV; totals and breakdowns use full loaded dataset."
        ]
      };


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
          humanLikeVisitors:deepDive.audience.humanLike,suspectedAutomated:deepDive.audience.suspectedAutomated,
          engagedVisitors:engaged,engagementRate:pct(engaged,uniqueVisitorIds.size),dropEntryVisitors,
          joined:joined.size,answered:answered.size,answered2,answered5,creators:creators.size,sharers:sharers.size,chatters:chatters.size,
          totalAnswers:eventCounts.response_submitted||0,totalDropsCreated:eventCounts.drop_created||0,totalChats:eventCounts.chat_message_sent||0,totalShares:(eventCounts.drop_shared||0)+(eventCounts.crew_shared||0)+(eventCounts.share_attempted||0),
          clientErrors:eventCounts.client_error||0,legacyEvents:legacyEvents.length,
          starter:{started:starterStarted.size,firstAnswer:starterFirst.size,completedFive:starterFive.size,completedTen:starterTen.size,crews:starterCrews.size,totalAnswers:eventCounts.starter_answered||0,funnel:starterFunnel},
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
        deepDive,recentEvents,eventCounts
      });
    }



    // Fast first-session Aura: never scan every Crew/Chat/Drop for a person with no Crew.
    // Both stores are server-authoritative, so Tenacious always carries its real 180 points.
    if(action==="getAuraStarter" && req.method==="GET"){
      const participantId=clean(url.searchParams.get("participantId"),40);
      if(!/^p_[a-zA-Z0-9]{6,40}$/.test(participantId))return bad("Invalid participant.");
      const starter=starterPayload(await getJSON(store,`starter/v1/${participantId}`));
      const guide=await getJSON(store,`guide/v1/${participantId}`)||{steps:{}};
      const guidePoints=Object.values(guide.steps||{}).reduce((sum:number,row:any)=>sum+Number(row?.points||0),0);
      const score=starter.points+guidePoints,tier=auraTier(score);
      const badges=STARTER_MILESTONES.map((m:any)=>({id:"starter_"+m.at,name:m.name,icon:m.icon,desc:m.text,current:starter.progress,target:m.at,unlocked:starter.progress>=m.at,progress:Math.min(100,Math.round(starter.progress/m.at*100))}));
      const nextUnlock=badges.find((b:any)=>!b.unlocked)||null;
      return ok({score,...tier,streak:0,answers:starter.progress,starterAnswers:starter.progress,dropsMade:0,chatsSent:0,shares:0,crews:0,badges,nextUnlock,crewRank:null,signature:"",starter:{progress:starter.progress,points:starter.points,firstFiveCompleted:starter.firstFiveCompleted,bonusCompleted:starter.bonusCompleted,earned:starter.earned},guided:{points:guidePoints,steps:guide.steps||{}},scoreMode:"solo_starter"});
    }
    // Separate private guided steps from shared Crew Drops. Never invent votes/results.
    if(action==="guideGet" && req.method==="GET"){
      const participantId=clean(url.searchParams.get("participantId"),40);
      if(!/^p_[a-zA-Z0-9]{6,40}$/.test(participantId))return bad("Invalid participant.",400);
      const st=await getJSON(store,`guide/v1/${participantId}`)||{steps:{}};
      return ok({steps:st.steps||{},points:Object.keys(st.steps||{}).reduce((t:string|number,k:string)=>Number(t)+Number(st.steps[k]?.points||0),0)});
    }
    if(action==="guideStep" && req.method==="POST"){
      const participantId=clean(body.participantId,40),step=clean(body.step,48),crewId=clean(body.crewId,40);
      if(!/^p_[a-zA-Z0-9]{6,40}$/.test(participantId))return bad("Invalid participant.",400);
      const allowed:any={personal_one:10,personal_two:15,tour_home:5,tour_crew:5,tour_create:5,tour_vibe:5,tour_profile:5,profile_bio:10,profile_photo:10,profile_avatar:10,profile_handle_draft:10};
      if(!Object.prototype.hasOwnProperty.call(allowed,step))return bad("Unknown guide step.");
      const key=`guide/v1/${participantId}`,state=await getJSON(store,key)||{steps:{},createdAt:now()};
      state.steps=state.steps||{};
      const isVisual=step==='profile_avatar'||step==='profile_photo';
      const isNew=!state.steps[step]&&!(isVisual&&(state.steps.profile_avatar||state.steps.profile_photo));
      if(isNew){
        state.steps[step]={points:allowed[step],at:now(),crewId};
        await store.setJSON(key,state);
        await analyticsEvent(store,"guide_step_completed",participantId,crewId,"",{step,points:allowed[step]},req,context);
      }
      const points=Object.keys(state.steps).reduce((sum:number,k:string)=>sum+Number(state.steps[k]?.points||0),0);
      return ok({step,points,steps:state.steps,earnedPoints:isNew?(state.steps[step]?.points||0):0});
    }

    if(action==="starterGet" && req.method==="GET"){
      const participantId=clean(url.searchParams.get("participantId"),40);
      if(!/^p_[a-zA-Z0-9]{6,40}$/.test(participantId))return bad("Invalid participant.",400);
      const key=`starter/v1/${participantId}`;
      const state=await getJSON(store,key)||{answers:{},deckVersion:'v3',createdAt:now()};
      if(!state.startedAt){
        state.startedAt=now();
        await store.setJSON(key,state);
        await analyticsEvent(store,"starter_started",participantId,"","",{deck:state.deckVersion||"v1"},req,context);
      }
      return ok(starterPayload(state));
    }
    if(action==="starterAnswer" && req.method==="POST"){
      const participantId=clean(body.participantId,40),questionId=clean(body.questionId,15),answer=clean(body.answer,100);
      if(!/^p_[a-zA-Z0-9]{6,40}$/.test(participantId))return bad("Invalid participant.",400);
      const key=`starter/v1/${participantId}`,state=await getJSON(store,key)||{answers:{},deckVersion:"v3",createdAt:now()};
      if(!state.answers||typeof state.answers!=="object")state.answers={};
      const deck=activeStarterDeck(state),q=deck.find((x:any)=>x.id===questionId);if(!q)return bad("Question not found.",404);
      if(!q.options.includes(answer))return bad("Choose one of the shown answers.");
      // Only the first answer earns progress. Retries cannot farm Aura.
      if(state.answers[questionId]!==undefined){
        return ok({...starterPayload(state),alreadyAnswered:true,feedback:q.fact,justUnlocked:null,earnedPoints:0});
      }
      const expected=deck.find((x:any)=>state.answers[x.id]===undefined);
      if(expected?.id!==questionId)return bad("Finish your current card first.");
      state.answers[questionId]=answer;state.updatedAt=now();
      await store.setJSON(key,state);
      const n=Object.keys(state.answers).length,milestone=STARTER_MILESTONES.find(x=>x.at===n)||null;
      const earnedPoints=10+(n===5?30:0)+(n===10?50:0);
      await analyticsEvent(store,"starter_answered",participantId,"",questionId,{step:n,type:q.type,deckVersion:state.deckVersion||"v1",interest:questionId==="s6"&&["v2","v3"].includes(state.deckVersion)?answer:undefined,earnedPoints},req,context);
      if(n===5||n===10)await analyticsEvent(store,n===5?"starter_first_five_completed":"starter_bonus_completed",participantId,"","",{step:n,points:starterPayload(state).points},req,context);
      return ok({...starterPayload(state),alreadyAnswered:false,feedback:q.fact,justUnlocked:milestone,earnedPoints,answeredQuestion:{id:q.id,question:q.question,answer,icon:q.icon}});
    }
    if(action==="starterName" && req.method==="POST"){
      const participantId=clean(body.participantId,40),nickname=clean(body.nickname,24);
      if(!/^p_[a-zA-Z0-9]{6,40}$/.test(participantId)||!nickname)return bad("Add your name.");
      const key=`starter/v1/${participantId}`,state=await getJSON(store,key);
      if(!state||Object.keys(state.answers||{}).length<5)return bad("Play the First Five first.");
      state.nickname=nickname;
      await store.setJSON(key,state);
      return ok(starterPayload(state));
    }
    if(action==="starterCreateCrew" && req.method==="POST"){
      const participantId=clean(body.participantId,40),nickname=clean(body.nickname,24),name=clean(body.name,42);
      if(!/^p_[a-zA-Z0-9]{6,40}$/.test(participantId)||!nickname||!name)return bad("Add your name and Crew name.");
      const starterKey=`starter/v1/${participantId}`,state=await getJSON(store,starterKey);
      if(!state||Object.keys(state.answers||{}).length<5)return bad("Complete your First Five first.");
      let crew=state.starterCrewId?await getJSON(store,`crew/${state.starterCrewId}`):null;
      const reused=!!crew;
      if(!crew){
        const crewId=id("c_"),ts=now();
        crew={id:crewId,name,createdAt:ts,createdBy:participantId,starterPack:true};
        await store.setJSON(`crew/${crewId}`,crew);
        await store.setJSON(`member/${crewId}/${participantId}`,{id:participantId,nickname,joinedAt:ts,provisional:false});
        // Persist the Crew id *before* seeding, so interrupted requests cannot leave
        // an unreferenced empty Crew or create multiple Crews on retry.
        state.starterCrewId=crewId;state.nickname=nickname;state.updatedAt=now();
        await store.setJSON(starterKey,state);
      }
      const pack=[
        {type:"either",question:"Weekend plan: mountains or beach? 🏔️🏖️",options:["Mountains","Beach"]},
        {type:"vote",question:"Who controls the playlist on a road trip? 🎧",options:["Driver","DJ friend","Me","Shuffle"]},
        {type:"predict",question:"Will this Crew execute its next plan? 🔮",options:["Yes","No"]},
        {type:"short",question:"What's ONE thing our Crew must do this year? 👀",options:[]},
        {type:"rate",question:"Rate our Crew's plan-making skills 😂",options:["😬 Nonexistent","😕 Rarely happens","🙂 Sometimes","😍 Pretty good","🔥 Elite"]}
      ];
      if(!state.starterPackSeeded){
        // Upgrade-safe: old Starter Crews already have five random-ID Drops.
        // Do not add another five if their client retries on the new release.
        const existingStarterDrops=(await listJSON(store,`drop/${crew.id}/`,50))
          .filter((d:any)=>d?.starterPack===true);
        if(existingStarterDrops.length>=5){
          state.starterPackSeeded=true;
          await store.setJSON(starterKey,state);
          return ok({crew,participantId,reused:true,starterDrops:existingStarterDrops.length});
        }
        const existingQuestions=new Set(existingStarterDrops.map((d:any)=>d.question));
        let seededCount=existingStarterDrops.length;
        for(let i=0;i<pack.length;i++){
          if(seededCount>=5)break;
          if(existingQuestions.has(pack[i].question))continue;
          const p=pack[i],dropId=`d_sp${i+1}_${crew.id.slice(2)}`,dropKey=`drop/${crew.id}/${dropId}`;
          const existing=await getJSON(store,dropKey);
          if(!existing){
            const createdAt=new Date(Date.parse(crew.createdAt)+i).toISOString();
            const d={id:dropId,crewId:crew.id,type:p.type,question:p.question,
              options:p.options.map((label:string,j:number)=>({id:p.type==="rate"?String(j+1):`o${j+1}`,label})),
              mediaA:"",mediaB:"",createdBy:participantId,creatorName:nickname,createdAt,
              thresholdMode:"count",thresholdCount:2,memberCountAtCreate:1,
              showNames:false,allowChange:true,status:"open",starterPack:true};
            await store.setJSON(dropKey,d);
            await store.setJSON(`dropIndex/${crew.id}/${createdAt}-${dropId}`,{dropId,createdAt});
            seededCount++;
          }else{seededCount++;}
        }
        if(seededCount<5)return bad('Starter Pack is preparing. Please retry.',503);
        state.starterPackSeeded=true;state.updatedAt=now();
        await store.setJSON(starterKey,state);
        await analyticsEvent(store,"starter_crew_created",participantId,crew.id,"",{starterDrops:pack.length},req,context);
      }
      return ok({crew,participantId,reused,starterDrops:pack.length});
    }


    if(action==="seedFirstCrew" && req.method==="POST"){
      const crewId=clean(body.crewId,40),participantId=clean(body.participantId,40);
      const crew=await getJSON(store,`crew/${crewId}`);
      if(!crew||crew.createdBy!==participantId)return bad("Only the creator can prepare this Crew's Starter Pack.",403);
      const interests=Array.isArray(body.interests)?body.interests.map((x:any)=>clean(x,24)).slice(0,2):[];
      const allowed=["rides","style","music","food","travel","memes","fitness"];
      if(interests.length!==2||interests[0]===interests[1]||interests.some((x:string)=>!allowed.includes(x)))return bad("Choose two different interests.");
      const existing=(await listJSON(store,`drop/${crewId}/`,100)).filter((x:any)=>x.starterPack===true);
      if(existing.length>=5)return ok({crew,seeded:5,reused:true,interestDropIds:existing.filter((x:any)=>x.seedInterest).map((x:any)=>x.id)});
      if(!crew.firstCreatedCrew||!Array.isArray(crew.seedInterests)&&existing.length)return bad("This Crew cannot be re-seeded.",409);
      const bank:any={
       rides:{either:["Sportbike or cruiser: which keys? 🏍️","Sportbike","Cruiser"],vote:["Road trip AUX: who gets control? 🎧","Driver","DJ friend","Me","Shuffle"]},
       style:{either:["Your entrance: which look? ✨","Streetwear","Classy"],vote:["Dress code for our next plan? 👀","All black","Statement fit","Comfy","Surprise"]},
       music:{either:["One free gig: where? 🎶","Front row","Rooftop"],vote:["Who gets the AUX? 🎧","DJ friend","Driver","Me","Shuffle"]},
       food:{either:["Midnight hunger: where? 🍕","Street food","Cafe desserts"],vote:["What's the first order? 🍟","Pizza","Momos","Chai","Dessert"]},
       travel:{either:["48-hour escape: where? 🏖️","Mountains","Beach"],vote:["Our next getaway? 🧳","Goa","Manali","Rishikesh","Anywhere"]},
       memes:{either:["Group chat chaos: which? 😂","Cursed memes","Voice notes"],vote:["Worst group-chat crime? 👀","Left on read","47 reels","Wrong chat","Spoilers"]},
       fitness:{either:["Saturday match: your pick? 🏏","Play it","Watch it"],vote:["What sport next? ⚡","Cricket","Football","Badminton","Gym"]}
      };
      if(!crew.seedInterests){crew.seedInterests=interests;await store.setJSON(`crew/${crewId}`,crew)}
      else if(crew.seedInterests.join("|")!==interests.join("|"))return bad("Retry with the Crew's saved interests.",409);
      const a=bank[interests[0]],b=bank[interests[1]];
      const pack=[
        {type:"either",question:a.either[0],options:a.either.slice(1),seedInterest:interests[0]},
        {type:"vote",question:b.vote[0],options:b.vote.slice(1),seedInterest:interests[1]},
        {type:"predict",question:"Will this Crew ACTUALLY execute its next plan? 🔮",options:["Yes","No"]},
        {type:"short",question:"What's ONE legendary thing our gang must do this year? 👀",options:[]},
        {type:"rate",question:"Rate our Crew's plan-making skills 😂",options:["😬 Never","😕 Rare","🙂 Sometimes","😍 Often","🔥 Legendary"]}
      ];
      for(let i=0;i<pack.length;i++){
        const q=pack[i],dropId=`d_fc${i+1}_${crewId.slice(2)}`,createdAt=new Date(Date.parse(crew.createdAt)+i+1).toISOString(),key=`drop/${crewId}/${dropId}`;
        if(!await getJSON(store,key)){
          await store.setJSON(key,{id:dropId,crewId,type:q.type,question:q.question,
            options:q.options.map((label:string,j:number)=>({id:q.type==="rate"?String(j+1):`o${j+1}`,label})),
            mediaA:"",mediaB:"",createdBy:"adda_seed",creatorName:"Adda",seededFor:participantId,createdAt,
            thresholdMode:"count",thresholdCount:2,memberCountAtCreate:1,showNames:false,allowChange:true,status:"open",
            starterPack:true,firstCrewSeed:true,seedInterest:q.seedInterest||""});
        }
        await store.setJSON(`dropIndex/${crewId}/${createdAt}-${dropId}`,{dropId,createdAt});
      }
      crew.starterPack=true;crew.seedReady=true;await store.setJSON(`crew/${crewId}`,crew);
      await analyticsEvent(store,"first_crew_seeded",participantId,crewId,"",{interests,count:5},req,context);
      return ok({crew,seeded:5,reused:false,interestDropIds:[`d_fc1_${crewId.slice(2)}`,`d_fc2_${crewId.slice(2)}`]});
    }

    if (action === "createCrew" && req.method === "POST") {
      const name = clean(body.name, 42);
      const nickname = clean(body.nickname, 24);
      if (!name || !nickname) return bad("Crew name and your name are required.");
      const participantId=clean(body.participantId,40)||id("p_"),requestId=clean(body.requestId,48);
      const key=/^[a-zA-Z0-9_-]{8,48}$/.test(requestId)?`crewCreate/v073/${participantId}/${requestId}`:"";
      if(key){const prior=await getJSON(store,key);if(prior?.crewId){const c=await getJSON(store,`crew/${prior.crewId}`);if(c)return ok({crew:c,participantId,reused:true,firstCreatedCrew:!!c.firstCreatedCrew})}}
      const previous=(await listJSON(store,"crew/",2000)).filter((x:any)=>x.createdBy===participantId);
      const crewId=id("c_"),crew={id:crewId,name,createdAt:now(),createdBy:participantId,firstCreatedCrew:previous.length===0};
      await store.setJSON(`crew/${crewId}`,crew);
      await store.setJSON(`member/${crewId}/${participantId}`,{id:participantId,nickname,joinedAt:now(),provisional:false});
      if(key)await store.setJSON(key,{crewId,createdAt:now()});
      return ok({crew,participantId,firstCreatedCrew:crew.firstCreatedCrew,reused:false});
    }

    if (action === "joinCrew" && req.method === "POST") {
      const crewId=clean(body.crewId,40),nickname=clean(body.nickname,24);
      const participantId=clean(body.participantId,40)||id("p_");
      const crew=await getJSON(store,`crew/${crewId}`);
      if(!crew)return bad("Crew not found.",404);
      if(!nickname)return bad("Your name is required.");
      const memberKey=`member/${crewId}/${participantId}`;
      const existing=await getJSON(store,memberKey);
      // An invite may make a temporary mate before the First Five finishes.
      // Never replace a real member's name with a temporary one on repeated link opens.
      const provisional=body.provisional===true&&!existing;
      const updated=existing&&body.provisional===true?existing:{
        id:participantId,nickname,joinedAt:existing?.joinedAt||now(),
        provisional:provisional||false
      };
      if(!existing||body.provisional!==true)await store.setJSON(memberKey,updated);
      return ok({crew,participantId,member:updated,alreadyJoined:!!existing});
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
      const requestId=clean(body.requestId,48),requestKey=/^[a-zA-Z0-9_-]{8,48}$/.test(requestId)?`dropCreate/v073/${crewId}/${participantId}/${requestId}`:"";
      if(requestKey){const prior=await getJSON(store,requestKey);if(prior?.dropId){const previous=await getJSON(store,`drop/${crewId}/${prior.dropId}`);if(previous)return ok({drop:previous,reused:true})}}
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
      if(requestKey)await store.setJSON(requestKey,{dropId,createdAt:drop.createdAt});
      return ok({drop,reused:false});
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
          result={entries:responses.map((r:any)=>({participantId:r.participantId,nickname:r.nickname,answer:r.answer,answeredAt:r.answeredAt})),total:responses.length};
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
      if(existing&&existing.answer===answer)return ok({saved:true,alreadyAnswered:true,myResponse:existing});
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

    if (action === "getVibe") {
      const participantId=clean(url.searchParams.get("participantId"),40),crewId=clean(url.searchParams.get("crewId"),40);
      if(!participantId)return bad("Participant required.");

      const memberBlobs=(await store.list({prefix:"member/"})).blobs;
      const responseBlobs=(await store.list({prefix:"response/"})).blobs;
      const dropRows=await listJSON(store,"drop/",100000);
      const chatRows=await listJSON(store,"chat/",100000);
      const analyticsEvents=(await listJSON(store,"analytics/event/",100000)).filter((e:any)=>e.participantId===participantId);
      const legacyEvents=(await listJSON(store,"event/",100000)).filter((e:any)=>e.participantId===participantId);

      const memberships=memberBlobs.filter((b:any)=>b.key.endsWith("/"+participantId));
      const membershipRows=(await Promise.all(memberships.slice(-20).map(async (b:any)=>getJSON(store,b.key)))).filter(Boolean);
      const displayName=membershipRows.slice().sort((a:any,b:any)=>String(b.joinedAt||"").localeCompare(String(a.joinedAt||"")))[0]?.nickname||"";
      const myResponses=responseBlobs.filter((b:any)=>b.key.endsWith("/"+participantId));
      const starter=starterPayload(await getJSON(store,`starter/v1/${participantId}`));
      const guideState=await getJSON(store,`guide/v1/${participantId}`)||{steps:{}};
      const guidePoints=Object.values(guideState.steps||{}).reduce((n:any,x:any)=>Number(n)+Number(x.points||0),0);
      const myDrops=dropRows.filter((d:any)=>d.createdBy===participantId);
      const myChats=chatRows.filter((m:any)=>m.participantId===participantId);
      const allEvents=[...legacyEvents,...analyticsEvents];
      const shares=allEvents.filter((e:any)=>["drop_shared","crew_shared","share_attempted"].includes(e.event)).length;

      const dropMap:any={};dropRows.forEach((d:any)=>dropMap[(d.crewId||"")+"/"+d.id]=d);
      const typeCounts:any={};
      myResponses.forEach((b:any)=>{const p=b.key.split("/");const d=dropMap[(p[1]||"")+"/"+(p[2]||"")];if(d?.type)typeCounts[d.type]=(typeCounts[d.type]||0)+1});
      activeStarterDeck(starter).filter((q:any)=>starter.answers[q.id]!==undefined).forEach((q:any)=>{typeCounts[q.type]=(typeCounts[q.type]||0)+1});
      const signature=Object.entries(typeCounts).sort((a:any,b:any)=>Number(b[1])-Number(a[1]))[0]?.[0]||myDrops[0]?.type||"";

      const daySet=new Set<string>();
      const addDay=(ts:any)=>{const d=String(ts||"").slice(0,10);if(/^\d{4}-\d{2}-\d{2}$/.test(d))daySet.add(d)};
      allEvents.forEach((e:any)=>addDay(e.createdAt));
      myDrops.forEach((d:any)=>addDay(d.createdAt));
      myChats.forEach((m:any)=>addDay(m.createdAt));
      const responseRows=await Promise.all(myResponses.slice(-500).map(async (b:any)=>getJSON(store,b.key)));
      responseRows.filter(Boolean).forEach((r:any)=>addDay(r.answeredAt));

      const dates=[...daySet].sort();
      const utcDay=(d:Date)=>d.toISOString().slice(0,10);
      let streak=0;
      if(dates.length){
        let cursor=new Date();cursor.setUTCHours(0,0,0,0);
        const latest=dates[dates.length-1],today=utcDay(cursor);
        const y=new Date(cursor);y.setUTCDate(y.getUTCDate()-1);const yesterday=utcDay(y);
        if(latest===today||latest===yesterday){
          if(latest===yesterday)cursor=y;
          while(daySet.has(utcDay(cursor))){streak++;cursor.setUTCDate(cursor.getUTCDate()-1)}
        }
      }

      const answers=myResponses.length,dropsMade=myDrops.length,chatsSent=myChats.length,crews=memberships.length;
      const totalAnswers=answers+starter.progress;
      const score=answers*10+dropsMade*30+chatsSent*4+shares*20+crews*10+Math.min(streak,10)*5+starter.points+guidePoints;
      const levels=AURA_LEVELS;
      let level=levels[0],next:any=null;
      for(let i=0;i<levels.length;i++){if(score>=levels[i].min)level=levels[i];else{next=levels[i];break}}
      const levelIndex=levels.indexOf(level),levelFloor=level.min,nextTarget=next?.min||level.min;
      const progress=next?Math.max(0,Math.min(100,Math.round((score-levelFloor)/(nextTarget-levelFloor)*100))):100;

      const defs=[
        {id:"first",icon:"🎯",name:"First Move",desc:"Answer your first Drop",current:totalAnswers,target:1},
        {id:"responder",icon:"⚡",name:"Responder",desc:"Answer 5 Drops",current:totalAnswers,target:5},
        {id:"deep",icon:"🏊",name:"Deep Diver",desc:"Answer 10 Drops",current:totalAnswers,target:10},
        {id:"maker",icon:"🛠️",name:"Drop Maker",desc:"Create your first Drop",current:dropsMade,target:1},
        {id:"machine",icon:"🚀",name:"Drop Machine",desc:"Create 5 Drops",current:dropsMade,target:5},
        {id:"firstfive",icon:"🏆",name:"First Five",desc:"Finish your First Five",current:starter.progress,target:5},
        {id:"tenacious",icon:"👑",name:"Tenacious",desc:"Finish all 10 Starter Drops",current:starter.progress,target:10},
        {id:"chatty",icon:"💬",name:"Chatty",desc:"Send 5 Crew chats",current:chatsSent,target:5},
        {id:"social",icon:"📣",name:"Social Spark",desc:"Share Adda 3 times",current:shares,target:3},
        {id:"multi",icon:"👥",name:"Multi-Crew",desc:"Join 2 Crews",current:crews,target:2},
        {id:"streak3",icon:"🔥",name:"On Fire",desc:"Build a 3-day streak",current:streak,target:3},
        {id:"streak7",icon:"🏆",name:"Weekender",desc:"Build a 7-day streak",current:streak,target:7}
      ];
      const badges=defs.map((b:any)=>({...b,unlocked:b.current>=b.target,progress:Math.min(100,Math.round(b.current/b.target*100))}));
      const locked=badges.filter((b:any)=>!b.unlocked).sort((a:any,b:any)=>(b.current/b.target)-(a.current/a.target));
      const nextUnlock=locked[0]||null;

      let crewRank:any=null;
      if(crewId){
        const crewMembers=await listJSON(store,`member/${crewId}/`,100);
        const cResp=(await store.list({prefix:`response/${crewId}/`})).blobs;
        const cDrops=dropRows.filter((d:any)=>d.crewId===crewId);
        const cChats=chatRows.filter((m:any)=>m.crewId===crewId||String((m as any).key||"").includes(`chat/${crewId}/`));
        const points:any={};crewMembers.forEach((m:any)=>points[m.id]=0);
        cResp.forEach((b:any)=>{const p=b.key.split("/"),who=p[p.length-1];if(points[who]!==undefined)points[who]+=10});
        cDrops.forEach((d:any)=>{if(points[d.createdBy]!==undefined)points[d.createdBy]+=30});
        // Chat rows do not carry crewId in older records, so count exact crew chat prefix separately.
        const crewChatRows=await listJSON(store,`chat/${crewId}/`,500);
        crewChatRows.forEach((m:any)=>{if(points[m.participantId]!==undefined)points[m.participantId]+=4});
        const ranked=crewMembers.map((m:any)=>({id:m.id,nickname:m.nickname,score:points[m.id]||0})).sort((a:any,b:any)=>b.score-a.score||String(a.nickname).localeCompare(String(b.nickname)));
        const idx=ranked.findIndex((x:any)=>x.id===participantId);
        if(idx>=0)crewRank={rank:idx+1,total:ranked.length,score:ranked[idx].score,crewName:(await getJSON(store,`crew/${crewId}`))?.name||""};
      }

      const visitor=await getJSON(store,`analytics/visitor/${participantId}`);
      return ok({
        score,level:{...level,index:levelIndex+1},nextLevel:next,progress,pointsToNext:next?Math.max(0,next.min-score):0,
        streak,activeDays:dates.length,answers:totalAnswers,starterAnswers:starter.progress,dropsMade,chatsSent,shares,crews,sessions:Number(visitor?.sessionCount)||0,
        displayName:displayName||starter.nickname,signature,typeCounts,badges,nextUnlock,crewRank,starter:{progress:starter.progress,points:starter.points,firstFiveCompleted:starter.firstFiveCompleted,bonusCompleted:starter.bonusCompleted,earned:starter.earned},guided:{points:guidePoints,steps:guideState.steps||{}}
      });
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
