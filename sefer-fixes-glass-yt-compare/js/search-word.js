/* SEFER module: search-word.js — script clásico (sin import/export) */

/* --- SEFER search-word.js lines 1733-1913 --- */
/* =========================================================
   BÚSQUEDA POR PALABRA (flotante, al teclear)
   ========================================================= */
const wordSearchBar = document.getElementById('word-search-bar');
const wordSearchInput = document.getElementById('word-search-input');
const wordSearchResults = document.getElementById('word-search-results');
let wordSearchOpen = false;

function openWordSearch(initialChar){
  if(wordSearchOpen) return;
  wordSearchOpen = true;
  wordSearchBar.classList.add('open');
  wordSearchInput.value = initialChar || '';
  wordSearchResults.innerHTML = '';
  wordSearchInput.focus();
  if(initialChar) runWordSearch(initialChar);
}
function closeWordSearch(){
  wordSearchOpen = false;
  wordSearchBar.classList.remove('open');
  wordSearchInput.value = '';
  wordSearchResults.innerHTML = '';
}

function openVersionsHistory(){
  const m = document.getElementById('modal-versions');
  const body = document.getElementById('versions-body');
  const lab = document.getElementById('versions-current-label');
  if(!m || !body) return;
  const hist = (typeof SEFER_VERSION_HISTORY !== 'undefined' && SEFER_VERSION_HISTORY.length)
    ? SEFER_VERSION_HISTORY
    : [{id: (typeof SEFER_VERSION!=='undefined'?SEFER_VERSION:'?'), name: (typeof SEFER_VERSION_NAME!=='undefined'?SEFER_VERSION_NAME:''), date:'', current:true, changes:['Sin historial detallado cargado.']}];
  if(lab){
    const cur = hist.find(v=>v.current) || hist[0];
    lab.textContent = 'Versión en uso: v' + (cur.id||'') + (cur.name ? ' — ' + cur.name : '');
  }
  body.innerHTML = hist.map((v,i)=>{
    const badge = v.current
      ? '<span style="display:inline-block;font-size:10px;font-weight:700;background:var(--rubric);color:var(--parchment);padding:2px 7px;border-radius:999px;margin-left:6px;">ACTUAL</span>'
      : '';
    const prev = hist[i+1];
    let delta = '';
    if(prev){
      delta = '<div style="font-size:11px;color:var(--ink-soft);margin:4px 0 6px;font-style:italic;">Respecto a v'+prev.id+': se añadieron o cambiaron los puntos de abajo.</div>';
    }
    const lis = (v.changes||[]).map(c=>'<li style="margin:0 0 4px;">'+c+'</li>').join('');
    const dateStr = (v.date && String(v.date).trim()) ? String(v.date).trim() : '—';
    return '<div style="margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--line);">'
      + '<div style="font-weight:700;color:var(--rubric);font-size:14px;">v'+v.id+' '+badge+'</div>'
      + '<div style="font-size:12px;color:var(--gold);margin:2px 0 2px;">'+(v.name||'')+'</div>'
      + '<div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin:0 0 6px;">📅 '+dateStr+'</div>'
      + delta
      + '<ul style="margin:0;padding-left:18px;">'+lis+'</ul></div>';
  }).join('');
  m.style.display = 'flex';
  try{ closeWordSearch(); }catch(e){}
}
function closeVersionsHistory(){
  const m = document.getElementById('modal-versions');
  if(m) m.style.display = 'none';
}
document.getElementById('cerrar-versions')?.addEventListener('click', closeVersionsHistory);
document.getElementById('modal-versions')?.addEventListener('click', (e)=>{ if(e.target.id==='modal-versions') closeVersionsHistory(); });
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape' && document.getElementById('modal-versions')?.style.display==='flex'){
    closeVersionsHistory();
  }
});
function isVersionsHistoryQuery(q){
  const n = String(q||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'');
  return n === 'versionshistory' || n === 'versionhistory' || n === 'historialversiones' || n === 'historialdeversiones' || n === 'seferversions';
}

function runWordSearch(q){
  q = (q||'').trim().toLowerCase();
  if(isVersionsHistoryQuery(q)){
    // Spotlight de resultados + modal de historial (misma fuente SEFER_VERSION_HISTORY)
    try{
      const hist = (typeof SEFER_VERSION_HISTORY !== 'undefined' && SEFER_VERSION_HISTORY.length) ? SEFER_VERSION_HISTORY : [];
      const cur = hist.find(v=>v.current) || hist[0];
      if(wordSearchResults){
        wordSearchResults.innerHTML = '<div class="ws-hit" style="cursor:pointer;padding:10px 12px;" id="ws-open-versions">'
          + '<div style="font-weight:700;color:var(--rubric);">📋 Historial de versiones SEFER</div>'
          + '<div style="font-size:12px;color:var(--ink-soft);margin-top:4px;">Versión actual: v'
          + (cur && cur.id ? cur.id : (typeof SEFER_VERSION!=='undefined'?SEFER_VERSION:'?'))
          + (cur && cur.name ? ' — ' + cur.name : '')
          + '</div>'
          + '<div style="font-size:12px;margin-top:6px;color:var(--ink);">Clic para ver todas las versiones y cambios (fechas y lista detallada).</div>'
          + '</div>';
        const hit = document.getElementById('ws-open-versions');
        if(hit) hit.onclick = ()=> openVersionsHistory();
      }
    }catch(e){}
    openVersionsHistory();
    return;
  }
  if(q.length < 2){
    wordSearchResults.innerHTML = q.length ? '<div class="empty-msg">Escribe al menos 2 letras…</div>' : '';
    return;
  }
  const results = [];
  outer:
  for(const entry of BOOK_ORDER){
    const book = entry.name;
    const chaps = BIBLE[book];
    if(!chaps) continue;
    for(const ch of Object.keys(chaps)){
      const verses = chaps[ch];
      for(const v of Object.keys(verses)){
        const text = verses[v];
        if(text.toLowerCase().includes(q)){
          results.push({book, ch, v, text});
          if(results.length > 120) break outer;
        }
      }
    }
  }
  wordSearchResults.innerHTML = '';
  if(results.length===0){
    wordSearchResults.innerHTML = '<div class="empty-msg">Sin coincidencias.</div>';
    return;
  }
  const head = document.createElement('div');
  head.className = 'empty-msg';
  head.style.padding = '8px 14px 4px';
  head.textContent = `${results.length}${results.length>120?'+':''} resultados`;
  wordSearchResults.appendChild(head);
  results.slice(0,80).forEach(r=>{
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `<div class="result-ref">${r.book} ${r.ch}:${r.v}</div><div class="result-text">${r.text}</div>`;
    item.onclick = ()=>{
      openTestaments.add(BOOK_ORDER.find(e=>e.name===r.book)?.testament || 'AT');
      openBooks.add(r.book);
      saveNavState();
      goTo(r.book, r.ch);
      detailVerse = r.v;
      selectedVerses = [r.v];
      updateSelectionUI();
      renderReader();
      renderBookList();
      closeWordSearch();
      scrollVerseIntoView(r.v);
    };
    wordSearchResults.appendChild(item);
  });
}
wordSearchInput.addEventListener('input', ()=> runWordSearch(wordSearchInput.value));
wordSearchInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ e.preventDefault(); closeWordSearch(); return; }
  if(e.key === 'Enter'){
    e.preventDefault();
    const first = wordSearchResults.querySelector('.result-item');
    if(first) first.click();
  }
});

// Abrir búsqueda por palabra al teclear letras (si no estamos en otro input)
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && wordSearchOpen){
    e.preventDefault();
    closeWordSearch();
    return;
  }
  if(wordSearchOpen) return;
  if(stage.classList.contains('open')) return;
  const tag = (e.target && e.target.tagName) || '';
  if(tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
  if(e.ctrlKey || e.metaKey || e.altKey) return;
  // Solo letras (incluye acentos y ñ)
  if(e.key.length === 1 && /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(e.key)){
    e.preventDefault();
    openWordSearch(e.key);
  }
});
document.addEventListener('mousedown', (e)=>{
  if(wordSearchOpen && !wordSearchBar.contains(e.target)){
    closeWordSearch();
  }
});

