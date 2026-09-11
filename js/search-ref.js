/* SEFER module: search-ref.js — script clásico (sin import/export) */

/* --- SEFER search-ref.js lines 1288-1732 --- */
/* =========================================================
   BÚSQUEDA POR REFERENCIA (nav) — Génesis 1:1 | 1:1-5 | 1:1,3,6
   ========================================================= */
/* dom ref hoisted */
const refSearch = document.getElementById('ref-search');
const refSearchWrap = document.getElementById('ref-search-wrap');
const refPhAnim = document.getElementById('ref-ph-anim');

/* Placeholder animado del buscador */
const REF_PH_EXAMPLES = [
  'Buscador de versículos',
  'Génesis 1:1',
  'Juan 3:16',
  'Salmos 23:1',
  'Proverbios 3:5',
  'Romanos 8:28',
  'Filipenses 4:13',
  'Jeremías 29:11',
  'Mateo 6:33',
  'Isaías 41:10',
  '1 Corintios 13:4',
  'Josué 1:9'
];
let refPhIndex = 0;
let refPhTimer = null;
function updateRefPhVisibility(){
  if(!refSearchWrap || !refSearch) return;
  const has = !!(refSearch.value && refSearch.value.trim());
  refSearchWrap.classList.toggle('has-value', has);
}
function cycleRefPlaceholder(){
  if(!refPhAnim || !refSearch) return;
  if(document.activeElement === refSearch || (refSearch.value||'').trim()) return;
  refPhAnim.classList.add('fade');
  setTimeout(()=>{
    refPhIndex = (refPhIndex + 1) % REF_PH_EXAMPLES.length;
    refPhAnim.textContent = REF_PH_EXAMPLES[refPhIndex];
    refPhAnim.classList.remove('fade');
  }, 450);
}
function startRefPhCycle(){
  if(refPhTimer) clearInterval(refPhTimer);
  refPhTimer = setInterval(cycleRefPlaceholder, 2800);
}
if(refSearch){
  refSearch.addEventListener('focus', ()=>{
    refSearchWrap?.classList.add('focused');
  });
  refSearch.addEventListener('blur', ()=>{
    refSearchWrap?.classList.remove('focused');
    updateRefPhVisibility();
  });
  refSearch.addEventListener('input', updateRefPhVisibility);
  updateRefPhVisibility();
  startRefPhCycle();
}

function goToRandomVerse(){
  const books = (BOOK_ORDER||[]).map(e=>e.name).filter(n=>BIBLE[n] && Object.keys(BIBLE[n]).length);
  if(!books.length){ alert('No hay libros cargados todavía.'); return; }
  const book = books[Math.floor(Math.random()*books.length)];
  const chaps = Object.keys(BIBLE[book]).filter(c=>BIBLE[book][c] && Object.keys(BIBLE[book][c]).length);
  if(!chaps.length) return;
  const chap = chaps[Math.floor(Math.random()*chaps.length)];
  const verses = Object.keys(BIBLE[book][chap]);
  const v = verses[Math.floor(Math.random()*verses.length)];
  openTestaments.add(BOOK_ORDER.find(e=>e.name===book)?.testament || 'AT');
  openBooks.add(book);
  saveNavState();
  // Evitar scroll del documento (franja negra)
  try{
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }catch(e){}
  goTo(book, chap);
  detailVerse = String(v);
  selectionUIActive = false;
  selectedVerses = [String(v)];
  updateSelectionUI();
  renderReader();
  renderBookList();
  // Mostrar en modo proyectar
  stageFromDice = true;
  stageFromSearch = false;
  if(typeof openStage === 'function'){
    openStage(book, chap, [String(v)], 'single');
  }
  try{ updateStageExtraBtns(); }catch(e){}
  try{ updateStageCompareVisibility(); }catch(e){}
  try{ if(typeof bumpAchProgress==='function') bumpAchProgress('random_1',1); }catch(e){}
}
document.getElementById('random-verse-btn')?.addEventListener('click', goToRandomVerse);

function stripAccentsNav(s){
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}

function findBookName(query){
  const q = stripAccentsNav(query.trim());
  if(!q) return null;
  // Coincidencia exacta o que empiece igual (sin acentos)
  let best = null;
  for(const entry of BOOK_ORDER){
    const name = entry.name;
    const n = stripAccentsNav(name);
    if(n === q) return name;
    if(n.startsWith(q) && (!best || n.length < stripAccentsNav(best).length)) best = name;
  }
  // Alias frecuentes sin número (1 Samuel, etc.)
  const aliases = {
    'genesis':'Génesis','exodo':'Éxodo','levitico':'Levítico','numeros':'Números',
    'deuteronomio':'Deuteronomio','josue':'Josué','jueces':'Jueces','rut':'Rut',
    '1samuel':'1 Samuel','2samuel':'2 Samuel','1reyes':'1 Reyes','2reyes':'2 Reyes',
    '1cronicas':'1 Crónicas','2cronicas':'2 Crónicas','esdras':'Esdras','nehemias':'Nehemías',
    'ester':'Ester','job':'Job','salmos':'Salmos','salmo':'Salmos','proverbios':'Proverbios',
    'eclesiastes':'Eclesiastés','cantares':'Cantares','isaias':'Isaías','jeremias':'Jeremías',
    'lamentaciones':'Lamentaciones','ezequiel':'Ezequiel','daniel':'Daniel','oseas':'Oseas',
    'joel':'Joel','amos':'Amós','abdias':'Abdías','jonas':'Jonás','miqueas':'Miqueas',
    'nahum':'Nahúm','habacuc':'Habacuc','sofonias':'Sofonías','hageo':'Hageo',
    'zacarias':'Zacarías','malaquias':'Malaquías','mateo':'Mateo','marcos':'Marcos',
    'lucas':'Lucas','juan':'Juan','hechos':'Hechos','romanos':'Romanos',
    '1corintios':'1 Corintios','2corintios':'2 Corintios','galatas':'Gálatas','efesios':'Efesios',
    'filipenses':'Filipenses','colosenses':'Colosenses','1tesalonicenses':'1 Tesalonicenses',
    '2tesalonicenses':'2 Tesalonicenses','1timoteo':'1 Timoteo','2timoteo':'2 Timoteo',
    'tito':'Tito','filemon':'Filemón','hebreos':'Hebreos','santiago':'Santiago',
    '1pedro':'1 Pedro','2pedro':'2 Pedro','1juan':'1 Juan','2juan':'2 Juan','3juan':'3 Juan',
    'judas':'Judas','apocalipsis':'Apocalipsis'
  };
  const compact = q.replace(/\s+/g,'');
  if(aliases[compact]) return aliases[compact];
  if(best) return best;
  return null;
}

function parseVersesPart(book, chap, versePart){
  versePart = (versePart || '').trim();
  if(!versePart) return {book, chap, verses:null};

  // Rango: 1-5 · 1–5 · 1—5
  const range = versePart.match(/^(\d+)\s*[-–—]\s*(\d+)\s*$/);
  if(range){
    const a = parseInt(range[1],10), b = parseInt(range[2],10);
    const lo = Math.min(a,b), hi = Math.max(a,b);
    const verses = [];
    for(let i=lo;i<=hi;i++) verses.push(String(i));
    return {book, chap, verses};
  }
  // Lista: 1,3,6 · 1, 3, 6
  if(/^\d+(\s*,\s*\d+)+\s*$/.test(versePart)){
    const verses = versePart.split(/\s*,\s*/).map(x=>String(parseInt(x,10))).filter(v=>v && v!=='NaN');
    return {book, chap, verses};
  }
  // Único: 16
  const single = versePart.match(/^(\d+)\s*$/);
  if(single) return {book, chap, verses:[single[1]]};

  return {book, chap, verses:null};
}

function parseRefQuery(raw){
  // Formatos soportados:
  //   Libro capítulo:versículo          → Génesis 1:1
  //   Libro capítulo:inicio-fin         → Génesis 1:1-5
  //   Libro capítulo:a, b, c            → Génesis 1:1,3,6
  //   Libro capítulo                    → Génesis 1
  //   capítulo:versículo (libro actual) → 1:1
  //   Solo libro                        → Génesis
  let s = (raw || '').trim().replace(/\s+/g, ' ');
  if(!s) return null;

  // Solo capítulo/versículo del libro actual
  if(/^\d+([:.,].*)?$/.test(s)){
    const cm = s.match(/^(\d+)(?:\s*[:.]\s*(.*))?$/);
    if(!cm) return null;
    return parseVersesPart(currentBook, cm[1], cm[2] || '');
  }

  // Libro + capítulo + versículos opcionales
  // El capítulo es el ÚLTIMO número "suelto" antes de :versos
  const m = s.match(/^(.*?)\s+(\d+)(?:\s*[:.]\s*(.*))?$/);
  if(!m){
    const bookOnly = findBookName(s);
    if(bookOnly) return {book: bookOnly, chap:'1', verses:null};
    return null;
  }
  const book = findBookName(m[1].trim());
  if(!book) return null;
  const chap = m[2];
  if(!BIBLE[book] || !BIBLE[book][chap]){
    // capítulo inválido: aún devolver para feedback
    return {book, chap, verses:null, invalidChap:true};
  }
  return parseVersesPart(book, chap, m[3] || '');
}

function goToRef(parsed){
  if(!parsed) return false;
  const {book, chap, verses} = parsed;
  if(!BIBLE[book]) return false;
  // Si el capítulo no existe, ir al 1
  const useChap = (BIBLE[book][chap] ? chap : Object.keys(BIBLE[book]).sort((a,b)=>+a-+b)[0]);
  if(!useChap) return false;
  openTestaments.add(BOOK_ORDER.find(e=>e.name===book)?.testament || 'AT');
  openBooks.add(book);
  saveNavState();
  goTo(book, useChap);
  if(verses && verses.length && BIBLE[book][useChap]){
    const existing = verses.map(String).filter(v => BIBLE[book][useChap][v]);
    if(existing.length){
      selectedVerses = existing;
      detailVerse = existing.length === 1 ? existing[0] : null;
      updateSelectionUI();
      renderReader();
      scrollVerseIntoView(existing[0]);
    }
  }
  renderBookList();
  return true;
}

const refSuggest = document.getElementById('ref-suggest');
let refSugItems = [];
let refSugIndex = -1;

function getBookSuggestions(prefix){
  const q = stripAccentsNav(prefix.trim());
  if(!q) return [];
  const out = [];
  for(const entry of BOOK_ORDER){
    const name = entry.name;
    const n = stripAccentsNav(name);
    if(n.startsWith(q) || n.includes(q)) out.push(name);
  }
  // Prefer startsWith
  out.sort((a,b)=>{
    const as = stripAccentsNav(a).startsWith(q) ? 0 : 1;
    const bs = stripAccentsNav(b).startsWith(q) ? 0 : 1;
    if(as !== bs) return as - bs;
    return a.localeCompare(b,'es');
  });
  return out.slice(0, 8);
}

function renderRefSuggest(items, typedBook){
  refSugItems = items;
  refSugIndex = items.length ? 0 : -1;
  if(!items.length){
    refSuggest.classList.remove('open');
    refSuggest.innerHTML = '';
    return;
  }
  refSuggest.innerHTML = items.map((name,i)=>
    `<div class="sug-item${i===0?' active':''}" data-i="${i}">${name}</div>`
  ).join('') + `<div class="sug-hint">Tab o clic para completar · Enter para ir</div>`;
  refSuggest.classList.add('open');
  refSuggest.querySelectorAll('.sug-item').forEach(el=>{
    el.onmousedown = (e)=>{
      e.preventDefault();
      applyRefSuggestion(parseInt(el.dataset.i,10));
    };
  });
}

function applyRefSuggestion(i){
  if(i < 0 || i >= refSugItems.length) return;
  const name = refSugItems[i];
  const val = refSearch.value;
  const dualPrefix = (refSearch._dualPrefix != null) ? refSearch._dualPrefix : '';
  let work = val;
  if(val.indexOf('|') >= 0){
    const parts = val.split('|');
    work = parts.slice(1).join('|').replace(/^\s*/, '');
  }
  const m = work.match(/^(\s*)([^\d:]*?)(\s*)(\d.*)?$/);
  let segment;
  if(m && m[4]){
    segment = name + ' ' + m[4].trim();
  } else {
    const restMatch = work.match(/(\d.*)$/);
    segment = restMatch ? (name + ' ' + restMatch[1]) : (name + ' ');
  }
  refSearch.value = dualPrefix ? (dualPrefix + segment) : segment;
  refSuggest.classList.remove('open');
  refSugItems = [];
  refSugIndex = -1;
  refSearch.focus();
  // Colocar cursor al final
  const len = refSearch.value.length;
  refSearch.setSelectionRange(len, len);
}

function updateRefAutocomplete(){
  const val = refSearch.value;
  // Tras "|": autocompletar el segundo libro
  let prefix = '';
  let work = val;
  if(val.indexOf('|') >= 0){
    const parts = val.split('|');
    prefix = parts[0] + '|';
    // conservar espacio tras | si el usuario lo escribió
    const after = parts.slice(1).join('|');
    const leadSpace = /^(\s*)/.exec(after);
    prefix += leadSpace ? leadSpace[1] : '';
    work = after.replace(/^\s*/, '');
  }
  // Si ya hay capítulo/versículo en el segmento activo, no sugerir libros
  if(/\d/.test(work) && /:/.test(work)){
    refSuggest.classList.remove('open');
    return;
  }
  // Extraer posible nombre de libro (todo antes del primer dígito) en el segmento activo
  const m = work.match(/^([^\d]*)/);
  const bookPart = (m ? m[1] : work).trim();
  if(bookPart.length < 1){
    refSuggest.classList.remove('open');
    return;
  }
  // Si coincide exactamente con un libro y hay espacio, cerrar
  const exact = BOOK_ORDER.find(e => stripAccentsNav(e.name) === stripAccentsNav(bookPart));
  if(exact && /\s$/.test(work)){
    refSuggest.classList.remove('open');
    return;
  }
  // Guardar prefijo para applyRefSuggestion
  refSearch._dualPrefix = prefix;
  const items = getBookSuggestions(bookPart);
  // No mostrar si solo hay una y es coincidencia exacta ya escrita
  if(items.length === 1 && stripAccentsNav(items[0]) === stripAccentsNav(bookPart)){
    refSuggest.classList.remove('open');
    return;
  }
  renderRefSuggest(items, bookPart);
}

refSearch.addEventListener('input', updateRefAutocomplete);
refSearch.addEventListener('keydown', (e)=>{
  if(e.key === 'Tab'){
    // Autocompletar libro con Tab
    if(refSuggest.classList.contains('open') && refSugItems.length){
      e.preventDefault();
      applyRefSuggestion(refSugIndex >= 0 ? refSugIndex : 0);
      return;
    }
    // Sin lista visible: intentar completar prefijo del libro
    const val = refSearch.value.trim();
    const bookPart = val.replace(/\s+\d.*$/, '').trim();
    if(bookPart && !/^\d/.test(bookPart)){
      const items = getBookSuggestions(bookPart);
      if(items.length){
        e.preventDefault();
        refSugItems = items;
        applyRefSuggestion(0);
      }
    }
    return;
  }
  if(e.key === 'ArrowDown' && refSuggest.classList.contains('open')){
    e.preventDefault();
    refSugIndex = Math.min(refSugIndex + 1, refSugItems.length - 1);
    refSuggest.querySelectorAll('.sug-item').forEach((el,i)=> el.classList.toggle('active', i===refSugIndex));
    return;
  }
  if(e.key === 'ArrowUp' && refSuggest.classList.contains('open')){
    e.preventDefault();
    refSugIndex = Math.max(refSugIndex - 1, 0);
    refSuggest.querySelectorAll('.sug-item').forEach((el,i)=> el.classList.toggle('active', i===refSugIndex));
    return;
  }
  if(e.key === 'Escape'){
    refSuggest.classList.remove('open');
    return;
  }
  if(e.key === 'Enter'){
    e.preventDefault();
    // Si hay sugerencia abierta y aún no hay número de capítulo, completar libro
    if(refSuggest.classList.contains('open') && refSugItems.length){
      const val = refSearch.value.trim();
      if(!/\d/.test(val)){
        applyRefSuggestion(refSugIndex >= 0 ? refSugIndex : 0);
        return;
      }
      // Hay capítulo: aplicar libro de la sugerencia y luego ir
      applyRefSuggestion(refSugIndex >= 0 ? refSugIndex : 0);
    }
    refSuggest.classList.remove('open');
    const rawVal = refSearch.value.trim();
    // Dos libros: "Juan 3:16 | Romanos 8:28" → proyección arriba/abajo
    if(rawVal.indexOf('|') >= 0){
      const dual = parseDualBookQuery(rawVal);
      if(dual){
        openStageStack(
          {book: dual.a.book, chap: dual.a.chap, verses: dual.a.verses || ['1']},
          {book: dual.b.book, chap: dual.b.chap, verses: dual.b.verses || ['1']}
        );
        refSearch.blur();
        return;
      }
      alert('Usa un solo | y dos libros distintos.\nEjemplo: Juan 3:16 | Romanos 8:28');
      return;
    }
    const parsed = parseRefQuery(rawVal);
    if(parsed && goToRef(parsed)){
      refSearch.blur();
    } else if(parsed && parsed.book){
      goToRef({book: parsed.book, chap: parsed.chap || '1', verses: parsed.verses});
      refSearch.blur();
    }
  }
});

/** Parsea "LibroA cap:v | LibroB cap:v" (un solo |, dos libros distintos). */
function parseDualBookQuery(raw){
  const parts = String(raw||'').split('|');
  if(parts.length !== 2) return null;
  const a = parseRefQuery(parts[0].trim());
  const b = parseRefQuery(parts[1].trim());
  if(!a || !b || !a.book || !b.book) return null;
  if(a.book === b.book) return null;
  if(!BIBLE[a.book] || !BIBLE[b.book]) return null;
  const chapA = a.chap || '1';
  const chapB = b.chap || '1';
  if(!BIBLE[a.book][chapA] || !BIBLE[b.book][chapB]) return null;
  let versesA = a.verses;
  let versesB = b.verses;
  if(!versesA || !versesA.length){
    const keys = Object.keys(BIBLE[a.book][chapA]||{}).sort((x,y)=>+x-+y);
    versesA = keys.length ? [keys[0]] : ['1'];
  }
  if(!versesB || !versesB.length){
    const keys = Object.keys(BIBLE[b.book][chapB]||{}).sort((x,y)=>+x-+y);
    versesB = keys.length ? [keys[0]] : ['1'];
  }
  return {
    a: {book:a.book, chap:String(chapA), verses: versesA.map(String)},
    b: {book:b.book, chap:String(chapB), verses: versesB.map(String)}
  };
}
refSearch.addEventListener('blur', ()=>{
  // Retraso para permitir clic en sugerencia
  setTimeout(()=> refSuggest.classList.remove('open'), 150);
});

