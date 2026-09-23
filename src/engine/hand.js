import Riichi from './riichi.js';
const E = Riichi;
const ORPHANS=[0,8,9,17,18,26,27,28,29,30,31,32,33];
const HONORS=['东','南','西','北','白','发','中'];
const name=t=>t>=27?HONORS[t-27]:(t%9+1)+['万','筒','索'][Math.floor(t/9)];
const terminal=t=>t<27&&(t%9===0||t%9===8),outside=t=>t>=27||terminal(t);
function initial(){return {groups:[],winTile:null,seat:null,round:null,method:null,riichi:'none',events:[],dora:0,aka:0,ura:0,honba:0,sticks:0};}
function groupTiles(g){return g.type==='seq'?[g.tile,g.tile+1,g.tile+2]:Array({trip:3,pair:2,quad:4,single:1}[g.type]||0).fill(g.tile);}
function inspect(h){const errors=[],missing=[],counts=Array(34).fill(0),loose=Array(34).fill(0),fixed=[];
 if(!h||!Array.isArray(h.groups))return {errors:['牌面数据无效，请重新录入。'],missing,counts,loose,fixed,total:0,target:14,closed:true};
 for(const g of h.groups){if(!['seq','trip','pair','quad','single'].includes(g.type)||!Number.isInteger(g.tile)||g.tile<0||g.tile>33||typeof g.open!=='boolean'){errors.push('存在无效牌组。');continue;}
 if(g.type==='seq'&&(g.tile>=27||g.tile%9>6)){errors.push('顺子必须是同花色连续三张，首张只能是 1～7。');continue;}
 if(g.open&&['pair','single'].includes(g.type)){errors.push('副露区只能放吃、碰或明杠。');continue;}
 const ts=groupTiles(g);ts.forEach(t=>counts[t]++);if(g.open||g.type==='quad')fixed.push({...g,tiles:ts,fixed:true});else ts.forEach(t=>loose[t]++);
 }
 counts.forEach((n,t)=>{if(n>4)errors.push(name(t)+' 超过四张（赤五与普通五合并计算）。');});
 const quads=fixed.filter(g=>g.type==='quad').length,total=counts.reduce((a,b)=>a+b,0),target=14+quads;
 if(fixed.length>4)errors.push('吃、碰、杠合计不能超过四组。');
 if(total<target)missing.push('还差 '+(target-total)+' 张牌');else if(total>target)errors.push('牌面多了 '+(total-target)+' 张，请删除或修改。');
 return {errors:[...new Set(errors)],missing,counts,loose,fixed,total,target,closed:!fixed.some(g=>g.open)};
}
function divisions(counts,fixed){const results=[],c=counts.slice(),need=4-fixed.length;if(need<0)return results;
 function walk(groups){let t=c.findIndex(n=>n>0);if(t<0){if(groups.length===need)results.push(groups.map(g=>({...g})));return;}if(groups.length>=need)return;
 if(c[t]>=3){c[t]-=3;groups.push({type:'trip',tile:t,open:false,fixed:false});walk(groups);groups.pop();c[t]+=3;}
 if(t<27&&t%9<=6&&c[t+1]&&c[t+2]){c[t]--;c[t+1]--;c[t+2]--;groups.push({type:'seq',tile:t,open:false,fixed:false});walk(groups);groups.pop();c[t]++;c[t+1]++;c[t+2]++;}}
 let all=[];for(let p=0;p<34;p++)if(c[p]>=2){c[p]-=2;results.length=0;walk([]);for(const gs of results)all.push([...fixed.map(g=>({...g})),...gs,{type:'pair',tile:p,open:false,fixed:false}]);c[p]+=2;}return all;
}
function waitType(g,w){if(g.type==='pair')return 'tanki';if(g.type==='trip')return 'shanpon';if(w===g.tile+1)return 'kanchan';if(g.tile%9===0&&w===g.tile+2||g.tile%9===6&&w===g.tile)return 'penchan';return 'ryanmen';}
const WAIT={ryanmen:'两面',shanpon:'双碰',kanchan:'嵌张',penchan:'边张',tanki:'单骑',kokushi:'国士听牌'};
function calculate(h,rules=E.RULES){rules={...E.RULES,...rules};const i=inspect(h),errors=i.errors.slice(),missing=i.missing.slice();
 if(!['ron','tsumo'].includes(h.method))missing.push('荣和 / 自摸');if(![27,28,29,30].includes(h.seat))missing.push('我的自风');if(![27,28,29,30].includes(h.round))missing.push('当前场风');
 if(h.winTile===null||h.winTile===undefined)missing.push('本次和牌张');else if(!Number.isInteger(h.winTile)||h.winTile<0||h.winTile>33||!i.loose[h.winTile])errors.push('和牌张必须来自普通手牌，不能选固定吃、碰或杠中的牌。');
 if(!['none','riichi','doubleRiichi'].includes(h.riichi))errors.push('立直状态无效。');
 const ev=new Set(h.events||[]);for(const event of ev)if(!['ippatsu','rinshan','chankan','haitei','houtei','tenhou','chiihou'].includes(event))errors.push('存在未知和牌事件。');
 const riichi=h.riichi!=='none';if(riichi&&!i.closed)errors.push('已经吃、碰或明杠，不能立直。');
 if(ev.has('ippatsu')&&!riichi)errors.push('一发需要立直或两立直。');
 if(h.ura>0&&!riichi)errors.push('里宝牌仅在立直或两立直时计番。');
 for(const key of ['dora','aka','ura','honba','sticks'])if(!Number.isInteger(h[key])||h[key]<0||h[key]>(['honba','sticks'].includes(key)?99:key==='aka'?4:72))errors.push('请填写有效的'+({dora:'宝牌',aka:'赤宝牌',ura:'里宝牌',honba:'本场',sticks:'立直棒'}[key])+'数量。');
 if(h.aka>i.counts[4]+i.counts[13]+i.counts[22])errors.push('赤宝牌数量不能超过牌面中五的张数。');
 if(h.method==='ron'&&['rinshan','haitei','tenhou','chiihou'].some(x=>ev.has(x)))errors.push('岭上、海底、天和、地和只适用于自摸。');
 if(h.method==='tsumo'&&['chankan','houtei'].some(x=>ev.has(x)))errors.push('抢杠与河底只适用于荣和。');
 if(ev.has('rinshan')&&!i.fixed.some(g=>g.type==='quad'))errors.push('岭上开花需要自己有杠。');
 if(ev.has('rinshan')&&ev.has('haitei')||ev.has('chankan')&&ev.has('houtei')||ev.has('rinshan')&&ev.has('ippatsu'))errors.push('已选和牌事件互相冲突，请检查一发、岭上、海底或河底。');
 if(ev.has('tenhou')||ev.has('chiihou')){
 if(!i.closed||i.fixed.length||riichi||ev.size>1)errors.push('天和 / 地和不能有吃碰杠、立直或其他和牌事件。');
 if(ev.has('tenhou')&&h.seat!==null&&h.seat!==27)errors.push('天和只适用于庄家。');if(ev.has('chiihou')&&h.seat===27)errors.push('地和只适用于闲家。');}
 const response={valid:false,...i,errors:[...new Set(errors)],missing:[...new Set(missing)],candidates:[],best:null};
 if(errors.length||i.total!==i.target)return response;
 const ds=divisions(i.loose,i.fixed),specialSeven=!i.fixed.length&&i.counts.filter(n=>n===2).length===7;
 const specialOrphans=!i.fixed.length&&ORPHANS.every(t=>i.counts[t]>=1)&&i.counts.every((n,t)=>!n||ORPHANS.includes(t));
 if(!ds.length&&!specialSeven&&!specialOrphans){response.errors.push('当前牌面不能组成和牌结构，请检查牌组。');return response;}
 if(missing.length)return response;
 const all=i.counts.flatMap((n,t)=>Array(n).fill(t)),hasHonor=all.some(t=>t>=27),suits=new Set(all.filter(t=>t<27).map(t=>Math.floor(t/9))),dealer=h.seat===27;
 const candidates=[];
 function evaluate(gs,winIndex,kind){const normal=[],yakumans=[];const add=(id,yakuman=false)=>{const y=E.YAKU.find(y=>y.id===id);if(!y)throw Error('Unknown yaku '+id);const arr=yakuman?yakumans:normal;if(!arr.some(x=>x.id===id))arr.push({...y,value:yakuman?(y.yakuman===2&&rules.doubleYakuman?2:1):(i.closed?y.closed:y.open)});};
 const winGroup=gs[winIndex],wait=kind==='seven'?'tanki':kind==='orphans'?'kokushi':waitType(winGroup,h.winTile);
 const sets=gs.filter(g=>g.type!=='pair'&&g.type!=='single'),seqs=sets.filter(g=>g.type==='seq'),trips=sets.filter(g=>g.type==='trip'||g.type==='quad');
 const concealed=trips.filter(g=>!g.open&&!(h.method==='ron'&&g===winGroup)),quads=sets.filter(g=>g.type==='quad');const pair=gs.find(g=>g.type==='pair');
 if(ev.has('tenhou'))add('tenhou',true);if(ev.has('chiihou'))add('chiihou',true);
 if(kind==='orphans'){const before=i.counts.slice();before[h.winTile]--;add(ORPHANS.every(t=>before[t]===1)?'kokushi13':'kokushi',true);}
 if(all.every(t=>t>=27))add('tsuuiisou',true);if(all.every(terminal))add('chinroutou',true);if(all.every(t=>[19,20,21,23,25,32].includes(t)))add('ryuuiisou',true);
 if(kind==='normal'){
 const dragonCount=trips.filter(g=>g.tile>=31).length,windCount=trips.filter(g=>g.tile>=27&&g.tile<=30).length;
 if(dragonCount===3)add('daisangen',true);if(windCount===4)add('daisuushii',true);else if(windCount===3&&pair.tile>=27&&pair.tile<=30)add('shousuushii',true);
 if(concealed.length===4)add(wait==='tanki'?'suuankouTanki':'suuankou',true);if(quads.length===4)add('suukantsu',true);
 if(i.closed&&!i.fixed.length&&suits.size===1&&!hasHonor){let offset=[...suits][0]*9,base=[3,1,1,1,1,1,1,1,3];if(base.every((n,x)=>i.counts[offset+x]>=n)){const before=i.counts.slice();before[h.winTile]--;add(base.every((n,x)=>before[offset+x]===n)?'junseiChuuren':'chuuren',true);}}
 }
 let f={value:null,raw:null,lines:[]};
 if(!yakumans.length){if(riichi)add(h.riichi);for(const event of ['ippatsu','rinshan','chankan','haitei','houtei'])if(ev.has(event))add(event);if(i.closed&&h.method==='tsumo')add('tsumo');
 if(all.every(t=>t<27&&!terminal(t))&&(i.closed||rules.kuitan))add('tanyao');if(suits.size===1)add(hasHonor?'honitsu':'chinitsu');if(all.every(outside))add('honroutou');
 if(kind==='seven'){add('chiitoi');f={value:25,raw:25,lines:[['七对子固定符数',25]]};}else if(kind==='normal'){
 for(const g of trips){if(g.tile>=31)add(['white','green','red'][g.tile-31]);if(g.tile===h.seat)add('seat');if(g.tile===h.round)add('round');}
 if(trips.length===4)add('toitoi');if(concealed.length>=3)add('sanankou');if(quads.length===3)add('sankantsu');
 if(trips.filter(g=>g.tile>=31).length===2&&pair.tile>=31)add('shousangen');
 if(i.closed){const freq={};seqs.forEach(g=>freq[g.tile]=(freq[g.tile]||0)+1);let pairs=Object.values(freq).reduce((a,n)=>a+Math.floor(n/2),0);if(pairs>=2)add('ryanpeikou');else if(pairs===1)add('iipeikou');}
 const starts=new Set(seqs.map(g=>g.tile)),tripTiles=new Set(trips.map(g=>g.tile));
 for(let n=0;n<7;n++)if([n,n+9,n+18].every(t=>starts.has(t))){add('sanshoku');break;}
 for(let n=0;n<9;n++)if([n,n+9,n+18].every(t=>tripTiles.has(t))){add('sanshokuDoukou');break;}
 for(let suit=0;suit<3;suit++)if([0,3,6].every(n=>starts.has(suit*9+n))){add('ittsuu');break;}
 if(seqs.length&&gs.every(g=>groupTiles(g).some(outside)))add(hasHonor?'chanta':'junchan');
 const derived={...E.initial(),closed:i.closed,win:h.method,kind:'normal',pair:pair.tile>=31?'dragon':pair.tile>=27?'wind':'number',seat:pair.tile===h.seat,round:pair.tile===h.round,wait,rules,melds:sets.map(g=>({type:g.type,edge:outside(g.tile),source:g.open?'open':h.method==='ron'&&g.type==='trip'&&g===winGroup?'ron':'closed'}))};
 f=E.fu(derived);if(f.pinfu)add('pinfu');
 }}
 const yakuman=yakumans.reduce((n,y)=>n+y.value,0),yaku=yakuman?yakumans:normal,yakuHan=normal.reduce((n,y)=>n+y.value,0),han=yakuman?0:yakuHan+h.dora+h.aka+h.ura;
 if(!yakuman&&!yakuHan)return;
 const payment=E.score({fu:f.value,han,yakuman,dealer,win:h.method,honba:h.honba,sticks:h.sticks,rules});
 candidates.push({kind,groups:gs.map(g=>({...g})),winIndex,wait,waitName:WAIT[wait],yaku,han,yakuHan,yakuman,fu:f,payment,closed:i.closed,dealer});
 }
 if(specialOrphans)evaluate(ORPHANS.map(t=>({type:i.counts[t]===2?'pair':'single',tile:t,open:false,fixed:false})),-1,'orphans');
 if(specialSeven){const gs=i.counts.flatMap((n,t)=>n===2?[{type:'pair',tile:t,open:false,fixed:false}]:[]);evaluate(gs,gs.findIndex(g=>g.tile===h.winTile),'seven');}
 for(const gs of ds)for(let w=0;w<gs.length;w++)if(!gs[w].fixed&&groupTiles(gs[w]).includes(h.winTile))evaluate(gs,w,'normal');
 candidates.sort((a,b)=>b.payment.baseTotal-a.payment.baseTotal||b.yakuman-a.yakuman||b.han-a.han||(b.fu.value||0)-(a.fu.value||0));
 const seen=new Set();response.candidates=candidates.filter(c=>{const key=JSON.stringify([c.kind,c.groups.map(g=>[g.type,g.tile,g.open,g.fixed]),c.wait,c.han,c.fu.value,c.yakuman]);if(seen.has(key))return false;seen.add(key);return true;});
 if(!response.candidates.length){response.errors.push('牌型成立，但当前没有役。宝牌不是役，请检查立直或其他和牌情况。');return response;}
 response.best=response.candidates[0];response.valid=true;return response;
}

const api = { initial, name, groupTiles, inspect, divisions, calculate, ORPHANS, WAIT };
export default api;
export { initial, name, groupTiles, inspect, divisions, calculate, ORPHANS, WAIT };
