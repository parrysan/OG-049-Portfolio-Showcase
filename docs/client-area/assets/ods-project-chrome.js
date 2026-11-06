/* ODS Project header v1.1.2 behaviour (scroll hairline + phone tab centring), verbatim from Tung's proposal example.html */
const h=document.querySelector('.ods-project-header');
const f=()=>h.classList.toggle('is-stuck',scrollY>40);addEventListener('scroll',f,{passive:true});f();
/* phones: bring the selected tab into view, centred in the tab row */
const nav=h.querySelector('.ods-project-header__tabs'),cur=nav.querySelector('[aria-current]');if(cur&&nav.scrollWidth>nav.clientWidth)nav.scrollLeft=cur.offsetLeft-(nav.clientWidth-cur.offsetWidth)/2;
