/* SEFER module: versions.js — script clásico (sin import/export) */

/* --- SEFER versions.js lines 3335-3502 --- */
/* =========================================================
   SELECTOR DE VERSIÓN BÍBLICA
   ========================================================= */
const SEFER_VERSION_FILES = {
  rv1960:  './bible/bible-data-rv1960.js',
  rv1909:  './bible/bible-data-rv1909.js',
  nvi:     './bible/bible-data-nvi.js',
  ntv:     './bible/bible-data-ntv.js',
  tla:     './bible/bible-data-tla.js',
  rva2015: './bible/bible-data-rva2015.js'
};
const SEFER_VERSION_META = {
  rv1960:  { short:'RV1960',  label:'Reina-Valera 1960' },
  rv1909:  { short:'RV1909',  label:'Reina-Valera 1909' },
  rva2015: { short:'RV2015',  label:'Reina Valera 2015' },
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
  try{ BIBLE = data; }catch(e){ window.BIBLE = data; }
  window.BIBLE = data;
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
    try{ if(typeof renderBookList === 'function') renderBookList(); }catch(e){}
    if(typeof renderReader === 'function' && currentBook && (BIBLE[currentBook] || (window.BIBLE||{})[currentBook])){
      try{ renderReader(); }catch(e){ console.warn(e); }
    }
    if(!opts.silent && typeof setNubeStatus === 'function'){
      /* no spamear nube */
    }
  }catch(err){
    console.error('[SEFER] versión', err);
    alert('No se pudo cargar la versión seleccionada. ¿Subiste los archivos en la carpeta bible/ (bible-data-*.js, etc.)?\n\n'+err.message);
  }
}

function wireVersionSwitcher(){
  const btn = document.getElementById('version-btn');
  let menu = document.getElementById('version-menu');
  if(!btn || !menu){ console.warn('[SEFER] version-btn o version-menu no encontrados'); return; }
  if(menu.parentElement !== document.body) document.body.appendChild(menu);

  function placeVersionMenu(){
    const r = btn.getBoundingClientRect();
    menu.style.cssText = [
      'position:fixed',
      'z-index:10060',
      'display:block',
      'width:max-content',
      'min-width:0',
      'max-width:min(320px, 92vw)',
      'box-sizing:border-box',
      'right:auto',
      'bottom:auto',
      'visibility:hidden',
      'left:0',
      'top:0'
    ].join(';');
    menu.classList.add('open');
    const mw = Math.max(menu.offsetWidth || 0, 140);
    const mh = menu.offsetHeight || 40;
    let left = r.left;
    let top = r.bottom + 4;
    if(left + mw > window.innerWidth - 6) left = Math.max(6, window.innerWidth - mw - 6);
    if(top + mh > window.innerHeight - 6) top = Math.max(6, r.top - mh - 4);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.style.visibility = 'visible';
  }
  function closeVersionMenu(){
    menu.classList.remove('open');
    menu.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
  }
  function openVersionMenu(){
    document.querySelectorAll('#font-family-menu.open').forEach(function(m){ m.classList.remove('open'); });
    placeVersionMenu();
    btn.setAttribute('aria-expanded', 'true');
  }
  function toggleVersionMenu(e){
    if(e){ e.preventDefault(); e.stopPropagation(); }
    if(menu.classList.contains('open') && menu.style.display !== 'none') closeVersionMenu();
    else openVersionMenu();
  }

  seferUpdateVersionUI();
  btn.onclick = toggleVersionMenu;
  btn.onkeydown = function(e){
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleVersionMenu(e); }
  };
  menu.querySelectorAll('.ver-item').forEach(function(el){
    el.onclick = function(e){
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-version') || el.dataset.version;
      closeVersionMenu();
      if(id) seferSetBibleVersion(id);
    };
  });
  document.addEventListener('click', function(e){
    if(!menu.classList.contains('open')) return;
    if(menu.contains(e.target) || btn.contains(e.target)) return;
    closeVersionMenu();
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
