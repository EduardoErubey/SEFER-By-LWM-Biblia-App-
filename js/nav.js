/* SEFER module: nav.js — script clásico (sin import/export) */

/* --- SEFER nav.js lines 407-664 --- */
/* =========================================================
   NAV — expandir/contraer por clic; botón reiniciar
   ========================================================= */
/* dom ref hoisted */
const navToggleBtn = document.getElementById('nav-toggle');

// Testamentos y libros abiertos (persistidos)
let openTestaments = new Set(store.get('bp_open_testaments', ['AT','NT']));
let openBooks = new Set(store.get('bp_open_books', []));

function saveNavState(){
  store.set('bp_open_testaments', [...openTestaments]);
  store.set('bp_open_books', [...openBooks]);
}

navToggleBtn.onclick = ()=>{
  openTestaments.clear();
  openBooks.clear();
  saveNavState();
  renderBookList();
  // Reiniciar tamaño de texto
  verseFontSize = DEFAULT_VERSE_FONT;
  store.set('bp_verse_font', verseFontSize);
  applyVerseFont();
  // Limpiar barra de búsqueda de referencias
  const rs = document.getElementById('ref-search');
  if(rs){ rs.value = ''; }
  const ac = document.getElementById('ref-autocomplete');
  if(ac){ ac.innerHTML = ''; ac.style.display = 'none'; }
  // Cerrar paneles laterales y búsqueda de palabras
  closeSidePanel();
  if(typeof closeWordSearch === 'function') closeWordSearch();
  showWelcomeScreen();
};

/** Lista ordenada para navegar ? : AT → libros AT → NT → libros NT */
let infoNavList = [];
let infoNavIndex = -1;
let infoNavEnabled = false; // false en Instrucciones u otros modales sin secuencia

function buildInfoNavList(){
  infoNavList = [];
  infoNavList.push({type:'testament', id:'AT'});
  BOOK_ORDER.filter(e=>e.testament==='AT').forEach(e=> infoNavList.push({type:'book', id:e.name}));
  infoNavList.push({type:'testament', id:'NT'});
  BOOK_ORDER.filter(e=>e.testament==='NT').forEach(e=> infoNavList.push({type:'book', id:e.name}));
}
buildInfoNavList();

function renderInfoContent(item){
  if(!item) return;
  if(item.type === 'testament'){
    const t = TESTAMENT_INFO[item.id];
    if(!t){
      document.getElementById('im-title').textContent = item.id;
      document.getElementById('im-sub').textContent = '';
      document.getElementById('im-body').innerHTML = '<div class="im-text">Sin información.</div>';
      return;
    }
    document.getElementById('im-title').textContent = t.seccion;
    document.getElementById('im-sub').textContent = 'Introducción';
    document.getElementById('im-body').innerHTML =
      `<div class="im-block"><div class="im-label">Significado del nombre</div><div class="im-text">${t.significado_nombre||''}</div></div>` +
      `<div class="im-block"><div class="im-label">Descripción</div><div class="im-text">${t.descripcion||''}</div></div>`;
  } else {
    const b = BOOK_INFO_MAP[item.id];
    if(!b){
      document.getElementById('im-title').textContent = item.id;
      document.getElementById('im-sub').textContent = '';
      document.getElementById('im-body').innerHTML = '<div class="im-text">Sin información para este libro.</div>';
      return;
    }
    const a = b.autor || {};
    document.getElementById('im-title').textContent = b.libro;
    document.getElementById('im-sub').textContent = b.testamento || '';
    document.getElementById('im-body').innerHTML =
      `<div class="im-block"><div class="im-label">Significado del nombre</div><div class="im-text">${b.significado_nombre||''}</div></div>` +
      `<div class="im-block"><div class="im-label">Autor</div><div class="im-text"><strong>${a.nombre||'—'}</strong><br>${a.biografia||''}` +
      (a.nacimiento ? `<br><em>Nacimiento:</em> ${a.nacimiento}` : '') +
      (a.fallecimiento ? `<br><em>Fallecimiento:</em> ${a.fallecimiento}` : '') +
      `</div></div>` +
      `<div class="im-block"><div class="im-label">Fecha de escritura</div><div class="im-text">${b.fecha_escritura||'—'}</div></div>` +
      `<div class="im-block"><div class="im-label">Idioma original</div><div class="im-text">${b.idioma_original||'—'}</div></div>` +
      `<div class="im-block"><div class="im-label">Resumen</div><div class="im-text">${b.resumen||''}</div></div>`;
  }
}
function updateInfoNavButtons(){
  const nav = document.getElementById('im-nav');
  if(!infoNavEnabled){ nav.style.display = 'none'; return; }
  nav.style.display = 'flex';
  document.getElementById('im-prev').disabled = infoNavIndex <= 0;
  document.getElementById('im-next').disabled = infoNavIndex >= infoNavList.length - 1;
}
function focusInfoScroll(){
  const sc = document.getElementById('im-scroll');
  if(sc){
    sc.focus({preventScroll:true});
    sc.scrollTop = 0;
  }
}
function openInfoAt(index){
  if(index < 0 || index >= infoNavList.length) return;
  infoNavIndex = index;
  infoNavEnabled = true;
  renderInfoContent(infoNavList[infoNavIndex]);
  updateInfoNavButtons();
  document.getElementById('info-modal').classList.add('open');
  focusInfoScroll();
}
function showTestamentInfo(testament){
  const idx = infoNavList.findIndex(x => x.type==='testament' && x.id===testament);
  openInfoAt(idx >= 0 ? idx : 0);
}
function showBookInfo(bookName){
  const idx = infoNavList.findIndex(x => x.type==='book' && x.id===bookName);
  if(idx < 0){ alert('No hay información disponible para este libro.'); return; }
  openInfoAt(idx);
}
function infoNavStep(delta){
  if(!infoNavEnabled) return;
  const next = infoNavIndex + delta;
  if(next < 0 || next >= infoNavList.length) return;
  openInfoAt(next);
}
(function initInfoModal(){
  const modal = document.getElementById('info-modal');
  if(!modal) return;
  modal.querySelector('.im-close').onclick = ()=> modal.classList.remove('open');
  modal.addEventListener('click', (e)=>{ if(e.target === modal) modal.classList.remove('open'); });
  document.getElementById('im-prev').onclick = ()=> infoNavStep(-1);
  document.getElementById('im-next').onclick = ()=> infoNavStep(1);
  document.addEventListener('keydown', (e)=>{
    if(!modal.classList.contains('open')) return;
    if(e.key === 'Escape'){ e.preventDefault(); modal.classList.remove('open'); return; }
    // Scroll del contenido con ↑ ↓ (sin necesitar clic previo)
    if(e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp' || e.key === 'Home' || e.key === 'End'){
      const sc = document.getElementById('im-scroll');
      if(sc){
        e.preventDefault();
        const step = e.key === 'PageDown' || e.key === 'PageUp' ? sc.clientHeight * 0.85 : 48;
        if(e.key === 'ArrowDown' || e.key === 'PageDown') sc.scrollTop += step;
        else if(e.key === 'ArrowUp' || e.key === 'PageUp') sc.scrollTop -= step;
        else if(e.key === 'Home') sc.scrollTop = 0;
        else if(e.key === 'End') sc.scrollTop = sc.scrollHeight;
      }
      return;
    }
    if(infoNavEnabled && e.key === 'ArrowLeft'){ e.preventDefault(); infoNavStep(-1); }
    if(infoNavEnabled && e.key === 'ArrowRight'){ e.preventDefault(); infoNavStep(1); }
  });
})();

function renderBookList(){
  bookList.innerHTML = '';
  let lastTestament = null;

  BOOK_ORDER.forEach(entry=>{
    const book = entry.name;
    const testament = entry.testament;

    if(testament !== lastTestament){
      const isOpen = openTestaments.has(testament);
      const label = document.createElement('div');
      label.className = 'testament-label';
      const tName = testament === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento';
      label.innerHTML =
        `<span class="t-label-text" tabindex="0" role="button"><span class="t-chevron">${isOpen ? '▾' : '▸'}</span> ${tName}</span>` +
        `<button type="button" class="info-btn" title="Información sobre ${tName}">📚</button>`;
      const toggleTest = ()=>{
        if(openTestaments.has(testament)) openTestaments.delete(testament);
        else openTestaments.add(testament);
        saveNavState();
        renderBookList();
      };
      label.querySelector('.t-label-text').onclick = toggleTest;
      label.querySelector('.t-label-text').onkeydown = (e)=>{
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleTest(); }
      };
      label.querySelector('.info-btn').onclick = (e)=>{
        e.stopPropagation();
        showTestamentInfo(testament);
      };
      bookList.appendChild(label);
      lastTestament = testament;
    }

    if(!openTestaments.has(testament)) return;

    const has = !!BIBLE[book];
    const bookOpen = openBooks.has(book);
    const item = document.createElement('div');
    item.className = 'book-item' + (book===currentBook?' active':'');
    item.tabIndex = 0;
    item.setAttribute('role','button');
    item.innerHTML =
      `<span>${book}${has && bookOpen ? '<span class="b-chevron">▾</span>' : (has ? '<span class="b-chevron">▸</span>' : '')}</span>` +
      (has?'':'<span style="font-size:10px;opacity:.5;">— sin datos</span>') +
      `<button type="button" class="info-btn" title="Información sobre ${book}">📚</button>`;
    item.querySelector('.info-btn').onclick = (e)=>{
      e.stopPropagation();
      showBookInfo(book);
    };
    const activateBook = ()=>{
      if(!has) return;
      if(book === currentBook && openBooks.has(book)){
        openBooks.delete(book);
        saveNavState();
        renderBookList();
        return;
      }
      openBooks.add(book);
      const chaps = Object.keys(BIBLE[book]).sort((a,b)=>+a-+b);
      const chap = (book === currentBook && chaps.includes(String(currentChap))) ? currentChap : chaps[0];
      goTo(book, chap);
      saveNavState();
      renderBookList();
    };
    item.addEventListener('click', (e)=>{
      if(e.target.closest('.info-btn')) return;
      activateBook();
    });
    item.addEventListener('keydown', (e)=>{
      if(e.target.closest('.info-btn')) return;
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activateBook(); }
    });
    bookList.appendChild(item);

    if(bookOpen && has){
      renderChapters(book, item);
    }
  });
}
function renderChapters(book, afterEl){
  const strip = document.createElement('div');
  strip.className = 'chap-strip open';
  Object.keys(BIBLE[book]).sort((a,b)=>+a-+b).forEach(ch=>{
    const pill = document.createElement('div');
    pill.className = 'chap-pill' + (ch===currentChap && book===currentBook ? ' active':'');
    pill.textContent = ch;
    pill.tabIndex = 0;
    pill.setAttribute('role','button');
    const goChap = (e)=>{
      if(e) e.stopPropagation();
      currentChap = ch;
      goTo(book, ch);
      openBooks.add(book);
      saveNavState();
      renderBookList();
    };
    pill.onclick = goChap;
    pill.onkeydown = (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); goChap(e); }
    };
    strip.appendChild(pill);
  });
  afterEl.insertAdjacentElement('afterend', strip);
}

