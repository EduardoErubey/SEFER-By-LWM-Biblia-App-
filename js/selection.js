/* SEFER module: selection.js — script clásico (sin import/export) */

/* --- SEFER selection.js lines 995-1287 --- */
function renderReader(){
  // Guardar scroll del contenedor real (#reader-verses o #reader)
  const prevScrollEl = document.getElementById('reader-verses') || reader;
  const prevScroll = prevScrollEl ? (prevScrollEl.scrollTop || 0) : 0;
  const keepScroll = !showWelcome && currentBook;
  // Quitar rail viejo antes de vaciar reader
  try{ document.getElementById('reader-scroll-rail')?.remove(); }catch(e){}
  reader.innerHTML = '';
  applyVerseFont();

  if(showWelcome){
    const isMob = document.body.classList.contains('mobile-mode');
    reader.classList.add('welcome-fixed'); /* centrar bienvenida en escritorio y móvil */
    const w = document.createElement('div');
    if(isMob){
      w.className = 'welcome-mobile';
      w.innerHTML = `
        <h1 class="welcome-brand">SEFER<span class="brand-heb">ספר</span></h1>
        <p class="welcome-sub"><strong>BY LIFE WORD MISSION PLAYA DEL CARMEN</strong></p>
        <p><strong>Tu Biblia para estudiar y proyectar la Palabra.</strong></p>
        <div class="wm-list">
          📖 Lee toda la Biblia.<br>
          🔎 Busca referencias y palabras.<br>
          📝 Guarda notas por versículo.<br>
          ♥ Marca favoritos.<br>
          📚 Consulta significados.<br>
          🎬 Proyecta versículos o sermones.
        </div>
        <p class="welcome-hint">Selecciona un libro para comenzar.</p>
      `;
    } else {
      w.className = 'welcome';
      w.innerHTML = `
        <h1 class="welcome-brand">SEFER<span class="brand-heb">ספר</span></h1>
        <p class="welcome-sub"><strong>BY LIFE WORD MISSION PLAYA DEL CARMEN</strong></p>
        <p>Bienvenido a tu herramienta de estudio y proyección bíblica.
        Elige un libro en el panel izquierdo, busca una referencia o escribe una palabra para comenzar.</p>
        <p class="welcome-hint">Consejo: usa las flechas en proyección para avanzar versículo a versículo · Tab completa nombres de libros en la búsqueda</p>
      `;
    }
    reader.appendChild(w);
    return;
  }
  reader.classList.remove('welcome-fixed');

  const chapData = (BIBLE[currentBook] || {})[currentChap];
  const meta = getBookMeta(currentBook);

  // Encabezado fijo (no se mueve al hacer scroll en los versículos)
  const head = document.createElement('div');
  head.id = 'reader-sticky-head';
  const bt = document.createElement('div');
  bt.className = 'book-title';
  bt.textContent = formatBookHeading(currentBook, currentChap);
  const ct = document.createElement('div');
  ct.className = 'chap-title';
  ct.textContent = detailVerse ? ('Versículo ' + detailVerse) : ('Capítulo ' + currentChap);
  const hint = document.createElement('div');
  hint.id = 'select-hint';
  hint.textContent = 'Toca un versículo: favorito o nota. Marca casillas para seleccionar. En la última casilla aparece Copiar (referencia y texto). Doble clic en una palabra: significado.';
  const titleRow = document.createElement('div');
  titleRow.id = 'reader-title-row';
  titleRow.className = 'reader-title-row';
  titleRow.appendChild(ct);
  const selWrap = document.createElement('div');
  selWrap.id = 'reader-sel-wrap';
  selWrap.className = 'reader-sel-wrap';
  const selSt = document.createElement('div');
  selSt.id = 'reader-sel-status';
  selSt.textContent = formatSelectionLabel();
  if(selectedVerses.length){
    selWrap.appendChild(selSt);
    const clr = document.createElement('button');
    clr.type = 'button';
    clr.className = 'btn';
    clr.id = 'reader-clear-sel';
    clr.textContent = 'Quitar marcas';
    clr.onclick = ()=>{ selectedVerses = []; selectionUIActive = false; updateSelectionUI(); renderReader(); };
    selWrap.appendChild(clr);
  }
  titleRow.appendChild(selWrap);
  head.appendChild(bt);
  head.appendChild(titleRow);
  head.appendChild(hint);
  reader.appendChild(head);

  const versesWrap = document.createElement('div');
  versesWrap.id = 'reader-verses';
  reader.appendChild(versesWrap);

  if(!chapData){
    const p = document.createElement('div');
    p.className = 'empty-msg';
    p.textContent = 'No hay datos cargados para este capítulo todavía.';
    versesWrap.appendChild(p);
    return;
  }

  const jesusMap = buildJesusMap(currentBook, currentChap);
  const verseParent = document.getElementById('reader-verses') || reader;
  sortedVerseNums(currentBook, currentChap).forEach(vnum=>{
    const text = chapData[vnum];
    const id = vid(currentBook, currentChap, vnum);
    const isSelected = selectedVerses.includes(vnum);
    const showCheck = selectionUIActive && (selectedVerses.length > 0 || detailVerse === vnum);
    const row = document.createElement('div');
    row.className = 'verse'
      + (favorites[id] ? ' highlighted':'')
      + (isSelected ? ' selected':'')
      + (detailVerse===vnum ? ' active-detail':'');
    const flags = (favorites[id] ? '<span class="fav-flag">♥</span>' : '')
      + (notes[id] ? '<span class="note-flag">✎ nota</span>' : '');
    let _vh = formatVerseHtml(text, !!jesusMap[vnum]);
    try{
      if(typeof applyHighlightsToVerseHtml === 'function'){
        // aplicar sobre el texto plano y re-formatear de forma simple si hay marcas
        const plain = stripPilcrow(text);
        const marked = applyHighlightsToVerseHtml(plain, currentBook, currentChap, vnum);
        if(marked !== plain){
          // marked puede incluir <mark>; combinar con easyReading spans de forma básica
          _vh = marked.replace(/([A-Za-záéíóúÁÉÍÓÚñÑüÜ]+)/g, (m, off, s)=>{
            // no tocar dentro de tags
            return m;
          });
          // Si no hay spans .w, usar marked directo; si formatVerseHtml añadió .w, preferir marked con clases
          if(marked.indexOf('<mark') >= 0){
            _vh = formatVerseHtml(plain, !!jesusMap[vnum]);
            // insert marks into _vh by replacing phrase occurrences in text content - fallback: use marked as vtext
            _vh = marked;
            if(!!jesusMap[vnum] && easyReading){
              _vh = '<span class="jesus-words">'+marked+'</span>';
            }
          }
        }
      }
    }catch(e){}
    const bodyHtml = `<span class="vnum">${vnum}</span>${_vh}${flags}`;
    // Casilla siempre en el DOM (sangría fija); solo cambia visibility
    row.innerHTML =
      `<label class="verse-check${showCheck?' is-visible':''}" title="Seleccionar versículo">` +
      `<input type="checkbox" data-vcheck="${vnum}" ${isSelected?'checked':''} ${showCheck?'':'tabindex="-1'}"></label>` +
      `<div class="verse-body">${bodyHtml}</div>`;
    row.tabIndex = 0;
    row.setAttribute('role','button');
    row.dataset.vnum = vnum;

    const checkEl = row.querySelector('input[data-vcheck]');
    if(checkEl){
      checkEl.addEventListener('click', (e)=> e.stopPropagation());
      checkEl.addEventListener('change', (e)=>{
        e.stopPropagation();
        setVerseSelected(vnum, checkEl.checked);
      });
    }

    const activateVerse = (e)=>{
      if(e && (e.target.closest('.vaction') || e.target.closest('.note-box') || e.target.closest('.verse-check'))) return;
      try{ window.getSelection && window.getSelection().removeAllRanges(); }catch(_e){}
      if(e && e.target && e.target.classList && e.target.classList.contains('w')){
        detailVerse = vnum;
        selectionUIActive = true;
        renderReader();
        return;
      }
      if(detailVerse === vnum){
        detailVerse = null;
        if(selectedVerses.length === 0) selectionUIActive = false;
      } else {
        detailVerse = vnum;
        selectionUIActive = true;
      }
      renderReader();
      requestAnimationFrame(()=>{
        const el = reader.querySelector('.verse[data-vnum="'+vnum+'"]');
        if(el) el.focus({preventScroll:true});
      });
    };
    row.onclick = activateVerse;
    row.ondblclick = (e)=>{
      try{ e.preventDefault(); e.stopPropagation(); }catch(_e){}
      try{ window.getSelection && window.getSelection().removeAllRanges(); }catch(_e){}
      const t = e.target;
      if(t && t.classList && (t.classList.contains('w') || t.classList.contains('word'))){
        if(typeof showWordPopup === 'function') showWordPopup(t.textContent, e.clientX, e.clientY);
      }
    };
    row.addEventListener('contextmenu', function(e){
      const t = e.target;
      if(t && t.classList && (t.classList.contains('w') || t.classList.contains('word'))){
        e.preventDefault();
      }
    });
    row.onkeydown = (e)=>{
      if(e.target.closest('.vaction') || e.target.closest('.note-box') || e.target.closest('textarea')) return;
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activateVerse(e); }
      if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
        e.preventDefault();
        const rows = [...reader.querySelectorAll('.verse')];
        const i = rows.indexOf(row);
        const next = rows[i + (e.key === 'ArrowDown' ? 1 : -1)];
        if(next){ next.focus(); next.scrollIntoView({block:'nearest'}); }
      }
      if((e.key === 'Delete' || e.key === 'Backspace') && favorites[id]){
        e.preventDefault();
        delete favorites[id];
        saveFavorites();
        renderReader();
      }
    };

    const sortedSel = (selectedVerses || []).map(String).sort((a,b)=> (+a) - (+b));
    const isLastSelected = isSelected && sortedSel.length && String(sortedSel[sortedSel.length - 1]) === String(vnum);
    if(detailVerse === vnum || isLastSelected){
      const actions = document.createElement('div');
      actions.className = 'verse-actions';
      actions.style.display = 'flex';

      if(detailVerse === vnum){
        const favBtn = document.createElement('div');
        favBtn.className = 'vaction' + (favorites[id] ? ' on' : '');
        favBtn.textContent = favorites[id] ? '♥ Favorito' : '♡ Favorito';
        favBtn.onclick = (e)=>{
          e.stopPropagation();
          if(favorites[id]) delete favorites[id];
          else favorites[id] = true;
          saveFavorites();
          renderReader();
        };
        const noteBtn = document.createElement('div');
        noteBtn.className = 'vaction';
        noteBtn.textContent = notes[id] ? 'Editar nota' : '+ Nota';
        actions.appendChild(favBtn);
        actions.appendChild(noteBtn);

        const noteBox = document.createElement('div');
        noteBox.className = 'note-box';
        noteBox.innerHTML =
          '<div class="note-toolbar">' +
          '<button type="button" class="note-trash" title="Eliminar nota">🗑</button>' +
          '<button type="button" class="note-close" title="Cerrar (Esc)">❌</button>' +
          '</div>' +
          '<textarea placeholder="Escribe tu nota de exposición aquí…">' + (notes[id] || '') + '</textarea>' +
          '<div class="note-actions-row">' +
          '<button type="button" class="note-ok" title="Guardar (Ctrl+Enter)">💾</button>' +
          '</div>';
        const ta = noteBox.querySelector('textarea');
        const closeNote = ()=>{ noteBox.classList.remove('open'); };
        const saveAndCollapse = ()=>{ notes[id] = ta.value; saveNotes(); noteBox.classList.remove('open'); renderReader(); };
        noteBox.querySelector('.note-close').onclick = (e)=>{ e.stopPropagation(); closeNote(); };
        noteBox.querySelector('.note-ok').onclick = (e)=>{ e.stopPropagation(); saveAndCollapse(); };
        noteBox.querySelector('.note-trash').onclick = (e)=>{
          e.stopPropagation();
          delete notes[id];
          saveNotes();
          renderReader();
        };
        ta.oninput = ()=>{ notes[id] = ta.value; saveNotes(); };
        ta.onkeydown = (e)=>{
          if(e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeNote(); }
          if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); saveAndCollapse(); }
        };
        noteBtn.onclick = (e)=>{
          e.stopPropagation();
          const willOpen = !noteBox.classList.contains('open');
          noteBox.classList.toggle('open');
          if(willOpen) ta.focus();
        };
        const bodyEl = row.querySelector('.verse-body') || row;
        bodyEl.appendChild(actions);
        bodyEl.appendChild(noteBox);
      } else {
        const bodyEl = row.querySelector('.verse-body') || row;
        bodyEl.appendChild(actions);
      }
      if(isLastSelected){
        const copyBtn = document.createElement('div');
        copyBtn.className = 'vaction vaction-copy';
        copyBtn.textContent = '📋 Copiar';
        copyBtn.title = 'Copiar referencia y texto de la selección';
        copyBtn.onclick = (e)=>{ e.stopPropagation(); seferCopySelectedVerses(copyBtn); };
        actions.appendChild(copyBtn);
      }
    }

    verseParent.appendChild(row);
  });
  // Restaurar scroll y re-montar flechas sobre #reader-verses
  requestAnimationFrame(()=>{
    try{ setupReaderVersesScrollRail(); }catch(e){}
    if(keepScroll){
      const sc = document.getElementById('reader-verses') || reader;
      if(sc) sc.scrollTop = prevScroll;
    }
  });
}


function seferFormatSelectedVersesForCopy(){
  const nums = (selectedVerses || []).map(String).filter(Boolean)
    .sort((a,b)=> (+a) - (+b));
  if(!nums.length || !currentBook || !currentChap) return '';
  const chapData = ((typeof BIBLE !== 'undefined' && BIBLE[currentBook]) || {})[currentChap] || {};
  const clean = (s)=> String(s || '').replace(/\s+/g, ' ').trim();
  if(nums.length === 1){
    const v = nums[0];
    return currentBook + ' ' + currentChap + ':' + v + ' "' + clean(chapData[v]) + '"';
  }
  let consecutive = true;
  for(let i = 1; i < nums.length; i++){
    if((+nums[i]) !== (+nums[i-1]) + 1){ consecutive = false; break; }
  }
  const ref = consecutive
    ? (currentBook + ' ' + currentChap + ':' + nums[0] + '-' + nums[nums.length - 1])
    : (currentBook + ' ' + currentChap + ':' + nums.join(','));
  const lines = nums.map(function(v){
    return v + ' "' + clean(chapData[v]) + '"';
  });
  return ref + '\n' + lines.join('\n');
}

function seferCopySelectedVerses(btn){
  const text = seferFormatSelectedVersesForCopy();
  if(!text) return;
  const done = function(ok){
    if(!btn) return;
    const prev = btn.textContent;
    btn.textContent = ok ? '✓ Copiado' : 'Error';
    setTimeout(function(){ try{ btn.textContent = prev; }catch(e){} }, 1200);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(function(){ done(true); }).catch(function(){
      try{
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done(true);
      }catch(e){ done(false); }
    });
  } else {
    try{
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done(true);
    }catch(e){ done(false); }
  }
}


function setVerseSelected(vnum, on){
  const i = selectedVerses.indexOf(vnum);
  if(on && i === -1) selectedVerses.push(vnum);
  if(!on && i !== -1) selectedVerses.splice(i,1);
  if(selectedVerses.length === 0){
    if(clearSelBtn){ clearSelBtn.classList.remove('is-visible'); clearSelBtn.style.visibility = 'hidden'; }
    if(bar) bar.classList.remove('has-sel');
    if(easyBtn) easyBtn.style.display = '';
    selectionUIActive = false;
  } else {
    if(clearSelBtn){ clearSelBtn.classList.add('is-visible'); clearSelBtn.style.visibility = 'visible'; }
    if(bar) bar.classList.add('has-sel');
    if(easyBtn) easyBtn.style.display = '';
    selectionUIActive = true;
  }
  updateSelectionUI();
  renderReader();
}
function toggleSelect(vnum){
  setVerseSelected(vnum, selectedVerses.indexOf(vnum) === -1);
}



(function(){
  if(typeof renderReader === 'function' && !renderReader.__seferHighlightWrapped){
    const orig = renderReader;
    window.renderReader = function(){
      const r = orig.apply(this, arguments);
      try{ if(typeof applyWordHighlightsToElement==='function') applyWordHighlightsToElement(document.getElementById('reader-verses')||document.getElementById('reader')); }catch(e){}
      return r;
    };
    renderReader.__seferHighlightWrapped = true;
  }
})();


/* Aplicar subrayados por versículo al renderizar lector */
(function(){
  function enhance(){
    if(typeof window.formatVerseHtml !== 'function') return;
    if(window.formatVerseHtml.__seferHl) return;
    const orig = window.formatVerseHtml;
    window.formatVerseHtml = function(text, isJesus){
      let html = orig.apply(this, arguments);
      try{
        if(typeof applyHighlightsToVerseHtml === 'function' && typeof currentBook !== 'undefined' && typeof currentChap !== 'undefined'){
          // vnum no está disponible aquí; se aplica en el loop si expone data-v
        }
      }catch(e){}
      return html;
    };
    window.formatVerseHtml.__seferHl = true;
  }
  setTimeout(enhance, 0);
})();

(function wrapRenderReaderHighlights(){
  function wrap(){
    if(typeof renderReader !== 'function' || renderReader.__hlWrap2) return;
    const orig = renderReader;
    window.renderReader = function(){
      const r = orig.apply(this, arguments);
      try{
        document.querySelectorAll('#reader-verses .verse, #reader .verse').forEach(row=>{
          const vnumEl = row.querySelector('.vnum');
          const vnum = vnumEl ? (vnumEl.getAttribute('data-v') || vnumEl.textContent || '').replace(/\D/g,'') : '';
          if(!vnum || typeof currentBook==='undefined') return;
          const body = row.querySelector('.vtext, .verse-text, .v-body') || row;
          // Re-aplicar sobre texto: si ya hay marks, ok; si no, reconstruir desde highlights
          if(typeof getHighlightsForVerse==='function'){
            const list = getHighlightsForVerse(currentBook, currentChap, vnum);
            if(!list.length) return;
            // Si el cuerpo solo tiene spans .w, unir texto y reaplicar marks de forma simple
            list.forEach(h=>{
              const phrase = h.text;
              if(!phrase) return;
              // marcar spans .w consecutivos que formen la frase es complejo; usar HTML del row
              if(body.innerHTML && body.innerHTML.indexOf('sefer-hl') === -1){
                const plain = body.textContent || '';
                if(plain.toLowerCase().indexOf(phrase.toLowerCase()) === -1) return;
                // rebuild from plain text with marks, preserving structure roughly
                let html = plain;
                if(typeof applyHighlightsToVerseHtml==='function'){
                  html = applyHighlightsToVerseHtml(plain, currentBook, currentChap, vnum);
                  // Keep vnum if body is whole row - skip if dangerous
                  const vtext = row.querySelector('.vtext, .verse-text');
                  if(vtext) vtext.innerHTML = html;
                }
              }
            });
          }
        });
      }catch(e){}
      return r;
    };
    renderReader.__hlWrap2 = true;
  }
  setTimeout(wrap, 0);
  setTimeout(wrap, 200);
})();
