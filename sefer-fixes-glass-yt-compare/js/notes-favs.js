/* SEFER module: notes-favs.js — script clásico (sin import/export) */

/* --- SEFER notes-favs.js lines 1914-2178 --- */
/* =========================================================
   NOTAS y FAVORITOS — panel lateral (segundo clic cierra)
   ========================================================= */
function closeSidePanel(){
  side.classList.remove('open');
  document.getElementById('side-backdrop')?.classList.remove('open');
  sidePanel = null;
  document.getElementById('notes-btn')?.classList.remove('active-panel');
  document.getElementById('favs-btn')?.classList.remove('active-panel');
  document.getElementById('sermons-btn')?.classList.remove('active-panel');
  document.getElementById('meanings-btn')?.classList.remove('active-panel');
}
function openSideChrome(){
  side.classList.add('open');
  document.getElementById('side-backdrop')?.classList.add('open');
}
document.getElementById('side-backdrop')?.addEventListener('click', ()=>{ if(typeof closeSidePanel==='function') closeSidePanel(); });
function sidePanelHeader(titleHtml){
  return `<h3><button type="button" class="side-close-btn" title="Cerrar panel">❌</button>${titleHtml}</h3>`;
}
function bindSideClose(){
  const btn = side.querySelector('.side-close-btn');
  if(btn) btn.onclick = (e)=>{ e.stopPropagation(); closeSidePanel(); };
}
// Agrega HTML al panel lateral SIN destruir nodos/listeners ya existentes
// (side.innerHTML += ... reconstruye todo el árbol, incluido el botón ❌,
// y pierde el onclick asignado por bindSideClose()).
function appendSideMsg(html){
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  while(wrap.firstChild) side.appendChild(wrap.firstChild);
}
function focusSidePanel(){
  requestAnimationFrame(()=>{
    const first = side.querySelector('.result-item, button.btn, .sermon-editor input, [tabindex="0"]');
    if(first) first.focus({preventScroll:true});
    else side.focus({preventScroll:true});
  });
}
function openNotesPanel(){
  side.innerHTML = sidePanelHeader('📝 Mis notas');
  bindSideClose();
  const entries = Object.entries(notes).filter(([k,v])=>v && v.trim());
  if(entries.length===0){
    appendSideMsg(`<div class="empty-msg">Aún no tienes notas guardadas. Selecciona un versículo y añade una.</div>`);
  }
  entries.forEach(([ref, text])=>{
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `<div class="result-ref">${ref}</div><div class="result-text">${text}</div><button type="button" class="note-del" title="Eliminar nota">🗑</button>`;
    item.querySelector('.note-del').onclick = (e)=>{
      e.stopPropagation();
      if(!confirm('¿Eliminar esta nota? Se moverá a la papelera.')) return;
      moveNoteToTrash(ref);
      openNotesPanel();
      renderReader();
    };
    item.onclick = ()=>{
      const [book, rest] = ref.split(/ (?=[^ ]+$)/);
      const [ch, v] = rest.split(':');
      goTo(book, ch); detailVerse = v; renderReader(); closeSidePanel(); renderBookList();
    };
    side.appendChild(item);
  });
  // export JSON eliminado
  const trashBtn = document.createElement('div');
  trashBtn.className = 'trash-link';
  trashBtn.innerHTML = `🗑 Papelera de notas${notesTrash.length ? ` (${notesTrash.length})` : ''}`;
  trashBtn.onclick = ()=> openNotesTrashPanel();
  side.appendChild(trashBtn);
  openSideChrome();
  side.tabIndex = -1;
  sidePanel = 'notes';
  document.getElementById('notes-btn').classList.add('active-panel');
  document.getElementById('favs-btn')?.classList.remove('active-panel');
  document.getElementById('sermons-btn')?.classList.remove('active-panel');
  document.getElementById('meanings-btn')?.classList.remove('active-panel');
  focusSidePanel();
}
function openNotesTrashPanel(){
  side.innerHTML = sidePanelHeader('🗑 Papelera de notas');
  bindSideClose();
  if(notesTrash.length === 0){
    appendSideMsg(`<div class="empty-msg">La papelera está vacía.</div>`);
  } else {
    const actions = document.createElement('div');
    actions.className = 'trash-actions';
    const emptyBtn = document.createElement('button');
    emptyBtn.className = 'btn';
    emptyBtn.textContent = 'Vaciar papelera';
    emptyBtn.onclick = ()=>{
      if(!confirm('¿Vaciar la papelera de forma permanente?')) return;
      notesTrash = [];
      saveNotesTrash();
      openNotesTrashPanel();
    };
    actions.appendChild(emptyBtn);
    side.appendChild(actions);
    notesTrash.forEach((entry, idx)=>{
      const item = document.createElement('div');
      item.className = 'result-item';
      item.innerHTML = `<div class="result-ref">${entry.ref}</div><div class="result-text">${entry.text}</div>
        <button type="button" class="note-del" title="Eliminar definitivamente">🗑</button>`;
      const restore = document.createElement('button');
      restore.className = 'btn';
      restore.style.cssText = 'margin-top:6px;font-size:11px;padding:4px 8px;';
      restore.textContent = 'Restaurar';
      restore.onclick = (e)=>{
        e.stopPropagation();
        notes[entry.ref] = entry.text;
        saveNotes();
        notesTrash.splice(idx, 1);
        saveNotesTrash();
        openNotesTrashPanel();
        renderReader();
      };
      item.appendChild(restore);
      item.querySelector('.note-del').onclick = (e)=>{
        e.stopPropagation();
        notesTrash.splice(idx, 1);
        saveNotesTrash();
        openNotesTrashPanel();
      };
      item.onclick = (e)=>{
        if(e.target.closest('button')) return;
        const [book, rest] = entry.ref.split(/ (?=[^ ]+$)/);
        const [ch, v] = rest.split(':');
        goTo(book, ch); detailVerse = v; renderReader(); closeSidePanel(); renderBookList();
      };
      side.appendChild(item);
    });
  }
  const back = document.createElement('div');
  back.className = 'trash-link';
  back.innerHTML = '← Volver a mis notas';
  back.onclick = ()=> openNotesPanel();
  side.appendChild(back);
  openSideChrome();
  sidePanel = 'trash';
  document.getElementById('notes-btn').classList.add('active-panel');
  document.getElementById('favs-btn').classList.remove('active-panel');
}
function openFavsPanel(){
  side.innerHTML = sidePanelHeader('♥ Mis favoritos');
  bindSideClose();
  const entries = Object.entries(favorites).filter(([k,v])=>v);
  if(entries.length===0){
    appendSideMsg(`<div class="empty-msg">Aún no tienes favoritos. Abre un versículo y marca ♡ Favorito.</div>`);
  }
  entries.forEach(([ref])=>{
    const item = document.createElement('div');
    item.className = 'result-item';
    let preview = '';
    const m = ref.match(/^(.+) (\d+):(\d+)$/);
    if(m && BIBLE[m[1]] && BIBLE[m[1]][m[2]] && BIBLE[m[1]][m[2]][m[3]]){
      preview = BIBLE[m[1]][m[2]][m[3]];
    }
    item.innerHTML =
      `<button type="button" class="fav-del" title="Quitar de favoritos">🗑</button>` +
      `<div class="result-ref">${ref}</div>` +
      (preview ? `<div class="result-text">${preview}</div>` : '');
    item.tabIndex = 0;
    item.setAttribute('role','button');
    item.querySelector('.fav-del').onclick = (e)=>{
      e.stopPropagation();
      delete favorites[ref];
      saveFavorites();
      openFavsPanel();
      if(!showWelcome) renderReader();
    };
    item.onclick = (e)=>{
      if(e.target.closest('.fav-del')) return;
      if(!m) return;
      goTo(m[1], m[2]); detailVerse = m[3]; renderReader(); closeSidePanel(); renderBookList();
      scrollVerseIntoView(m[3]);
    };
    item.onkeydown = (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        if(!m) return;
        goTo(m[1], m[2]); detailVerse = m[3]; renderReader(); closeSidePanel(); renderBookList();
        scrollVerseIntoView(m[3]);
      }
      if(e.key === 'Delete' || e.key === 'Backspace'){
        e.preventDefault();
        delete favorites[ref];
        saveFavorites();
        openFavsPanel();
        if(!showWelcome) renderReader();
      }
    };
    side.appendChild(item);
  });
  // export JSON eliminado — sincronización solo por Nube
  openSideChrome();
  side.tabIndex = -1;
  sidePanel = 'favs';
  document.getElementById('favs-btn').classList.add('active-panel');
  document.getElementById('notes-btn')?.classList.remove('active-panel');
  document.getElementById('sermons-btn')?.classList.remove('active-panel');
  document.getElementById('meanings-btn')?.classList.remove('active-panel');
  focusSidePanel();
}
document.getElementById('notes-btn').onclick = ()=>{
  if(sidePanel === 'notes' || sidePanel === 'trash'){ closeSidePanel(); return; }
  openNotesPanel();
};
document.getElementById('favs-btn').onclick = ()=>{
  if(sidePanel === 'favs'){ closeSidePanel(); return; }
  openFavsPanel();
};

/* Significados guardados */
let savedMeanings = store.get('bp_saved_meanings', {});
function saveMeaningsStore(){ store.set('bp_saved_meanings', savedMeanings); }
function openMeaningsPanel(){
  side.innerHTML = sidePanelHeader('📚 Significados guardados');
  bindSideClose();
  const entries = Object.entries(savedMeanings);
  if(!entries.length){
    appendSideMsg(`<div class="empty-msg">Aún no hay significados guardados. Consulta una palabra y pulsa 💾 Guardar.</div>`);
  }
  entries.forEach(([term, data])=>{
    const item = document.createElement('div');
    item.className = 'result-item';
    item.tabIndex = 0;
    item.innerHTML =
      `<button type="button" class="fav-del" title="Eliminar">🗑</button>` +
      `<div class="result-ref">${term}</div>` +
      `<div class="result-text">${(data.def||'').slice(0,200)}${(data.def||'').length>200?'…':''}</div>` +
      (data.source ? `<div style="font-size:10.5px;color:var(--ink-soft);margin-top:4px;">${data.source}</div>` : '');
    item.querySelector('.fav-del').onclick = (e)=>{
      e.stopPropagation();
      delete savedMeanings[term];
      saveMeaningsStore();
      openMeaningsPanel();
    };
    item.onclick = (e)=>{
      if(e.target.closest('.fav-del')) return;
      showWordPopup(term, window.innerWidth/2, window.innerHeight/3);
      const defEl = wordPopup.querySelector('.wp-def');
      const srcEl = wordPopup.querySelector('.wp-source');
      defEl.textContent = data.def || '';
      srcEl.textContent = data.source || 'Guardado localmente';
    };
    item.onkeydown = (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); item.click(); }
      if(e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); item.querySelector('.fav-del').click(); }
    };
    side.appendChild(item);
  });
  openSideChrome();
  side.tabIndex = -1;
  sidePanel = 'meanings';
  document.getElementById('meanings-btn')?.classList.add('active-panel');
  document.getElementById('notes-btn')?.classList.remove('active-panel');
  document.getElementById('favs-btn')?.classList.remove('active-panel');
  document.getElementById('sermons-btn')?.classList.remove('active-panel');
  focusSidePanel();
}
document.getElementById('meanings-btn').onclick = ()=>{
  if(sidePanel === 'meanings'){ closeSidePanel(); return; }
  openMeaningsPanel();
};

