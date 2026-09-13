/* SEFER module: tour.js — script clásico (sin import/export) */

/* --- SEFER tour.js lines 3053-3191 --- */
/* =========================================================
   TOUR INTERACTIVO + AYUDA ACTUALIZADA
   ========================================================= */
const SEFER_TOUR_STEPS = [
  { sel:'#nav-header-row, #nav-header .brand, #nav-header', title:'1. Marca SEFER', text:'Aquí ves SEFER ספר y BY LWM PDC (Life Word Mission Playa del Carmen). El tour va de izquierda a derecha, con calma.' },
  { sel:'#nav-header-actions', title:'2. Acciones rápidas', text:'Perfil y logros, nube (sincronizar), pantalla completa y reiniciar la navegación de libros.' },
  { sel:'#theme-batch-top, #theme-more-btn, #theme-batch', title:'3. Temas', text:'Cinco temas a la vez. El botón ＋/− cambia entre lote clásico y lote Glass. Life Word Mission es el predeterminado. Atajo: Ctrl+T.' },
  { sel:'#random-verse-btn', title:'4. Dado', text:'El 🎲 abre un versículo al azar (en proyección). Siempre es un dado, en todos los temas.' },
  { sel:'#ref-search-wrap, #ref-search', title:'5. Buscador', text:'Escribe por ejemplo Juan 3:16. También rangos (1:1-5) o dos pasajes con |. Tab completa el libro. Atajo: Ctrl+Shift+V.' },
  { sel:'#book-list', title:'6. Libros', text:'Antiguo y Nuevo Testamento. Toca un libro y un número de capítulo. El icono 📚 abre la ficha del libro.' },
  { sel:'#easy-btn', title:'7. Destacar', text:'✨ Destacar marca nombres, lugares y palabras de Jesús para leer más fácil. No pinta el versículo entero. Atajo: Ctrl+D.' },
  { sel:'#font-dec, #font-inc', title:'8. Tamaño del texto', text:'A− hace la letra más pequeña y A+ más grande. Prueba ambos hasta leer con comodidad.' },
  { sel:'#font-family-btn', title:'9. Tipografía', text:'Aa cambia la fuente de lectura (estilos claros y modernos). Elige la que mejor se lea en tu pantalla.' },
  { sel:'#version-switch, #version-btn', title:'10. Traducción', text:'Cambia entre RV1960 (predeterminada), RV1909, RVA2015, NVI, NTV y TLA. Atajo: Ctrl+Shift+T.' },
  { sel:'#meanings-btn', title:'11. Significados', text:'Lista de palabras con significado. También puedes dar doble clic a una palabra en el texto.' },
  { sel:'#notes-btn', title:'12. Notas', text:'Tus notas por versículo. Puedes escribirlas desde el lector o desde la proyección.' },
  { sel:'#favs-btn', title:'13. Favoritos', text:'Versículos que guardaste con ❤️.' },
  { sel:'#glossary-btn', title:'14. Glosario', text:'Términos bíblicos difíciles explicados con palabras sencillas.' },
  { sel:'#biography-btn', title:'15. Biografías', text:'Personas de la Biblia en forma de lista (indica si son del Antiguo o del Nuevo Testamento).' },
  { sel:'#apocrifos-btn', title:'16. Apócrifos', text:'Información y curiosidades sobre libros apócrifos (no incluye el texto completo).' },
  { sel:'#plan-btn', title:'17. Plan 1 año', text:'Plan de lectura anual: varios órdenes y la opción de empezar el 1 de enero o desde hoy.' },
  { sel:'#youtube-btn', title:'18. YouTube', text:'Pega un enlace de sermón. El vídeo aparece en la barra izquierda solo cuando hay un enlace cargado.' },
  { sel:'#project-btn', title:'19. Proyectar', text:'Abre el menú de proyección. Con el menú abierto puedes pulsar 1, 2 o 3 (según las opciones) sin usar el ratón. Atajo: Ctrl+Enter.' },
  { sel:'#project-sheet, #project-btn', title:'20. Opciones al proyectar', text:'1 Versículo actual · 2 Selección (si hay casillas) · 3 Capítulo completo. Esc cierra menús y la proyección.' },
  { sel:'#stage-nav, #project-btn', title:'21. Controles en proyección', text:'Dentro de la proyección: Anterior y Siguiente, Auto y velocidad (si el texto es largo). A la misma altura: ❤️ favorito, 📝 nota y 🖍️ resaltar. Esc sale de proyección.' },
  { sel:'#stage-extra-btns, #stage-highlight-btn, #project-btn', title:'22. Resaltar (🖍️)', text:'Solo en proyección: activa 🖍️, selecciona un trozo de texto y se subraya en ese versículo. Para quitar, repite sobre lo marcado. No sustituye a favoritos.' },
  { sel:'#help-btn', title:'23. Ayuda', text:'Este botón abre el manual completo. Desde ahí también puedes volver a lanzar el tour.' },
  { sel:'#reader, #main', title:'24. Área de lectura', text:'Aquí se leen los versículos. Un clic: favorito o nota y casilla. Doble clic en una palabra: significado. Las casillas no mueven el texto.' },
  { sel:'#nav-header .brand, #nav-header', title:'25. Listo', text:'Ya conoces lo esencial de SEFER. ¡Que la Palabra te acompañe!' }
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
