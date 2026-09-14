/* SEFER module: tour.js — script clásico (sin import/export) */

/* --- SEFER tour.js lines 3053-3191 --- */
/* =========================================================
   TOUR INTERACTIVO + AYUDA ACTUALIZADA
   ========================================================= */



function seferTourPrepareStep(step){
  try{
    if(!step) return;
    const title = step.title || '';
    const needStage = /^(21|22|23)\./.test(title);
    const needMenu = /^20\./.test(title);
    const needSpot = /^25\./.test(title) || ((step.sel||'').indexOf('word-search') >= 0);
    if(!needStage){
      try{ if(typeof closeProjectSheet === 'function') closeProjectSheet(); }catch(e){}
      try{
        if(typeof stage !== 'undefined' && stage && stage.classList.contains('open')){
          stage.classList.remove('open','stage-stack','stage-stack-2','stage-stack-3','stage-compare');
          document.body.style.overflow = '';
        }
      }catch(e){}
    }
    if(needMenu){
      try{ if(typeof openProjectSheet === 'function') openProjectSheet(); }catch(e){}
    }
    if(needStage){
      try{ if(typeof closeProjectSheet === 'function') closeProjectSheet(); }catch(e){}
      try{
        if(typeof openStage === 'function'){
          const b = (typeof currentBook !== 'undefined' && currentBook) ? currentBook : 'Génesis';
          const c = (typeof currentChap !== 'undefined' && currentChap) ? currentChap : '1';
          openStage(b, c, ['1'], 'single');
        }
      }catch(e){}
    }
    if(needSpot){
      try{ if(typeof openWordSearch === 'function') openWordSearch(''); }catch(e){}
    } else {
      try{ if(typeof closeWordSearch === 'function') closeWordSearch(); }catch(e){}
    }
  }catch(e){ console.warn('[tour prepare]', e); }
}

const SEFER_TOUR_STEPS = [
  { sel:'#nav-header-row .brand-block, #nav-header-row', title:'1. Branding', text:'SEFER ספר y BY LWM PDC (Life Word Mission Playa del Carmen).' },
  { sel:'#nav-header-actions', title:'2. Acciones', text:'Perfil, nube, pantalla completa y reiniciar navegación.' },
  { sel:'#theme-batch, #theme-switch', title:'3. Temas', text:'Los 5 temas del lote actual y el botón ＋/− para cambiar de lote.' },
  { sel:'#random-verse-btn', title:'4. Dado', text:'Abre un versículo al azar en proyección.' },
  { sel:'#ref-search-wrap, #ref-search', title:'5. Buscador de versículos', text:'Ej.: Juan 3:16. Hasta 3 libros con | o /. Tab completa solo el último libro. Ctrl+Shift+V.' },
  { sel:'#book-list', title:'6. Biblia', text:'Antiguo y Nuevo Testamento. El botón 📚 muestra la información del libro.' },
  { sel:'#version-btn, #version-switch', title:'7. Traducción', text:'Cambia RV1960, RV1909, RV2015, NVI, NTV y TLA. Menú bajo el botón. Ctrl+Shift+T.' },
  { sel:'.tb-group', title:'8. Tamaño del texto', text:'A− reduce y A+ aumenta el tamaño de la letra (ambos botones).' },
  { sel:'#font-family-btn', title:'9. Tipografía', text:'Aa cambia la fuente de lectura.' },
  { sel:'#easy-btn', title:'10. Destacar', text:'Resalta nombres, lugares y palabras de Jesús. Ctrl+D.' },
  { sel:'#meanings-btn', title:'11. Significados', text:'Panel de significados guardados. Ctrl+S.' },
  { sel:'#notes-btn', title:'12. Notas', text:'Notas por versículo. Ctrl+N.' },
  { sel:'#favs-btn', title:'13. Favoritos', text:'Versículos marcados con corazón. Ctrl+F.' },
  { sel:'#glossary-btn', title:'14. Glosario', text:'Términos bíblicos. Ctrl+G.' },
  { sel:'#biography-btn', title:'15. Biografías', text:'Personas de la Biblia. Ctrl+B.' },
  { sel:'#apocrifos-btn', title:'16. Apócrifos', text:'Información sobre libros apócrifos. Ctrl+A.' },
  { sel:'#plan-btn', title:'17. Plan 1 año', text:'Plan de lectura anual. Ctrl+P.' },
  { sel:'#youtube-btn', title:'18. Reproductor', text:'YouTube en la barra lateral. Ctrl+Y.' },
  { sel:'#project-btn', title:'19. Proyectar', text:'Abre el menú de proyección. Ctrl+Enter.' },
  { sel:'#project-sheet', title:'20. Menú de proyección', text:'Opciones 1 / 2 / 3. Con el menú abierto usa las teclas 1, 2 o 3.' },
  { sel:'#stage', title:'21. Proyección', text:'Pantalla grande para el culto. Esc cierra la proyección.' },
  { sel:'#stage-compare-btn, #stage-nav', title:'22. Comparar', text:'Un clic activa la comparación de traducciones; el segundo clic la desactiva.' },
  { sel:'#stage-extra-btns, #stage-nav', title:'23. Controles en proyección', text:'Favorito, nota y Resaltar en la zona de controles de proyección.' },
  { sel:'#reader, #main', title:'24. Lector', text:'Zona de lectura: clic, casillas, Copiar en la última casilla, doble clic en una palabra.' },
  { sel:'#word-search-bar, #word-search-input', title:'25. Spotlight', text:'Buscador de palabras: escribe fuera de un campo de texto. Clic en un resultado para ir al versículo.' },
  { sel:'#help-btn', title:'26. Ayuda', text:'Manual de SEFER y este tour. Ctrl+H.' },
  { sel:'#nav-header-row .brand-block, #nav-header-row', title:'27. Listo', text:'Fin del recorrido. ¡Que la Palabra te acompañe!' }
];


function seferTourFindEl(sel){
  if(!sel) return null;
  try{
    const parts = String(sel).split(',').map(s=>s.trim()).filter(Boolean);
    for(const p of parts){
      const el = document.querySelector(p);
      if(el) return el;
    }
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
