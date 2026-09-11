/* SEFER module: tour.js — script clásico (sin import/export) */

/* --- SEFER tour.js lines 3053-3191 --- */
/* =========================================================
   TOUR INTERACTIVO + AYUDA ACTUALIZADA
   ========================================================= */
const SEFER_TOUR_STEPS = [
  { sel:'#nav-header .brand, #nav-header', title:'1. Marca SEFER', text:'Aquí a la izquierda está SEFER (ספר), de Life Word Mission Playa del Carmen. Recorremos de izquierda a derecha.' },
  { sel:'#nav-header-actions', title:'2. Perfil y nube', text:'🏆 perfil y logros, ☁️ sincronizar con Google, ⛶ pantalla completa (Ctrl+Shift+F) y ↺ reiniciar navegación.' },
  { sel:'#theme-switch, #theme-batch', title:'3. Temas', text:'Cinco temas visibles. +/− cambia de lote (10 en total). Ctrl+T pasa al tema siguiente y cambia de lote cuando hace falta.' },
  { sel:'#random-verse-btn', title:'4. Versículo al azar', text:'Abre un versículo aleatorio en proyección. En temas normales el icono es 🎲; en Glass (cristal) es 🔀 para no confundirlo con ✨ Resaltar.' },
  { sel:'#ref-search-wrap, #ref-search', title:'5. Buscador de versículos', text:'Ejemplo: Juan 3:16. Rangos: 1:1-5. Dos libros: Juan 3:16 | Romanos 8:28 → proyección arriba/abajo. Atajo: Ctrl+Shift+V.' },
  { sel:'#book-list', title:'6. Lista de libros', text:'Antiguo y Nuevo Testamento. Elige libro y capítulo. 📚 muestra la ficha del libro.' },
  { sel:'#version-switch, #version-btn', title:'7. Traducción', text:'A la izquierda de la toolkit: botón corto (RV60, RV09, NVI…). Abre un menú compacto para cambiar la versión y recargar el capítulo. Atajo: Ctrl+Shift+T.' },
  { sel:'#clear-selection-btn', title:'8. Limpiar selección', text:'🧹 Limpiar aparece cuando marcas versículos (casillas). Quita todas las marcas. El espacio queda reservado para que la barra no salte.' },
  { sel:'#font-dec, #font-inc, #topbar-actions', title:'9. Tamaño del texto', text:'A− y A+ cambian el tamaño de los versículos (Ctrl+− / Ctrl++). Junto a ellos está la tipografía Aa.' },
  { sel:'#easy-btn', title:'10. Resaltar', text:'✨ Resaltar (antes “Resaltar”) marca visualmente elementos del texto: nombres, ciudades y palabras de Jesús. Atajo: Ctrl+D.' },
  { sel:'#meanings-btn', title:'11. Significados', text:'📚 Significados guardados. También: doble clic en una palabra del versículo. Atajo: Ctrl+S.' },
  { sel:'#notes-btn', title:'12. Notas', text:'📝 Tus notas por versículo. Atajo: Ctrl+N.' },
  { sel:'#favs-btn', title:'13. Favoritos', text:'❤️ Versículos favoritos. Atajo: Ctrl+F.' },
  { sel:'#glossary-btn', title:'14. Glosario', text:'📖 Términos bíblicos. Atajo: Ctrl+G.' },
  { sel:'#biography-btn', title:'15. Biografías', text:'👤 Personas de la Biblia. Atajo: Ctrl+B.' },
  { sel:'#apocrifos-btn', title:'16. Apócrifos', text:'📜 Libros apócrifos: qué son y por qué no están en el canon protestante. Atajo: Ctrl+A.' },
  { sel:'#plan-btn', title:'17. Plan 1 año', text:'📅 Plan de lectura en un año (órdenes y fecha de inicio). Atajo: Ctrl+P.' },
  { sel:'#youtube-btn', title:'18. YouTube', text:'Sermón en la barra lateral mientras lees. Atajo: Ctrl+Y.' },
  { sel:'#project-btn', title:'19. Proyectar', text:'Pantalla grande para culto. Comparar = dos traducciones izquierda/derecha (no en capítulo completo ni en buscador con |). Atajo: Ctrl+Enter.' },
  { sel:'#help-btn', title:'20. Ayuda', text:'❓ Siempre al final de la toolkit. Guía, atajos y este tour. Atajo: Ctrl+H.' },
  { sel:'#reader, #reader-sticky-head', title:'21. Área de lectura', text:'Clic en versículo: favorito, nota y casilla. Doble clic en palabra: significado. ✨ Resaltar activa el realce visual.' },
  { sel:'#random-verse-btn', title:'22. Dado y Glass', text:'Recuerda: 🎲 en la mayoría de temas y 🔀 en Glass. En proyección, el botón de “otro al azar” usa el mismo icono.' },
  { sel:'#help-btn', title:'23. Listo', text:'Ya conoces SEFER de izquierda a derecha. ¡Que la Palabra te acompañe!' }
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

