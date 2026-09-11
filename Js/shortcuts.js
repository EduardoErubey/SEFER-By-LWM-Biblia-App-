/* SEFER module: shortcuts.js — script clásico (sin import/export) */

/* --- SEFER shortcuts.js lines 3508-3749 --- */
/* =========================================================
   COMPARAR TRADUCCIONES + ATAJOS + TEMA SIGUIENTE
   ========================================================= */
async function stageToggleCompare(){
  if(!stage || !stage.classList.contains('open')) return;
  if(stageMode === 'stack'){
    alert('En proyección de dos libros (arriba/abajo) no se usa comparar. Comparar es izquierda/derecha con otra traducción.');
    return;
  }
  const sel = document.getElementById('stage-compare-sel');
  if(stageCompareOn){
    stageCompareOn = false;
    stageMode = stagePassages[0] && stagePassages[0].verses && stagePassages[0].verses.length>1 ? 'selection' : 'single';
    if(stage) stage.classList.remove('stage-compare');
    if(sel) sel.style.display = 'none';
    renderStage();
    return;
  }
  // elegir segunda versión distinta a la actual
  let v = (sel && sel.value) || stageCompareVersion || 'nvi';
  if(v === currentBibleVersion){
    const alts = ['rv1960','nvi','ntv','tla','rva2015','rv1909'].filter(x=>x!==currentBibleVersion);
    v = alts[0] || 'nvi';
    if(sel) sel.value = v;
  }
  stageCompareVersion = v;
  try{
    if(typeof seferLoadBibleScript === 'function'){
      stageCompareData = await seferLoadBibleScript(v);
    } else {
      stageCompareData = seferGetGlobalBible(v);
    }
  }catch(e){
    alert('No se pudo cargar la segunda traducción. ¿Subiste bible-data-'+v+'.js?');
    return;
  }
  stageCompareOn = true;
  stageMode = 'compare';
  if(sel) sel.style.display = '';
  if(stage) stage.classList.add('stage-compare');
  renderStage();
}

function wireStageCompare(){
  const btn = document.getElementById('stage-compare-btn');
  const sel = document.getElementById('stage-compare-sel');
  if(btn) btn.addEventListener('click', (e)=>{ e.stopPropagation(); stageToggleCompare(); });
  if(sel){
    // no listar la versión actual como única
    sel.addEventListener('change', async ()=>{
      stageCompareVersion = sel.value;
      if(!stageCompareOn) return;
      try{
        stageCompareData = await seferLoadBibleScript(stageCompareVersion);
        renderStage();
      }catch(e){ alert('No se pudo cargar '+stageCompareVersion); }
    });
  }
}

const SEFER_THEME_CYCLE = ['mexico','corea','ucrania','reino','eden','lwm-day','lwm-night','arena','sandalo','amoled'];

function seferNextTheme(){
  const cur = (typeof currentTheme !== 'undefined' && currentTheme) ? currentTheme : 'mexico';
  let i = SEFER_THEME_CYCLE.indexOf(cur);
  if(i < 0) i = 0;
  const next = SEFER_THEME_CYCLE[(i + 1) % SEFER_THEME_CYCLE.length];
  // Activar lote correcto
  const batchB = ['lwm-day','lwm-night','arena','sandalo','amoled'];
  const wantB = batchB.indexOf(next) >= 0;
  try{
    store.set('bp_themes_more', wantB);
  }catch(e){}
  // Re-render theme dots si existe wire
  try{
    if(typeof wireThemeBatches === 'function'){ /* already IIFE */ }
  }catch(e){}
  currentTheme = next;
  document.body.setAttribute('data-theme', currentTheme);
  try{ store.set('bp_theme', currentTheme); }catch(e){}
  try{ if(typeof applyThemeIcons==='function') applyThemeIcons(); }catch(e){}
  // refrescar dots
  const batchEl = document.getElementById('theme-batch');
  const moreBtn = document.getElementById('theme-more-btn');
  if(batchEl){
    // trigger re-render by toggling more if needed
    const showB = wantB;
    if(moreBtn){
      moreBtn.classList.toggle('open', showB);
      moreBtn.textContent = showB ? '−' : '＋';
    }
    // rebuild dots from known batches if globals not available
    try{
      const flagUA = batchEl.querySelector('[data-t="ucrania"]');
      // click simulation: set via re-call of wireThemeBatches is hard; manual rebuild
    }catch(e){}
  }
  // Force theme batch UI by dispatching storage-compatible redraw
  try{ seferRedrawThemeBatch(wantB, next); }catch(e){ console.warn(e); }
}

function seferRedrawThemeBatch(showB, active){
  const batchEl = document.getElementById('theme-batch');
  const btn = document.getElementById('theme-more-btn');
  if(!batchEl) return;
  const flagUA = '<svg class="flag-svg" viewBox="0 0 36 24" width="20" height="14" aria-hidden="true"><rect width="36" height="12" y="0" fill="#0057B7"/><rect width="36" height="12" y="12" fill="#FFD700"/></svg>';
  const flagMX = '<svg class="flag-svg" viewBox="0 0 36 24" width="20" height="14" aria-hidden="true"><rect width="12" height="24" x="0" fill="#006847"/><rect width="12" height="24" x="12" fill="#fff"/><rect width="12" height="24" x="24" fill="#CE1126"/><circle cx="18" cy="12" r="3.2" fill="#006847"/></svg>';
  const flagKR = '<svg class="flag-svg" viewBox="0 0 36 24" width="20" height="14" aria-hidden="true"><rect width="36" height="24" fill="#fff" stroke="#ddd" stroke-width="0.5"/><circle cx="18" cy="12" r="5" fill="#CD2E3A"/><path d="M18 12a5 5 0 0 1 0-0.01 2.5 2.5 0 1 0 0 0.01z" fill="#0047A0"/></svg>';
  const A = [
    {t:'mexico', tip:'México', html:flagMX},{t:'corea', tip:'Corea', html:flagKR},{t:'ucrania', tip:'Ucrania', html:flagUA},
    {t:'reino', tip:'Reino', html:'👑'},{t:'eden', tip:'Edén', html:'🌿'}
  ];
  const B = [
    {t:'lwm-day', tip:'LWM-Day', html:'☀️'},{t:'lwm-night', tip:'LWM-Night', html:'🌙'},{t:'arena', tip:'Arena', html:'⏳'},
    {t:'sandalo', tip:'Sándalo', html:'🕯️'},{t:'amoled', tip:'Glass', html:'🫧'}
  ];
  const list = showB ? B : A;
  batchEl.innerHTML = list.map(item => '<div class="theme-dot" data-t="'+item.t+'" data-tooltip="'+item.tip+'">'+item.html+'</div>').join('');
  if(btn){ btn.classList.toggle('open', !!showB); btn.textContent = showB ? '−' : '＋'; }
  batchEl.querySelectorAll('.theme-dot').forEach(dot=>{
    dot.classList.toggle('active', dot.dataset.t === active);
    dot.onclick = ()=>{
      currentTheme = dot.dataset.t;
      document.body.setAttribute('data-theme', currentTheme);
      store.set('bp_theme', currentTheme);
      batchEl.querySelectorAll('.theme-dot').forEach(d=> d.classList.toggle('active', d.dataset.t===currentTheme));
      try{ applyThemeIcons(); }catch(e){}
      if(typeof scheduleDriveSave==='function') scheduleDriveSave();
    };
  });
}

function seferIsTypingTarget(t){
  if(!t) return false;
  const tag = (t.tagName||'').toUpperCase();
  if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if(t.isContentEditable) return true;
  return false;
}

function wireSeferShortcuts(){
  document.addEventListener('keydown', (e)=>{
    const ctrl = e.ctrlKey || e.metaKey;
    if(!ctrl) return;
    const typing = seferIsTypingTarget(e.target);
    const k = (e.key||'').toLowerCase();

    // Ctrl+Shift+V → foco buscador versículos
    if(e.shiftKey && k === 'v'){
      e.preventDefault();
      const rs = document.getElementById('ref-search');
      if(rs){ rs.focus(); rs.select(); }
      return;
    }
    // Ctrl+Shift+T → menú traducción
    if(e.shiftKey && k === 't'){
      e.preventDefault();
      const btn = document.getElementById('version-btn');
      const menu = document.getElementById('version-menu');
      if(btn && menu){
        menu.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        btn.focus();
      }
      return;
    }
    // Ctrl+Shift+F → fullscreen app
    if(e.shiftKey && k === 'f'){
      e.preventDefault();
      document.getElementById('fullscreen-btn')?.click();
      return;
    }
    if(e.shiftKey) return; // otras con shift no
    if(typing && k !== 'enter') return;

    if(k === 't' && !e.shiftKey){
      e.preventDefault();
      seferNextTheme();
      return;
    }
    if(k === '-' || k === '_'){
      e.preventDefault();
      document.getElementById('font-dec')?.click();
      return;
    }
    if(k === '+' || k === '='){
      e.preventDefault();
      document.getElementById('font-inc')?.click();
      return;
    }
    if(k === 'd'){ e.preventDefault(); document.getElementById('easy-btn')?.click(); return; }
    if(k === 's'){ e.preventDefault(); document.getElementById('meanings-btn')?.click(); return; }
    if(k === 'n'){ e.preventDefault(); document.getElementById('notes-btn')?.click(); return; }
    if(k === 'f'){ e.preventDefault(); document.getElementById('favs-btn')?.click(); return; }
    if(k === 'g'){ e.preventDefault(); document.getElementById('glossary-btn')?.click(); return; }
    if(k === 'b'){ e.preventDefault(); document.getElementById('biography-btn')?.click(); return; }
    if(k === 'a'){ e.preventDefault(); document.getElementById('apocrifos-btn')?.click(); return; }
    if(k === 'p'){ e.preventDefault(); document.getElementById('plan-btn')?.click(); return; }
    if(k === 'y'){ e.preventDefault(); document.getElementById('youtube-btn')?.click(); return; }
    if(k === 'h'){ e.preventDefault(); document.getElementById('help-btn')?.click(); return; }
    if(k === 'enter'){
      e.preventDefault();
      document.getElementById('project-btn')?.click();
      return;
    }
  }, true);
}


try{ wireStageCompare(); }catch(e){}
try{ wireSeferShortcuts(); }catch(e){}
try{ wireVersionSwitcher(); }catch(e){ console.warn('[SEFER] version switcher', e); }
try{ seferUpdateDiceEmoji(); }catch(e){}
try{ updateEasyBtn(); }catch(e){}
renderBookList();
showWelcomeScreen();
tryLoadLocalFiles().then(()=>{ /* notas/favs desde carpetas locales si existen */ });

// Tamaño de fuente de versículos
document.getElementById('font-inc').onclick = ()=>{
  verseFontSize = Math.min(32, verseFontSize + 1);
  store.set('bp_verse_font', verseFontSize);
  applyVerseFont();
};
document.getElementById('font-dec').onclick = ()=>{
  verseFontSize = Math.max(12, verseFontSize - 1);
  store.set('bp_verse_font', verseFontSize);
  applyVerseFont();
};
try{ setupFontFamilyMenu(); }catch(e){}
try{ setupReaderScrollArrows(); }catch(e){}
try{ applyVerseFont(); }catch(e){}

// Lectura fácil
updateEasyBtn();
document.getElementById('easy-btn').onclick = ()=>{
  easyReading = !easyReading; try{ if(easyReading && typeof setAchProgress==='function') setAchProgress('detail_1',1); }catch(e){};
  store.set('bp_easy_reading', easyReading);
  updateEasyBtn();
  if(!showWelcome) renderReader();
};

