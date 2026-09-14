/* SEFER module: tour.js — script clásico (sin import/export) */

/* --- SEFER tour.js lines 3053-3191 --- */
/* =========================================================
   TOUR INTERACTIVO + AYUDA ACTUALIZADA
   ========================================================= */

function seferTourPrepareStep(step){
  try{
    if(!step || !step.title) return;
    const t = step.title || '';
    if(t.indexOf('20.') === 0 || t.indexOf('Menú de proyección') >= 0){
      if(typeof openProjectSheet === 'function') openProjectSheet();
    }
    if(t.indexOf('21.') === 0 || t.indexOf('22.') === 0){
      try{ if(typeof closeProjectSheet === 'function') closeProjectSheet(); }catch(e){}
      if(typeof openStage === 'function' && typeof currentBook !== 'undefined' && currentBook){
        openStage(currentBook, currentChap || '1', ['1'], 'single');
      } else if(typeof openStage === 'function'){
        openStage('Génesis', '1', ['1'], 'single');
      }
    }
    if(t.indexOf('7.') === 0 || (step.sel && step.sel.indexOf('word-search') >= 0)){
      if(typeof openWordSearch === 'function') openWordSearch('');
    }
  }catch(e){ console.warn('[tour prepare]', e); }
}

const SEFER_TOUR_STEPS = [
  { sel:'#nav-header-row, #nav-header .brand, #nav-header', title:'1. Branding', text:'Aquí está el branding completo: SEFER ספר y BY LWM PDC (Life Word Mission Playa del Carmen).' },
  { sel:'#nav-header-actions', title:'2. Acciones', text:'Perfil, nube (sincronizar), pantalla completa y reiniciar la navegación de la Biblia.' },
  { sel:'#theme-batch-top, #theme-more-btn, #theme-batch, #theme-switch', title:'3. Temas', text:'Los 5 temas visibles y el botón ＋/− de lotes (clásicos / Glass). El Dado es otro control, aparte.' },
  { sel:'#random-verse-btn', title:'4. Dado', text:'El 🎲 abre un versículo al azar en proyección.' },
  { sel:'#ref-search-wrap, #ref-search', title:'5. Buscador de versículos', text:'Ej.: Juan 3:16. Varios pasajes con | o / (máx. 3 libros). Tab completa el nombre del libro. Ctrl+Shift+V enfoca este buscador.' },
  { sel:'#book-list', title:'6. Biblia', text:'Lista del Antiguo y Nuevo Testamento. Libro → capítulo. El icono 📚 abre la ficha del libro.' },
  { sel:'#word-search-bar, #word-search-input', title:'7. Spotlight', text:'Buscador de palabras: escribe en el teclado (fuera de un cuadro de texto) y se abre. Muestra versículos que contienen la palabra. Clic en un resultado para ir a él.' },
  { sel:'#version-switch, #version-btn', title:'8. Traducción', text:'Cambia entre RV1960 (predeterminada), RV1909, RV2015, NVI, NTV y TLA. El menú se abre justo debajo del botón. Atajo: Ctrl+Shift+T.' },
  { sel:'#font-dec, #font-inc', title:'9. Tamaño del texto', text:'A− disminuye y A+ aumenta el tamaño de la letra en el Lector. Ambos botones forman esta pareja.' },
  { sel:'#font-family-btn', title:'10. Tipografía', text:'Aa cambia la fuente de lectura. El menú es compacto y aparece bajo el botón.' },
  { sel:'#easy-btn', title:'11. Destacar', text:'✨ Destacar marca nombres, lugares y palabras de Jesús. Atajo: Ctrl+D.' },
  { sel:'#meanings-btn', title:'12. Significados', text:'Abre el Panel de estudio con significados guardados. También: doble clic en una palabra del Lector. Ctrl+S.' },
  { sel:'#notes-btn', title:'13. Notas', text:'Tus notas por versículo (Panel de estudio). Ctrl+N.' },
  { sel:'#favs-btn', title:'14. Favoritos', text:'Versículos guardados con ❤️. Ctrl+F.' },
  { sel:'#glossary-btn', title:'15. Glosario', text:'Términos bíblicos explicados con palabras sencillas. Ctrl+G.' },
  { sel:'#biography-btn', title:'16. Biografías', text:'Personas de la Biblia (indica AT o NT). Ctrl+B.' },
  { sel:'#apocrifos-btn', title:'17. Apócrifos', text:'Datos y curiosidades (sin el texto completo de esos libros). Ctrl+A.' },
  { sel:'#plan-btn', title:'18. Plan 1 año', text:'Plan de lectura anual. Ctrl+P.' },
  { sel:'#youtube-btn', title:'19. Reproductor', text:'Pega un enlace de YouTube; el vídeo aparece en la barra cuando hay enlace cargado. Ctrl+Y.' },
  { sel:'#project-btn, #project-sheet', title:'20. Menú de proyección', text:'Al proyectar se abre el menú. Opciones numeradas: 1, 2 o 3. Con el menú abierto puedes usar las teclas 1–3. Ctrl+Enter abre proyectar.' },
  { sel:'#stage, #project-btn', title:'21. Proyección', text:'Pantalla grande para el culto. Anterior/Siguiente, Auto y velocidad cuando aplica. Esc cierra la proyección.' },
  { sel:'#stage-extra-btns, #stage-highlight-btn, #project-btn', title:'22. Controles en proyección', text:'En la misma fila inferior: favorito, nota y 🖍️ Resaltar (subraya un trozo solo en ese versículo).' },
  { sel:'#help-btn', title:'23. Ayuda', text:'Abre este manual y permite repetir el tour. Ctrl+H.' },
  { sel:'#reader, #main', title:'24. Lector', text:'Zona de lectura. Clic: favorito/nota/casilla. Doble clic en palabra: significado. Casillas + Copiar en la última marcada.' },
  { sel:'#nav-header-row, #nav-header .brand, #nav-header', title:'25. Listo', text:'Has recorrido el branding y lo esencial de SEFER. ¡Que la Palabra te acompañe!' }
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
  updateProjectBtnVisibility();
  document.getElementById('sefer-tour-overlay')?.classList.remove('open');
  const spot = document.getElementById('sefer-tour-spot');
  const card = document.getElementById('sefer-tour-card');
  if(spot) spot.style.display = 'none';
  if(card) card.style.display = 'none';
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
