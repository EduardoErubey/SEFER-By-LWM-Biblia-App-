/* SEFER module: versions.js — script clásico (sin import/export) */

/* --- SEFER versions.js lines 3335-3502 --- */
/* =========================================================
   SELECTOR DE VERSIÓN BÍBLICA
   ========================================================= */
const SEFER_VERSION_FILES = {
  rv1960:  './bible-data-rv1960.js',
  rv1909:  './bible-data-rv1909.js',
  nvi:     './bible-data-nvi.js',
  ntv:     './bible-data-ntv.js',
  tla:     './bible-data-tla.js',
  rva2015: './bible-data-rva2015.js'
};
const SEFER_VERSION_META = {
  rv1960:  { short:'RV60',  label:'Reina-Valera 1960' },
  rv1909:  { short:'RV09',  label:'Reina-Valera 1909' },
  rva2015: { short:'RV15',  label:'Reina Valera 2015' },
  nvi:     { short:'NVI',   label:'Nueva Versión Internacional' },
  ntv:     { short:'NTV',   label:'Nueva Traducción Viviente' },
  tla:     { short:'TLA',   label:'Traducción en Lenguaje Actual' }
};
let currentBibleVersion = (function(){
  try {
    const v = (store && store.get) ? store.get('bp_bible_version', 'rv1960') : 'rv1960';
    return SEFER_VERSION_FILES[v] ? v : 'rv1960';
  } catch(e){ return 'rv1960'; }
})();
const _bibleLoadPromises = {};

function seferGetGlobalBible(id){
  const map = {
    rv1960: window.BIBLE_DATA_RV1960,
    rv1909: window.BIBLE_DATA_RV1909,
    nvi: window.BIBLE_DATA_NVI,
    ntv: window.BIBLE_DATA_NTV,
    tla: window.BIBLE_DATA_TLA,
    rva2015: window.BIBLE_DATA_RVA2015
  };
  return map[id] || null;
}

function seferLoadBibleScript(id){
  if(seferGetGlobalBible(id)) return Promise.resolve(seferGetGlobalBible(id));
  if(_bibleLoadPromises[id]) return _bibleLoadPromises[id];
  const src = SEFER_VERSION_FILES[id];
  if(!src) return Promise.reject(new Error('Versión desconocida: '+id));
  _bibleLoadPromises[id] = new Promise((resolve, reject)=>{
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = ()=>{
      const data = seferGetGlobalBible(id);
      if(data) resolve(data);
      else reject(new Error('No se cargó '+id));
    };
    s.onerror = ()=> reject(new Error('Error de red al cargar '+src));
    document.head.appendChild(s);
  });
  return _bibleLoadPromises[id];
}

function seferApplyBibleData(data){
  if(!data || typeof data !== 'object') return;
  BIBLE = data;
  window.BIBLE_DATA = data;
}

function seferUpdateVersionUI(){
  const meta = SEFER_VERSION_META[currentBibleVersion] || SEFER_VERSION_META.rv1960;
  const btn = document.getElementById('version-btn');
  const label = btn && btn.querySelector('.vb-label');
  // etiqueta corta para que quepa en toolkit
  if(label) label.textContent = meta.short || currentBibleVersion;
  if(btn) btn.title = (meta.short || '') + ' · ' + (meta.label || '') + ' (Ctrl+Shift+T)';
  document.querySelectorAll('#version-menu .ver-item, body > #version-menu .ver-item').forEach(el=>{
    el.classList.toggle('active', el.dataset.version === currentBibleVersion);
  });
}

async function seferSetBibleVersion(id, opts){
  opts = opts || {};
  if(!SEFER_VERSION_FILES[id]) id = 'rv1960';
  try{
    const data = await seferLoadBibleScript(id);
    seferApplyBibleData(data);
    currentBibleVersion = id;
    try{ store.set('bp_bible_version', id); }catch(e){}
    seferUpdateVersionUI();
    // Cerrar menú
    const menu = document.getElementById('version-menu');
    const btn = document.getElementById('version-btn');
    if(menu) menu.classList.remove('open');
    if(btn) btn.setAttribute('aria-expanded','false');
    // Re-render capítulo actual si hay datos
    if(typeof renderReader === 'function' && currentBook && BIBLE[currentBook]){
      try{ renderReader(); }catch(e){ console.warn(e); }
    } else if(typeof renderBookList === 'function'){
      try{ renderBookList(); }catch(e){}
    }
    if(!opts.silent && typeof setNubeStatus === 'function'){
      /* no spamear nube */
    }
  }catch(err){
    console.error('[SEFER] versión', err);
    alert('No se pudo cargar la versión seleccionada. ¿Subiste los archivos bible-data-*.js al repositorio?\n\n'+err.message);
  }
}

function wireVersionSwitcher(){
  const btn = document.getElementById('version-btn');
  let menu = document.getElementById('version-menu');
  if(!btn || !menu) return;
  // Mover menú a body para no quedar recortado por overflow de toolkit
  if(menu.parentElement !== document.body){
    document.body.appendChild(menu);
  }
  seferUpdateVersionUI();
  function placeVersionMenu(){
    const r = btn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.left = Math.max(6, Math.min(r.left, window.innerWidth - 240)) + 'px';
    menu.style.top = (r.bottom + 4) + 'px';
    menu.style.right = 'auto';
    menu.style.minWidth = '220px';
    menu.style.zIndex = '5000';
  }
  btn.onclick = function(e){
    e.preventDefault();
    e.stopPropagation();
    const open = !menu.classList.contains('open');
    document.querySelectorAll('#font-family-menu.open').forEach(m=>m.classList.remove('open'));
    if(open){
      placeVersionMenu();
      menu.classList.add('open');
      btn.setAttribute('aria-expanded','true');
    } else {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
    }
  };
  menu.querySelectorAll('.ver-item').forEach(el=>{
    el.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      const id = el.dataset.version;
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded','false');
      if(id) seferSetBibleVersion(id);
    };
  });
  document.addEventListener('click', function(e){
    if(!menu.classList.contains('open')) return;
    if(menu.contains(e.target) || btn.contains(e.target)) return;
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  });
  window.addEventListener('resize', function(){
    if(menu.classList.contains('open')) placeVersionMenu();
  });
  try{
    if(currentBibleVersion && currentBibleVersion !== 'rv1960'){
      seferSetBibleVersion(currentBibleVersion, {silent:true});
    } else if(window.BIBLE_DATA_RV1960){
      seferApplyBibleData(window.BIBLE_DATA_RV1960);
    } else if(window.BIBLE_DATA){
      seferApplyBibleData(window.BIBLE_DATA);
    }
  }catch(err){ console.warn('[SEFER] version init', err); }
}

