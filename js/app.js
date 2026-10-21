/* SEFER module: app.js — script clásico (sin import/export) */

/* --- SEFER app.js lines 3322-3334 --- */
/* =========================================================
   SERMONES — DESHABILITADOS (funcionalidad eliminada temporalmente)
   ========================================================= */
let customSermons = [];
function saveCustomSermons(){}
function exportSermonsFile(){}
function openSermonsPanel(){
  alert('La función de Sermones ha sido deshabilitada temporalmente.');
}
function openSermonDetail(){}
function openSermonEditor(){}



/* --- SEFER app.js lines 3503-3507 --- */
/* =========================================================
   INIT
   ========================================================= */
// Inicio: pantalla de bienvenida (sin capítulo abierto)


/* --- arranque --- */
function seferBoot(){
  try{ if(typeof applyViewportLayout==='function') applyViewportLayout(); }catch(e){}
  try{ if(typeof applyThemeIcons==='function') applyThemeIcons(); }catch(e){}
  try{ if(typeof updateEasyBtn==='function') updateEasyBtn(); }catch(e){}
  try{ if(typeof seferUpdateDiceEmoji==='function') seferUpdateDiceEmoji(); }catch(e){}
  try{ if(typeof setupFontFamilyMenu==='function') setupFontFamilyMenu(); }catch(e){}
  try{ if(typeof wireVersionSwitcher==='function') wireVersionSwitcher(); }catch(e){}
  try{ if(typeof wireSeferShortcuts==='function') wireSeferShortcuts(); }catch(e){}
  try{ if(typeof wireStageCompare==='function') wireStageCompare(); }catch(e){}
  try{ if(typeof bootGoogle==='function') bootGoogle(); }catch(e){}
  try{ if(typeof renderBookList==='function') renderBookList(); }catch(e){}
  try{ if(typeof showWelcomeScreen==='function' && typeof showWelcome!=='undefined' && showWelcome) showWelcomeScreen(); }catch(e){}
  console.info('[SIFRIÁ] boot OK', typeof SEFER_VERSION!=='undefined'?SEFER_VERSION:'');
}
window.seferBoot = seferBoot;
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', seferBoot);
} else {
}

try{
  const GLASS = ['amoled','lwm-night','mexico','ucrania','corea'];
  if(typeof currentTheme !== 'undefined'){
    document.body.classList.toggle('theme-glass', GLASS.includes(currentTheme));
  }
}catch(e){}

/* SEFER_WAIT_BIBLE_BOOT */
(function(){
  function syncBible(){
    try{
      if(window.BIBLE_DATA && Object.keys(window.BIBLE_DATA).length){
        try{ BIBLE = window.BIBLE_DATA; }catch(e){}
        window.BIBLE = window.BIBLE_DATA;
      } else if(window.BIBLE_DATA_RV1960){
        try{ BIBLE = window.BIBLE_DATA_RV1960; }catch(e){}
        window.BIBLE = window.BIBLE_DATA_RV1960;
        window.BIBLE_DATA = window.BIBLE_DATA_RV1960;
      }
      if(typeof BOOK_ORDER !== 'undefined' && window.BOOK_ORDER && window.BOOK_ORDER.length){
        if(BOOK_ORDER.length !== window.BOOK_ORDER.length){
          BOOK_ORDER.length = 0;
          Array.prototype.push.apply(BOOK_ORDER, window.BOOK_ORDER);
        }
      }
      if(typeof BOOK_INFO !== 'undefined' && window.BOOK_INFO && window.BOOK_INFO.libros && window.BOOK_INFO.libros.length){
        BOOK_INFO.libros = window.BOOK_INFO.libros;
        BOOK_INFO.introduccion_testamentos = window.BOOK_INFO.introduccion_testamentos || [];
        if(typeof BOOK_INFO_MAP !== 'undefined'){
          Object.keys(BOOK_INFO_MAP).forEach(k=>delete BOOK_INFO_MAP[k]);
          BOOK_INFO.libros.forEach(function(b){ BOOK_INFO_MAP[b.libro] = b; });
        }
        if(typeof TESTAMENT_INFO !== 'undefined'){
          (BOOK_INFO.introduccion_testamentos||[]).forEach(function(t){
            if(t.seccion && t.seccion.indexOf('Antiguo') >= 0) TESTAMENT_INFO.AT = t;
            if(t.seccion && t.seccion.indexOf('Nuevo') >= 0) TESTAMENT_INFO.NT = t;
          });
        }
      }
      try{ if(typeof buildInfoNavList === 'function') buildInfoNavList(); }catch(e){}
    }catch(e){ console.warn('[SIFRIÁ] syncBible', e); }
  }
  function start(){
    syncBible();
    try{
      if(typeof seferBoot === 'function') seferBoot();
    }catch(e){ console.error('[SIFRIÁ] boot', e); }
    try{
      if(typeof renderBookList === 'function') renderBookList();
    }catch(e){}
  }
  if(window.__SEFER_BIBLE_READY && typeof window.__SEFER_BIBLE_READY.then === 'function'){
    window.__SEFER_BIBLE_READY.then(start).catch(start);
  } else {
    // scripts clásicos síncronos
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
  }
})();


/* Ajusta la toolkit si aún no caben todos los botones */

function seferFitToolkit(){
  try{
    var bar = document.getElementById('topbar');
    var actions = document.getElementById('topbar-actions');
    if(!bar || !actions) return;

    /* Quitar escala previa (causaba desacomodo en 2.º monitor / TV) */
    actions.style.transform = '';
    actions.style.transformOrigin = '';
    actions.style.width = '';
    bar.classList.remove('tk-density-0','tk-density-1','tk-density-2','tk-density-3');

    var avail = Math.max(40, bar.clientWidth - 8);
    /* medir sin compactar */
    var need = actions.scrollWidth;
    var ratio = need > 0 ? (avail / need) : 1;
    var dens = 0;
    if(ratio < 0.98) dens = 1;
    if(ratio < 0.88) dens = 2;
    if(ratio < 0.78) dens = 3;
    if(dens > 0) bar.classList.add('tk-density-' + dens);

    /* Si aún no cabe, permitir wrap controlado (última opción) */
    if(actions.scrollWidth > bar.clientWidth - 4){
      bar.classList.add('tk-density-wrap');
    } else {
      bar.classList.remove('tk-density-wrap');
    }
  }catch(e){}
}
window.seferFitToolkit = seferFitToolkit;

function seferBindDisplayFit(){
  var t = null;
  function run(){
    if(t) clearTimeout(t);
    t = setTimeout(function(){
      seferFitToolkit();
      try{
        if(typeof applyViewportClass === 'function') applyViewportClass();
        else if(typeof window.applyViewportClass === 'function') window.applyViewportClass();
      }catch(e){}
    }, 60);
  }
  window.addEventListener('resize', run);
  window.addEventListener('orientationchange', run);
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', run);
    window.visualViewport.addEventListener('scroll', run);
  }
  /* al volver a la pestaña / cambiar de monitor */
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) run(); });
  run();
  setTimeout(run, 200);
  setTimeout(run, 600);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', seferBindDisplayFit);
} else {
  seferBindDisplayFit();
}
