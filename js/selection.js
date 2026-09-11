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
  hint.textContent = 'Toca un versículo para ver opciones (favorito o nota). Doble clic en una palabra para ver su significado. Marca la casilla para elegir varios versículos.';
  const headRow = document.createElement('div');
  headRow.id = 'reader-head-row';
  headRow.className = 'reader-head-row';
  const selWrap = document.createElement('div');
  selWrap.id = 'reader-sel-wrap';
  selWrap.className = 'reader-sel-wrap';
  const selSt = document.createElement('div');
  selSt.id = 'reader-sel-status';
  selSt.textContent = formatSelectionLabel();
  selWrap.appendChild(selSt);
  if(selectedVerses.length){
    const clr = document.createElement('button');
    clr.type = 'button';
    clr.className = 'btn';
    clr.id = 'reader-clear-sel';
    clr.textContent = 'Quitar marcas';
    clr.onclick = ()=>{ selectedVerses = []; selectionUIActive = false; updateSelectionUI(); renderReader(); };
    selWrap.appendChild(clr);
  }
  headRow.appendChild(hint);
  headRow.appendChild(selWrap);
  head.appendChild(bt);
  head.appendChild(ct);
  head.appendChild(headRow);
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
    const bodyHtml = `<span class="vnum">${vnum}</span>${formatVerseHtml(text, !!jesusMap[vnum])}${flags}`;
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
      const sel = window.getSelection();
      if(e && e.type === 'click' && sel && sel.toString().trim().length > 0) return;
      if(e && e.target && e.target.classList && e.target.classList.contains('w')){
        // Un clic en palabra solo abre el versículo (significado = doble clic)
        detailVerse = vnum;
        selectionUIActive = true;
        renderReader();
        return;
      }
      // Clic en versículo: abre acciones y muestra casilla de ese versículo
      if(detailVerse === vnum){
        detailVerse = null;
        if(selectedVerses.length === 0) selectionUIActive = false;
      } else {
        detailVerse = vnum;
        selectionUIActive = true;
      }
      renderReader();
      requestAnimationFrame(()=>{
        const el = reader.querySelector(`.verse[data-vnum="${vnum}"]`);
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
      // Supr / Backspace: quitar favorito del versículo enfocado
      if((e.key === 'Delete' || e.key === 'Backspace') && favorites[id]){
        e.preventDefault();
        delete favorites[id];
        saveFavorites();
        renderReader();
      }
    };

    if(detailVerse === vnum){
      const actions = document.createElement('div');
      actions.className = 'verse-actions';

      const favBtn = document.createElement('div');
      favBtn.className = 'vaction' + (favorites[id] ? ' on':'');
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

      actions.appendChild(favBtn); actions.appendChild(noteBtn);

      const noteBox = document.createElement('div');
      noteBox.className = 'note-box';
      noteBox.innerHTML = `
        <div class="note-toolbar">
          <button type="button" class="note-trash" title="Eliminar nota">🗑</button>
          <button type="button" class="note-close" title="Cerrar (Esc)">❌</button>
        </div>
        <textarea placeholder="Escribe tu nota de exposición aquí…">${notes[id]||''}</textarea>
        <div class="note-actions-row">
          <button type="button" class="note-ok" title="Guardar (Ctrl+Enter)">💾</button>
        </div>`;
      const ta = noteBox.querySelector('textarea');
      const closeNote = ()=>{
        noteBox.classList.remove('open');
        if(!(notes[id]||'').trim()){ delete notes[id]; saveNotes(); }
      };
      const saveAndCollapse = ()=>{
        const val = ta.value;
        if(val && val.trim()){
          notes[id] = val;
          saveNotes();
        } else {
          delete notes[id];
          saveNotes();
        }
        // Contraer menú del versículo
        detailVerse = null;
        renderReader();
      };
      noteBox.querySelector('.note-close').onclick = (e)=>{ e.stopPropagation(); closeNote(); };
      noteBox.querySelector('.note-ok').onclick = (e)=>{ e.stopPropagation(); saveAndCollapse(); };
      noteBox.querySelector('.note-trash').onclick = (e)=>{
        e.stopPropagation();
        if(notes[id] && String(notes[id]).trim()){
          if(!confirm('¿Eliminar esta nota? Se moverá a la papelera.')) return;
          moveNoteToTrash(id);
        } else {
          delete notes[id];
          saveNotes();
        }
        detailVerse = null;
        renderReader();
      };
      // Guardar al escribir, pero no contraer hasta OK
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
