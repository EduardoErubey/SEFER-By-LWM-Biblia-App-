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
    const needMenu = (n === 12);
    const needStage = (n === 13);
    const needSpot = (n === 16);
    if(n >= 14){
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
    if(needSpot){ try{ if(typeof openWordSearch==='function') openWordSearch(''); }catch(e){} }
    else if(n < 16){ try{ if(typeof closeWordSearch==='function') closeWordSearch(); }catch(e){} }
  }catch(e){}
}

const SEFER_TOUR_STEPS = window.SEFER_TOUR_STEPS = [
  { sel:'.brand-block, #nav-header-row .brand-block', title:'1. SEFER', text:'Marca SEFER ספר. Debajo está la FIRMA (BY LWM PDC).' },
  { sel:'#nav-header-actions', title:'2. BARRA DE ACCIONES', text:'Perfil, nube, pantalla completa y reiniciar.' },
  { sel:'#nav-header-row, #nav-header', title:'3. CABECERA PRINCIPAL', text:'SEFER + FIRMA + BARRA DE ACCIONES.' },
  { sel:'.theme-row-continuous, #theme-more-btn, #theme-batch', title:'4. TEMAS y SELECTOR DE LOTE', text:'Lote (＋/−) y los cinco temas visibles.' },
  { sel:'#random-verse-btn', title:'5. ALEATORIO', text:'Dado: versículo al azar.' },
  { sel:'#ref-search-wrap, #ref-search', title:'6. VERSE FINDER', text:'Buscador de referencias. Las SUGERENCIAS aparecen al escribir.' },
  { sel:'#book-list', title:'7. BIBLIOTECA', text:'Libros del Antiguo y Nuevo Testamento. BOOK ABOUT abre la info del libro.' },
  { sel:'#topbar-actions', title:'8. TOOLKIT', text:'Barra de herramientas. Abajo: TOOLKIT FOOTER (nombres de grupo).' },
  { sel:'#tb-group-font, #font-dec, #font-inc, #font-family-btn', title:'9. TOOLKIT · Texto', text:'Tamaño y FONT MENU (Aa).' },
  { sel:'#version-btn, #version-switch', title:'10. VERSION MENU', text:'Selector de traducción bíblica.' },
  { sel:'#tb-group-study, #tb-group-consult, #plan-btn, #youtube-btn, #project-btn, #help-btn', title:'11. TOOLKIT · resto', text:'Estudio (STUDY PANEL), CONSULTA, PLAN, REPRODUCTOR, proyección y AYUDA.' },
  { sel:'#project-btn', title:'12. MENÚ DE PROYECCIÓN', text:'Se abre desde Proyectar.' },
  { sel:'#stage', title:'13. PROYECCIÓN', text:'Pantalla grande. Incluye STAGE CONTROLS y COMPARE.' },
  { sel:'#reader-sticky-head, .sticky-head', title:'14. CABECERA DEL LECTOR', text:'Libro, capítulo e indicaciones.' },
  { sel:'#reader-verses, #reader', title:'15. LECTOR', text:'Versículos. CASILLAS DE SELECCIÓN y VERSE ACTIONS viven aquí. WORD POPUP al doble clic.' },
  { sel:'#word-search-bar, #word-search-input', title:'16. SPOTLIGHT', text:'Búsqueda de palabras en toda la Biblia.' },
  { sel:'.brand-block', title:'17. Listo', text:'Mapa de zonas de SEFER. Detalle de cada botón: AYUDA. Historial: HISTORIAL DE VERSIONES.' }
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
    if(nodes.length === 1) return nodes[0];
    // Envolver mentalmente: devolver el primero pero ampliar spotlight en placeCard via data
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
