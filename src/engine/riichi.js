const RULES={doubleWind:4,kiriage:false,kazoe:true,kuitan:true,doubleYakuman:true};
const FUS=[20,25,30,40,50,60,70,80,90,100,110];
const YAKU=[
['riichi','立直',1,0,'门前听牌后宣告立直。','宣告时支付 1,000 点；与两立直不重复。',''],
['ippatsu','一发',1,0,'立直后的一巡内和牌，期间没有吃、碰、杠打断。','必须同时有立直或两立直；暗杠也会打断一发。',''],
['tsumo','门前清自摸和',1,0,'门前状态下自己摸到和牌张。','暗杠不破坏门前；有副露自摸不算这个役。',''],
['pinfu','平和',1,0,'四组顺子、无符雀头、两面听牌，且门前清。','自摸固定 20 符；荣和 30 符。牌例中的雀头需非役牌。','123m 456m 234p 678s 55p'],
['tanyao','断幺九',1,1,'全手只有 2～8 数牌，没有 1、9 或字牌。','副露后能否成立，取决于“允许副露断幺九”设置。','234m 456m 345p 678s 55p'],
['iipeikou','一杯口',1,0,'同一花色的两组相同顺子。','只限门前；二杯口不再另计一杯口。','234m 234m'],
['white','役牌·白',1,1,'白牌组成刻子或杠子。','雀头只有符，没有役牌番。','白 白 白'],
['green','役牌·发',1,1,'发牌组成刻子或杠子。','小三元的两个三元牌刻子需分别计役牌番。','发 发 发'],
['red','役牌·中',1,1,'中牌组成刻子或杠子。','雀头不构成役牌。','中 中 中'],
['seat','役牌·自风',1,1,'自己的座位风组成刻子或杠子。','同为场风时，可同时勾选场风，共 2 番。','南 南 南'],
['round','役牌·场风',1,1,'当前场风组成刻子或杠子。','例如东场的东刻子；不要与自己的座位风混淆。','东 东 东'],
['rinshan','岭上开花',1,1,'开杠后，从岭上牌自摸和牌。','必须自摸，有杠子；不能与海底摸月同时成立。',''],
['chankan','抢杠',1,1,'荣和他人用于加杠的牌。','普通计分不支持特殊抢暗杠情况。',''],
['haitei','海底摸月',1,1,'自摸牌山最后一张普通摸牌而和牌。','岭上牌不算海底。',''],
['houtei','河底捞鱼',1,1,'荣和海底摸牌后打出的最后一张牌。','不能与抢杠同时成立。',''],
['doubleRiichi','两立直',2,0,'自己的第一巡内、没有鸣牌打断时宣告立直。','共 2 番，不再额外叠加普通立直。',''],
['chiitoi','七对子',2,0,'七组不同牌的对子。','四张相同牌不能算两对；固定 25 符。','11m 33m 55p 77p 22s 88s 白白'],
['toitoi','对对和',2,2,'四组刻子或杠子，加一对雀头。','可以副露；不要求刻子都是暗刻。','222m 555p 888s 白白白 东东'],
['sanankou','三暗刻',2,2,'至少三组暗刻或暗杠。','荣和补齐的刻子不算暗刻；整手可以有其他副露。','222m 555p 888s'],
['sankantsu','三杠子',2,2,'三组杠子。','明杠、暗杠、加杠均计入。','1111m 5555p 9999s'],
['sanshokuDoukou','三色同刻',2,2,'万、筒、索中同一数字各一组刻子或杠子。','与三色同顺不同，副露不减番。','555m 555p 555s'],
['shousangen','小三元',2,2,'两组三元牌刻子或杠子，另一种作雀头。','本役 2 番，另加两组三元牌的役牌番。','白白白 发发发 中中'],
['honroutou','混老头',2,2,'所有牌都是 1、9 和字牌。','通常与对对和或七对子叠加；没有顺子。','111m 999p 白白白 中中中 东东'],
['sanshoku','三色同顺',2,1,'万、筒、索各有一组数字相同的顺子。','门前 2 番，副露后 1 番。','234m 234p 234s'],
['ittsuu','一气通贯',2,1,'同花色的 123、456、789 三组顺子。','必须能拆成这三组顺子；仅凑齐 1～9 不够。','123m 456m 789m'],
['chanta','混全带幺九',2,1,'每组面子及雀头均含 1、9 或字牌，且有顺子及字牌。','副露减为 1 番；全是刻子的幺九结构按混老头判断。','123m 789p 白白白 999s 东东'],
['ryanpeikou','二杯口',3,0,'四组顺子组成两组一杯口。','按四顺子结构计算，不同时计七对子。','223344m 556677p 88s'],
['junchan','纯全带幺九',3,2,'每组面子及雀头均含 1 或 9，有顺子且没有字牌。','副露减为 2 番，不叠加混全带幺九。','123m 789m 111p 999s 11s'],
['honitsu','混一色',3,2,'仅一种花色的数牌与字牌。','必须含字牌；没有字牌时考虑清一色。','123m 456m 999m 白白白 东东'],
['chinitsu','清一色',6,5,'所有牌均为同一种花色的数牌。','副露 5 番；与混一色不重复。','123m 456m 789m 222m 55m'],
['kokushi','国士无双',0,0,'十三种幺九牌各一张，另有其中一种组成对子。','仅门前；十三面听牌可按设置计双倍。','19m 19p 19s 东南西北白发中 中',1],
['kokushi13','国士无双十三面',0,0,'和牌前已集齐十三种幺九牌，等其中任一种成对。','特殊双倍关闭时按单倍役满。','19m 19p 19s 东南西北白发中',2],
['suuankou','四暗刻',0,0,'四组暗刻或暗杠。','双碰听牌必须自摸；单骑可荣和。','111m 444p 777s 白白白 东东',1],
['suuankouTanki','四暗刻单骑',0,0,'四组暗刻已经完成，单骑和出雀头。','特殊双倍关闭时按单倍役满。','111m 444p 777s 白白白 东',2],
['daisangen','大三元',0,0,'白、发、中分别组成刻子或杠子。','允许副露；本工具不处理包牌分摊。','白白白 发发发 中中中',1],
['shousuushii','小四喜',0,0,'三组风牌刻子或杠子，第四种风牌作雀头。','允许副露。','东东东 南南南 西西西 北北',1],
['daisuushii','大四喜',0,0,'四种风牌均组成刻子或杠子。','默认双倍役满；特殊双倍关闭时按单倍。','东东东 南南南 西西西 北北北',2],
['tsuuiisou','字一色',0,0,'全手只有东、南、西、北、白、发、中。','允许副露；也可能为七对子结构。','东东东 南南南 白白白 发发发 中中',1],
['chinroutou','清老头',0,0,'全手只有数牌的 1 和 9。','不能包含字牌，允许副露。','111m 999m 111p 999s 11s',1],
['ryuuiisou','绿一色',0,0,'只由二、三、四、六、八索及发组成。','不要求一定含发，允许副露。','234s 666s 888s 发发发 22s',1],
['chuuren','九莲宝灯',0,0,'门前清同花色 1112345678999，加同花色任一张。','允许普通九莲；九面听牌另选纯正九莲。','1112345678999m 5m',1],
['junseiChuuren','纯正九莲宝灯',0,0,'和牌前恰为同花色 1112345678999，九面听牌。','特殊双倍关闭时按单倍。','1112345678999m',2],
['suukantsu','四杠子',0,0,'自己完成四组杠子并和牌。','允许副露；本工具不处理包牌。','1111m 9999m 2222p 8888s 白白',1],
['tenhou','天和',0,0,'庄家在没有任何鸣牌时，用配牌直接和牌。','只限庄家自摸。','',1],
['chiihou','地和',0,0,'闲家在没有鸣牌打断时，第一次摸牌便自摸和牌。','只限闲家自摸。','',1]
].map(([id,name,closed,open,desc,tip,example,yakuman=0])=>({id,name,closed,open,desc,tip,example,yakuman,menzen:!yakuman&&!open||['kokushi','kokushi13','suuankou','suuankouTanki','chuuren','junseiChuuren','tenhou','chiihou'].includes(id)}));
function initial(){return {tab:'calc',dealer:null,win:null,closed:null,kind:'normal',fuMode:'guided',directFu:null,pair:null,seat:false,round:false,wait:null,melds:Array.from({length:4},()=>({type:null,edge:null,source:null})),han:null,hanMode:'manual',yaku:[],dora:0,aka:0,ura:0,yakuman:1,honba:0,sticks:0,rules:{...RULES},tableDealer:false,tableWin:'ron',filter:'all',query:'',onlyAvailable:false};}
function meldFu(m){if(m.type==='seq')return 0;if(!m.type||m.edge===null||!m.source)return null;return (m.type==='quad'?8:2)*(m.source==='closed'?2:1)*(m.edge?2:1);}
function fu(s){let missing=[],errors=[],lines=[];if(s.fuMode==='direct')return {value:s.directFu,raw:s.directFu,lines:[['直接选择符数',s.directFu]],missing:s.directFu?[]:['符数'],errors,pinfu:false};
 if(s.closed===null)missing.push('门前状态');if(!s.win)missing.push('和牌方式');
 if(s.kind==='seven'){if(s.closed===false)errors.push('七对子要求门前清，请修改门前状态。');return {value:25,raw:25,lines:[['七对子固定符数，不加符、不进位',25]],missing,errors,pinfu:false};}
 if(!s.pair)missing.push('雀头');if(!s.wait)missing.push('听牌方式');
 s.melds.forEach((m,i)=>{if(!m.type||!m.source||(m.type!=='seq'&&m.edge===null))missing.push('面子 '+(i+1));});
 const opens=s.melds.filter(m=>m.source==='open').length; const rons=s.melds.filter(m=>m.source==='ron').length;
 if(s.closed===true&&opens)errors.push('门前清不能有吃、碰、明杠。请检查面子形成方式。');
 if(s.closed===false&&!opens&&!missing.some(x=>x.startsWith('面子')))errors.push('已选有副露，请至少指定一组吃、碰或明杠。');
 if(rons>1)errors.push('本次荣和只能补齐一组刻子。');if(rons&&s.win==='tsumo')errors.push('自摸不能选择“本次荣和补齐”。');
 if(rons&&s.wait&&s.wait!=='shanpon')errors.push('荣和补齐刻子对应双碰听牌，请核对听牌方式。');
 if(s.win==='ron'&&s.wait==='shanpon'&&rons!==1)errors.push('双碰荣和：请指定一组“本次荣和补齐”的刻子。');
 if(s.wait==='shanpon'&&s.melds.every(m=>m.type)&&!s.melds.some(m=>m.type==='trip'))errors.push('双碰和牌需有一组刻子。');
 if(['ryanmen','kanchan','penchan'].includes(s.wait)&&s.melds.every(m=>m.type)&&!s.melds.some(m=>m.type==='seq'))errors.push('当前听牌方式需要至少一组顺子。');
 let p=s.pair==='dragon'?2:s.pair==='wind'?(s.seat&&s.round?s.rules.doubleWind:s.seat||s.round?2:0):0;
 let pinfu=s.closed===true&&s.melds.every(m=>m.type==='seq')&&p===0&&s.wait==='ryanmen';
 if(missing.length)return {value:null,raw:null,missing,errors,lines,pinfu};
 if(pinfu&&s.win==='tsumo')return {value:20,raw:20,missing,errors,pinfu,lines:[['平和自摸固定 20 符，不另加自摸符',20]]};
 lines.push(['底符',20]);if(s.closed&&s.win==='ron')lines.push(['门前荣和',10]);if(s.win==='tsumo')lines.push(['自摸',2]);lines.push(['雀头',p]);lines.push(['听牌方式',['kanchan','penchan','tanki'].includes(s.wait)?2:0]);s.melds.forEach((m,i)=>lines.push(['面子 '+(i+1)+(m.source==='ron'?'（荣和补齐，按明刻）':''),meldFu(m)]));
 let raw=lines.reduce((n,l)=>n+l[1],0),value=Math.ceil(raw/10)*10;if(value===20){value=30;lines.push(['副露无加符荣和，按 30 符处理',10]);}return {value,raw,lines,missing,errors,pinfu};}
function combination(f,h,w,closed=null){if(f===20&&(w==='ron'||h<2||closed===false))return '20 符仅用于门前平和自摸，至少 2 番。';if(f===25&&(h<(w==='tsumo'?3:2)||closed===false))return '七对子固定 25 符；门前荣和至少 2 番，自摸至少 3 番。';if(f===110&&h===1&&w==='tsumo')return '1 番 110 符自摸不是可成立的常规组合。';return null;}
function yakuCount(s){const selected=YAKU.filter(y=>s.yaku.includes(y.id));const ys=selected.filter(y=>y.yakuman);const errors=[];const has=id=>s.yaku.includes(id);const add=t=>errors.push(t);
 for(const y of (ys.length?ys:selected)){if(s.closed===false&&(y.menzen||y.id==='tanyao'&&!s.rules.kuitan))add(y.name+' 在当前副露规则下不成立。');}
 if(ys.length){const conflict=[['kokushi','kokushi13'],['suuankou','suuankouTanki'],['chuuren','junseiChuuren'],['shousuushii','daisuushii'],['tenhou','chiihou']];for(const [a,b] of conflict)if(has(a)&&has(b))add('基础役满与对应特殊役满不能重复选择。');
 if(has('tenhou')&&(s.dealer===false||s.win==='ron'))add('天和只适用于庄家自摸。');if(has('chiihou')&&(s.dealer===true||s.win==='ron'))add('地和只适用于闲家自摸。');if(has('suuankou')&&s.win==='ron')add('四暗刻荣和须为单骑，请选择“四暗刻单骑”。');
 if(ys.some(y=>['kokushi','kokushi13'].includes(y.id))&&ys.some(y=>!['kokushi','kokushi13','tenhou','chiihou'].includes(y.id)))add('国士无双不能与已选的其他牌型役满同时成立。');
 if(ys.some(y=>['chuuren','junseiChuuren'].includes(y.id))&&ys.some(y=>!['chuuren','junseiChuuren','tenhou','chiihou'].includes(y.id)))add('九莲宝灯不能与已选的其他牌型役满同时成立。');
 if(has('chinroutou')&&ys.some(y=>['tsuuiisou','ryuuiisou','daisangen','shousuushii','daisuushii'].includes(y.id)))add('清老头与所选字牌或绿一色役满冲突。');
 if(has('ryuuiisou')&&ys.some(y=>['tsuuiisou','daisangen','shousuushii','daisuushii'].includes(y.id)))add('绿一色与所选字牌结构冲突。');
 return {han:0,yakuman:ys.reduce((n,y)=>n+(y.yakuman===2&&s.rules.doubleYakuman?2:1),0),errors,selected:ys};}
 if(!selected.length)add('至少选择一个役；宝牌本身不是役。');
 for(const [a,b] of [['riichi','doubleRiichi'],['iipeikou','ryanpeikou'],['honitsu','chinitsu'],['chanta','junchan']])if(has(a)&&has(b))add('上位役与下位役不能重复计番。');
 if((has('ippatsu')||s.ura>0)&&!has('riichi')&&!has('doubleRiichi'))add('一发与里宝牌需要立直或两立直。');
 if(s.win==='ron'&&['tsumo','rinshan','haitei'].some(has))add('门前自摸、岭上、海底只适用于自摸。');if(s.win==='tsumo'&&['houtei','chankan'].some(has))add('河底、抢杠只适用于荣和。');
 if(has('rinshan')&&has('haitei'))add('岭上开花与海底摸月不能同时成立。');if(has('chankan')&&has('houtei'))add('抢杠与河底捞鱼不能同时成立。');if(has('rinshan')&&has('ippatsu'))add('开杠会打断一发，不能与岭上开花叠加。');
 if(has('chiitoi')&&['pinfu','toitoi','iipeikou','ryanpeikou','sanankou','sankantsu','sanshoku','sanshokuDoukou','ittsuu','chanta','junchan','shousangen','white','green','red','seat','round','rinshan'].some(has))add('七对子与已选的面子型役种冲突。');
 if(has('tanyao')&&['honroutou','chanta','junchan','shousangen','white','green','red','seat','round'].some(has))add('断幺九不含幺九或字牌，与已选役种冲突。');
 if(has('chinitsu')&&['honitsu','shousangen','white','green','red','seat','round','chanta'].some(has))add('清一色不能包含字牌。');
 if(has('pinfu')&&['toitoi','sanankou','sankantsu','sanshokuDoukou','shousangen','honroutou','white','green','red','seat','round','rinshan'].some(has))add('平和与刻子、杠子或役牌类役种冲突。');
 if(s.fuMode==='guided'){
 const f=fu(s),full=!f.missing.length;
 if(s.kind==='seven'&&!has('chiitoi'))add('当前为七对子，请勾选“七对子”计入 2 番。');
 if(s.kind==='seven'&&s.win==='tsumo'&&!has('tsumo'))add('七对子自摸还需勾选“门前清自摸和”。');
 if(s.kind==='normal'&&has('chiitoi'))add('已选七对子役，请把手牌结构改为七对子。');
 if(full&&has('pinfu')&&!f.pinfu)add('已填牌型不符合平和：需门前、四顺子、无符雀头、两面。');
 if(full&&f.pinfu&&!has('pinfu'))add('当前符合平和结构，请将“平和”计入番数。');
 if(s.closed===true&&s.win==='tsumo'&&!has('tsumo'))add('门前自摸时请勾选“门前清自摸和”。');
 if(s.kind==='normal'){
 if(full&&has('toitoi')&&s.melds.some(m=>m.type==='seq'))add('对对和不能包含顺子。');
 if(full&&has('sanankou')&&s.melds.filter(m=>m.type!=='seq'&&m.source==='closed').length<3)add('已填面子不足三组暗刻／暗杠。');
 if(full&&has('sankantsu')&&s.melds.filter(m=>m.type==='quad').length<3)add('已填面子不足三组杠子。');
 if(full&&has('rinshan')&&!s.melds.some(m=>m.type==='quad'))add('岭上开花需有杠子。');
 if(has('tanyao')&&(s.pair==='dragon'||s.pair==='wind'||s.melds.some(m=>m.type!=='seq'&&m.edge===true)))add('断幺九不能包含已填的字牌雀头或幺九刻杠。');
 }}
 return {han:selected.reduce((n,y)=>n+(s.closed===false?y.open:y.closed),0)+s.dora+s.aka+s.ura,yakuman:0,errors:[...new Set(errors)],selected};}
function score({fu:fv,han,dealer,win,yakuman=0,honba=0,sticks=0,rules=RULES}){let b=0,tier='';if(yakuman){b=8000*yakuman;tier=yakuman===1?'役满':yakuman+' 倍役满';}else if(han>=13){b=rules.kazoe?8000:6000;tier=rules.kazoe?'累计役满':'三倍满';}else if(han>=11){b=6000;tier='三倍满';}else if(han>=8){b=4000;tier='倍满';}else if(han>=6){b=3000;tier='跳满';}else {b=Math.min(2000,fv*2**(han+2));if(han===5||(rules.kiriage&&((han===4&&fv===30)||(han===3&&fv===60))))b=2000;if(b===2000)tier='满贯';}
 const up=n=>Math.ceil(n/100)*100;let payments=win==='ron'?[{who:'放铳者',count:1,base:up(b*(dealer?6:4)),extra:honba*300}]:dealer?[{who:'其余三家',count:3,base:up(b*2),extra:honba*100}]:[{who:'庄家',count:1,base:up(b*2),extra:honba*100},{who:'其余两位闲家',count:2,base:up(b),extra:honba*100}];payments=payments.map(p=>({...p,amount:p.base+p.extra}));const baseTotal=payments.reduce((n,p)=>n+p.base*p.count,0),extraTotal=honba*300;return {tier,b,payments,baseTotal,extraTotal,deposit:sticks*1000,total:baseTotal+extraTotal+sticks*1000};}
function evaluate(s){let errors=[],missing=[];if(s.dealer===null)missing.push('庄闲身份');if(!s.win)missing.push('和牌方式');let yc=s.hanMode==='yaku'?yakuCount(s):null;const yakuman=yc?yc.yakuman:s.kind==='yakuman'?s.yakuman:0;let f=yakuman?{value:null,lines:[],missing:[],errors:[]}:fu(s);missing.push(...f.missing);errors.push(...f.errors);let h=yc?yc.han:s.han;if(yc){errors.push(...yc.errors);if(s.closed===null)missing.push('门前状态');}if(!yakuman&&!h)missing.push('总番数');
 if(!yakuman&&f.value&&h&&s.win){let c=combination(f.value,h,s.win,s.closed);if(c)errors.push(c);if(s.fuMode==='guided'&&s.kind==='seven'&&h<(s.win==='tsumo'?3:2))errors.push('七对子荣和至少 2 番，自摸至少 3 番。');if(f.pinfu&&s.win==='tsumo'&&h<2)errors.push('平和自摸至少 2 番。');}
 const valid=!errors.length&&!missing.length;return {valid,errors:[...new Set(errors)],missing:[...new Set(missing)],fu:f,han:h,yakuman,yaku:yc,result:valid?score({fu:f.value,han:h,dealer:s.dealer,win:s.win,yakuman,honba:s.honba,sticks:s.sticks,rules:s.rules}):null};}

const api = { RULES, FUS, YAKU, initial, meldFu, fu, combination, yakuCount, score, evaluate };
export default api;
export { RULES, FUS, YAKU, initial, meldFu, fu, combination, yakuCount, score, evaluate };
