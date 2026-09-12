
function seferUpdateDiceEmoji(){
  try{
    const glass = (typeof currentTheme !== 'undefined' && ['amoled','lwm-night','mexico','ucrania','corea'].includes(currentTheme));
    const emoji = glass ? '🔀' : '🎲';
    const tip = glass ? 'Versículo al azar (barajar)' : 'Versículo aleatorio';
    const main = document.getElementById('random-verse-btn');
    if(main){ main.textContent = emoji; main.setAttribute('data-tooltip', tip); main.title = tip; }
    const stageDice = document.getElementById('stage-dice-btn');
    if(stageDice){ stageDice.textContent = emoji; stageDice.title = glass ? 'Otro al azar' : 'Otro versículo al azar'; }
  }catch(e){}
}
window.seferUpdateDiceEmoji = seferUpdateDiceEmoji;
/* SEFER module: themes.js — script clásico (sin import/export) */

/* --- SEFER themes.js lines 254-406 --- */
/* =========================================================
   TEMAS
   ========================================================= */
document.body.setAttribute('data-theme', currentTheme);
try{
  const GLASS = ['amoled','lwm-night','mexico','ucrania','corea'];
  document.body.classList.toggle('theme-glass', GLASS.includes(currentTheme));
}catch(e){}
try{ if(typeof applyThemeIcons==='function') applyThemeIcons(); }catch(e){}
/* theme dots se enlazan en wireThemeBatches() */

/* Modo móvil / PC */
// Si el usuario nunca eligió manualmente, se activa solo en pantallas
// angostas (celulares), respetando luego cualquier elección manual.
const MOBILE_DEFAULT = false;
let mobileMode = false; // solo escritorio

// Reordena el DOM real (sin clonar nodos) para que el modo móvil quede:
// 1) logo+botones · 2) bienvenida/lector · 3) testamentos · 4) temas+buscador.
// Al usar los mismos elementos (no copias), todos los listeners ya
// asignados (tema, búsqueda, navegación) se conservan intactos.
function layoutForMobile(){
  const app = document.getElementById('app');
  const mobileHeader = document.getElementById('mobile-header');
  const mobileFooterThemes = document.getElementById('mobile-footer-themes');
  const mobileFooterSearch = document.getElementById('mobile-footer-search');
  const mobileFooter = document.getElementById('mobile-footer');
  const navHeaderRow = document.getElementById('nav-header-row');
  const themeSwitch = document.getElementById('theme-switch');
  const refSearchWrap = document.getElementById('ref-search-wrap');
  const wordWrap = document.getElementById('mobile-word-search-wrap');
  const nav = document.getElementById('nav');
  const main = document.getElementById('main');
  if(!app || !mobileHeader || !navHeaderRow) return;

  mobileHeader.appendChild(navHeaderRow);
  if(wordWrap){
    wordWrap.style.display = 'block';
    mobileHeader.appendChild(wordWrap);
  }
  mobileFooterThemes.appendChild(themeSwitch);
  mobileFooterSearch.appendChild(refSearchWrap);
  [mobileHeader, main, nav, mobileFooter].forEach(el => app.appendChild(el));
}

// Restaura el orden original de escritorio (barra lateral #nav a la
// izquierda con su encabezado completo, #main a la derecha).
function layoutForDesktop(){
  const app = document.getElementById('app');
  const navHeader = document.getElementById('nav-header');
  const navHeaderRow = document.getElementById('nav-header-row');
  const themeSwitch = document.getElementById('theme-switch');
  const refSearchWrap = document.getElementById('ref-search-wrap');
  const wordWrap = document.getElementById('mobile-word-search-wrap');
  const nav = document.getElementById('nav');
  const main = document.getElementById('main');
  if(!app || !navHeader || !navHeaderRow) return;

  if(wordWrap) wordWrap.style.display = 'none';
  navHeader.appendChild(navHeaderRow);
  navHeader.appendChild(themeSwitch);
  navHeader.appendChild(refSearchWrap);
  [nav, main].forEach(el => app.appendChild(el));
}

/* —— Detección de resolución al cargar y al redimensionar —— */
function applyViewportLayout(){
  const w = window.innerWidth || document.documentElement.clientWidth || 1200;
  const h = window.innerHeight || document.documentElement.clientHeight || 800;
  document.body.classList.remove('vp-narrow', 'vp-medium', 'vp-wide');
  if(w < 1100) document.body.classList.add('vp-narrow');
  else if(w < 1400) document.body.classList.add('vp-medium');
  else document.body.classList.add('vp-wide');
  document.documentElement.style.setProperty('--vp-w', w + 'px');
  document.documentElement.style.setProperty('--vp-h', h + 'px');
  // Evitar desbordes (franjas negras en fullscreen / dado)
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
applyViewportLayout();
let _vpTimer = null;
window.addEventListener('resize', ()=>{
  clearTimeout(_vpTimer);
  _vpTimer = setTimeout(applyViewportLayout, 120);
});
window.addEventListener('orientationchange', ()=> setTimeout(applyViewportLayout, 200));

function applyMobileMode(){
  mobileMode = false; // forzado escritorio
  document.body.classList.remove('mobile-mode');
  if(mobileMode) layoutForMobile(); else layoutForDesktop();
  const btn = document.getElementById('mobile-toggle');
  if(btn){
    btn.classList.toggle('active', mobileMode);
    btn.textContent = mobileMode ? '💻' : '📱';
    btn.setAttribute('data-tooltip', mobileMode ? 'Modo PC' : 'Modo móvil');
    btn.title = mobileMode ? 'Volver a modo horizontal (PC)' : 'Modo vertical para smartphone';
  }
  // Re-render welcome if showing, to switch mobile/desktop text
  if(typeof showWelcome !== 'undefined' && showWelcome && typeof showWelcomeScreen === 'function'){
    showWelcomeScreen();
updateProjectBtnVisibility();
  }
  store.set('bp_mobile_mode', mobileMode);
}
applyMobileMode();
const _mobToggle = document.getElementById('mobile-toggle');
if(_mobToggle){ _mobToggle.onclick = ()=>{ mobileMode = false; applyMobileMode(); }; }

/* ← → expandir/contraer testamento o libro enfocado */
document.addEventListener('keydown', (e)=>{
  if(e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const modal = document.getElementById('info-modal');
  if(modal && modal.classList.contains('open')) return;
  if(stage && stage.classList.contains('open')) return;
  const t = e.target;
  if(t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

  // Libro enfocado
  const bookEl = t && t.closest && t.closest('.book-item');
  if(bookEl){
    const name = (bookEl.querySelector('span')?.textContent || '').replace(/[▾▸]/g,'').trim();
    if(!name || !BIBLE[name]) return;
    e.preventDefault();
    if(e.key === 'ArrowRight'){
      openBooks.add(name);
      openTestaments.add(BOOK_ORDER.find(x=>x.name===name)?.testament || 'AT');
      if(name !== currentBook || showWelcome){
        const chaps = Object.keys(BIBLE[name]).sort((a,b)=>+a-+b);
        goTo(name, chaps[0]);
      }
      saveNavState();
      renderBookList();
    } else {
      openBooks.delete(name);
      saveNavState();
      renderBookList();
    }
    return;
  }
  // Testamento enfocado
  const testEl = t && t.closest && t.closest('.t-label-text');
  if(testEl){
    e.preventDefault();
    const isAT = /Antiguo/i.test(testEl.textContent);
    const tid = isAT ? 'AT' : 'NT';
    if(e.key === 'ArrowRight') openTestaments.add(tid);
    else openTestaments.delete(tid);
    saveNavState();
    renderBookList();
  }
});


/* --- SEFER themes.js lines 3932-3996 --- */
(function wireThemeBatches(){
  const flagUA = '<svg class="flag-svg" viewBox="0 0 36 24" width="20" height="14" aria-hidden="true"><rect width="36" height="12" y="0" fill="#0057B7"/><rect width="36" height="12" y="12" fill="#FFD700"/></svg>';
  const flagMX = '<svg class="flag-svg" viewBox="0 0 36 24" width="20" height="14" aria-hidden="true"><rect width="12" height="24" x="0" fill="#006847"/><rect width="12" height="24" x="12" fill="#fff"/><rect width="12" height="24" x="24" fill="#CE1126"/><circle cx="18" cy="12" r="3.2" fill="#006847"/></svg>';
  const flagKR = '<svg class="flag-svg" viewBox="0 0 36 24" width="20" height="14" aria-hidden="true"><rect width="36" height="24" fill="#fff" stroke="#ddd" stroke-width="0.5"/><circle cx="18" cy="12" r="5" fill="#CD2E3A"/><path d="M18 12a5 5 0 0 1 0-0.01 2.5 2.5 0 1 0 0 0.01z" fill="#0047A0"/><g fill="#000"><rect x="6" y="4" width="5" height="1.2"/><rect x="6" y="6" width="2" height="1.2"/><rect x="9" y="6" width="2" height="1.2"/><rect x="6" y="8" width="5" height="1.2"/><rect x="25" y="4" width="5" height="1.2"/><rect x="25" y="6.6" width="5" height="1.2"/><rect x="25" y="9.2" width="5" height="1.2"/><rect x="6" y="14.5" width="5" height="1.2"/><rect x="6" y="17.1" width="2" height="1.2"/><rect x="9" y="17.1" width="2" height="1.2"/><rect x="6" y="19.7" width="5" height="1.2"/><rect x="25" y="14.5" width="2" height="1.2"/><rect x="28" y="14.5" width="2" height="1.2"/><rect x="25" y="17.1" width="5" height="1.2"/><rect x="25" y="19.7" width="2" height="1.2"/><rect x="28" y="19.7" width="2" height="1.2"/></g></svg>';
  const BATCH_A = [
    {t:'lwm-day', tip:'Life Word Mission', html:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#ffffff" stroke="#5a6a7a" stroke-width="0.6" d="M4.2 13.5c2.4-1.1 4.1-2.2 5.5-4.1.3 1.6 1.2 2.9 2.6 3.7-1.5.4-2.7 1.2-3.5 2.4-.3.5-.2 1.1.3 1.4.5.3 1.1.1 1.4-.3.9-1.4 2.5-2.1 4.2-2.1h.6c1.5 0 2.9.5 4 1.5.4.4 1 .4 1.3 0 .4-.4.3-1 0-1.3-1.1-1.2-2.6-1.9-4.2-2.1 1.6-1.2 2.5-3.1 2.4-5.2 0-.6-.5-1-1-1-.6 0-1 .4-1 1 0 1.5-.6 2.8-1.7 3.7-1.1-1.5-2.6-2.5-4.3-2.8-.6-.1-1.1.3-1.2.9-.1.5.3 1 .9 1.1.9.2 1.7.6 2.3 1.2-1.5.2-2.9.8-4 1.8-1.3 1.2-2.9 2.1-4.6 2.6-.5.2-.8.7-.6 1.2.2.5.7.8 1.2.6z"/></svg>'},
    {t:'eden', tip:'Edén', html:'🌿'},
    {t:'sandalo', tip:'Sándalo', html:'🕯️'},
    {t:'reino', tip:'Reino', html:'👑'},
    {t:'arena', tip:'Arena', html:'⏳'}
  ];
  const BATCH_B = [
    {t:'amoled', tip:'Day Glass', html:'🫧'},
    {t:'lwm-night', tip:'Night Glass', html:'🌙'},
    {t:'mexico', tip:'Mex Glass', html:flagMX},
    {t:'ucrania', tip:'Ukr Glass', html:flagUA},
    {t:'corea', tip:'Kor Glass', html:flagKR}
  ];
  const batchEl = document.getElementById('theme-batch');
  const btn = document.getElementById('theme-more-btn');
  if(!batchEl || !btn) return;

  // +/− encima del tema 1; reservar hueco antiguo con visibility:hidden
  const themeSwitch = document.getElementById('theme-switch');
  if(themeSwitch && btn && batchEl){
    let topRow = document.getElementById('theme-batch-top');
    if(!topRow){
      topRow = document.createElement('div');
      topRow.id = 'theme-batch-top';
      topRow.className = 'theme-batch-top';
      themeSwitch.insertBefore(topRow, batchEl);
    }
    if(btn.parentElement !== topRow) topRow.appendChild(btn);
    let spacer = document.getElementById('theme-more-spacer');
    if(!spacer){
      spacer = document.createElement('span');
      spacer.id = 'theme-more-spacer';
      spacer.className = 'theme-more-spacer';
      spacer.setAttribute('aria-hidden','true');
      // colocar spacer donde estaba el botón (junto a dados/lote)
      const dice = document.getElementById('random-verse-btn');
      if(dice && dice.parentElement) dice.parentElement.insertBefore(spacer, dice);
      else themeSwitch.appendChild(spacer);
    }
  }


  let showB = !!store.get('bp_themes_more', false);
  if(BATCH_B.some(x => x.t === currentTheme)) showB = true;
  if(BATCH_A.some(x => x.t === currentTheme)) showB = false;

  function bindDots(){
    batchEl.querySelectorAll('.theme-dot').forEach(dot=>{
      dot.tabIndex = 0;
      dot.setAttribute('role','button');
      dot.classList.toggle('active', dot.dataset.t === currentTheme);
      const applyTheme = ()=>{
        currentTheme = dot.dataset.t;
        document.body.setAttribute('data-theme', currentTheme);
        try{
          const GLASS = ['amoled','lwm-night','mexico','ucrania','corea'];
          document.body.classList.toggle('theme-glass', GLASS.includes(currentTheme));
        }catch(e){}
        batchEl.querySelectorAll('.theme-dot').forEach(d=> d.classList.toggle('active', d.dataset.t===currentTheme));
        store.set('bp_theme', currentTheme);
        try{ applyThemeIcons(); }catch(e){}
        if(typeof scheduleDriveSave==='function') scheduleDriveSave();
        try{ if(typeof trackThemeTried==='function') trackThemeTried(currentTheme); }catch(e){}
      };
      dot.onclick = applyTheme;
      dot.onkeydown = (e)=>{
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); applyTheme(); }
      };
    });
  }
  function render(){
    const list = showB ? BATCH_B : BATCH_A;
    batchEl.innerHTML = list.map(item =>
      '<div class="theme-dot" data-t="'+item.t+'" data-tooltip="'+item.tip+'">'+item.html+'</div>'
    ).join('');
    btn.classList.toggle('open', showB);
    btn.textContent = showB ? '−' : '＋';
    btn.title = showB ? 'Ver primer lote de temas' : 'Ver segundo lote de temas';
    bindDots();
  }
  btn.onclick = ()=>{
    showB = !showB;
    store.set('bp_themes_more', showB);
    render();
  };
  render();
  try{ applyThemeIcons(); }catch(e){}
})();


/* Destacar label after theme icons */
(function(){
  const wrap = function(fn){
    return function(){
      const r = fn && fn.apply(this, arguments);
      try{ if(typeof updateEasyBtn==='function') updateEasyBtn(); }catch(e){}
      try{ if(typeof seferUpdateDiceEmoji==='function') seferUpdateDiceEmoji(); }catch(e){}
      return r;
    };
  };
  if(typeof applyThemeIcons === 'function'){
    applyThemeIcons = wrap(applyThemeIcons);
    window.applyThemeIcons = applyThemeIcons;
  }
})();
