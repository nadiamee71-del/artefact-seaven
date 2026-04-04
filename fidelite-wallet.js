let userMode = 'cliente';

const THEMES = [
  {id:'th-dark', label:'Noir',  acc:'#7BC67E', css:'background:linear-gradient(145deg,#1c1c1e,#2c2c2e)'},
  {id:'th-teal', label:'Océan', acc:'#2BA8C8', css:'background:linear-gradient(145deg,#083748,#165a72)'},
  {id:'th-rose', label:'Rose',  acc:'#E05280', css:'background:linear-gradient(145deg,#3a0d20,#65183a)'},
  {id:'th-gold', label:'Or',    acc:'#D4C45A', css:'background:linear-gradient(145deg,#2c1b00,#573800)'},
  {id:'th-sage', label:'Forêt', acc:'#8BC98E', css:'background:linear-gradient(145deg,#0d2216,#1a432a)'},
  {id:'th-mauve',label:'Mauve', acc:'#9B7EC8', css:'background:linear-gradient(145deg,#1c0e2c,#371858)'},
];

const POOL = [
  {id:1,prenom:'Soraya', nom:'L.',color:'#9c27b0',rdv:14,tel:'+33 7 59 84 02 67'},
  {id:2,prenom:'Naomie', nom:'W.',color:'#0097a7',rdv:6, tel:'+33 6 12 00 11 22'},
  {id:3,prenom:'Marine', nom:'D.',color:'#e53935',rdv:11,tel:'+33 6 55 44 33 22'},
  {id:4,prenom:'Karina', nom:'B.',color:'#5c6bc0',rdv:3, tel:''},
  {id:5,prenom:'Ylan',   nom:'A.',color:'#f57c00',rdv:5, tel:'+33 6 91 08 67 10'},
  {id:6,prenom:'Amira',  nom:'D.',color:'#00897b',rdv:8, tel:'+33 6 33 44 55 66'},
  {id:7,prenom:'Inès',   nom:'B.',color:'#8e24aa',rdv:3, tel:'+33 6 77 88 99 00'},
];

let cartes = [
  {id:1,nom:'Bloom Nails · Sassa',theme:'th-dark', init:'B',total:10,pct:'−10%',num:'8872',stC:8,
   clientes:[
     {id:1,prenom:'Soraya',nom:'L.',color:'#9c27b0',stamps:8, rdv:14,tel:'+33 7 59 84',inscrite:true},
     {id:2,prenom:'Naomie',nom:'W.',color:'#0097a7',stamps:4, rdv:6, tel:'+33 6 12 00',inscrite:true},
     {id:3,prenom:'Marine',nom:'D.',color:'#e53935',stamps:10,rdv:11,tel:'+33 6 55 44',inscrite:true},
     {id:4,prenom:'Karina',nom:'B.',color:'#5c6bc0',stamps:2, rdv:3, tel:'',           inscrite:false},
   ]},
  {id:2,nom:'Nina Cils',theme:'th-teal',init:'N',total:5,pct:'−5%',num:'3341',stC:3,
   clientes:[
     {id:1,prenom:'Soraya',nom:'L.',color:'#9c27b0',stamps:3,rdv:5,tel:'+33 7 59 84',inscrite:true},
     {id:5,prenom:'Ylan',  nom:'A.',color:'#f57c00',stamps:1,rdv:2,tel:'+33 6 91 08',inscrite:true},
   ]},
  {id:3,nom:'Leila Bien-être',theme:'th-gold',init:'L',total:6,pct:'−15%',num:'6610',stC:6,
   clientes:[
     {id:6,prenom:'Amira',nom:'D.',color:'#00897b',stamps:6,rdv:8,tel:'+33 6 33 44',inscrite:true},
     {id:7,prenom:'Inès', nom:'B.',color:'#8e24aa',stamps:2,rdv:3,tel:'+33 6 77 88',inscrite:true},
   ]},
];

const FID_STORE_KEY='seaven-fid-cardbg';
const FID_CARD_PALETTE=[
  'linear-gradient(145deg,#2BA8C8,#156b85)',
  'linear-gradient(145deg,#7BC67E,#3d8f45)',
  'linear-gradient(145deg,#D4C45A,#8a7020)',
  'linear-gradient(145deg,#E07B5A,#a84a32)',
  'linear-gradient(145deg,#9B7EC8,#5c3d8c)',
  'linear-gradient(145deg,#E05280,#9a3060)',
  'linear-gradient(145deg,#1C1C1E,#3a3a3c)',
];

function fidLoadCardBgs(){
  try{
    const s=localStorage.getItem(FID_STORE_KEY);
    if(!s)return;
    const o=JSON.parse(s);
    cartes.forEach(c=>{ const v=o[String(c.id)]; if(typeof v==='string'&&v) c.cardBg=v; });
  }catch(e){}
}
function fidSaveCardBgs(){
  try{
    const o={};
    cartes.forEach(c=>{ if(c.cardBg) o[String(c.id)]=c.cardBg; });
    localStorage.setItem(FID_STORE_KEY,JSON.stringify(o));
  }catch(e){}
}
function buildProPaletteHtml(c){
  const btns=FID_CARD_PALETTE.map(bg=>{
    const esc=(bg+'').replace(/"/g,'&quot;');
    const on=c.cardBg===bg?' on':'';
    return `<button type="button" class="fpal-sw${on}" data-bg="${esc}" onclick="event.stopPropagation();fidPickCardColor(${c.id},this)" style="background:${bg}" aria-label="Couleur"></button>`;
  }).join('');
  return `<div class="cfg-row col" style="padding-top:2px">
    <span class="cfg-lbl">Couleur de la carte</span>
    <div class="fid-pal-row">${btns}</div>
    <button type="button" class="fid-theme-def" onclick="event.stopPropagation();fidClearCardColor(${c.id})">Reprendre le thème par défaut</button>
  </div>`;
}
function fidPickCardColor(cid,btn){
  const bg=btn&&btn.getAttribute('data-bg');
  if(bg) fidSetCardColor(cid,bg);
}
function fidSetCardColor(cid,bg){
  if(userMode!=='pro'||bg==null||bg==='')return;
  const c=cartes.find(x=>x.id===cid);if(!c)return;
  c.cardBg=bg;
  fidSaveCardBgs();
  const el=document.getElementById('wc'+cid);
  if(el) el.style.background=bg;
  document.querySelectorAll('#wc'+cid+' .fpal-sw').forEach(sw=>{
    sw.classList.toggle('on', sw.getAttribute('data-bg')===bg);
  });
}
function fidClearCardColor(cid){
  if(userMode!=='pro')return;
  const c=cartes.find(x=>x.id===cid);if(!c)return;
  delete c.cardBg;
  fidSaveCardBgs();
  const el=document.getElementById('wc'+cid);
  if(el) el.style.background='';
  document.querySelectorAll('#wc'+cid+' .fpal-sw').forEach(sw=>sw.classList.remove('on'));
}

function setMode(m){
  userMode=m;
  const fts=document.getElementById('ftSub');
  if(fts) fts.textContent=m==='pro'?'Gérer mes cartes fidélité':'Mes cartes tampons';
  renderDots();
  if(m!=='pro'){
    try{closeCreate();}catch(e){}
    const fc=document.getElementById('fidCreate');
    if(fc) fc.classList.remove('open');
    const st=document.getElementById('mStamp');
    if(st) st.classList.remove('show');
    const fi=document.getElementById('fidFiche');
    if(fi) fi.classList.remove('open');
    if(expanded!==null&&expanded!==undefined){ try{closeCard(expanded,false);}catch(e){} }
  }
  const fs=document.getElementById('fidScreen');
  if(fs&&fs.classList.contains('open')) buildWallet();
}
function renderDots(){
  const el=document.getElementById('ftDots');if(!el)return;
  if(userMode==='pro'){el.innerHTML='';return;}
  const c=cartes[0];if(!c)return;
  let h='';for(let i=0;i<c.total;i++)h+=`<div class="fdt${i<c.stC?'':' e'}"></div>`;
  el.innerHTML=h;
}

function fidOpen(){
  document.getElementById('fidHsub').textContent='Touche une carte pour la déployer';
  document.getElementById('fidScreen').classList.add('open');
  buildWallet();
}
function fidClose(){
  if(expanded!==null&&expanded!==undefined){
    try{closeCard(expanded,true);}catch(e){}
  }
}

const PEEK=80, CH=110, MARGIN=12;
let expanded=null;

function buildWallet(){
  const vp=document.getElementById('walletVP');
  vp.innerHTML='';

  cartes.forEach((c,i)=>{
    const th=THEMES.find(t=>t.id===c.theme), acc=th.acc;
    const rgb=hexRgb(acc);
    const ava=`rgba(${rgb},.18)`, avb=`rgba(${rgb},.35)`;

    const filled   = userMode==='cliente' ? c.stC : Math.max(...c.clientes.map(cl=>cl.stamps),0);
    const complete = userMode==='cliente' ? filled>=c.total : false;

    let dots='';
    const dotsTotal = userMode==='cliente' ? c.total : Math.min(c.total,8);
    const dotsFilled= userMode==='cliente' ? filled  : c.clientes.filter(cl=>cl.stamps>=c.total).length;
    for(let d=0;d<dotsTotal;d++) dots+=`<div class="wdot${d<dotsFilled?'':' e'}"></div>`;

    const statTxt = userMode==='cliente'
      ? (complete?'🎉 Carte complète !':filled+' / '+c.total+' · Plus que '+(c.total-filled)+' !')
      : (c.clientes.length+' clientes · '+c.clientes.filter(cl=>cl.stamps>=c.total).length+' complète(s)');

    const backContent = userMode==='cliente'
      ? buildBackCliente(c, th, acc, ava, avb)
      : buildBackPro(c, th, acc, ava, avb);

    const el=document.createElement('div');
    el.className=`wcard ${c.theme}`;
    el.id='wc'+c.id;
    el.style.bottom=(MARGIN+(cartes.length-1-i)*PEEK)+'px';
    el.style.height=CH+'px';
    el.style.zIndex=(i+1)*10;

    el.innerHTML=`
      <div class="wf-front">
        <div class="w-ava" style="background:${ava};border:1.5px solid ${avb}">${c.init}</div>
        <div class="w-info">
          <div class="w-name">${c.nom}</div>
          <div class="w-dots">${dots}</div>
          <div class="w-stat" style="color:${complete?acc:'rgba(255,255,255,.5)'}">${statTxt}</div>
        </div>
        <div class="w-badge" style="background:${ava}">
          <div class="bp" style="color:${acc}">${c.pct}</div>
          <div class="bl">${complete?'à utiliser !':'récompense'}</div>
        </div>
      </div>
      <div class="wf-back">${backContent}</div>`;

    el.addEventListener('click',()=>{ if(expanded!==c.id) openCard(c.id); });
    if(c.cardBg) el.style.background=c.cardBg;
    else el.style.background='';
    vp.appendChild(el);
  });

  if(userMode==='pro'){
    const btn=document.createElement('button');
    btn.style.cssText=`position:absolute;left:12px;right:12px;bottom:${MARGIN+(cartes.length)*PEEK-30}px;padding:13px;border-radius:14px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.07);color:rgba(255,255,255,.8);font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;z-index:1;transition:opacity .2s;`;
    btn.textContent='➕  Créer une nouvelle carte fidélité';
    btn.onclick=()=>openCreate();
    vp.appendChild(btn);
  }
}

function buildBackCliente(c, th, acc, ava, avb){
  const filled=c.stC, complete=filled>=c.total;
  let sg='';
  for(let s=0;s<c.total;s++){
    if(s<filled)sg+='<div class="st ok"></div>';
    else if(s===filled&&!complete)sg+='<div class="st nxt"></div>';
    else sg+='<div class="st"></div>';
  }
  const pct=Math.round(filled/c.total*100);
  const rwd=complete
    ?`<div class="rstrip" style="background:${acc}22;border:1px solid ${acc}44">
        <span style="font-size:22px">🎉</span>
        <div style="flex:1">
          <div style="color:${acc};font-weight:700;font-size:14px">${c.pct} sur ton prochain RDV</div>
          <div style="color:rgba(255,255,255,.4);font-size:12px">Chez ${c.nom}</div>
        </div>
        <button class="use-btn" style="background:${acc};color:${c.theme==='th-gold'?'#1C1C1E':'#fff'}"
          onclick="event.stopPropagation();utiliserCliente(${c.id})">Utiliser</button>
      </div>`
    :`<div class="rstrip" style="background:rgba(255,255,255,.07)">
        <span style="font-size:18px">🎁</span>
        <div>
          <div style="color:${acc};font-weight:600;font-size:13px">Récompense : ${c.pct}</div>
          <div style="color:rgba(255,255,255,.35);font-size:11px">Après ${c.total} tampons</div>
        </div>
      </div>`;
  return `<div class="card-content">
    <div class="card-head">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="w-ava" style="background:${ava};border:1.5px solid ${avb}">${c.init}</div>
        <div>
          <div style="color:#fff;font-weight:600;font-size:15px">${c.nom}</div>
          <div style="color:rgba(255,255,255,.4);font-size:12px">Nice · Beauté & bien-être</div>
        </div>
      </div>
      <div class="w-close" onclick="event.stopPropagation();closeCard(${c.id})">✕</div>
    </div>
    <div class="w-cnum">•••• •••• ${c.num}</div>
    <div class="sgrid">${sg}</div>
    <div class="prow">
      <span class="ptxt">${filled} / ${c.total}</span>
      <div class="pbar"><div class="pfill" style="width:${pct}%"></div></div>
      <span class="ptxt" style="${complete?'color:'+acc+';font-weight:600':''}">${complete?'Complète !':`−${c.total-filled}`}</span>
    </div>
    ${rwd}
  </div>`;
}

function buildBackPro(c, th, acc, ava, avb){
  const pcts=['−5%','−10%','−15%','−20%','🎁 Offert'];
  const pills=pcts.map(p=>`<button class="pp${p===c.pct?' on':''}" onclick="event.stopPropagation();proSetPct(${c.id},'${p}',this)">${p}</button>`).join('');
  let sg=''; for(let i=0;i<c.total;i++) sg+='<div class="st" style="width:36px;height:36px;border-color:rgba(255,255,255,.15)"></div>';
  let lignes='';
  c.clientes.forEach(cl=>{
    const comp=cl.stamps>=c.total, pp=Math.round(cl.stamps/c.total*100);
    lignes+=`<div class="cli-row" onclick="event.stopPropagation();openFiche(${c.id},${cl.id})">
      <div class="cav" style="background:${cl.color}">${cl.prenom[0]}</div>
      <div class="cnm">${cl.prenom} ${cl.nom}${!cl.inscrite?' <span style="font-size:10px;color:var(--yellow)">· non inscrite</span>':''}</div>
      <div class="cts" style="${comp?'color:var(--green)':''}">${comp?'✓':cl.stamps+'/'+c.total}</div>
      <div class="cpb"><div class="cpf" style="width:${pp}%"></div></div>
    </div>`;
  });
  return `<div class="card-content">
    <div class="card-head">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="w-ava" style="background:${ava};border:1.5px solid ${avb}">${c.init}</div>
        <div>
          <div style="color:#fff;font-weight:700;font-size:15px">${c.nom}</div>
          <div style="color:rgba(255,255,255,.4);font-size:12px">${c.clientes.length} clientes · ${c.clientes.filter(cl=>cl.stamps>=c.total).length} complète(s)</div>
        </div>
      </div>
      <div class="w-close" onclick="event.stopPropagation();closeCard(${c.id})">✕</div>
    </div>
    <div class="card-sep"></div>
    <div class="pro-section">
      <div class="cfg-row">
        <span class="cfg-lbl">Tampons</span>
        <div style="display:flex;align-items:center;gap:8px">
          <button class="smb" onclick="event.stopPropagation();proTampons(${c.id},-1)">−</button>
          <span class="smv" id="sc${c.id}">${c.total}</span>
          <button class="smb" onclick="event.stopPropagation();proTampons(${c.id},1)">+</button>
        </div>
      </div>
      <div class="cfg-row col">
        <span class="cfg-lbl">Récompense</span>
        <div class="pro-pills" id="pp${c.id}">${pills}</div>
      </div>
      ${buildProPaletteHtml(c)}
      <div class="sgrid" id="sg${c.id}" style="padding:0">${sg}</div>
      <div class="cli-box">
        <div class="cli-sec-lbl">👥 Clientes</div>
        ${lignes}
        <button class="add-cli-btn" onclick="event.stopPropagation();openStampModal(${c.id})">➕ Valider un tampon / ajouter une cliente</button>
      </div>
    </div>
  </div>`;
}

function openCard(id){
  if(expanded!==null) closeCard(expanded,false);
  expanded=id;
  document.getElementById('fidHsub').textContent='Touche ✕ pour revenir';
  const vp=document.getElementById('walletVP'), vpH=vp.offsetHeight;
  const selI=cartes.findIndex(c=>c.id===id);

  cartes.forEach((c,i)=>{
    const el=document.getElementById('wc'+c.id);if(!el)return;
    if(c.id===id){
      el.classList.add('open');
      el.style.bottom='0px';
      el.style.height=vpH+'px';
      el.style.zIndex='100';
      el.style.left='0';el.style.right='0';
      el.style.transform='scale(1) translateY(0)';
      el.style.opacity='1';
      el.style.borderRadius='20px 20px 0 0';
    } else if(i<selI){
      el.style.bottom=(MARGIN+(cartes.length-1-i)*PEEK-70)+'px';
      el.style.transform='scale(0.92) translateY(20px)';
      el.style.opacity='0';
      el.style.pointerEvents='none';
    } else {
      el.style.bottom=(-CH-60)+'px';
      el.style.transform='scale(0.88) translateY(40px)';
      el.style.opacity='0';
      el.style.pointerEvents='none';
    }
  });
}

function closeCard(id,animate=true){
  const el=document.getElementById('wc'+id);if(!el)return;
  el.classList.remove('open');
  el.style.height=CH+'px';
  el.style.left='12px';el.style.right='12px';
  el.style.borderRadius='20px';
  expanded=null;
  document.getElementById('fidHsub').textContent='Touche une carte pour la déployer';
  if(animate){
    cartes.forEach((c,i)=>{
      const ce=document.getElementById('wc'+c.id);if(!ce)return;
      setTimeout(()=>{
        ce.style.bottom=(MARGIN+(cartes.length-1-i)*PEEK)+'px';
        ce.style.height=CH+'px';
        ce.style.transform='scale(1) translateY(0)';
        ce.style.opacity='1';
        ce.style.zIndex=(i+1)*10;
        ce.style.pointerEvents='auto';
      },(cartes.length-1-i)*30);
    });
  }
}

function utiliserCliente(cid){
  const c=cartes.find(x=>x.id===cid);if(!c)return;
  c.stC=0; showToast('🎉 Récompense utilisée · Carte remise à zéro !');
  closeCard(cid); setTimeout(()=>buildWallet(),500);
}

function proTampons(cid,d){
  if(userMode!=='pro') return;
  const c=cartes.find(x=>x.id===cid);
  c.total=Math.max(3,Math.min(20,c.total+d));
  const sc=document.getElementById('sc'+cid);if(sc)sc.textContent=c.total;
  const sg=document.getElementById('sg'+cid);
  if(sg){let h='';for(let i=0;i<c.total;i++)h+='<div class="st" style="width:36px;height:36px;border-color:rgba(255,255,255,.15)"></div>';sg.innerHTML=h;}
  showToast('✅ '+c.total+' tampons'); renderDots();
}
function proSetPct(cid,pct,btn){
  if(userMode!=='pro') return;
  const c=cartes.find(x=>x.id===cid);c.pct=pct;
  document.querySelectorAll('#pp'+cid+' .pp').forEach(p=>p.classList.remove('on'));
  btn.classList.add('on'); showToast('✅ Récompense : '+pct);
}

let fIds={cid:null,clid:null};
function openFiche(cid,clid){
  if(userMode!=='pro') return;
  fIds={cid,clid};
  const c=cartes.find(x=>x.id===cid), cl=c.clientes.find(x=>x.id===clid);
  document.getElementById('ficheNom').textContent=cl.prenom+' '+cl.nom;
  document.getElementById('ficheSub').textContent=cl.inscrite?(cl.tel||'Cliente SEAVEN'):'⚠ Non inscrite';
  const th=THEMES.find(t=>t.id===c.theme),acc=th.acc;
  const filled=cl.stamps,total=c.total,complete=filled>=total;
  let sg='';
  for(let s=0;s<total;s++){
    if(s<filled)sg+='<div class="st ok"></div>';
    else if(s===filled&&!complete)sg+='<div class="st nxt"></div>';
    else sg+='<div class="st"></div>';
  }
  const ficheCardBloc=c.cardBg?('background:'+c.cardBg+';box-shadow:0 -8px 40px rgba(0,0,0,.35)'):th.css;
  document.getElementById('ficheBody').innerHTML=`
    <div style="background:#fff;border-radius:14px;padding:16px;box-shadow:var(--sh);margin-bottom:12px">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">
        <div style="width:52px;height:52px;border-radius:50%;background:${cl.color};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;color:#fff">${cl.prenom[0]}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:17px;color:var(--dark)">${cl.prenom} ${cl.nom}</div>
          <div style="font-size:13px;color:var(--mid)">${cl.inscrite?'✓ Cliente SEAVEN':'⚠ Non inscrite'}</div>
          ${cl.tel?`<div style="font-size:13px;color:var(--teal);margin-top:2px">📞 ${cl.tel}</div>`:''}
        </div>
        ${!cl.inscrite?`<button style="padding:8px 14px;border-radius:10px;background:var(--teal);color:#fff;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit" onclick="inviter(${cid},${clid})">Inviter →</button>`:''}
      </div>
      <div class="fstats">
        <div class="fstat"><div class="sv">${cl.rdv}</div><div class="sl">RDV total</div></div>
        <div class="fstat"><div class="sv">${filled}</div><div class="sl">Tampons</div></div>
        <div class="fstat" style="${complete?'background:rgba(123,198,126,.12)':''}">
          <div class="sv" style="${complete?'color:#34a85a':''}">${complete?'✓':'−'+(total-filled)}</div>
          <div class="sl">${complete?'Complète !':'Restants'}</div>
        </div>
      </div>
    </div>
    <div style="border-radius:18px;padding:18px;${ficheCardBloc};margin-bottom:14px">
      <div style="font-size:12px;color:rgba(255,255,255,.3);margin-bottom:12px">Carte · ${c.nom}</div>
      <div class="sgrid">${sg}</div>
      <div class="prow" style="margin-top:12px">
        <span class="ptxt">${filled} / ${total}</span>
        <div class="pbar"><div class="pfill" style="width:${Math.round(filled/total*100)}%"></div></div>
        <span class="ptxt" style="${complete?'color:'+acc+';font-weight:600':''}">${complete?'Complète !':c.pct+' bientôt'}</span>
      </div>
    </div>
    <button class="act act-p" onclick="addStamp(${cid},${clid})">✅ Ajouter un tampon · RDV effectué</button>
    ${filled>0?`<button class="act act-g" onclick="removeStamp(${cid},${clid})">↩ Retirer un tampon</button>`:''}
    ${complete?`<button class="act" style="background:var(--yellow);color:var(--dark);font-weight:700;padding:14px;border-radius:14px;border:none;cursor:pointer;width:100%;margin-bottom:8px;font-family:inherit" onclick="utiliserFiche(${cid},${clid})">🎉 Utiliser la récompense</button>`:''}`;
  document.getElementById('fidFiche').classList.add('open');
}
function closeFiche(){document.getElementById('fidFiche').classList.remove('open');}
function addStamp(cid,clid){
  const c=cartes.find(x=>x.id===cid),cl=c.clientes.find(x=>x.id===clid);
  if(cl.stamps>=c.total){showToast('🎉 Carte déjà complète !');return;}
  cl.stamps++;cl.rdv++;
  showToast(`🪶 Tampon ${cl.stamps}/${c.total} · ${cl.prenom}`);
  renderDots(); openFiche(cid,clid);
}
function removeStamp(cid,clid){
  const c=cartes.find(x=>x.id===cid),cl=c.clientes.find(x=>x.id===clid);
  if(cl.stamps<=0)return;cl.stamps--;renderDots();openFiche(cid,clid);
}
function utiliserFiche(cid,clid){
  const c=cartes.find(x=>x.id===cid),cl=c.clientes.find(x=>x.id===clid);
  cl.stamps=0;showToast('🎉 Récompense utilisée !');renderDots();openFiche(cid,clid);
}
function inviter(cid,clid){
  const cl=cartes.find(x=>x.id===cid).clientes.find(x=>x.id===clid);
  showToast(`📲 Invitation envoyée à ${cl.prenom} !`);
}

function onRdvEncaisse(clienteId){
  cartes.forEach(carte=>{
    const cl=carte.clientes.find(x=>x.id===clienteId);
    if(cl&&cl.stamps<carte.total){cl.stamps++;cl.rdv++;if(clienteId===1)carte.stC=cl.stamps;}
  });
  renderDots(); showToast('🪶 Tampon ajouté automatiquement !');
}

let mCid=null,mSelId=null,mAddOpen=false;
function openStampModal(cid){
  if(userMode!=='pro') return;
  mCid=cid;mSelId=null;mAddOpen=false;
  document.getElementById('mSearch').value='';
  document.getElementById('mAddForm').style.display='none';
  document.getElementById('mAddLbl').textContent='Cliente non inscrite ? Ajouter';
  document.getElementById('mSub').textContent='Carte · '+cartes.find(x=>x.id===cid).nom;
  mFilter(''); document.getElementById('mStamp').classList.add('show');
}
function closeOverlay(id){document.getElementById(id).classList.remove('show');}
function mFilter(q){
  const c=cartes.find(x=>x.id===mCid),list=document.getElementById('mList');list.innerHTML='';
  c.clientes.filter(cl=>(cl.prenom+' '+cl.nom).toLowerCase().includes(q.toLowerCase())).forEach(cl=>{
    const comp=cl.stamps>=c.total,d=document.createElement('div');
    d.className='copt'+(mSelId===cl.id?' sel':'');
    d.onclick=()=>{mSelId=cl.id;mFilter(document.getElementById('mSearch').value);};
    d.innerHTML=`<div class="coav" style="background:${cl.color}">${cl.prenom[0]}</div>
      <div style="flex:1"><div style="font-size:14px;font-weight:600;color:var(--dark)">${cl.prenom} ${cl.nom}</div>
      <div style="font-size:12px;color:var(--mid)">${cl.tel||'Pas de contact'}</div></div>
      <div style="font-size:12px;font-weight:600;color:${comp?'var(--green)':'var(--teal)'}">${comp?'✓ Complète':cl.stamps+'/'+c.total}</div>`;
    list.appendChild(d);
  });
}
function mToggle(){
  mAddOpen=!mAddOpen;
  document.getElementById('mAddForm').style.display=mAddOpen?'flex':'none';
  document.getElementById('mAddLbl').textContent=mAddOpen?'Masquer':'Cliente non inscrite ? Ajouter';
  if(mAddOpen)mSelId=null;
}
function mConfirm(){
  const c=cartes.find(x=>x.id===mCid);
  if(mAddOpen){
    const p=document.getElementById('mPre').value.trim();if(!p){document.getElementById('mPre').focus();return;}
    const cols=['#e91e63','#9c27b0','#3f51b5','#00796b','#f57c00'];
    c.clientes.push({id:Date.now(),prenom:p,nom:document.getElementById('mNom').value.trim(),
      tel:document.getElementById('mTel').value.trim(),color:cols[c.clientes.length%cols.length],stamps:1,rdv:1,inscrite:false});
    closeOverlay('mStamp');showToast(`✅ ${p} ajoutée · 1er tampon validé !`);
    ['mPre','mNom','mTel'].forEach(id=>document.getElementById(id).value='');
  } else if(mSelId){
    const cl=c.clientes.find(x=>x.id===mSelId);
    if(cl.stamps>=c.total){showToast('🎉 Carte déjà complète !');closeOverlay('mStamp');return;}
    cl.stamps++;cl.rdv++;closeOverlay('mStamp');showToast(`🪶 Tampon ${cl.stamps}/${c.total} · ${cl.prenom} !`);
  }
  closeCard(expanded,false); expanded=null; buildWallet(); renderDots();
}

let crStep=1,crD={nom:'',desc:'',tampons:8,pct:'−10%',theme:'th-dark',clientes:[]};
const CR_LABELS=['Nom de la carte','Tampons & récompense','Thème de la carte','Vos clientes','Récapitulatif'];
function openCreate(){
  if(userMode!=='pro') return;
  crReset();document.getElementById('fidCreate').classList.add('open');crShow(1);
}
function closeCreate(){document.getElementById('fidCreate').classList.remove('open');}
function crReset(){
  crStep=1;crD={nom:'',desc:'',tampons:8,pct:'−10%',theme:'th-dark',clientes:[]};
  document.getElementById('crOk').classList.remove('show');
  ['crNav','crFoot'].forEach(id=>document.getElementById(id).style.display='');
  document.getElementById('crWrap').style.display='flex';
}
function crGoBack(){if(crStep>1)crShow(crStep-1);else closeCreate();}
function crGoNext(){if(crStep<5)crShow(crStep+1);else crPublish();}
function crShow(n){
  if(userMode!=='pro') return;
  crStep=n;
  document.getElementById('crH1').textContent=CR_LABELS[n-1];
  document.getElementById('crCnt').textContent=n+' / 5';
  document.getElementById('crFill').style.width=(n/5*100)+'%';
  document.getElementById('crBackBtn').textContent=n===1?'‹ Mes cartes':'‹ Retour';
  const btn=document.getElementById('crNextBtn');
  btn.className=n===5?'cr-next dark':'cr-next';
  btn.textContent=n===5?'✅ Créer cette carte':'Continuer →';
  btn.disabled=n===1;
  const wrap=document.getElementById('crWrap');wrap.innerHTML='';
  const body=document.createElement('div');body.className='cr-body';
  if(n===1)body.innerHTML=`
    <div class="cr-field"><label>Nom de la carte *</label>
      <input class="cr-in" id="crNom" placeholder="Ex : Pass Beauté · Bloom Nails" maxlength="40" value="${crD.nom}"
        oninput="crD.nom=this.value.trim();document.getElementById('crNextBtn').disabled=crD.nom.length<2">
    </div>
    <div class="cr-field"><label>Description (optionnel)</label>
      <textarea class="cr-in cr-ta" placeholder="Ex : 1 tampon par visite, valable sur toutes les prestations.">${crD.desc}</textarea>
    </div>
    <div class="cr-note"><span>💡</span><span>Ce nom apparaît sur la carte dans le wallet SEAVEN de vos clientes.</span></div>`;
  else if(n===2)body.innerHTML=`
    <div class="cr-sec">Nombre de tampons</div>
    <div class="cr-stepper">
      <div class="cr-stl"><div class="n">Tampons pour compléter</div><div class="s">Entre 3 et 20 passages</div></div>
      <div class="cr-ctrl">
        <button class="cr-sb" onclick="crChgT(-1)">−</button>
        <span class="cr-sv" id="crTV">${crD.tampons}</span>
        <button class="cr-sb" onclick="crChgT(1)">+</button>
      </div>
    </div>
    <div class="cr-sec" style="margin-top:24px">Récompense</div>
    <div class="cr-pills">${['−5%','−10%','−15%','−20%','−25%','🎁 Soin offert','🎁 Produit offert'].map(p=>`<div class="cr-pill${p===crD.pct?' on':''}" onclick="crSelP(this,'${p}')">${p}</div>`).join('')}</div>
    <div class="cr-sec" style="margin-top:24px">Aperçu en direct</div>
    <div id="crPv"></div>`;
  else if(n===3)body.innerHTML=`
    <div style="font-size:14px;color:var(--mid);margin-bottom:16px;line-height:1.5">Choisissez le thème visuel. Modifiable dans <b>Réglages</b>.</div>
    <div class="cr-themes" id="crTG"></div>
    <div class="cr-sec" style="margin-top:20px">Aperçu</div><div id="crPv"></div>`;
  else if(n===4)body.innerHTML=`
    <div style="font-size:14px;color:var(--mid);margin-bottom:12px;line-height:1.5">Sélectionnez les clientes. Vous pouvez aussi le faire plus tard depuis leur fiche.</div>
    <div class="cr-note" style="margin-bottom:14px"><span>🔄</span><span>Les tampons se cochent <b>automatiquement</b> à chaque RDV encaissé.</span></div>
    <div id="crCL"></div>
    <div style="font-size:13px;color:var(--mid);text-align:center;margin-top:12px;cursor:pointer" onclick="crShow(5)">Passer · Lier plus tard →</div>`;
  else body.innerHTML=`
    <div class="cr-sec" style="margin-top:0">Aperçu final</div><div id="crPv"></div>
    <div class="cr-recap" id="crRcp"></div>
    <div class="cr-note" style="margin-top:14px"><span>✅</span><span>Carte visible immédiatement par les clientes sélectionnées dans leur wallet.</span></div>`;
  wrap.appendChild(body);
  if(n===2||n===3||n===5)crPrev('crPv');
  if(n===3)crThemes();
  if(n===4)crCliList();
  if(n===5){crRecap();btn.disabled=false;}
}
function crChgT(d){crD.tampons=Math.max(3,Math.min(20,crD.tampons+d));const e=document.getElementById('crTV');if(e)e.textContent=crD.tampons;crPrev('crPv');}
function crSelP(btn,val){crD.pct=val;document.querySelectorAll('.cr-pill').forEach(p=>p.classList.remove('on'));btn.classList.add('on');crPrev('crPv');}
function crThemes(){
  const g=document.getElementById('crTG');if(!g)return;g.innerHTML='';
  THEMES.forEach(t=>{
    const d=document.createElement('div');d.className='cr-th'+(t.id===crD.theme?' on':'');d.style.cssText=t.css;
    d.innerHTML=`<div class="cr-th-chk">✓</div><div class="cr-th-name">${t.label}</div>
      <div class="cr-th-dots"><div class="cr-td f"></div><div class="cr-td f"></div><div class="cr-td f"></div><div class="cr-td"></div><div class="cr-td"></div></div>
      <div style="font-size:11px;font-weight:700;color:${t.acc};margin-top:2px">${crD.pct}</div>`;
    d.onclick=()=>{crD.theme=t.id;document.querySelectorAll('.cr-th').forEach(e=>e.classList.toggle('on',e===d));crPrev('crPv');};
    g.appendChild(d);
  });
}
function crCliList(){
  const list=document.getElementById('crCL');if(!list)return;list.innerHTML='';
  POOL.forEach(c=>{
    const sel=crD.clientes.includes(c.id),d=document.createElement('div');
    d.className='cr-cli'+(sel?' on':'');
    d.onclick=()=>{const i=crD.clientes.indexOf(c.id);if(i>-1)crD.clientes.splice(i,1);else crD.clientes.push(c.id);crCliList();};
    d.innerHTML=`<div class="cr-cav" style="background:${c.color}">${c.prenom[0]}</div>
      <div style="flex:1"><div class="cr-cn">${c.prenom} ${c.nom}</div><div class="cr-cd">${c.rdv} RDV · ${c.tel||'Pas de tél.'}</div></div>
      <div class="cr-chk">${sel?'✓':''}</div>`;
    list.appendChild(d);
  });
}
function crPrev(elId){
  const el=document.getElementById(elId);if(!el)return;
  const th=THEMES.find(t=>t.id===crD.theme),acc=th.acc;
  const nom=crD.nom||'Nom de votre carte',total=crD.tampons,ex=Math.min(3,total);
  let stamps='';for(let i=0;i<total;i++)stamps+=`<div class="cpst${i<ex?' f':''}"></div>`;
  el.className='cr-prev';el.style.cssText=th.css;
  el.innerHTML=`
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div><div class="cpn">${nom}</div><div class="cpsb">Carte fidélité SEAVEN</div></div>
      <div style="background:${acc}22;border-radius:10px;padding:5px 10px;text-align:center">
        <div style="color:${acc};font-weight:700;font-size:14px">${crD.pct}</div>
        <div style="font-size:9px;color:rgba(255,255,255,.4)">récompense</div>
      </div>
    </div>
    <div class="cpnum">•••• •••• ${Math.floor(1000+Math.random()*9000)}</div>
    <div style="display:flex;flex-wrap:wrap;gap:7px;justify-content:center">${stamps}</div>
    <div style="display:flex;align-items:center;gap:8px">
      <span style="font-size:10px;color:rgba(255,255,255,.35)">${ex} / ${total}</span>
      <div style="flex:1;height:3px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden">
        <div style="height:100%;width:${Math.round(ex/total*100)}%;background:linear-gradient(90deg,var(--green),var(--teal));border-radius:99px"></div>
      </div>
      <span style="font-size:10px;color:rgba(255,255,255,.35)">Encore ${total-ex} !</span>
    </div>`;
}
function crRecap(){
  const sel=POOL.filter(c=>crD.clientes.includes(c.id)),th=THEMES.find(t=>t.id===crD.theme);
  const el=document.getElementById('crRcp');if(!el)return;
  el.innerHTML=`
    <div class="cr-rrow"><span class="cr-rl">Nom</span><span class="cr-rv">${crD.nom}</span></div>
    <div class="cr-rrow"><span class="cr-rl">Tampons</span><span class="cr-rv">${crD.tampons} passages</span></div>
    <div class="cr-rrow"><span class="cr-rl">Récompense</span><span class="cr-rv">${crD.pct}</span></div>
    <div class="cr-rrow"><span class="cr-rl">Thème</span><span class="cr-rv">${th.label}</span></div>
    <div class="cr-rrow"><span class="cr-rl">Clientes liées</span><span class="cr-rv">${sel.length?sel.map(c=>c.prenom+' '+c.nom).join(', '):'Aucune · à lier plus tard'}</span></div>
    <div class="cr-rrow"><span class="cr-rl">Validation</span><span class="cr-rv">Automatique à chaque RDV encaissé ✓</span></div>`;
}
function crPublish(){
  if(userMode!=='pro') return;
  const th=THEMES.find(t=>t.id===crD.theme);
  const inits=crD.nom.split(' ').filter(w=>w).map(w=>w[0]).join('').toUpperCase().slice(0,2);
  const sel=POOL.filter(c=>crD.clientes.includes(c.id));
  cartes.push({id:Date.now(),nom:crD.nom,theme:crD.theme,init:inits,
    total:crD.tampons,pct:crD.pct,num:String(Math.floor(1000+Math.random()*9000)),
    stC:0,clientes:sel.map(c=>({...c,stamps:0}))});
  ['crNav','crFoot'].forEach(id=>document.getElementById(id).style.display='none');
  document.getElementById('crWrap').style.display='none';
  document.getElementById('crOkP').textContent=sel.length
    ?`Carte visible par ${sel.length} cliente${sel.length>1?'s':''}. Tampons automatiques activés.`
    :'Carte créée. Liez des clientes depuis leur fiche.';
  crPrev('crOkPrev');
  document.getElementById('crOk').classList.add('show');
  showToast('🎉 Carte créée !'); renderDots();
}
function crDone(){
  closeCreate();
  expanded=null; buildWallet();
}

function hexRgb(hex){const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);return r?`${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}`:'43,168,200';}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2800);}

fidLoadCardBgs();
renderDots();
document.addEventListener('DOMContentLoaded',function(){
  const fs=document.getElementById('fidScreen');
  if(fs) fs.classList.add('open');
  buildWallet();
});
window.fidwOnRdvEncaisse=onRdvEncaisse;
window.fidwSetMode=setMode;
