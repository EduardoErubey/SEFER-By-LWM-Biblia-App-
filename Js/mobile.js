/* SEFER module: mobile.js — script clásico (sin import/export) */

/* --- SEFER mobile.js lines 3750-3931 --- */
/* =========================================================
   MÓVIL: toolbar, buscador palabra, ayuda, scroll hide
   ========================================================= */
(function wireMobileExtras(){
  // Toolbar buttons → same as desktop counterparts
  const map = {
    'mt-easy': 'easy-btn',
    'mt-sermons': 'sermons-btn',
    'mt-meanings': 'meanings-btn',
    'mt-notes': 'notes-btn',
    'mt-favs': 'favs-btn',
    'mt-help': 'help-btn'
  };
  Object.keys(map).forEach(id=>{
    const src = document.getElementById(id);
    const dst = document.getElementById(map[id]);
    if(src && dst) src.onclick = (e)=>{ e.preventDefault(); dst.click(); };
  });

  // Word search inline (desktop header) + mobile header input → open central bar
  function triggerWordSearch(q){
    if(typeof openWordSearch === 'function'){
      openWordSearch('');
      const inp = document.getElementById('word-search-input');
      if(inp){
        inp.value = q || '';
        if(q && typeof runWordSearch === 'function') runWordSearch(q);
        else if(q) inp.dispatchEvent(new Event('input', {bubbles:true}));
        inp.focus();
      }
      return;
    }
    const bar = document.getElementById('word-search-bar');
    const inp = document.getElementById('word-search-input');
    if(!bar || !inp) return;
    bar.classList.add('open');
    inp.value = q || '';
    inp.focus();
    if(q) inp.dispatchEvent(new Event('input', {bubbles:true}));
  }
  ['word-search-inline', 'mobile-word-search-input'].forEach(id=>{
    const el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        e.preventDefault();
        triggerWordSearch(el.value.trim());
      }
    });
    el.addEventListener('input', ()=>{
      // mirror typing into the floating bar when it is already open
      const inp = document.getElementById('word-search-input');
      if(inp && typeof wordSearchOpen !== 'undefined' && wordSearchOpen){
        inp.value = el.value;
        if(typeof runWordSearch === 'function') runWordSearch(el.value);
      }
    });
  });

  // Auto-hide mobile toolbar on scroll down
  let lastScrollY = 0;
  const toolbar = document.getElementById('mobile-toolbar');
  const readerEl = document.getElementById('reader');
  if(readerEl && toolbar){
    readerEl.addEventListener('scroll', ()=>{
      if(!document.body.classList.contains('mobile-mode')) return;
      const y = readerEl.scrollTop;
      if(y > lastScrollY + 12 && y > 40){
        toolbar.classList.add('hidden-scroll');
      } else if(y < lastScrollY - 8){
        toolbar.classList.remove('hidden-scroll');
      }
      lastScrollY = y;
    }, {passive:true});
  }
})();

// Help: mobile-specific content when in mobile mode
(function patchHelpForMobile(){
  const helpBtn = document.getElementById('help-btn');
  if(!helpBtn) return;
  const orig = helpBtn.onclick;
  helpBtn.onclick = function(ev){
    if(!document.body.classList.contains('mobile-mode')){
      if(typeof orig === 'function') return orig.call(this, ev);
      return;
    }
    // Mobile instructions
    if(typeof infoNavEnabled !== 'undefined') infoNavEnabled = false;
    const nav = document.getElementById('im-nav');
    if(nav) nav.style.display = 'none';
    document.getElementById('im-title').textContent = 'Guía rápida (móvil)';
    document.getElementById('im-sub').textContent = 'SEFER · BY LIFE WORD MISSION';
    document.getElementById('im-body').innerHTML = `
      <div class="im-block"><div class="im-label">Lectura</div>
      <div class="im-text">• Haz clic en un versículo para seleccionarlo, marcar favorito, añadir nota o proyectar.<br>
      • <strong>A− / A+</strong> cambia el tamaño del texto.</div></div>
      <div class="im-block"><div class="im-label">Búsqueda</div>
      <div class="im-text">• Escribe en cualquier momento para buscar una <strong>palabra</strong> en toda la Biblia (barra flotante).<br>
      • En el panel izquierdo: busca por <strong>referencia</strong> (ej. Génesis 1:1). <strong>Tab</strong> autocompleta el libro.</div></div>
      <div class="im-block"><div class="im-label">Herramientas</div>
      <div class="im-text">• ✨ Resaltar · 📚 Significados · 📝 Notas · ❤️ Favoritos<br>
      • 📅 Plan 1 año (orden + calendario o desde hoy) · 📖 Glosario<br>
      • ☁️ Sincronizar (Google Drive) · 🎬 Proyectar · ❓ Ayuda</div></div>
      <div class="im-block"><div class="im-label">Temas</div>
      <div class="im-text"><svg class="flag-svg help-flag" viewBox="0 0 36 24" width="18" height="12" aria-hidden="true"><rect width="12" height="24" x="0" fill="#006847"/><rect width="12" height="24" x="12" fill="#fff"/><rect width="12" height="24" x="24" fill="#CE1126"/><circle cx="18" cy="12" r="3.2" fill="#006847"/></svg> México · <svg class="flag-svg help-flag" viewBox="0 0 36 24" width="18" height="12" aria-hidden="true"><rect width="36" height="24" fill="#fff" stroke="#ddd" stroke-width="0.5"/><circle cx="18" cy="12" r="5" fill="#CD2E3A"/><path d="M18 12a5 5 0 0 1 0-0.01 2.5 2.5 0 1 0 0 0.01z" fill="#0047A0"/><g fill="#000"><rect x="6" y="4" width="5" height="1.2"/><rect x="6" y="6" width="2" height="1.2"/><rect x="9" y="6" width="2" height="1.2"/><rect x="6" y="8" width="5" height="1.2"/><rect x="25" y="4" width="5" height="1.2"/><rect x="25" y="6.6" width="5" height="1.2"/><rect x="25" y="9.2" width="5" height="1.2"/><rect x="6" y="14.5" width="5" height="1.2"/><rect x="6" y="17.1" width="2" height="1.2"/><rect x="9" y="17.1" width="2" height="1.2"/><rect x="6" y="19.7" width="5" height="1.2"/><rect x="25" y="14.5" width="2" height="1.2"/><rect x="28" y="14.5" width="2" height="1.2"/><rect x="25" y="17.1" width="5" height="1.2"/><rect x="25" y="19.7" width="2" height="1.2"/><rect x="28" y="19.7" width="2" height="1.2"/></g></svg> Corea · <svg class="flag-svg help-flag" viewBox="0 0 36 24" width="18" height="12" aria-hidden="true"><rect width="36" height="12" y="0" fill="#0057B7"/><rect width="36" height="12" y="12" fill="#FFD700"/></svg> Ucrania · 👑 Reino · 🌿 Edén<br>
      Con <strong>＋</strong>: ☀️ Day · 🌙 Night · ⏳ Arena · 🕯️ Sándalo · 🫧 Glass</div></div>
      <div class="im-block"><div class="im-label">Nube</div>
      <div class="im-text">Favoritos, notas, significados y progreso del plan se sincronizan con Google Drive (appDataFolder) al pulsar ☁️ Sincronizar.</div></div>
    `;
    document.getElementById('info-modal').classList.add('open');
    if(typeof focusInfoScroll === 'function') focusInfoScroll();
  };
})();

/* Iconos estilo Apple/macOS/iOS solo en tema Glass (amoled); el resto conserva los originales */
const SEFER_GLASS_ICONS = {
  'btn-user-profile': '👤',
  'btn-login-google': '☁️',
  'fullscreen-btn': '⛶',
  'nav-toggle': '↺',
  'random-verse-btn': '🔀',
  'easy-btn': '✨ Resaltar',
  'meanings-btn': '📑 Significados',
  'notes-btn': '✏️ Notas',
  'favs-btn': '❤️ Favoritos',
  'glossary-btn': '📖 Glosario',
  'biography-btn': '👥 Biografía',
  'apocrifos-btn': '📄 Apócrifos',
  'plan-btn': '📅 Plan 1 año',
  'project-btn': '🖥️ Proyectar',
  'help-btn': 'ℹ️ Ayuda'
};

function seferUpdateDiceEmoji(){
  try{
    const glass = (typeof currentTheme !== 'undefined' && currentTheme === 'amoled');
    const emoji = glass ? '🔀' : '🎲';
    const tip = glass ? 'Versículo al azar (barajar)' : 'Versículo aleatorio';
    const main = document.getElementById('random-verse-btn');
    if(main){
      main.textContent = emoji;
      main.setAttribute('data-tooltip', tip);
      main.setAttribute('title', tip);
    }
    const stageDice = document.getElementById('stage-dice-btn');
    if(stageDice){
      stageDice.textContent = emoji;
      stageDice.setAttribute('title', glass ? 'Otro al azar' : 'Otro versículo al azar');
    }
  }catch(e){}
}

function applyThemeIcons(){
  try{
    seferUpdateDiceEmoji();
    const glass = (typeof currentTheme !== 'undefined' && currentTheme === 'amoled');
    Object.keys(SEFER_GLASS_ICONS).forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      if(el.dataset.iconDefault === undefined){
        el.dataset.iconDefault = el.innerHTML;
      }
      if(glass){
        el.innerHTML = SEFER_GLASS_ICONS[id];
      } else if(el.dataset.iconDefault !== undefined){
        el.innerHTML = el.dataset.iconDefault;
      }
    });
    // Botón +/− del lote de temas: en Glass se ve más “sistema”
    const more = document.getElementById('theme-more-btn');
    if(more){
      if(more.dataset.iconDefault === undefined) more.dataset.iconDefault = more.textContent;
      // no forzar texto aquí: wireThemeBatches controla ＋/−
    }
      // Resaltar y dado: no dejar textos viejos del mapa Glass
    try{ if(typeof updateEasyBtn==='function') updateEasyBtn(); }catch(e){}
    try{ if(typeof seferUpdateDiceEmoji==='function') seferUpdateDiceEmoji(); }catch(e){}
  }catch(e){}
}

/* Segundo lote de temas (botón ＋ junto a themes) */
