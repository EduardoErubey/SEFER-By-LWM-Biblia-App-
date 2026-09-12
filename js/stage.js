/* SEFER module: stage.js — script clásico (sin import/export) */

/* --- SEFER stage.js lines 2179-2637 --- */
/* =========================================================
   MODO PROYECCIÓN (soporta varios versículos a la vez)
   ========================================================= */
/* dom ref hoisted */
const stageRef = document.getElementById('stage-ref');
const stageText = document.getElementById('stage-text');
let stagePassages = [];
let stageIndex = 0;

let stageMode = 'single'; // 'single' | 'selection' | 'chapter' | 'stack' | 'compare'
var stageFromDice = false; // hoisted: true solo si se abrió proyección desde el dado
var stageFromSearch = false; // proyección dual desde buscador (|)
let stageCompareOn = false;
let stageCompareVersion = 'nvi';
let stageStackSecond = null; // {book,chap,verses} para proyección arriba/abajo
let stageCompareData = null; // segundo corpus BIBLE para compare

function openStage(book, chap, verses, mode){
  stageMode = mode || (verses && verses.length > 1 ? 'selection' : 'single');
  stagePassages = [{book, chap, verses: [...verses].map(String).sort((a,b)=>+a-+b)}];
  stageIndex = 0;
  stageStackSecond = null;
  stageCompareOn = false;
  stageFromSearch = false;
  if(stage){ stage.classList.remove('stage-stack','stage-compare'); }
  const paneB = document.getElementById('stage-pane-b');
  if(paneB) paneB.style.display = 'none';
  const sel = document.getElementById('stage-compare-sel');
  if(sel) sel.style.display = 'none';
  renderStage();
  stage.classList.add('open');
  try{ updateStageExtraBtns(); }catch(e){}
  try{ updateStageCompareVisibility(); }catch(e){}
  try{ if(typeof setAchProgress==='function') setAchProgress('project_1', 1); }catch(e){}
}

/** Proyección de dos pasajes (libros distintos): arriba / abajo */
function openStageStack(p1, p2){
  stageMode = 'stack';
  stageFromDice = false;
  stageFromSearch = true;
  stageCompareOn = false;
  stagePassages = [p1];
  stageIndex = 0;
  stageStackSecond = p2;
  if(stage){
    stage.classList.remove('stage-compare');
    stage.classList.add('open','stage-stack');
  }
  const paneB = document.getElementById('stage-pane-b');
  if(paneB) paneB.style.display = '';
  const sel = document.getElementById('stage-compare-sel');
  if(sel) sel.style.display = 'none';
  renderStage();
  try{ updateStageExtraBtns(); }catch(e){}
  try{ updateStageCompareVisibility(); }catch(e){}
}

function fillStagePane(refEl, textEl, book, chap, verses, versionLabel){
  if(!refEl || !textEl) return;
  const data = (arguments.length >= 7 && arguments[6]) ? arguments[6] : BIBLE;
  const chapData = (data[book]||{})[chap] || {};
  const vlist = (verses||[]).map(String);
  const first = vlist[0], last = vlist[vlist.length-1];
  const isFullySequential = vlist.length > 1 && (parseInt(last) - parseInt(first) + 1) === vlist.length;
  let ref = '';
  if(vlist.length === 1) ref = book + ' ' + chap + ':' + first;
  else if(isFullySequential) ref = book + ' ' + chap + ':' + first + '-' + last;
  else ref = book + ' ' + chap + ':' + vlist.join(', ');
  if(versionLabel) ref = versionLabel + ' · ' + ref;
  refEl.textContent = ref;
  const jesusMap = (data === BIBLE) ? buildJesusMap(book, chap) : {};
  let html = '';
  let prevV = null;
  const useJumpStyle = !isFullySequential && vlist.length > 1;
  vlist.forEach(v=>{
    const isGap = prevV !== null && (parseInt(v) - parseInt(prevV) !== 1);
    const isJump = useJumpStyle || isGap;
    const cls = isJump ? 'stage-vnum jump' : 'stage-vnum';
    const block = isJump ? 'jump-block' : '';
    const raw = chapData[v] || chapData[String(v)] || '';
    let line = raw;
    if(jesusMap && jesusMap[v]){
      // keep simple text if other version
    }
    if(block) html += '<div class="'+block+'">';
    let body = raw||'';
    try{ if(typeof applyHighlightsToVerseHtml==='function') body = applyHighlightsToVerseHtml(body, book, chap, v); }catch(e){}
    html += '<span class="'+cls+'" data-v="'+v+'">'+v+'</span> <span class="stage-verse-body" data-book="'+book+'" data-chap="'+chap+'" data-v="'+v+'">' + body + '</span> ';
    if(block) html += '</div>';
    prevV = v;
  });
  textEl.innerHTML = html || '<span style="opacity:0.6">Sin texto en esta versión</span>';
}


function updateStageCompareVisibility(){
  const wrap = document.getElementById('stage-compare-wrap');
  if(!wrap) return;
  // No mostrar comparar: buscador multi-libro, stack, ni capitulo completo
  const hide = !!(stageFromSearch || stageMode === 'stack' || stageMode === 'chapter');
  wrap.style.display = hide ? 'none' : 'flex';
  if(hide){
    const sel = document.getElementById('stage-compare-sel');
    if(sel) sel.style.display = 'none';
  }
}

function updateStageExtraBtns(){
  const box = document.getElementById('stage-extra-btns');
  if(!box) return;
  const show = !!(stage && stage.classList.contains('open') && !stageFromSearch);
  box.style.display = show ? 'flex' : 'none';
  const diceBtn = document.getElementById('stage-dice-btn');
  if(diceBtn) diceBtn.style.display = stageFromDice ? '' : 'none';
  if(!show){
    const panel = document.getElementById('stage-note-panel');
    if(panel) panel.style.display = 'none';
  } else {
    try{ refreshStageFavBtn(); }catch(e){}
  }
}
function renderStage(){
  const p = stagePassages[stageIndex];
  if(!p) return;
  const chapData = (BIBLE[p.book]||{})[p.chap] || {};
  const verses = p.verses;
  const first = verses[0], last = verses[verses.length-1];
  const isFullySequential = verses.length > 1 && (parseInt(last) - parseInt(first) + 1) === verses.length;
  const jesusMap = buildJesusMap(p.book, p.chap);

  if(verses.length === 1){
    stageRef.textContent = `${p.book} ${p.chap}:${first}`;
  } else if(isFullySequential){
    stageRef.textContent = `${p.book} ${p.chap}:${first}-${last}`;
  } else {
    stageRef.textContent = `${p.book} ${p.chap}:${verses.join(', ')}`;
  }

  let html = '';
  let prevV = null;
  const useJumpStyle = !isFullySequential && verses.length > 1;
  verses.forEach(v=>{
    const isGap = prevV !== null && (parseInt(v) - parseInt(prevV) !== 1);
    const isJump = useJumpStyle || isGap;
    const vnumClass = isJump ? 'stage-vnum jump' : 'stage-vnum';
    const openTag = isGap ? '<span class="jump-block">' : '<span>';
    const raw = stripPilcrow(chapData[v]||'');
    let bodyText = raw;
    try{
      if(typeof applyHighlightsToVerseHtml === 'function'){
        bodyText = applyHighlightsToVerseHtml(raw, p.book, p.chap, v);
      }
    }catch(e){}
    const body = (easyReading && jesusMap[v]) ? `<span class="jesus-words">${bodyText}</span>` : bodyText;
    html += `${openTag}<span class="${vnumClass}" data-v="${v}">${v}</span><span class="stage-verse-body" data-book="${p.book}" data-chap="${p.chap}" data-v="${v}">${body}</span> </span>`;
    prevV = v;
  });
  stageText.innerHTML = html;

  // Panel B: stack (arriba/abajo dos libros) o compare (izq/der dos traducciones)
  const paneB = document.getElementById('stage-pane-b');
  const refB = document.getElementById('stage-ref-b');
  const textB = document.getElementById('stage-text-b');
  if(stageMode === 'stack' && stageStackSecond){
    if(stage) stage.classList.add('stage-stack');
    if(paneB) paneB.style.display = '';
    try{
      fillStagePane(refB, textB, stageStackSecond.book, stageStackSecond.chap, stageStackSecond.verses, null, BIBLE);
    }catch(e){ console.warn(e); }
  } else if(stageMode === 'compare' && stageCompareOn){
    if(stage) stage.classList.add('stage-compare');
    if(paneB) paneB.style.display = '';
    const meta = (typeof SEFER_VERSION_META!=='undefined' && SEFER_VERSION_META[stageCompareVersion]) ? SEFER_VERSION_META[stageCompareVersion] : {short: stageCompareVersion};
    const other = stageCompareData || (typeof seferGetGlobalBible==='function' ? seferGetGlobalBible(stageCompareVersion) : null) || {};
    try{
      fillStagePane(refB, textB, p.book, p.chap, verses, meta.short || stageCompareVersion, other);
    }catch(e){ console.warn(e); }
    // etiqueta versión actual en panel A
    const metaA = (typeof SEFER_VERSION_META!=='undefined' && SEFER_VERSION_META[currentBibleVersion]) ? SEFER_VERSION_META[currentBibleVersion] : null;
    if(metaA && stageRef){
      const base = stageRef.textContent || '';
      if(base && base.indexOf('·') < 0) stageRef.textContent = metaA.short + ' · ' + base;
    }
  } else {
    if(stage){ stage.classList.remove('stage-stack','stage-compare'); }
    if(paneB) paneB.style.display = 'none';
  }

  // Anterior/Siguiente: ocultos en capítulo completo o stack multi-libro
  const prevBtn = document.getElementById('stage-prev');
  const nextBtn = document.getElementById('stage-next');
  if(stageMode === 'chapter' || stageMode === 'stack'){
    if(prevBtn) prevBtn.style.display = 'none';
    if(nextBtn) nextBtn.style.display = 'none';
  } else {
    const allV = sortedVerseNums(p.book, p.chap);
    const anchor = verses[verses.length-1];
    const idx = allV.indexOf(String(anchor));
    if(prevBtn){
      prevBtn.style.display = '';
      prevBtn.disabled = idx <= 0;
    }
    if(nextBtn){
      nextBtn.style.display = '';
      nextBtn.disabled = idx < 0 || idx >= allV.length-1;
    }
  }
  requestAnimationFrame(()=> updateStageScrollControls());
}
function stageStep(dir){
  const p = stagePassages[stageIndex];
  if(!p) return;
  const allV = sortedVerseNums(p.book, p.chap);
  // Si hay varios versículos proyectados, avanzar desde el último / primero según dirección
  const anchor = dir > 0 ? p.verses[p.verses.length-1] : p.verses[0];
  const idx = allV.indexOf(String(anchor));
  if(idx < 0) return;
  const next = idx + dir;
  if(next < 0 || next >= allV.length) return;
  // Al navegar con flechas, mostrar un solo versículo
  stagePassages = [{book: p.book, chap: p.chap, verses: [allV[next]]}];
  stageIndex = 0;
  renderStage();
}
function openProjectSheet(){
  const sheet = document.getElementById('project-sheet');
  const selOpt = document.getElementById('ps-opt-selection');
  if(selOpt) selOpt.style.display = (selectedVerses && selectedVerses.length) ? '' : 'none';
  if(sheet) sheet.classList.add('open');
}
function closeProjectSheet(){
  const sheet = document.getElementById('project-sheet');
  if(sheet) sheet.classList.remove('open');
}
const projectBtn = document.getElementById('project-btn');
if(projectBtn) projectBtn.onclick = ()=> openProjectSheet();
const psCancel = document.getElementById('ps-cancel');
if(psCancel) psCancel.onclick = ()=> closeProjectSheet();
const projectSheet = document.getElementById('project-sheet');
if(projectSheet) projectSheet.addEventListener('click', (e)=>{
  if(e.target.id === 'project-sheet') closeProjectSheet();
});
document.querySelectorAll('#project-sheet .ps-opt').forEach(btn=>{
  btn.onclick = ()=>{
    const mode = btn.dataset.proj;
    closeProjectSheet();
    if(showWelcome){ alert('Abre un capítulo primero.'); return; }
    stageFromDice = false;
    if(mode === 'current'){
      const v = detailVerse || Object.keys((BIBLE[currentBook]||{})[currentChap]||{})[0];
      if(!v){ alert('No hay versículos en este capítulo.'); return; }
      openStage(currentBook, currentChap, [v], 'single');
    } else if(mode === 'selection'){
      if(!selectedVerses.length){ alert('Marca uno o más versículos con las casillas primero.'); return; }
      openStage(currentBook, currentChap, selectedVerses, 'selection');
    } else if(mode === 'sermon'){
      alert('La función de Sermones ha sido deshabilitada temporalmente.');
    } else if(mode === 'chapter'){
      const all = sortedVerseNums(currentBook, currentChap);
      if(!all.length){ alert('Capítulo vacío.'); return; }
      openStage(currentBook, currentChap, all, 'chapter');
    }
  };
});
document.getElementById('stage-exit').onclick = ()=> closeStageProjection();
document.getElementById('stage-next').onclick = ()=> stageStep(1);
document.getElementById('stage-prev').onclick = ()=> stageStep(-1);
// Botones discretos en proyección (solo si vino del dado) — no cierran proyección
function stageCurrentVerseId(){
  const p = stagePassages[stageIndex];
  if(!p || !p.verses || !p.verses.length) return null;
  const v = p.verses[0];
  return { p, v, id: p.book+'|'+p.chap+'|'+v };
}
function refreshStageFavBtn(){
  const btn = document.getElementById('stage-fav-btn');
  const cur = stageCurrentVerseId();
  if(!btn || !cur) return;
  btn.textContent = favorites[cur.id] ? '❤️' : '🤍';
}
document.getElementById('stage-fav-btn')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  const cur = stageCurrentVerseId(); if(!cur) return;
  if(favorites[cur.id]){ delete favorites[cur.id]; }
  else { favorites[cur.id] = true; }
  try{ saveFavorites(); }catch(err){}
  refreshStageFavBtn();
});
document.getElementById('stage-note-btn')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  const panel = document.getElementById('stage-note-panel');
  const ta = document.getElementById('stage-note-ta');
  const cur = stageCurrentVerseId(); if(!cur || !panel || !ta) return;
  const open = panel.style.display === 'block';
  if(open){ panel.style.display = 'none'; return; }
  ta.value = (notes && notes[cur.id]) ? notes[cur.id] : '';
  panel.style.display = 'block';
  ta.focus();
});
document.getElementById('stage-note-save')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  const cur = stageCurrentVerseId();
  const ta = document.getElementById('stage-note-ta');
  if(!cur || !ta) return;
  const text = (ta.value || '').trim();
  if(text){ notes[cur.id] = text; }
  else { delete notes[cur.id]; }
  try{ if(typeof saveNotes==='function') saveNotes(); else store.set('bp_notes', notes); }catch(err){}
  document.getElementById('stage-note-panel').style.display = 'none';
});
document.getElementById('stage-note-cancel')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  const panel = document.getElementById('stage-note-panel');
  if(panel) panel.style.display = 'none';
});
document.getElementById('stage-dice-btn')?.addEventListener('click', (e)=>{
  e.stopPropagation();
  // Otro aleatorio sin salir de proyección
  stageFromDice = true;
  goToRandomVerse();
});

/* Auto-desplazamiento del texto en proyección (solo si hay overflow) */
let stageAutoTimer = null;
let stageAutoDelayTimer = null;
let stageAutoCountdownTimer = null;
let stageAutoSpeed = 0.03; // predeterminada
const STAGE_SPEEDS = [0.03, 0.05, 0.07, 0.09];
let stageSpeedIndex = 0;
const STAGE_SCROLL_BASE = 40; // px por tick a 1×
const STAGE_AUTO_DELAY_MS = 10000; // 10 s con conteo regresivo

function stageTextOverflows(){
  const el = document.getElementById('stage-text');
  if(!el) return false;
  return el.scrollHeight > el.clientHeight + 8;
}
function updateStageScrollControls(){
  const show = stageTextOverflows();
  const autoBtn = document.getElementById('stage-auto');
  const speedBtn = document.getElementById('stage-speed-btn');
  if(autoBtn) autoBtn.style.display = show ? '' : 'none';
  if(speedBtn) speedBtn.style.display = show ? '' : 'none';
  if(!show) stopStageAuto();
}
function isStageAutoRunning(){
  return !!(stageAutoTimer || stageAutoDelayTimer || stageAutoCountdownTimer);
}
function updateSpeedBtnLabel(){
  const speedBtn = document.getElementById('stage-speed-btn');
  if(speedBtn){
    speedBtn.textContent = stageAutoSpeed.toFixed(2).replace(/0+$/,'').replace(/\.$/,'') + '×';
    // normalize 0.03 style
    speedBtn.textContent = String(stageAutoSpeed) + '×';
  }
}
function stopStageAuto(){
  if(stageAutoTimer){ clearInterval(stageAutoTimer); stageAutoTimer = null; }
  if(stageAutoDelayTimer){ clearTimeout(stageAutoDelayTimer); stageAutoDelayTimer = null; }
  if(stageAutoCountdownTimer){ clearInterval(stageAutoCountdownTimer); stageAutoCountdownTimer = null; }
  const autoBtn = document.getElementById('stage-auto');
  if(autoBtn){ autoBtn.classList.remove('active'); autoBtn.textContent = '▶ Auto'; }
}
function beginStageScrollLoop(){
  const el = document.getElementById('stage-text');
  if(!el || !stageTextOverflows()){ stopStageAuto(); return; }
  const autoBtn = document.getElementById('stage-auto');
  if(autoBtn){ autoBtn.classList.add('active'); autoBtn.textContent = '⏸ Auto'; }
  let acc = 0;
  const pxPerTick = STAGE_SCROLL_BASE * stageAutoSpeed / 4;
  if(stageAutoTimer){ clearInterval(stageAutoTimer); stageAutoTimer = null; }
  stageAutoTimer = setInterval(()=>{
    if(!el){ stopStageAuto(); return; }
    const max = el.scrollHeight - el.clientHeight;
    if(el.scrollTop >= max - 1){
      el.scrollTop = 0;
      acc = 0;
      return;
    }
    acc += pxPerTick;
    if(acc >= 1){
      const move = Math.floor(acc);
      acc -= move;
      el.scrollTop = Math.min(max, el.scrollTop + move);
    }
  }, 50);
}
function startStageAuto(){
  stopStageAuto();
  const el = document.getElementById('stage-text');
  if(!el || !stageTextOverflows()) return;
  const autoBtn = document.getElementById('stage-auto');
  let remaining = Math.ceil(STAGE_AUTO_DELAY_MS / 1000); // 10
  if(autoBtn){
    autoBtn.classList.add('active');
    autoBtn.textContent = '⏳ ' + remaining + 's';
  }
  stageAutoCountdownTimer = setInterval(()=>{
    remaining -= 1;
    if(remaining > 0){
      if(autoBtn) autoBtn.textContent = '⏳ ' + remaining + 's';
    } else {
      clearInterval(stageAutoCountdownTimer);
      stageAutoCountdownTimer = null;
    }
  }, 1000);
  stageAutoDelayTimer = setTimeout(()=>{
    stageAutoDelayTimer = null;
    if(stageAutoCountdownTimer){ clearInterval(stageAutoCountdownTimer); stageAutoCountdownTimer = null; }
    beginStageScrollLoop();
  }, STAGE_AUTO_DELAY_MS);
}
document.getElementById('stage-auto')?.addEventListener('click', ()=>{
  if(isStageAutoRunning()) stopStageAuto();
  else startStageAuto();
});
document.getElementById('stage-speed-btn')?.addEventListener('click', ()=>{
  stageSpeedIndex = (stageSpeedIndex + 1) % STAGE_SPEEDS.length;
  stageAutoSpeed = STAGE_SPEEDS[stageSpeedIndex];
  updateSpeedBtnLabel();
  // Si está desplazando (no solo en cuenta atrás), reiniciar loop con nueva velocidad
  if(stageAutoTimer) beginStageScrollLoop();
});
updateSpeedBtnLabel();
function closeStageProjection(){
  stopStageAuto();
  if(stage) stage.classList.remove('open','stage-stack','stage-compare'); stageStackSecond=null; stageCompareOn=false;;
  // NO salir de fullscreen del documento (solo cerrar proyección)
  // Restaurar scroll al versículo proyectado
  try{
    const v = detailVerse || (selectedVerses && selectedVerses[0]);
    if(v && currentBook && currentChap){
      requestAnimationFrame(()=>{
        const el = document.querySelector('#reader .verse[data-vnum="'+v+'"]');
        if(el) el.scrollIntoView({ block: 'center', behavior: 'instant' });
      });
    }
  }catch(err){}
  stageFromDice = false;
  try{ updateStageExtraBtns(); }catch(e){}
  try{ updateStageCompareVisibility(); }catch(e){}
}
document.getElementById('stage-exit')?.addEventListener('click', closeStageProjection);

document.addEventListener('keydown', (e)=>{
  if(e.key !== 'Escape' && e.key !== 'Esc') return;
  // Cerrar proyección con Esc (fase captura = prioridad alta)
  const st = document.getElementById('stage');
  if(st && st.classList.contains('open')){
    e.preventDefault();
    e.stopImmediatePropagation();
    closeStageProjection();
    return;
  }
  if(document.getElementById('project-sheet')?.classList.contains('open')){
    e.preventDefault();
    closeProjectSheet();
    return;
  }
}, true);
document.addEventListener('keydown', (e)=>{
  if(!stage || !stage.classList.contains('open')) return;
  if(e.key === 'ArrowRight'){ e.preventDefault(); stageStep(1); }
  if(e.key === 'ArrowLeft'){ e.preventDefault(); stageStep(-1); }
});







/* ===== 🖍️ Resaltar = subrayador por versículo =====
   Uso:
   1) Pulsar 🖍️ → modo activo
   2) Seleccionar texto en el versículo proyectado → se resalta SOLO ahí
   3) El botón se desactiva solo
   4) Para quitar: activar 🖍️, seleccionar lo resaltado → se quita
*/
let stageHighlightMode = false;

function seferGetStageSelectionContext(){
  const sel = window.getSelection && window.getSelection();
  if(!sel || sel.isCollapsed || !sel.toString().trim()) return null;
  const stage = document.getElementById('stage');
  if(!stage || !stage.contains(sel.anchorNode)) return null;
  const text = sel.toString().replace(/\s+/g,' ').trim();
  if(!text) return null;
  let node = sel.anchorNode;
  if(node && node.nodeType === 3) node = node.parentElement;
  const body = node && node.closest ? node.closest('.stage-verse-body, [data-v]') : null;
  let book, chap, vnum;
  if(body && body.classList && body.classList.contains('stage-verse-body')){
    book = body.getAttribute('data-book');
    chap = body.getAttribute('data-chap');
    vnum = body.getAttribute('data-v');
  } else if(body){
    vnum = body.getAttribute('data-v');
  }
  try{
    if((!book || !chap || !vnum) && typeof stagePassages !== 'undefined' && stagePassages[stageIndex]){
      const p = stagePassages[stageIndex];
      book = book || p.book;
      chap = chap || p.chap;
      if(!vnum && p.verses && p.verses.length === 1) vnum = p.verses[0];
      if(!vnum && p.verses && p.verses.length){
        const vEl = node && node.closest ? node.closest('.stage-vnum') : null;
        if(vEl) vnum = (vEl.getAttribute('data-v') || vEl.textContent || '').trim();
      }
    }
  }catch(e){}
  if(!book || !chap || !vnum) return null;
  return { book, chap, vnum, text };
}

function seferSetHighlightMode(on){
  stageHighlightMode = !!on;
  const b = document.getElementById('stage-highlight-btn');
  if(b){
    b.classList.toggle('active', stageHighlightMode);
    b.setAttribute('aria-pressed', stageHighlightMode ? 'true' : 'false');
    b.title = stageHighlightMode
      ? 'Subrayador activo: selecciona texto (se desactiva al marcar)'
      : 'Resaltar: activa y selecciona texto en el versículo';
  }
  const root = document.getElementById('stage');
  if(root) root.classList.toggle('stage-highlight-on', stageHighlightMode);
  try{ /* no body class for hl mode */ }catch(e){}
}

function seferApplyStageHighlightFromSelection(){
  const ctx = seferGetStageSelectionContext();
  if(!ctx) return null;
  const added = toggleVerseHighlight(ctx.book, ctx.chap, ctx.vnum, ctx.text);
  try{ window.getSelection().removeAllRanges(); }catch(e){}
  try{ if(typeof renderStage === 'function') renderStage(); }catch(e){}
  try{ if(typeof renderReader === 'function') renderReader(); }catch(e){}
  return { added, ctx };
}

(function wireSeferHighlighter(){
  // Clic en 🖍️: solo enciende/apaga el modo (no aplica sin selección)
  document.addEventListener('click', function(e){
    const t = e.target;
    if(!t) return;
    const b = t.id === 'stage-highlight-btn' ? t : (t.closest && t.closest('#stage-highlight-btn'));
    if(!b) return;
    e.preventDefault();
    e.stopPropagation();
    seferSetHighlightMode(!stageHighlightMode);
  }, true);

  // Al soltar el ratón con modo activo y texto seleccionado → resaltar y apagar modo
  document.addEventListener('mouseup', function(e){
    if(!stageHighlightMode) return;
    const stageEl = document.getElementById('stage');
    if(!stageEl || !stageEl.classList.contains('open')) return;
    if(e.target && e.target.closest && e.target.closest('#stage-highlight-btn')) return;
    setTimeout(function(){
      if(!stageHighlightMode) return;
      const sel = window.getSelection && window.getSelection();
      if(!sel || sel.isCollapsed) return;
      const text = (sel.toString() || '').replace(/\s+/g,' ').trim();
      if(text.length < 2) return;
      const ctx = seferGetStageSelectionContext();
      if(!ctx) return;
      seferApplyStageHighlightFromSelection();
      seferSetHighlightMode(false);
    }, 15);
  }, true);

  // Escape cancela el modo
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && stageHighlightMode){
      seferSetHighlightMode(false);
    }
  });
})();

window.stageHighlightMode = stageHighlightMode;
window.seferSetHighlightMode = seferSetHighlightMode;
window.seferGetStageSelectionContext = seferGetStageSelectionContext;
window.seferApplyStageHighlightFromSelection = seferApplyStageHighlightFromSelection;


/* ⇄ Comparar traducciones (izq / der) */
(function wireStageCompare(){
  const btn = document.getElementById('stage-compare-btn');
  const sel = document.getElementById('stage-compare-sel');
  if(!btn) return;
  function loadCompareCorpus(id){
    try{
      if(typeof seferGetGlobalBible === 'function') return seferGetGlobalBible(id);
    }catch(e){}
    try{
      if(typeof SEFER_BIBLES !== 'undefined' && SEFER_BIBLES[id]) return SEFER_BIBLES[id];
    }catch(e){}
    return null;
  }
  btn.addEventListener('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    if(stageFromSearch || stageMode === 'stack' || stageMode === 'chapter') return;
    stageCompareOn = !stageCompareOn;
    if(stageCompareOn){
      stageMode = 'compare';
      if(sel){
        sel.style.display = '';
        stageCompareVersion = sel.value || stageCompareVersion || 'nvi';
      }
      stageCompareData = loadCompareCorpus(stageCompareVersion);
      if(!stageCompareData || !Object.keys(stageCompareData).length){
        alert('No se pudo cargar la segunda traducción ('+stageCompareVersion+'). ¿Están los archivos bible-data de esa versión?');
        stageCompareOn = false;
        stageMode = 'single';
        if(sel) sel.style.display = 'none';
        stageCompareData = null;
      }
    } else {
      stageMode = (stagePassages[0] && stagePassages[0].verses && stagePassages[0].verses.length > 1) ? 'selection' : 'single';
      if(sel) sel.style.display = 'none';
      stageCompareData = null;
      try{ if(stage) stage.classList.remove('stage-compare'); }catch(err){}
      const paneB = document.getElementById('stage-pane-b');
      if(paneB) paneB.style.display = 'none';
    }
    try{ renderStage(); }catch(err){ console.error(err); }
    try{ updateStageCompareVisibility(); }catch(err){}
  });
  if(sel){
    sel.addEventListener('change', function(){
      stageCompareVersion = sel.value || 'nvi';
      if(!stageCompareOn) return;
      stageCompareData = loadCompareCorpus(stageCompareVersion);
      try{ renderStage(); }catch(err){ console.error(err); }
    });
  }
})();
