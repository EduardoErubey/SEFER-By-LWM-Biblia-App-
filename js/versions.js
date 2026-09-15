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
    if(menu){
      menu.classList.remove('open');
      try{ menu.style.setProperty('display','none','important'); }catch(e){}
    }
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
  const menu = document.getElementById('version-menu');
  if(!btn || !menu){
    setTimeout(function(){ try{ wireVersionSwitcher(); }catch(e){} }, 250);
    return;
  }
  if(btn.dataset.seferWired === '1') return;
  btn.dataset.seferWired = '1';

  const host = document.getElementById('version-switch') || btn.parentElement;
  if(host && menu.parentElement !== host) host.appendChild(menu);

  function hideMenu(){
    menu.classList.remove('open');
    menu.style.setProperty('display', 'none', 'important');
    menu.style.setProperty('visibility', 'hidden', 'important');
    btn.setAttribute('aria-expanded', 'false');
  }
  function showMenu(){
    if(menu.parentElement !== document.body) document.body.appendChild(menu);

    try{ document.querySelectorAll('#font-family-menu.open').forEach(function(m){ m.classList.remove('open'); }); }catch(e){}
    const r = btn.getBoundingClientRect();
    menu.classList.add('open');
    menu.style.setProperty('display', 'block', 'important');
    menu.style.setProperty('visibility', 'visible', 'important');
    menu.style.setProperty('opacity', '1', 'important');
    menu.style.setProperty('position', 'fixed', 'important');
    menu.style.setProperty('z-index', '2147483646', 'important');
    menu.style.setProperty('pointer-events', 'auto', 'important');
    menu.style.setProperty('width', 'max-content', 'important');
    menu.style.setProperty('min-width', '160px', 'important');
    menu.style.setProperty('max-width', 'min(320px, 92vw)', 'important');
    var solid = (getComputedStyle(document.body).getPropertyValue('--menu-solid-bg') || '').trim()
      || (getComputedStyle(document.body).getPropertyValue('--card-bg') || '').trim()
      || '#f0f4fa';
    // Si card-bg es rgba semitransparente, forzar sólido claro
    if(/^rgba\(/i.test(solid) && solid.indexOf(',0.')>=0) solid = '#f0f4fa';
    if(document.body.getAttribute('data-theme')==='lwm-night') solid = (getComputedStyle(document.body).getPropertyValue('--menu-solid-bg')||'#152538').trim() || '#152538';
    menu.style.setProperty('background', solid, 'important');
    menu.style.setProperty('background-color', solid, 'important');
    menu.style.setProperty('color', 'var(--ink, #eee)', 'important');
    menu.style.setProperty('border', '1px solid var(--line, #666)', 'important');
    menu.style.setProperty('border-radius', '10px', 'important');
    menu.style.setProperty('box-shadow', '0 12px 36px rgba(0,0,0,0.45)', 'important');
    menu.style.setProperty('padding', '8px', 'important');
    menu.style.setProperty('backdrop-filter', 'none', 'important');
    menu.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
    var solid = (getComputedStyle(document.body).getPropertyValue('--menu-solid-bg') || '').trim()
      || (getComputedStyle(document.body).getPropertyValue('--card-bg') || '').trim()
      || '#f0f4fa';
    // Si card-bg es rgba semitransparente, forzar sólido claro
    if(/^rgba\(/i.test(solid) && solid.indexOf(',0.')>=0) solid = '#f0f4fa';
    if(document.body.getAttribute('data-theme')==='lwm-night') solid = (getComputedStyle(document.body).getPropertyValue('--menu-solid-bg')||'#152538').trim() || '#152538';
    menu.style.setProperty('background', solid, 'important');
    menu.style.setProperty('background-color', solid, 'important');
    menu.style.setProperty('color', (getComputedStyle(document.body).getPropertyValue('--ink') || '#222').trim() || '#222', 'important');
    menu.style.setProperty('opacity', '1', 'important');
    menu.style.setProperty('-webkit-backdrop-filter', 'none', 'important');
    menu.style.left = '0px';
    menu.style.top = '0px';
    const mw = Math.max(menu.offsetWidth || 0, 160);
    const mh = menu.offsetHeight || 120;
    let left = Math.max(8, r.left || r.x || 0);
    let top = (r.bottom || (r.top + r.height) || 0) + 4;
    if(!r.width && !r.height){
      // botón sin geometría: centrar bajo la toolkit
      const tb = document.getElementById('topbar-actions');
      const tr = tb ? tb.getBoundingClientRect() : null;
      if(tr){ left = tr.left; top = tr.bottom + 4; }
    }
    if(left + mw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - mw - 8);
    if(top + mh > window.innerHeight - 8) top = Math.max(8, (r.top || 40) - mh - 4);
    menu.style.setProperty('left', left + 'px', 'important');
    menu.style.setProperty('top', top + 'px', 'important');
    btn.setAttribute('aria-expanded', 'true');
  }
  function isOpen(){
    return menu.classList.contains('open') && getComputedStyle(menu).display !== 'none';
  }

  btn.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    if(isOpen()) hideMenu();
    else showMenu();
  }, true);

  menu.querySelectorAll('.ver-item').forEach(function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      const id = el.getAttribute('data-version');
      hideMenu();
      if(id && typeof seferSetBibleVersion === 'function') seferSetBibleVersion(id);
    }, true);
  });

  document.addEventListener('click', function(e){
    if(!isOpen()) return;
    if(btn.contains(e.target) || menu.contains(e.target)) return;
    hideMenu();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && isOpen()) hideMenu();
  });
  window.addEventListener('resize', function(){ if(isOpen()) showMenu(); });

  hideMenu();
  try{ seferUpdateVersionUI(); }catch(e){}
  try{
    if(typeof currentBibleVersion !== 'undefined' && currentBibleVersion && currentBibleVersion !== 'rv1960'){
      seferSetBibleVersion(currentBibleVersion, {silent:true});
    } else if(window.BIBLE_DATA_RV1960){
      seferApplyBibleData(window.BIBLE_DATA_RV1960);
    } else if(window.BIBLE_DATA){
      seferApplyBibleData(window.BIBLE_DATA);
    }
  }catch(err){ console.warn('[SEFER] version init', err); }
  console.info('[SEFER] traducción lista');
}
window.wireVersionSwitcher = wireVersionSwitcher;
