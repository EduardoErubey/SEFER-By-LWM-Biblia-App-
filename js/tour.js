/* SEFER module: tour.js — script clásico (sin import/export) */

/* --- SEFER tour.js lines 3053-3191 --- */
/* =========================================================
   TOUR INTERACTIVO + AYUDA ACTUALIZADA
   ========================================================= */



function seferTourPrepareStep(step){
  try{
    if(!step) return;
    const title = step.title || '';
    const n = parseInt(String(title).split('.')[0], 10) || 0;
    const needMenu = (n === 10);
    const needStage = (n === 11);
    const needReader = (n === 12 || n === 13);
    const needSpot = (n === 14);
    if(n >= 12){
      try{ if(typeof closeProjectSheet==='function') closeProjectSheet(); }catch(e){}
      try{ if(typeof stage!=='undefined' && stage){ stage.classList.remove('open','stage-stack','stage-compare'); } }catch(e){}
    }
    if(needMenu){ try{ if(typeof openProjectSheet==='function') openProjectSheet(); }catch(e){} }
    if(needStage){
      try{ if(typeof closeProjectSheet==='function') closeProjectSheet(); }catch(e){}
      try{
        const book = (typeof currentBook!=='undefined'&&currentBook)||'Génesis';
        const chap = String((typeof currentChap!=='undefined'&&currentChap)||'1');
        if(typeof openStage==='function') openStage(book, chap, ['1'], 'single');
      }catch(e){}
    }
    if(needReader){
      try{
        const book = (typeof currentBook!=='undefined'&&currentBook)||'Génesis';
        const chap = String((typeof currentChap!=='undefined'&&currentChap)||'1');
        if(typeof goTo==='function') goTo(book, chap);
      }catch(e){}
    }
    if(needSpot){ try{ if(typeof openWordSearch==='function') openWordSearch(''); }catch(e){} }
    else if(n < 14){ try{ if(typeof closeWordSearch==='function') closeWordSearch(); }catch(e){} }
  }catch(e){}
}

const SEFER_TOUR_STEPS = window.SEFER_TOUR_STEPS = [
  { sel:'.brand-block, #nav-header-row .brand-block', title:'1. Sifriá', text:'Marca Sifriá סִפְרִיָּה y la firma BY LWM PDC.' },
  { sel:'#nav-header-actions', title:'2. Barra de acciones', text:'Perfil, nube, pantalla completa y reiniciar.' },
  { sel:'#nav-header-row, #nav-header', title:'3. Cabecera principal', text:'Sifriá, firma y barra de acciones juntos.' },
  { sel:'.theme-row-continuous, #theme-more-btn, #theme-batch', title:'4. Lotes de temas', text:'Botón ＋/− de lote y los cinco temas visibles.' },
  { sel:'#random-verse-btn', title:'5. Aleatorio', text:'Dado: versículo al azar.' },
  { sel:'#theme-switch', title:'6. Cabecera secundaria', text:'Lotes de temas y aleatorio en la misma franja.' },
  { sel:'#ref-search-wrap, #ref-search', title:'7. Buscador de versículos', text:'Campo para ir a una referencia bíblica.' },
  { sel:'#book-list', title:'8. Biblia', text:'Lista de libros del Antiguo y Nuevo Testamento.' },
  { sel:'#topbar-actions', title:'9. Toolkit', text:'Barra de herramientas superior. El detalle de cada botón está en Ayuda.' },
  { sel:'#project-sheet.open .ps-card, #project-sheet .ps-card', title:'10. Menú de proyección', text:'Ventana con las opciones de proyección.' },
  { sel:'#stage', title:'11. Proyección', text:'Pantalla grande de culto o estudio.' },
  { sel:'#reader-sticky-head, .sticky-head', title:'12. Cabecera del lector', text:'Libro, capítulo e indicaciones.' },
  { sel:'#reader-verses, #reader', title:'13. Lector', text:'Área donde se leen los versículos.' },
  { sel:'#word-search-bar, #word-search-input', title:'14. Spotlight', text:'Búsqueda de palabras en toda la Biblia.' },
  { sel:'.brand-block', title:'15. Listo', text:'Estas son las zonas de Sifriá. Para el detalle de cada botón, abre Ayuda.' }
];


function seferTourFindEl(sel){
  if(!sel) return null;
  try{
    const parts = String(sel).split(',').map(function(s){ return s.trim(); }).filter(Boolean);
    const nodes = [];
    parts.forEach(function(p){
      try{
        document.querySelectorAll(p).forEach(function(el){ if(el && nodes.indexOf(el)<0) nodes.push(el); });
      }catch(e){}
    });
    if(!nodes.length) return null;
    const cards = nodes.filter(function(el){ return el.classList && el.classList.contains('ps-card'); });
    if(cards.length){ return cards[0]; }
    if(nodes.length === 1) return nodes[0];
    const first = nodes[0];
    first.__seferTourGroup = nodes;
    return first;
  }catch(e){}
  return null;
}
function seferTourPlaceCard(el){
  const card = document.getElementById('sefer-tour-card');
  const spot = document.getElementById('sefer-tour-spot');
  if(!card) return;
  const margin = 12;
  const vw = window.innerWidth || 800;
  const vh = window.innerHeight || 600;
  if(spot){
    if(el && el.getBoundingClientRect){
      const r = el.getBoundingClientRect();
      spot.style.display = 'block';
      spot.style.top = Math.max(0, r.top - 6) + 'px';
      spot.style.left = Math.max(0, r.left - 6) + 'px';
      spot.style.width = Math.min(vw, r.width + 12) + 'px';
      spot.style.height = Math.min(vh, r.height + 12) + 'px';
    } else {
      spot.style.display = 'none';
    }
  }
  // tarjeta centrada abajo o junto al elemento
  card.style.position = 'fixed';
  card.style.zIndex = '1600';
  card.style.display = 'block';
  const cw = Math.min(360, vw - 24);
  card.style.width = cw + 'px';
  card.style.maxWidth = '92vw';
  let top = vh - 180;
  let left = (vw - cw) / 2;
  if(el && el.getBoundingClientRect){
    const r = el.getBoundingClientRect();
    // preferir debajo del elemento si cabe
    if(r.bottom + 160 < vh){
      top = r.bottom + 14;
      left = Math.min(Math.max(margin, r.left), vw - cw - margin);
    } else if(r.top > 160){
      top = Math.max(margin, r.top - 150);
      left = Math.min(Math.max(margin, r.left), vw - cw - margin);
    }
  }
  card.style.top = Math.max(margin, Math.min(top, vh - 140)) + 'px';
  card.style.left = Math.max(margin, left) + 'px';
}

function seferTourShowStep(){
  const step = SEFER_TOUR_STEPS[seferTourIndex];
  if(!step){ endSeferTour(); return; }
  const title = document.getElementById('sefer-tour-title');
  const text = document.getElementById('sefer-tour-text');
  const num = document.getElementById('sefer-tour-step');
  const next = document.getElementById('sefer-tour-next');
  const prev = document.getElementById('sefer-tour-prev');
  if(title) title.textContent = step.title;
  if(text) text.textContent = step.text;
  if(num) num.textContent = (seferTourIndex + 1) + ' / ' + SEFER_TOUR_STEPS.length;
  if(next) next.textContent = seferTourIndex >= SEFER_TOUR_STEPS.length - 1 ? 'Finalizar' : 'Siguiente';
  if(prev) prev.disabled = seferTourIndex <= 0;
  try{ seferTourPrepareStep(step); }catch(e){}
  const el = seferTourFindEl(step.sel);
  if(el && el.scrollIntoView){
    try{ el.scrollIntoView({block:'nearest', behavior:'smooth'}); }catch(e){}
  }
  requestAnimationFrame(()=> seferTourPlaceCard(el));
}

function startSeferTour(){
  // Cerrar ayuda si está abierta
  document.getElementById('info-modal')?.classList.remove('open');
  seferTourActive = true;
  seferTourIndex = 0;
  updateProjectBtnVisibility();
  document.getElementById('sefer-tour-overlay')?.classList.add('open');
  document.getElementById('sefer-tour-card').style.display = 'block';
  seferTourShowStep();
}
function endSeferTour(){
  seferTourActive = false;
  try{ updateProjectBtnVisibility(); }catch(e){}
  document.getElementById('sefer-tour-overlay')?.classList.remove('open');
  const spot = document.getElementById('sefer-tour-spot');
  const card = document.getElementById('sefer-tour-card');
  if(spot) spot.style.display = 'none';
  if(card) card.style.display = 'none';
  try{ if(typeof closeProjectSheet==='function') closeProjectSheet(); }catch(e){}
  try{ if(typeof closeWordSearch==='function') closeWordSearch(); }catch(e){}
  try{
    if(typeof stage !== 'undefined' && stage){
      stage.classList.remove('open','stage-stack','stage-compare');
    }
  }catch(e){}
}
document.getElementById('sefer-tour-next')?.addEventListener('click', ()=>{
  if(seferTourIndex >= SEFER_TOUR_STEPS.length - 1) endSeferTour();
  else { seferTourIndex++; seferTourShowStep(); }
});
document.getElementById('sefer-tour-prev')?.addEventListener('click', ()=>{
  if(seferTourIndex > 0){ seferTourIndex--; seferTourShowStep(); }
});
document.getElementById('sefer-tour-skip')?.addEventListener('click', endSeferTour);
window.addEventListener('resize', ()=>{ if(seferTourActive) seferTourShowStep(); });
document.addEventListener('keydown', (e)=>{
  if(!seferTourActive) return;
  if(e.key === 'Escape'){ e.preventDefault(); endSeferTour(); }
  if(e.key === 'ArrowRight' || e.key === 'Enter'){ e.preventDefault(); document.getElementById('sefer-tour-next')?.click(); }
  if(e.key === 'ArrowLeft'){ e.preventDefault(); document.getElementById('sefer-tour-prev')?.click(); }
}, true);



/* Tour z-index / clicks force */
(function(){
  const forceTourUi = function(){
    const ov = document.getElementById('sefer-tour-overlay');
    const spot = document.getElementById('sefer-tour-spot');
    const card = document.getElementById('sefer-tour-card');
    if(ov){
      ov.style.zIndex = '20000';
      ov.style.pointerEvents = 'none';
      ov.style.background = 'transparent';
    }
    if(spot){
      spot.style.zIndex = '20001';
      spot.style.pointerEvents = 'none';
    }
    if(card){
      card.style.zIndex = '20002';
      card.style.pointerEvents = 'auto';
      card.style.position = 'fixed';
      card.querySelectorAll('button').forEach(b=>{ b.style.pointerEvents = 'auto'; b.style.position = 'relative'; b.style.zIndex = '20003'; });
    }
  };
  const _show = window.seferTourShowStep;
  if(typeof seferTourShowStep === 'function'){
    const orig = seferTourShowStep;
    window.seferTourShowStep = seferTourShowStep = function(){
      const r = orig.apply(this, arguments);
      forceTourUi();
      return r;
    };
  }
  const _start = window.startSeferTour;
  if(typeof startSeferTour === 'function'){
    const origS = startSeferTour;
    window.startSeferTour = startSeferTour = function(){
      const r = origS.apply(this, arguments);
      forceTourUi();
      return r;
    };
  }
})();
