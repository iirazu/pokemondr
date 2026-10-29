(()=>{
const T=16,VW=11,VH=11,MW=40,MH=40,$=s=>document.querySelector(s);
const TY={fuego:{planta:2,agua:.5,fuego:.5},agua:{fuego:2,planta:.5,agua:.5},planta:{agua:2,fuego:.5,planta:.5},normal:{}};
const SP=[{n:'Flamix',e:'🦊',t:'fuego',hp:39,atk:52,def:43},{n:'Aquaro',e:'🐢',t:'agua',hp:44,atk:48,def:65},{n:'Hojita',e:'🌱',t:'planta',hp:45,atk:49,def:49},{n:'Ratix',e:'🐭',t:'normal',hp:30,atk:56,def:35},{n:'Pajarín',e:'🐦',t:'normal',hp:40,atk:45,def:40},{n:'Sapito',e:'🐸',t:'agua',hp:50,atk:50,def:45},{n:'Lagartix',e:'🦎',t:'fuego',hp:42,atk:55,def:40},{n:'Setón',e:'🍄',t:'planta',hp:48,atk:46,def:55}];
const MV={fuego:['Ascuas',45],agua:['Pistola Agua',45],planta:['Látigo Cepa',45],normal:['Golpe Fuerte',55]};
const COL=['#8bc34a','#4e9a2f','#8bc34a','#3f8fd8','#d9c28f','#e4574d'];
const cv=$('#map'),ctx=cv.getContext('2d');cv.width=VW*T;cv.height=VH*T;
let rs=20261029;const rnd=()=>(rs=(rs*1664525+1013904223)%4294967296)/4294967296;
const map=Array.from({length:MH},()=>Array(MW).fill(0));
const blob=(t,n,a,b)=>{for(let i=0;i<n;i++){const cx=rnd()*MW|0,cy=rnd()*MH|0,r=a+rnd()*(b-a);for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if((x-cx)**2+(y-cy)**2<r*r)map[y][x]=t}};
blob(1,16,2,4.5);blob(3,5,2,3.5);
for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)if(map[y][x]<2&&rnd()<.06)map[y][x]=2;
for(let i=0;i<MW;i++){map[20][i]=4;map[i][20]=4}
for(let i=0;i<MW;i++){map[0][i]=map[MH-1][i]=map[i][0]=map[i][MW-1]=2}
map[19][20]=5;
const walk=(x,y)=>x>=0&&y>=0&&x<MW&&y<MH&&map[y][x]!==2&&map[y][x]!==3;
let S={balls:5,pots:3,dex:{},party:[],x:20,y:20};
try{const d=JSON.parse(localStorage.getItem('pokemondr'));if(d&&d.party)S=d}catch(e){}
const P={x:S.x,y:S.y,fx:S.x,fy:S.y,mv:null};
const save=()=>{S.x=P.x;S.y=P.y;localStorage.setItem('pokemondr',JSON.stringify(S))};
let busy=false,held=null,last=0,B=null,tt=0;
const nm=m=>SP[m.sp].n;
const stats=m=>{const s=SP[m.sp];m.mhp=(s.hp*2*m.L/50|0)+m.L+10;m.atk=(s.atk*2*m.L/50|0)+5;m.def=(s.def*2*m.L/50|0)+5};
const mk=(sp,L)=>{const m={sp,L,xp:0};stats(m);m.hp=m.mhp;return m};
const getMoves=m=>{const t=SP[m.sp].t,x=MV[t];return[{n:'Placaje',p:40,t:'normal'},{n:x[0],p:x[1],t}]};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const say=(t,ms=900)=>{$('#msg').textContent=t;return wait(ms)};
const hud=()=>{$('#info').textContent=`⚪ ${S.balls}   🧪 ${S.pots}   📖 ${Object.keys(S.dex).length}/${SP.length}`};
const toast=t=>{const el=$('#toast');el.textContent=t;el.hidden=false;clearTimeout(tt);tt=setTimeout(()=>el.hidden=true,2000)};
function draw(){const cx=P.fx*T-(VW*T-T)/2,cy=P.fy*T-(VH*T-T)/2;ctx.fillStyle='#000';ctx.fillRect(0,0,cv.width,cv.height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='13px sans-serif';
const x0=Math.floor(cx/T),y0=Math.floor(cy/T);
for(let y=y0;y<=y0+VH;y++)for(let x=x0;x<=x0+VW;x++){if(x<0||y<0||x>=MW||y>=MH)continue;const t=map[y][x],px=Math.round(x*T-cx),py=Math.round(y*T-cy);ctx.fillStyle=COL[t];ctx.fillRect(px,py,T,T);
if(t===1){ctx.fillStyle='#2f7a22';ctx.fillRect(px+3,py+4,2,6);ctx.fillRect(px+9,py+6,2,7)}
else if(t===2)ctx.fillText('🌲',px+8,py+9);
else if(t===3){ctx.fillStyle='#8cc6f2';ctx.fillRect(px+3,py+6,6,1)}
else if(t===5)ctx.fillText('🏥',px+8,py+9)}
ctx.fillText('🧑',Math.round(P.fx*T-cx)+8,Math.round(P.fy*T-cy)+9)}
const D={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function arrive(){const t=map[P.y][P.x];if(t===5){S.party.forEach(m=>m.hp=m.mhp);S.balls=Math.max(S.balls,5);S.pots=Math.max(S.pots,3);toast('🏥 ¡Tu equipo se ha curado!');save();hud()}else if(t===1&&S.party.length&&Math.random()<.14)startBattle()}
function loop(ts){const dt=Math.min(50,ts-last);last=ts;
if(P.mv){P.mv.t+=dt/130;if(P.mv.t>=1){P.mv=null;P.fx=P.x;P.fy=P.y;arrive()}else{P.fx=P.mv.sx+(P.x-P.mv.sx)*P.mv.t;P.fy=P.mv.sy+(P.y-P.mv.sy)*P.mv.t}}
if(!P.mv&&held&&!busy){const[dx,dy]=D[held];if(walk(P.x+dx,P.y+dy)){P.mv={sx:P.x,sy:P.y,t:0};P.x+=dx;P.y+=dy}}
draw();requestAnimationFrame(loop)}
document.querySelectorAll('#dpad button').forEach(b=>{const on=e=>{e.preventDefault();held=b.dataset.d};const off=e=>{e.preventDefault();if(held===b.dataset.d)held=null};b.addEventListener('pointerdown',on);['pointerup','pointerleave','pointercancel'].forEach(n=>b.addEventListener(n,off))});
const KM={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
addEventListener('keydown',e=>{if(KM[e.key])held=KM[e.key]});
addEventListener('keyup',e=>{if(held===KM[e.key])held=null});
function fill(k,m){const s=SP[m.sp],r=m.hp/m.mhp,h=$('#'+k+'H');$('#'+k+'N').textContent=s.n;$('#'+k+'L').textContent=' Nv'+m.L;h.style.width=(100*r)+'%';h.className=r<.25?'lo':r<.5?'mid':'';$('#'+k+'S').textContent=s.e;if(k==='p')$('#pT').textContent=m.hp+'/'+m.mhp+' · '+s.t}
function upd(){fill('e',B.e);fill('p',S.party[0])}
function setMenu(items){const m=$('#menu');m.innerHTML='';items.forEach(([l,f,d])=>{const b=document.createElement('button');b.textContent=l;b.disabled=!!d;b.onclick=f;m.append(b)})}
function startBattle(){busy=true;held=null;const avg=S.party[0].L;B={e:mk(Math.floor(Math.random()*SP.length),Math.max(2,avg+Math.floor(Math.random()*5)-2))};$('#battle').hidden=false;$('#eS').classList.remove('gone');setMenu([]);upd();(async()=>{await say(`¡Un ${nm(B.e)} salvaje apareció!`,1000);mainMenu()})()}
function mainMenu(){const p=S.party[0];$('#msg').textContent='¿Qué hará '+nm(p)+'?';setMenu([['⚔️ Luchar',movesMenu],[`⚪ Bola (${S.balls})`,()=>act(throwBall),S.balls<1],[`🧪 Poción (${S.pots})`,()=>act(usePotion),S.pots<1||p.hp>=p.mhp],['🔁 Equipo',switchMenu],['🏃 Huir',()=>act(run)]])}
function movesMenu(){setMenu(getMoves(S.party[0]).map(m=>[`${m.n} (${m.t})`,()=>act(()=>playerAttack(m))]).concat([['↩ Volver',mainMenu]]))}
function partyItems(cb,forced){const it=S.party.map((m,i)=>[`${SP[m.sp].e} ${nm(m)} Nv${m.L} ${m.hp}/${m.mhp}`,()=>cb(i),m.hp<=0||i===0]);if(!forced)it.push(['↩ Volver',mainMenu]);return it}
const swap=i=>{const a=S.party;[a[0],a[i]]=[a[i],a[0]];upd()};
function switchMenu(){setMenu(partyItems(i=>act(async()=>{swap(i);await say(`¡Adelante, ${nm(S.party[0])}!`)}),false))}
function forcedSwitch(){return new Promise(res=>{$('#msg').textContent='Elige a tu siguiente criatura';setMenu(partyItems(i=>{swap(i);res()},true))})}
async function act(fn){setMenu([]);const end=await fn();if(end)return;await enemyTurn()}
async function useMove(a,d,mv,mine){await say(`${nm(a)}${mine?'':' salvaje'} usó ${mv.n}`,700);const m=TY[mv.t][SP[d.sp].t]??1;const dmg=Math.max(1,Math.floor((((2*a.L/5+2)*mv.p*a.atk/d.def)/50+2)*m*(.85+Math.random()*.15)));d.hp=Math.max(0,d.hp-dmg);const el=$(mine?'#eS':'#pS');el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),300);upd();if(m>1)await say('¡Es muy eficaz!',700);else if(m<1)await say('No es muy eficaz…',700);else await wait(300)}
async function playerAttack(mv){await useMove(S.party[0],B.e,mv,true);if(B.e.hp<=0){await win();return true}}
async function enemyTurn(){const e=B.e,p=S.party[0],mv=getMoves(e)[Math.floor(Math.random()*2)];await useMove(e,p,mv,false);if(p.hp<=0){await say(`¡${nm(p)} se debilitó!`);if(!S.party.some(m=>m.hp>0)){await lose();return}await forcedSwitch();await say(`¡Adelante, ${nm(S.party[0])}!`,700)}mainMenu()}
async function usePotion(){const p=S.party[0];S.pots--;p.hp=Math.min(p.mhp,p.hp+25);upd();hud();await say(`${nm(p)} recuperó salud.`)}
async function run(){if(Math.random()<.7){await say('¡Escapaste sin problemas!');endBattle();return true}await say('¡No puedes escapar!')}
async function throwBall(){S.balls--;hud();const e=B.e;await say('¡Lanzaste una bola!',700);$('#eS').classList.add('gone');await say('1… 2… 3…',900);if(Math.random()<.2+.65*(1-e.hp/e.mhp)){await say(`¡${nm(e)} fue capturado!`);S.party.push(e);S.dex[e.sp]=1;endBattle();return true}$('#eS').classList.remove('gone');await say('¡Se escapó de la bola!')}
async function win(){const e=B.e,p=S.party[0];await say(`¡${nm(e)} salvaje se debilitó!`);const g=e.L*9;p.xp=(p.xp||0)+g;await say(`${nm(p)} ganó ${g} PX`,700);while(p.xp>=p.L*15){p.xp-=p.L*15;const o=p.mhp;p.L++;stats(p);p.hp+=p.mhp-o;upd();await say(`¡${nm(p)} subió al nivel ${p.L}!`)}if(Math.random()<.35){S.balls++;await say('Encontraste una bola ⚪',700)}endBattle()}
async function lose(){await say('¡Te quedaste sin criaturas! Corres al centro…',1400);S.party.forEach(m=>m.hp=m.mhp);P.x=P.fx=20;P.y=P.fy=20;endBattle()}
function endBattle(){B=null;$('#battle').hidden=true;busy=false;save();hud()}
function team(){const p=$('#panel');p.hidden=false;p.innerHTML='';const h=document.createElement('h3');h.textContent='Tu equipo (toca para usar una poción 🧪 x'+S.pots+')';p.append(h);S.party.forEach(m=>{const b=document.createElement('button');b.textContent=`${SP[m.sp].e} ${nm(m)} Nv${m.L} — ${m.hp}/${m.mhp}`;b.onclick=()=>{if(S.pots>0&&m.hp<m.mhp&&m.hp>0){S.pots--;m.hp=Math.min(m.mhp,m.hp+25);save();hud();team()}};p.append(b)});const c=document.createElement('button');c.textContent='Cerrar';c.onclick=()=>{p.hidden=true;busy=false};p.append(c)}
$('#teamBtn').onclick=()=>{if(!busy&&S.party.length){busy=true;held=null;team()}};
function pickStarter(){busy=true;const p=$('#panel');p.hidden=false;p.innerHTML='<h3>¡Elige tu compañero!</h3>';[0,1,2].forEach(i=>{const b=document.createElement('button');b.textContent=`${SP[i].e} ${SP[i].n} (${SP[i].t})`;b.onclick=()=>{S.party.push(mk(i,5));S.dex[i]=1;save();hud();p.hidden=true;busy=false};p.append(b)})}
hud();if(!S.party.length)pickStarter();requestAnimationFrame(loop);
})();
