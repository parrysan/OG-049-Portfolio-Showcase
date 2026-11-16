/* ODS decision report — report.js v1.1 (2026-10-28: dedicated Save note button; decision:'note' saves a note without approve/reject)
   Reads data-page-id (and optional data-storage-key) from the first element that has data-page-id.
   Each decision cell: <div class="decide" data-item="r1" data-label="Row 1"></div> inside a <tr>.
   Bulk controls: any [data-approve-all], [data-clear-all], [data-decide-count]. With a [data-dash-filter] on the page, Approve all skips rows the filter hides.
   Saves to localStorage and POSTs /api/decision {page,item_id,decision:approve|reject|note|undo,note}. "note" saves a note only (needs the matching .serve.py change).
   On load it merges GET /api/decisions?page=<id> so decisions follow Phil across browsers. */
(function(){'use strict';
var root=document.querySelector('[data-page-id]')||document.body;
var page=(root.getAttribute('data-page-id')||'').trim();
var live=/^[A-Za-z0-9][A-Za-z0-9._-]{0,80}$/.test(page)&&location.protocol.indexOf('http')===0;
var K=root.getAttribute('data-storage-key')||((page||location.pathname)+'-decisions');
function load(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return{}}}
function save(s){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
function post(b){if(!live)return Promise.resolve(false);b.page=page;
 return fetch('/api/decision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(function(r){return r.ok}).catch(function(){return false})}
function cells(){return Array.prototype.slice.call(document.querySelectorAll('.decide[data-item]'))}
function isD(e){return!!e&&(e.d==='approve'||e.d==='reject')}
function setNote(id,n){var s=load(),e=s[id];if(isD(e))e.n=n;else s[id]={d:'note',n:n,t:Date.now()};save(s);return post({item_id:id,decision:'note',note:n})}
function setD(id,d,n){var s=load();s[id]={d:d,n:n||'',t:Date.now()};save(s);return post({item_id:id,decision:d,note:n||''})}
function unset(id){var s=load();delete s[id];save(s);return post({item_id:id,decision:'undo'})}
function seq(list,fn){return list.reduce(function(p,x){return p.then(function(){return fn(x)})},Promise.resolve())}
function render(el){var s=load(),id=el.getAttribute('data-item'),label=el.getAttribute('data-label')||id,e=s[id],tr=el.closest('tr')||el;el.innerHTML='';
 if(isD(e)){tr.setAttribute('data-state',e.d);var st=document.createElement('span');st.className='ods-status';st.textContent=e.d==='approve'?'\u2713 Approved':'\u2715 Rejected';
  var u=document.createElement('button');u.type='button';u.className='decide-undo';u.textContent='Undo';u.setAttribute('aria-label','Undo decision on '+label);
  u.onclick=function(){unset(id);render(el);update()};el.append(st,u);
  if(e.n){var n=document.createElement('span');n.className='decide-note';n.textContent='\u201c'+e.n+'\u201d';el.append(n)}return}
 tr.removeAttribute('data-state');var A=document.createElement('button'),R=document.createElement('button'),N=document.createElement('input');
 A.type=R.type='button';A.className='ods-btn ods-btn--approve';R.className='ods-btn ods-btn--reject';A.textContent='Approve';R.textContent='Reject';
 N.className='og-input';N.placeholder='Note (optional)';N.setAttribute('aria-label','Note for '+label);if(e&&e.n)N.value=e.n;
 var W=document.createElement('span');W.className='decide-notewrap';
 var S=document.createElement('button');S.type='button';S.className='ods-btn decide-save';S.setAttribute('aria-label','Save note');S.title='Save note';
 S.innerHTML='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
 var M=document.createElement('span');M.className='decide-saved';M.setAttribute('role','status');M.setAttribute('aria-live','polite');
 function sync(){S.disabled=!N.value.trim()}
 function doSave(){var v=N.value.trim();if(!v)return;S.disabled=true;setNote(id,v).then(function(ok){M.textContent=(ok||!live)?'Note saved':'Saved here only';sync();
  clearTimeout(M._t);M._t=setTimeout(function(){M.textContent=''},2500)})}
 N.addEventListener('input',function(){sync();M.textContent=''});
 N.addEventListener('keydown',function(ev){if(ev.key==='Enter'){ev.preventDefault();doSave()}});
 S.onclick=doSave;sync();W.append(N,S);
 [A,R].forEach(function(b){b.setAttribute('aria-label',b.textContent+' '+label);b.onclick=function(){setD(id,b===A?'approve':'reject',N.value.trim());render(el);update()}});
 el.append(A,R,W,M)}
function renderAll(){cells().forEach(render);update()}
function update(){var s=load(),all=cells(),a=0,r=0;all.forEach(function(el){var e=s[el.getAttribute('data-item')];if(e&&e.d==='approve')a++;else if(e&&e.d==='reject')r++});
 var open=all.length-a-r;
 document.querySelectorAll('[data-decide-count]').forEach(function(x){x.textContent=a+' approved \u00b7 '+r+' rejected \u00b7 '+open+' open'});
 document.querySelectorAll('[data-approve-all]').forEach(function(b){b.disabled=open===0});
 document.querySelectorAll('[data-clear-all]').forEach(function(b){b.disabled=(a+r)===0})}
function approveAll(){var s=load(),scoped=!!document.querySelector('[data-dash-filter]'),open=cells().filter(function(el){var tr=el.closest('tr');return!isD(s[el.getAttribute('data-item')])&&!(scoped&&tr&&tr.hidden)});if(!open.length)return;
 if(!window.confirm('Approve '+open.length+' undecided row'+(open.length===1?'':'s')+'?\nRows you already approved or rejected stay as they are.'))return;
 var jobs=open.map(function(el){var i=el.querySelector('.og-input');return{id:el.getAttribute('data-item'),n:i?i.value:''}});
 var s2=load();jobs.forEach(function(j){s2[j.id]={d:'approve',n:j.n,t:Date.now()}});save(s2);renderAll();
 seq(jobs,function(j){return post({item_id:j.id,decision:'approve',note:j.n})})}
function clearAll(){var s=load(),ids=cells().map(function(el){return el.getAttribute('data-item')}).filter(function(id){return isD(s[id])});if(!ids.length)return;
 if(!window.confirm('Clear all '+ids.length+' decision'+(ids.length===1?'':'s')+' on this page?\nThis also clears them on the Studio.'))return;
 var s2=load();ids.forEach(function(id){var x=s2[id];if(x&&x.n)s2[id]={d:'note',n:x.n,t:Date.now()};else delete s2[id]});save(s2);renderAll();
 seq(ids,function(id){return post({item_id:id,decision:'undo'})})}
document.querySelectorAll('[data-approve-all]').forEach(function(b){b.addEventListener('click',approveAll)});
document.querySelectorAll('[data-clear-all]').forEach(function(b){b.addEventListener('click',clearAll)});
renderAll();
if(live)fetch('/api/decisions?page='+encodeURIComponent(page)).then(function(r){return r.ok?r.json():null}).then(function(srv){if(!srv)return;var s=load();
 Object.keys(srv).forEach(function(id){var e=srv[id];if(e&&(e.decision==='approve'||e.decision==='reject'||e.decision==='note'))s[id]={d:e.decision,n:e.note||'',t:Date.parse(e.timestamp)||0}});save(s);renderAll()}).catch(function(){});
})();
