const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const projects = {
  npv:{title:"NullPointVector",state:"CENTER",desc:"AI threat-detection platform across email, SMS, and voice with FastAPI, PostgreSQL/pgvector, NLP, and hardened CI/CD.",source:"https://github.com/EPdacoder05/NullPointVector",project:"https://epdacoder05.github.io/NullPointVector/"},
  fabric:{title:"Security Data Fabric",state:"SECURITY ANALYTICS",desc:"Three-tier medallion architecture built to normalize and enrich security telemetry from 10+ enterprise data sources.",source:"https://github.com/EPdacoder05/security-data-fabric",project:"https://github.com/EPdacoder05/security-data-fabric"},
  finops:{title:"Cost-Control-as-Code",state:"FINOPS",desc:"Event-driven AWS automation for cost discovery, budget enforcement, orphan detection, and reusable security controls.",source:"https://github.com/EPdacoder05/finops-cost-control-as-code",project:"https://github.com/EPdacoder05/finops-cost-control-as-code"},
  ble:{title:"HA-BLE-MQTT Bridge",state:"IOT / EDGE",desc:"Reverse-engineered BLE lighting protocols and built an asynchronous Python/MQTT bridge with self-healing network resilience.",source:"https://github.com/EPdacoder05/ha-ble-mqtt-bridge",project:"https://epdacoder05.github.io/ha-ble-mqtt-bridge/"},
  jarvis:{title:"Jarvis AI Homelab",state:"AI / HOME LAB",desc:"Serverless voice-assistant backend translating voice commands into secure smart-home actions with secrets isolated in AWS.",source:"https://github.com/EPdacoder05/Jarvis-AI-Assistant",project:"https://github.com/EPdacoder05/Jarvis-AI-Assistant"},
  media:{title:"Cloud Media Pipeline",state:"EVENT DRIVEN",desc:"Automated AWS pipeline for ingestion, AI analysis, transcoding, orchestration, and smart storage lifecycle management.",source:"https://github.com/EPdacoder05/Media-Processing-Pipeline",project:"https://github.com/EPdacoder05/Media-Processing-Pipeline"}
};

// Full-screen first-load preloader uses the exact uploaded gear-preloader.svg.
const preloader=document.getElementById("preloader");
if(preloader){if(reduceMotion){preloader.remove()}else{setTimeout(()=>{preloader.classList.add("is-hidden");setTimeout(()=>preloader.remove(),500)},1500)}}

// Header mark is the SAME animated SVG and therefore keeps spinning continuously.
const gearBrand=document.getElementById("gearBrand");
gearBrand?.addEventListener("click",()=>{gearBrand.classList.add("is-burst");document.getElementById("top")?.scrollIntoView({behavior:reduceMotion?"auto":"smooth"});setTimeout(()=>gearBrand.classList.remove("is-burst"),350)});

// Typed working set.
const typed=document.getElementById("typedText"),phrases=["cloud automation","platform infrastructure","security systems","backend platforms","BLE → MQTT"];
if(typed&&!reduceMotion){let p=0,c=phrases[0].length,del=true;const loop=()=>{const s=phrases[p];typed.textContent=s.slice(0,c);if(del){c--;if(c<0){del=false;p=(p+1)%phrases.length;c=0;return setTimeout(loop,250)}return setTimeout(loop,28)}c++;if(c>s.length){del=true;return setTimeout(loop,1200)}setTimeout(loop,52)};setTimeout(loop,900)}

// Project constellation: actual rotating satellites, zoom, joining, animated links, non-blocking inspector.
const svg=document.getElementById("constellation"),shell=document.getElementById("projectMap"),lineLayer=document.getElementById("lineLayer"),packetLayer=document.getElementById("packetLayer"),nodes=[...document.querySelectorAll(".satellite")],center=document.getElementById("centerNode"),mapMode=document.getElementById("mapMode");
const inspector={state:document.getElementById("inspectorState"),count:document.getElementById("joinCount"),title:document.getElementById("inspectorTitle"),desc:document.getElementById("inspectorDesc"),source:document.getElementById("inspectorSource"),project:document.getElementById("inspectorProject")};
const cx=410,cy=250;let rotation=0,zoom=1,drag=null;const joined=new Set();const lineMap=new Map(),packetMap=new Map();

nodes.forEach(node=>{const key=node.dataset.project;const line=document.createElementNS("http://www.w3.org/2000/svg","line");line.classList.add("line");line.dataset.project=key;lineLayer.appendChild(line);lineMap.set(key,line);const packet=document.createElementNS("http://www.w3.org/2000/svg","circle");packet.setAttribute("r","3.2");packet.classList.add("packet");packet.style.opacity="0";packetLayer.appendChild(packet);packetMap.set(key,packet)});

function pos(node){const baseAngle=Number(node.dataset.angle),baseRadius=Number(node.dataset.radius),key=node.dataset.project;const angle=(baseAngle+rotation)*Math.PI/180;const joinScale=joined.has(key)?.72:1;const r=baseRadius*zoom*joinScale;return{x:cx+Math.cos(angle)*r,y:cy+Math.sin(angle)*r}}
function render(){nodes.forEach(node=>{const key=node.dataset.project,{x,y}=pos(node);node.setAttribute("transform",`translate(${x.toFixed(2)} ${y.toFixed(2)})`);node.classList.toggle("joined",joined.has(key));const line=lineMap.get(key);line.setAttribute("x1",cx);line.setAttribute("y1",cy);line.setAttribute("x2",x);line.setAttribute("y2",y);line.classList.toggle("joined",joined.has(key))});inspector.count.textContent=`${joined.size}/5 joined`;mapMode.textContent=`drag ${rotation.toFixed(0)}° · orbit ${(zoom*100).toFixed(0)}% · ${joined.size} joined`}
function inspect(key,override){const p=projects[key];inspector.state.textContent=override||p.state;inspector.title.textContent=p.title;inspector.desc.textContent=p.desc;inspector.source.href=p.source;inspector.project.href=p.project}
function resetInspector(){if(joined.size){const key=[...joined].at(-1);inspect(key,"JOINED TO NPV")}else inspect("npv")}
function toggleJoin(key){joined.has(key)?joined.delete(key):joined.add(key);inspect(key,joined.has(key)?"JOINED TO NPV":"DETACHED");render()}

nodes.forEach(node=>{const key=node.dataset.project;node.addEventListener("mouseenter",()=>inspect(key,joined.has(key)?"JOINED TO NPV":"PREVIEW"));node.addEventListener("mouseleave",resetInspector);node.addEventListener("focus",()=>inspect(key,joined.has(key)?"JOINED TO NPV":"PREVIEW"));node.addEventListener("blur",resetInspector);node.addEventListener("click",e=>{e.stopPropagation();toggleJoin(key)});node.addEventListener("dblclick",e=>{e.stopPropagation();window.open(projects[key].project,"_blank","noopener,noreferrer")});node.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggleJoin(key)}})});
center?.addEventListener("click",()=>{joined.clear();rotation=0;zoom=1;inspect("npv");render()});

shell?.addEventListener("pointerdown",e=>{if(e.target.closest(".satellite,.center-node,.map-inspector a"))return;drag={x:e.clientX,r:rotation};svg.classList.add("dragging");shell.setPointerCapture?.(e.pointerId)});
shell?.addEventListener("pointermove",e=>{if(!drag)return;rotation=drag.r+(e.clientX-drag.x)*.12;render()});
function endDrag(e){if(!drag)return;drag=null;svg.classList.remove("dragging");shell.releasePointerCapture?.(e.pointerId)}shell?.addEventListener("pointerup",endDrag);shell?.addEventListener("pointercancel",endDrag);
shell?.addEventListener("wheel",e=>{if(!e.target.closest("svg"))return;e.preventDefault();zoom=Math.max(.78,Math.min(1.12,zoom+(e.deltaY<0?.045:-.045)));render()},{passive:false});

// Animated packets travel only on JOINED links.
function animatePackets(t){nodes.forEach(node=>{const key=node.dataset.project,packet=packetMap.get(key);if(!joined.has(key)){packet.style.opacity="0";return}const{x,y}=pos(node),phase=((t/1350)+(nodes.indexOf(node)*.17))%1;packet.setAttribute("cx",cx+(x-cx)*phase);packet.setAttribute("cy",cy+(y-cy)*phase);packet.style.opacity=String(.35+Math.sin(phase*Math.PI)*.65)});requestAnimationFrame(animatePackets)}
if(!reduceMotion)requestAnimationFrame(animatePackets);render();inspect("npv");

// Impact count-up.
const counters=document.querySelectorAll("[data-count]");const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target,target=Number(el.dataset.count),prefix=el.dataset.prefix||"",suffix=el.dataset.suffix||"",dec=String(target).includes(".")?1:0,start=performance.now(),duration=reduceMotion?0:850;function tick(now){const q=duration===0?1:Math.min((now-start)/duration,1),v=target*(1-Math.pow(1-q,3)),txt=dec?v.toFixed(dec):Math.round(v).toLocaleString();el.textContent=prefix+txt+suffix;if(q<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);obs.unobserve(el)}),{threshold:.4});counters.forEach(c=>obs.observe(c));
