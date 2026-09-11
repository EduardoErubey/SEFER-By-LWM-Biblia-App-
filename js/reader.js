/* SEFER module: reader.js — script clásico (sin import/export) */

/* --- SEFER reader.js lines 665-778 --- */
/* =========================================================
   READER
   ========================================================= */
/* dom ref hoisted */
/* dom ref hoisted */
/* dom ref hoisted */
/* dom ref hoisted */

function getBookMeta(book){
  const entry = BOOK_ORDER.find(e=>e.name===book);
  const testament = entry?.testament || 'AT';
  const list = BOOK_ORDER.filter(e=>e.testament===testament);
  const num = list.findIndex(e=>e.name===book) + 1;
  return {testament, num: num > 0 ? num : 0};
}
function formatBookHeading(book, chap, verse){
  const {testament, num} = getBookMeta(book);
  const tName = testament === 'NT' ? 'Nuevo Testamento' : 'Antiguo Testamento';
  let ref = book;
  if(chap != null && chap !== ''){
    ref += ':' + chap;
    if(verse != null && verse !== '') ref += ':' + verse;
  }
  const libro = num ? `Libro ${num}` : 'Libro';
  return `${tName}: ${libro} [${ref}]`;
}
function goTo(book, chap){
  try{ if(typeof trackBookRead==='function') trackBookRead(book); }catch(e){}
  showWelcome = false;
  currentBook = book; currentChap = chap; detailVerse = null;
  selectedVerses = [];
  selectionUIActive = false;
  updateSelectionUI();
  updateProjectBtnVisibility();
  document.getElementById('side').classList.remove('open');
  document.getElementById('side-backdrop')?.classList.remove('open');
  sidePanel = null;
  document.getElementById('notes-btn')?.classList.remove('active-panel');
  document.getElementById('favs-btn')?.classList.remove('active-panel');
  const _heading = formatBookHeading(book, chap);
  currentRef.textContent = _heading;
  currentRef.title = _heading;
  // Mantener el libro visible en la navegación
  const entry = BOOK_ORDER.find(e=>e.name===book);
  if(entry) openTestaments.add(entry.testament);
  openBooks.add(book);
  renderReader();
}
function updateProjectBtnVisibility(){
  const btn = document.getElementById('project-btn');
  if(!btn) return;
  // Visible al leer, o en bienvenida solo durante el tour
  btn.style.display = (showWelcome && !seferTourActive) ? 'none' : '';
}
function showWelcomeScreen(){
  showWelcome = true;
  detailVerse = null;
  selectedVerses = [];
  selectionUIActive = false;
  updateSelectionUI();
  updateProjectBtnVisibility();
  currentRef.textContent = 'Inicio';
  currentRef.title = 'Inicio';
  renderReader();
}

function sortedVerseNums(book, chap){
  return Object.keys((BIBLE[book]||{})[chap] || {}).sort((a,b)=>+a-+b);
}

function formatSelectionLabel(){
  if(!selectedVerses.length) return '';
  const nums = [...selectedVerses].sort((a,b)=>+a-+b);
  if(nums.length === 1) return 'Has marcado el versículo ' + nums[0] + '.';
  return 'Has marcado ' + nums.length + ' versículos: ' + nums.join(', ') + '.';
}
function updateSelectionUI(){
  const bar = document.getElementById('selection-bar');
  const easyBtn = document.getElementById('easy-btn');
  const stickySel = document.getElementById('reader-sel-status');
  const label = formatSelectionLabel();
  if(selectionInfo) selectionInfo.textContent = label;
  if(stickySel) stickySel.textContent = label;
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
  updateProjectBtnVisibility();
}
clearSelBtn.onclick = ()=>{ selectedVerses = []; selectionUIActive = false; updateSelectionUI(); renderReader(); };

function applyVerseFont(){
  try{
    const fonts = (typeof SEFER_FONTS!=='undefined' && SEFER_FONTS) ? SEFER_FONTS : [];
    const f = fonts.find(x=>x.id===verseFontFamily) || fonts[0];
    const stack = f ? f.stack : "Georgia, serif";
    const size = (typeof verseFontSize!=='undefined'?verseFontSize:17) + 'px';
    document.documentElement.style.setProperty('--verse-size', size);
    document.documentElement.style.setProperty('--verse-font', stack);
    if(reader){
      reader.style.setProperty('--verse-size', size);
      reader.style.setProperty('--verse-font', stack);
      reader.style.fontFamily = stack;
      reader.querySelectorAll('.verse').forEach(el=>{ el.style.fontFamily = stack; });
    }
  }catch(e){}
}


/* Aplicar 🖍️ Resaltar (palabras guardadas) al área de lectura */
(function(){
  const tryWrap = function(){
    if(typeof window.renderReader !== 'function') return;
    if(window.renderReader.__seferHighlightWrapped) return;
    const orig = window.renderReader;
    window.renderReader = function(){
      const r = orig.apply(this, arguments);
      try{
        if(typeof applyWordHighlightsToElement === 'function'){
          applyWordHighlightsToElement(document.getElementById('reader-verses') || document.getElementById('reader'));
        }
      }catch(e){}
      return r;
    };
    window.renderReader.__seferHighlightWrapped = true;
  };
  setTimeout(tryWrap, 0);
  setTimeout(tryWrap, 100);
})();
