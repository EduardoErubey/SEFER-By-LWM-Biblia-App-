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
  console.info('[SEFER] boot OK', typeof SEFER_VERSION!=='undefined'?SEFER_VERSION:'');
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
      if(window.BIBLE_DATA){
        if(typeof BIBLE !== 'undefined') BIBLE = window.BIBLE_DATA;
        window.BIBLE = window.BIBLE_DATA;
      }
    }catch(e){}
  }
  function start(){
    syncBible();
    try{
      if(typeof seferBoot === 'function') seferBoot();
    }catch(e){ console.error('[SEFER] boot', e); }
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
