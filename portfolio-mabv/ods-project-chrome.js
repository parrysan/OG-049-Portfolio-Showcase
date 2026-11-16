/* ods-project-chrome.js: behaviour for the ODS Project header v1.1.3 + footer v1.1.0 (scroll hairline, phone tab centring,
   'Project portals' dropdown, standard anchor-tab script). Copied verbatim from Scout's reference report
   ~/OG/reports/research-tool-fallbacks/index.html (18 Oct 2026). Replace with the OS-000 component once PR #47 merges.
   Load at the end of <body>, after report.js, then /_shared/ods-project-header-collapse.js (hide-on-scroll). */
const h=document.querySelector('.ods-project-header');
const f=()=>h.classList.toggle('is-stuck',scrollY>40);addEventListener('scroll',f,{passive:true});f();
/* phones: bring the selected tab into view, centred in the tab row */
const nav=h.querySelector('.ods-project-header__tabs'),cur=nav.querySelector('[aria-current]');if(cur&&nav.scrollWidth>nav.clientWidth)nav.scrollLeft=cur.offsetLeft-(nav.clientWidth-cur.offsetWidth)/2;
/* ods-project-footer v1.1.0: "Project portals" dropdown. Select-only combobox (ARIA APG pattern) fed by the shared
   registry ~/OG/reports/_shared/project-portals.json. Picking a portal goes straight to it. Keyboard: Enter/Space/
   Arrow opens; arrows move; Home/End; type-ahead; Enter/Space picks; Esc closes; Tab closes. If the registry fails
   to load, the plain link list in the HTML stays. */
(()=>{
 const root=document.querySelector('.ods-project-footer__portals');if(!root)return;
 const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 fetch(root.dataset.registry||'/_shared/project-portals.json',{cache:'no-cache'})
  .then(r=>{if(!r.ok)throw new Error(r.status);return r.json()})
  .then(d=>{const list=(Array.isArray(d)?d:d.portals||[]).filter(p=>p&&p.name&&p.url);if(list.length)build(list)})
  .catch(()=>{});
 /* data-variant="og" (or "os") on the footer: this project's own portals first (same code or a sub-code), then portals
    of the same "type" in the registry, then the rest. Without a variant the registry order is kept. */
 function order(list){
  const v=root.closest('[data-variant]')?.dataset.variant,proj=root.dataset.project||'';if(!v)return list;
  const rank=p=>p.code&&(p.code===proj||p.code.startsWith(proj+'-'))?0:p.type===v?1:2;
  return list.map((p,i)=>[rank(p),i,p]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(x=>x[2]);
 }
 function build(list){
  list=order(list);
  const here=location.href.split('#')[0];let cur=-1,best=0;
  list.forEach((p,i)=>{if(here.startsWith(p.url)&&p.url.length>best){best=p.url.length;cur=i}});
  if(cur<0&&root.dataset.project)cur=list.findIndex(p=>p.code===root.dataset.project);
  const id='ods-portals';
  root.innerHTML=`<span class="ods-project-footer__portals-label" id="${id}-label">Project portals</span>
<div class="og-select__control"><div class="og-select__trigger" id="${id}-combo" role="combobox" tabindex="0" aria-haspopup="listbox" aria-expanded="false" aria-controls="${id}-list" aria-labelledby="${id}-label ${id}-combo">${esc(cur>=0?list[cur].name:'Choose a portal')}</div>
<span class="og-select__chevron" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 15.4 6 9.4 7.4 8l4.6 4.6L16.6 8 18 9.4z"/></svg></span>
<ul class="og-select__list" id="${id}-list" role="listbox" aria-labelledby="${id}-label" tabindex="-1" hidden>${list.map((p,i)=>`<li class="og-select__option" id="${id}-opt-${i}" role="option" aria-selected="${i===cur}"><span>${esc(p.name)}</span><span class="ods-portals__meta">${esc(p.code||'')}${p.status==='preview'?(p.code?' · ':'')+'preview':''}</span></li>`).join('')}</ul></div>`;
  root.classList.add('og-select','is-enhanced');
  const box=root.querySelector('[role=combobox]'),ul=root.querySelector('[role=listbox]'),opts=[...ul.children];
  let active=Math.max(cur,0),buf='',bufT;
  const isOpen=()=>!ul.hidden;
  const paint=()=>{opts.forEach((o,i)=>o.classList.toggle('is-active',i===active));box.setAttribute('aria-activedescendant',opts[active].id);opts[active].scrollIntoView({block:'nearest'})};
  const open=()=>{if(isOpen())return;const r=box.getBoundingClientRect();root.classList.toggle('is-up',innerHeight-r.bottom<Math.min(360,innerHeight*.6)&&r.top>innerHeight-r.bottom);ul.hidden=false;box.setAttribute('aria-expanded','true');root.classList.add('is-open');paint()};
  const close=()=>{buf='';clearTimeout(bufT);ul.hidden=true;box.setAttribute('aria-expanded','false');box.removeAttribute('aria-activedescendant');root.classList.remove('is-open')};
  const pick=i=>{close();if(i===cur)return;opts.forEach((o,j)=>o.setAttribute('aria-selected',String(j===i)));box.textContent=list[i].name;location.href=list[i].url};
  const type=ch=>{clearTimeout(bufT);bufT=setTimeout(()=>buf='',500);const same=buf.length&&[...buf].every(c=>c===ch);buf+=ch;const q=same?ch:buf,start=same||buf.length===1?active+1:active;
   for(let k=0;k<opts.length;k++){const i=(start+k)%opts.length;if(list[i].name.toLowerCase().startsWith(q)){active=i;break}}};
  box.addEventListener('keydown',e=>{const k=e.key;
   if(!isOpen()){
    if(['ArrowDown','ArrowUp','Enter',' '].includes(k)){e.preventDefault();active=Math.max(cur,0);open()}
    else if(k==='Home'||k==='End'){e.preventDefault();active=k==='Home'?0:opts.length-1;open()}
    else if(k.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();open();type(k.toLowerCase());paint()}
    return}
   if(k==='ArrowDown'){e.preventDefault();if(e.altKey)return;active=Math.min(opts.length-1,active+1);paint()}
   else if(k==='ArrowUp'){e.preventDefault();if(e.altKey){pick(active);return}active=Math.max(0,active-1);paint()}
   else if(k==='Home'||k==='End'){e.preventDefault();active=k==='Home'?0:opts.length-1;paint()}
   else if(k==='PageDown'||k==='PageUp'){e.preventDefault();active=Math.max(0,Math.min(opts.length-1,active+(k==='PageDown'?10:-10)));paint()}
   else if(k==='Enter'||(k===' '&&!buf)){e.preventDefault();pick(active)}
   else if(k==='Escape'){e.preventDefault();close()}
   else if(k==='Tab'){close()}
   else if(k.length===1&&!e.ctrlKey&&!e.metaKey){e.preventDefault();type(k.toLowerCase());paint()}});
  box.addEventListener('click',()=>{isOpen()?close():(active=Math.max(cur,0),open())});
  ul.addEventListener('mousedown',e=>e.preventDefault());
  ul.addEventListener('click',e=>{const o=e.target.closest('[role=option]');if(o)pick(opts.indexOf(o))});
  ul.addEventListener('mousemove',e=>{const o=e.target.closest('[role=option]');if(o&&opts.indexOf(o)!==active){active=opts.indexOf(o);paint()}});
  box.addEventListener('blur',()=>setTimeout(()=>{if(!root.contains(document.activeElement))close()},0));
  document.addEventListener('click',e=>{if(!root.contains(e.target))close()});
 }
})();
/* ODS standard tab script (from Tung), rootMargin top = header height + a little */
const tabs=[...document.querySelectorAll('.ods-project-header__tabs a[href^="#"]')];
const setTab=id=>tabs.forEach(t=>t.hash.slice(1)===id?t.setAttribute('aria-current','page'):t.removeAttribute('aria-current'));
let lock=false,lockT;
document.querySelector('.ods-project-header__tabs').addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;setTab(a.hash.slice(1));lock=true;const rel=()=>{clearTimeout(lockT);lockT=setTimeout(()=>{lock=false;removeEventListener('scroll',rel);},150);};addEventListener('scroll',rel,{passive:true});rel();});
addEventListener('hashchange',()=>setTab(location.hash.slice(1)));
const io=new IntersectionObserver(es=>{if(lock)return;es.forEach(e=>{if(e.isIntersecting)setTab(e.target.id);});},{rootMargin:'-'+(document.querySelector('.ods-project-header').offsetHeight+20)+'px 0px -60% 0px'});
tabs.forEach(t=>{const s=document.getElementById(t.hash.slice(1));if(s)io.observe(s);});
setTab(location.hash.slice(1)||tabs[0].hash.slice(1));
