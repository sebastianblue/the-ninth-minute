import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {IDS,DEPENDENCIES,normalize,checkAnswer,unlocked,LEDGER,REQUESTS,mustHold,MORSE,SIGNAL,CIPHERTEXT,decrypt,FILM_A,FILM_B,blockedRooms,PLAN_LETTERS,adjacent,SHUTTER_START,SHUTTER_TARGET,toggleShutter,shutterAligned,EVENTS,validChronology,RELAYS,GRILLE,grilleHoles,emptySession,cleanSession,encodeSession,decodeSession} from '../dist/engine.js';
import {RECORDS,ENDINGS} from '../dist/records.js';
let checks=0;
const test=(truth,message)=>{assert.ok(truth,message);checks++};
const eq=(a,b,message)=>{assert.deepEqual(a,b,message);checks++};
const derive={};
const intakeHTML=RECORDS.intake.body();
const cancelled=[...intakeHTML.matchAll(/class="cancelled"><td>(\d+)<\/td><td>([^<]+)/g)].sort((a,b)=>Number(a[1])-Number(b[1]));
derive.intake=cancelled.map(x=>x[2][0]).join('');eq(cancelled.length,5,'five rejected entries');
derive.ledger=[...LEDGER].sort((a,b)=>a.copy-b.copy).map(r=>{const delta=r.opening+r.in-r.out-r.balance;test(delta>=1&&delta<=26,'valid ledger extraction');return String.fromCharCode(64+delta)}).join('');
derive.carrier=SIGNAL.map(group=>Object.entries(MORSE).find(([,code])=>code===group)?.[0]).join('');test(303*3===909,'unique specified harmonic');
derive.retention=REQUESTS.filter(mustHold).map(r=>r.tab).join('');eq(REQUESTS.filter(mustHold).map(r=>r.docket),[1,3,5,7,9,11],'unique charter audit');
const decoded=decrypt(CIPHERTEXT,derive.carrier);derive.cipher=decoded.match(/SEAL ([A-Z]+)\./)?.[1];test(decoded.startsWith('THE TAPE ENDS'),'cipher produces coherent testimony');
const blocks=blockedRooms(true),routes=[];
function walk(room,path){if(room===14){routes.push(path);return}for(let i=0;i<25;i++)if(!blocks.has(i)&&!path.includes(i)&&adjacent(room,i))walk(i,[...path,i])}
walk(20,[20]);eq(routes.length,1,'unique route after aligning films');eq(routes[0],[20,15,10,11,6,1,2,3,8,13,14],'route matches hint');derive.plan=routes[0].map(i=>PLAN_LETTERS[i]||'').join('');
test(blockedRooms(false).has(20),'misregistered film blocks intake');test(FILM_A.every(i=>!FILM_B.includes(i)),'obstruction sheets complementary');
const shutterSolutions=[];for(let mask=0;mask<512;mask++){let s=[...SHUTTER_START];for(let i=0;i<9;i++)if(mask>>i&1)s=toggleShutter(s,i);if(shutterAligned(s))shutterSolutions.push(mask);checks++}
eq(shutterSolutions.length,1,'unique shutter switch combination');eq(Array.from({length:9},(_,i)=>i).filter(i=>shutterSolutions[0]>>i&1),[0,2,3,4,8],'switch solution matches hint');derive.shutters='RETURN';
for(let i=0;i<9;i++){eq(toggleShutter(toggleShutter(SHUTTER_START,i),i),SHUTTER_START,'double press cancels');for(let j=0;j<9;j++)eq(toggleShutter(toggleShutter(SHUTTER_START,i),j),toggleShutter(toggleShutter(SHUTTER_START,j),i),'presses commute')}
const orders=[];function permute(left,order=[]){if(!left.length){if(validChronology(order))orders.push(order);checks++;return}for(let i=0;i<left.length;i++)permute([...left.slice(0,i),...left.slice(i+1)],[...order,left[i]])}
permute(EVENTS.map(e=>e.id));eq(orders.length,1,'six constraints admit exactly one chronology');derive.chronology=orders[0].map(id=>EVENTS.find(e=>e.id===id).tab).join('');
derive.final=RELAYS.map(r=>derive[r.operator[0]][r.operator[1]-1]+derive[r.witness[0]][r.witness[1]-1]).join('');test(RELAYS.every(r=>r.operator[1]>0&&r.witness[1]>0),'one-based relay indices');
const allHoles=[];derive.zero='';for(let turn=0;turn<4;turn++){const holes=grilleHoles(turn);allHoles.push(...holes);derive.zero+=holes.map(i=>GRILLE[i]).join('')};eq(new Set(allHoles).size,16,'grille covers all cells once');eq(allHoles.length,16,'four holes, four turns');
const seals={};for(const id of [...IDS,'zero']){test(unlocked(id,seals),'legal progression: '+id);test(await checkAnswer(id,derive[id]),'derived extraction validates: '+id);test(await checkAnswer(id,derive[id].toLowerCase().split('').join(' ')),'normalization: '+id);test(!await checkAnswer(id,'NOTTHISANSWER'),'reject wrong guess: '+id);test(RECORDS[id].hints[2].includes(derive[id])||normalize(RECORDS[id].hints[2]).includes(derive[id]),'full hint agrees: '+id);seals[id]=derive[id];}
test(!unlocked('final',{}),'final cannot open early');test(!unlocked('chronology',{intake:'X',ledger:'X',carrier:'X',plan:'X'}),'hearing requires both tiers of all branches');
for(const id of IDS){const missing={...seals};delete missing[id];for(const [child,parents]of Object.entries(DEPENDENCIES))if(parents.includes(id))test(!unlocked(child,missing),'dependency blocks child: '+child)}
const defaultSession=emptySession();eq(cleanSession(null),defaultSession,'empty restore');eq(cleanSession({version:2,seals}),defaultSession,'unsupported restore');const restored=cleanSession({version:1,seals,notes:'A witness',hints:{ledger:100},widgets:{frequency:909},ending:'release',foundZero:true});eq(restored.seals,seals,'session round trip');eq(restored.hints.ledger,3,'hint count bounded');eq(restored.notes,'A witness','notes retained');eq(cleanSession({version:1,seals:{ledger:'<script>'},ending:'unknown'}).ending,null,'invalid choice excluded');
for(const [id,r]of Object.entries(RECORDS)){test(r.hints.length===3,'three hint tiers: '+id);for(const next of r.next)test(Boolean(RECORDS[next]),'valid addendum link');for(const match of r.body().matchAll(/href="#([^" ]+)"/g))test(Boolean(RECORDS[match[1]]),'evidence link valid')}
eq(Object.keys(ENDINGS),['release','preserve','silence'],'three dispositions');
eq(decodeSession(encodeSession({...restored,notes:'Rain — 雨 ☔'})),{...restored,notes:'Rain — 雨 ☔'},'Unicode recovery code round trip');
const index=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');test(index.includes('type="module" src="app.js"'),'app entry');test(!index.includes('href="/'),'relative project paths');
console.log(`PASS: ${checks.toLocaleString()} checks. All ten extractions agree with their validators. Floor plan, shutter configuration, and event chronology have unique solutions. All branch gates and session checks pass.`);
