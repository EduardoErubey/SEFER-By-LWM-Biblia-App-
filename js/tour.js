/* SEFER module: tour.js — script clásico (sin import/export) */

/* --- SEFER tour.js lines 3053-3191 --- */
/* =========================================================
   TOUR INTERACTIVO + AYUDA ACTUALIZADA
   ========================================================= */



function seferTourPrepareStep(step){
  try{
    if(!step) return;
    const title = step.title || '';
    const needMenu = title.indexOf('14.') === 0;
    const needStage = /^(15|16|17)\./.test(title);
    const needSpot = title.indexOf('18.') === 0;
    if(!needStage && !needMenu){
      try{ if(typeof closeProjectSheet==='function') closeProjectSheet(); }catch(e){}
      try{ if(typeof stage!=='undefined' && stage) stage.classList.remove('open','stage-stack','stage-compare'); }catch(e){}
    }
    if(needMenu){ try{ if(typeof openProjectSheet==='function') openProjectSheet(); }catch(e){} }
    if(needStage){
      try{ if(typeof closeProjectSheet==='function') closeProjectSheet(); }catch(e){}
      try{
        if(typeof openStage==='function'){
          openStage((typeof currentBook!=='undefined'&&currentBook)||'Génesis', (typeof currentChap!=='undefined'&&currentChap)||'1', ['1'], 'single');
        }
      }catch(e){}
    }
    if(needSpot){ try{ if(typeof openWordSearch==='function') openWordSearch(''); }catch(e){} }
    else { try{ if(typeof closeWordSearch==='function') closeWordSearch(); }catch(e){} }
  }catch(e){}
}

const SEFER_TOUR_STEPS = [
  { sel:'#nav-header-row .brand-block, .brand-block', title:'1. Branding', text:'SEFER ספר y BY LWM PDC (Life Word Mission Playa del Carmen).' },
  { sel:'#nav-header-actions', title:'2. Acciones', text:'Perfil, nube, pantalla completa y reiniciar.' },
  { sel:'.theme-row-continuous, #theme-batch, #theme-more-btn', title:'3. Temas', text:'Seis iconos seguidos: ＋/− de lotes y los 5 temas. El Dado va aparte.' },
  { sel:'#random-verse-btn', title:'4. Dado', text:'Versículo al azar en proyección.' },
  { sel:'#ref-search-wrap, #ref-search', title:'5. Buscador de versículos', text:'Referencias y hasta 3 libros con | o /. Tab completa solo el último libro.' },
  { sel:'#book-list', title:'6. Biblia', text:'Lista de libros. 📚 abre la información del libro.' },
  { sel:'#tb-group-font, #font-dec, #font-inc, #font-family-btn', title:'7. Texto', text:'A−, A+ y Aa: tamaño y tipografía.' },
  { sel:'#tb-group-read, #version-btn, #easy-btn, #plan-btn', title:'8. Lectura', text:'Traducción, Destacar y Plan 1 año.' },
  { sel:'#tb-group-study, #meanings-btn, #notes-btn, #favs-btn', title:'9. Estudio', text:'Significados, Notas y Favoritos (panel centrado).' },
  { sel:'#tb-group-consult, #glossary-btn, #biography-btn, #apocrifos-btn', title:'10. Consulta', text:'Glosario, Biografía y Apócrifos.' },
  { sel:'#tb-group-tools, #youtube-btn, #project-btn, #help-btn', title:'11. Herramientas', text:'YouTube, Proyectar y Ayuda.' },
  { sel:'#reader, #main', title:'12. Lector', text:'Clic en versículo, casillas, Copiar en la última casilla, doble clic en palabra.' },
  { sel:'#project-btn', title:'13. Proyectar', text:'Abre el menú de proyección (teclas 1/2/3).' },
  { sel:'#project-sheet', title:'14. Menú de proyección', text:'Versículo actual, selección o capítulo completo.' },
  { sel:'#stage', title:'15. Proyección', text:'Pantalla grande. Esc cierra.' },
  { sel:'#stage-compare-btn', title:'16. Comparar', text:'1er clic activa la comparación de traducciones; 2º clic la desactiva.' },
  { sel:'#stage-nav, #stage-extra-btns', title:'17. Controles en proyección', text:'Anterior/Siguiente, Auto, favorito, nota y Resaltar.' },
  { sel:'#word-search-bar, #word-search-input', title:'18. Spotlight', text:'Escribe fuera de un campo de texto para buscar palabras en la Biblia.' },
  { sel:'#help-btn', title:'19. Ayuda', text:'Manual completo y este tour.' },
  { sel:'.brand-block', title:'20. Listo', text:'¡Que la Palabra te acompañe!' }
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
