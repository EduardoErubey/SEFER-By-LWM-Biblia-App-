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
    const needMenu = (n === 16);
    const needStage = (n === 17 || n === 18);
    const needSpot = (n === 21);
    if(n >= 19){
      try{ if(typeof closeProjectSheet==='function') closeProjectSheet(); }catch(e){}
      try{ if(typeof stage!=='undefined' && stage){ stage.classList.remove('open','stage-stack','stage-compare'); } }catch(e){}
    }
    if(needMenu){
      try{ if(typeof openProjectSheet==='function') openProjectSheet(); }catch(e){}
    }
    if(needStage){
      try{ if(typeof closeProjectSheet==='function') closeProjectSheet(); }catch(e){}
      try{
        const book = (typeof currentBook!=='undefined'&&currentBook)||'Génesis';
        const chap = String((typeof currentChap!=='undefined'&&currentChap)||'1');
        if(typeof openStage==='function') openStage(book, chap, ['1'], 'single');
      }catch(e){}
    }
    if(needSpot){ try{ if(typeof openWordSearch==='function') openWordSearch(''); }catch(e){} }
    else if(n < 21){ try{ if(typeof closeWordSearch==='function') closeWordSearch(); }catch(e){} }
  }catch(e){}
}

const SEFER_TOUR_STEPS = window.SEFER_TOUR_STEPS = [
  { sel:'.brand-block, #nav-header-row .brand-block', title:'1. Branding', text:'Aquí está el nombre SEFER y la firma BY LWM PDC.' },
  { sel:'#nav-header-actions', title:'2. Acciones', text:'Zona de perfil, nube, pantalla completa y reiniciar.' },
  { sel:'.theme-row-continuous, #theme-more-btn, #theme-batch', title:'3. Temas', text:'Cambio de lote y los cinco temas visibles. El dado va aparte.' },
  { sel:'#random-verse-btn', title:'4. Dado', text:'Atajo a un versículo al azar.' },
  { sel:'#ref-search-wrap, #ref-search', title:'5. Buscador de versículos', text:'Campo para ir a una referencia bíblica.' },
  { sel:'#book-list', title:'6. Biblioteca', text:'Lista de libros del Antiguo y Nuevo Testamento.' },
  { sel:'#tb-group-font, #font-dec, #font-inc, #font-family-btn', title:'7. Toolkit · Texto', text:'Grupo de tamaño y tipografía en la barra de herramientas.' },
  { sel:'#version-btn, #version-switch', title:'8. Toolkit · Traducción', text:'Selector de versión bíblica.' },
  { sel:'#easy-btn', title:'9. Toolkit · Destacar', text:'Botón de resaltado automático de nombres y lugares.' },
  { sel:'#plan-btn', title:'10. Toolkit · Plan', text:'Acceso al plan de lectura anual.' },
  { sel:'#tb-group-study', title:'11. Toolkit · Estudio', text:'Significados, notas y favoritos.' },
  { sel:'#tb-group-consult', title:'12. Toolkit · Consulta', text:'Glosario, biografía y apócrifos.' },
  { sel:'#youtube-btn', title:'13. Toolkit · YouTube', text:'Reproductor de sermones junto a la biblioteca.' },
  { sel:'#project-btn', title:'14. Toolkit · Proyectar', text:'Abre el menú de proyección.' },
  { sel:'#help-btn', title:'15. Toolkit · Ayuda', text:'Manual completo de SEFER (aquí están las funciones en detalle).' },
  { sel:'#project-sheet, .ps-card', title:'16. Menú de proyección', text:'Opciones para elegir qué se proyecta.' },
  { sel:'#stage', title:'17. Proyección', text:'Pantalla grande de culto o estudio.' },
  { sel:'#stage-compare-btn, #stage-nav, #stage-auto, #stage-speed, #stage-extra-btns', title:'18. Controles de proyección', text:'Comparar, navegar, auto y velocidad.' },
  { sel:'#reader-sticky-head, .sticky-head', title:'19. Cabecera del lector', text:'Libro, capítulo e indicaciones breves.' },
  { sel:'#reader-verses, #reader', title:'20. Lector', text:'Área donde se leen los versículos.' },
  { sel:'#word-search-bar, #word-search-input', title:'21. Spotlight', text:'Búsqueda de palabras en toda la Biblia.' },
  { sel:'.brand-block', title:'22. Listo', text:'Estas son las zonas de SEFER. El detalle de cada botón está en Ayuda.' }
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
