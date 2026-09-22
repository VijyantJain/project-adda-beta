// Private opt-in interest warm-up; never stored in Crew Drop results.
export function createPersonalGuide(c){
const {api,pid,esc,toast,onDone,track,getCrewId,getProfile,saveProfile}=c;
const packs={
 rides:{name:"Wheels & rides",emoji:"🏍️",art:"roadtrip",q:[["Pick your weekend machine 👀",["Sportbike","Big cruiser"]],["Your road-trip job? 😂",["AUX DJ","Snacks","Lost navigator"]]]},
 style:{name:"Fashion & looks",emoji:"✨",art:"denim",q:[["Two looks. Pick your entrance ✨",["Bold statement glam","Clean, classy fit"]],["Rate this outfit idea",["😬 Pass","😕 Not quite","🙂 Nice","😍 Love","🔥 Main character"]]]},
 music:{name:"Music & concerts",emoji:"🎧",art:"friends",q:[["One ticket. Where are we?",["Front-row concert","Tiny rooftop gig"]],["Your AUX habit? 😂",["One track repeat","Only my playlist","Skipping the gang"]]]},
 food:{name:"Food & cafés",emoji:"🍕",art:"chai",q:[["Midnight hunger. Choose!",["Street-food chaos","Café & dessert"]],["Share your last fry?",["😬 Never","😕 One only","🙂 Maybe","😍 Sure","🔥 Take all"]]]},
 travel:{name:"Travel & escapes",emoji:"🏖️",art:"travel",q:[["48-hour escape. Choose!",["Mountains & mist","Beach & sunsets"]],["Your trip role? 😂",["Organizer","Late packer","Here for photos"]]]},
 memes:{name:"Memes & chaos",emoji:"😂",art:"friends",q:[["Serious group chat. You...",["Send a cursed meme","Go silent","Change topic"]],["Your group chat offense?",["57 reels/hour","Reply in 3 days","Podcast voice notes"]]]},
 fitness:{name:"Sports & fitness",emoji:"🏏",art:"roadtrip",q:[["Perfect Saturday: choose!",["Watch a live match","Play a match"]],["Rate gym buddy consistency",["😬 Ghosted","😕 Cancels","🙂 Sometimes","😍 Regular","🔥 Wakes me up"]]]}
};
const styleVariant={man:["Your entrance? More aura? 👀",["Sharp tailored look","Streetwear, sneakers & shades"]],woman:["Your night-out mood? ✨",["Statement sparkle","Chic & classy"]]};
const key="addaPersonalGuide_"+pid,done="addaPersonalGuideDone_"+pid;
let interest="",gender="",index=0,answers=[],busy=false;
const load=()=>{try{return JSON.parse(localStorage.getItem(key)||"{}")}catch{return {}}};
const save=()=>localStorage.setItem(key,JSON.stringify({interest,gender,index,answers}));
function overlay(html){document.querySelector(".addaPersonalOverlay")?.remove();const o=document.createElement("div");o.className="addaPersonalOverlay";o.setAttribute("role","dialog");o.setAttribute("aria-label","Your personal Vibe");o.innerHTML='<main class="addaPersonalStage">'+html+"</main>";document.body.appendChild(o)}
function finish(){
 const p=getProfile();p.interest=interest;p.gender=gender;p.privateVibePicks=answers;saveProfile(p);localStorage.setItem(done,"1");
 document.querySelector(".addaPersonalOverlay")?.remove();track("personal_guide_completed",{interest});onDone();
}
function render(){
 if(!interest){
  overlay('<span class="starterKicker">PICK YOUR VIBE 💜</span><h1>What do YOU like?</h1><p>These next two picks are private and won’t change your Crew mates’ shared Drops.</p><div class="addaInterestGrid">'+Object.entries(packs).map(([id,p])=>'<button class="addaInterestPick" data-pack="'+id+'"><span>'+p.emoji+'</span><b>'+esc(p.name)+'</b></button>').join("")+'</div><div class="field"><label>Gender (optional and private)</label><select id="personalGender"><option value="">Prefer not to say</option><option value="man">Man</option><option value="woman">Woman</option><option value="nonbinary">Nonbinary / another identity</option></select></div><p class="sub">Interests decide the card pack. Gender never blocks an interest.</p><button class="starterTextLink" id="surpriseMe">Surprise me instead →</button>');
  document.getElementById("personalGender").value=gender;
  document.querySelectorAll("[data-pack]").forEach(b=>b.addEventListener("click",()=>{interest=b.dataset.pack;gender=document.getElementById("personalGender").value;save();track("personal_pack_selected",{interest});render()}));
  document.getElementById("surpriseMe").addEventListener("click",()=>{interest="memes";gender="";save();track("personal_pack_skipped",{});render()});return;
 }
 const p=packs[interest],d=interest==="style"&&index===0&&styleVariant[gender]?styleVariant[gender]:p.q[index];
 overlay('<span class="starterKicker">JUST FOR YOU · '+(index+1)+'/2</span><div class="addaPrivateMedia"><img src="/starter-'+p.art+'.svg" alt=""><span>'+p.emoji+'</span></div><h1>'+esc(d[0])+'</h1><p>Your personal picks stay outside shared Crew results.</p><div class="starterChoices">'+d[1].map((x,i)=>'<button class="starterChoice" data-choice="'+i+'"><span class="choiceIndex">'+(i+1)+'</span><b>'+esc(x)+'</b><span>↗</span></button>').join("")+'</div><div id="personalStatus" aria-live="polite"></div>');
 document.querySelectorAll("[data-choice]").forEach(btn=>btn.addEventListener("click",async()=>{
  if(busy)return;busy=true;btn.classList.add("picked");document.querySelectorAll("[data-choice]").forEach(b=>b.disabled=true);
  document.getElementById("personalStatus").textContent="Saving your choice…";
  try{const r=await api("guideStep",{method:"POST",body:{participantId:pid,step:index?"personal_two":"personal_one",crewId:getCrewId()}});
   answers[index]=d[1][Number(btn.dataset.choice)];index++;save();track("personal_card_answered",{interest,step:index});
   if(index===2){finish();return}
   overlay('<div class="addaPrivateReward">⚡<h1>+'+(r.earnedPoints||0)+' Vibe</h1><p>One more private choice. Then meet your Crew!</p><button class="btn starterCTA" id="personalNext">Next choice →</button></div>');
   document.getElementById("personalNext").addEventListener("click",render);
  }catch(e){toast(e.message);render()}finally{busy=false}
 }));
}
function start(){if(localStorage.getItem(done)==="1"){onDone();return}const st=load();interest=packs[st.interest]?st.interest:"";gender=st.gender||"";index=st.index||0;answers=st.answers||[];if(index>=2){finish();return}track("personal_guide_started",{});render()}
return{start}
}