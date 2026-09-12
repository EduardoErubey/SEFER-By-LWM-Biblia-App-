/* SEFER module: store.js — script clásico (sin import/export) */

/* --- SEFER store.js lines 36-253 --- */
/* =========================================================
   ESTADO
   ========================================================= */
let currentBook = (BOOK_ORDER[0] || {}).name || "Génesis";
let currentChap = "1";
let detailVerse = null;
let selectedVerses = [];
let selectionUIActive = false; // casillas visibles (tras clic en versículo o con selección)
const SEFER_FONTS = [
  { id:'literata', name:'Literata (lectura)', stack:"'Literata', Georgia, serif" },
  { id:'inter', name:'Inter (moderna)', stack:"'Inter', system-ui, sans-serif" },
  { id:'fraunces', name:'Fraunces (títulos)', stack:"'Fraunces', Georgia, serif" },
  { id:'roboto', name:'Roboto (Android)', stack:"'Roboto', 'Helvetica Neue', sans-serif" },
  { id:'sf', name:'SF-style (Apple)', stack:"-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  { id:'noto', name:'Noto Sans', stack:"'Noto Sans', 'Helvetica Neue', sans-serif" },
  { id:'georgia', name:'Georgia (clásica)', stack:"Georgia, 'Times New Roman', serif" },
  { id:'mono', name:'Mono legible', stack:"ui-monospace, 'Cascadia Code', 'Segoe UI Mono', monospace" }
];
let verseFontFamily = 'literata';
let seferTourActive = false; // hoisted (tour) — evitar TDZ en updateProjectBtnVisibility
let seferTourIndex = 0;

const store = {
  get(key, fallback){
    try{ const v = JSON.parse(localStorage.getItem(key)); return v===null||v===undefined ? fallback : v; }
    catch(e){ return fallback; }
  },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};
try{ verseFontFamily = store.get('sefer_font_family', 'literata') || 'literata'; }catch(e){}
let favorites = store.get('bp_favorites', store.get('bp_highlights', {})); // migra resaltados antiguos
let notes      = store.get('bp_notes', {});
// Migrar nombres de temas antiguos
const THEME_MIGRATE = {
  original:'arena', frio:'paz', oscuro:'sandalo',
  playa:'arena', cielo:'paz', noche:'sandalo', mono:'claro'
};
let currentTheme = store.get('bp_theme', 'lwm-day');
if(THEME_MIGRATE[currentTheme]) currentTheme = THEME_MIGRATE[currentTheme];
if(currentTheme==='paz'||currentTheme==='claro') currentTheme='lwm-day';
const VALID_THEMES = ['lwm-day','lwm-night','sandalo','arena','amoled','eden','reino','ucrania','mexico','corea'];
if(!VALID_THEMES.includes(currentTheme)) currentTheme = 'lwm-day';
let sidePanel = null; // 'notes' | 'favs' | 'trash' | null
let notesTrash = store.get('bp_notes_trash', []); // [{ref, text, deletedAt}]
function saveNotesTrash(){ store.set('bp_notes_trash', notesTrash); }
function moveNoteToTrash(ref){
  const text = notes[ref];
  if(text && String(text).trim()){
    notesTrash.unshift({ref, text, deletedAt: Date.now()});
    // límite razonable
    if(notesTrash.length > 200) notesTrash.length = 200;
    saveNotesTrash();
  }
  delete notes[ref];
  saveNotes();
}
let showWelcome = true;
let verseFontSize = store.get('bp_verse_font', 17);
const DEFAULT_VERSE_FONT = 17;
let easyReading = store.get('bp_easy_reading', false);

function vid(book, chap, v){ return `${book} ${chap}:${v}`; }
function saveFavorites(){
  store.set('bp_favorites', favorites);
  if(typeof scheduleDriveSave==='function') scheduleDriveSave();
  try{ if(typeof trackFavsCount==='function') trackFavsCount(); }catch(e){}
}
function saveNotes(){
  store.set('bp_notes', notes);
  if(typeof scheduleDriveSave==='function') scheduleDriveSave();
  try{ if(typeof trackNotesCount==='function') trackNotesCount(); }catch(e){}
}
function downloadJSON(filename, data){
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(()=> URL.revokeObjectURL(a.href), 2000);
}
function exportNotesFile(){ downloadJSON('notes.json', notes); }
function exportFavsFile(){ downloadJSON('favorites.json', favorites); }
/** Intenta cargar notas/favoritos desde archivos locales (si se sirven por HTTP junto al index) */
async function tryLoadLocalFiles(){
  try{
    const rn = await fetch('notes/notes.json', {cache:'no-store'});
    if(rn.ok){
      const data = await rn.json();
      if(data && typeof data === 'object'){ notes = Object.assign({}, data, notes); saveNotes(); }
    }
  }catch(e){}
  try{
    const rf = await fetch('favs/favorites.json', {cache:'no-store'});
    if(rf.ok){
      const data = await rf.json();
      if(data && typeof data === 'object'){ favorites = Object.assign({}, data, favorites); saveFavorites(); }
    }
  }catch(e){}
}

/* Libros donde se aplican palabras de Jesús (letra roja) */
const JESUS_BOOKS = new Set(['Mateo','Marcos','Lucas','Juan','Apocalipsis']);

/* Nombres propios (personas) y ciudades/lugares para lectura fácil */
const EASY_NAMES = new Set([
  'abraham','abrahán','isaac','jacob','israel','moisés','moisess','aaron','aarón','josué','josue',
  'david','salomón','salomon','saúl','saul','samuel','elías','elias','eliseo','isaías','isaias',
  'jeremías','jeremias','ezequiel','daniel','oseas','amós','amos','miqueas','nahúm','nahum',
  'habacuc','sofonías','sofonias','hageo','zacarías','zacarias','malaquías','malaquias',
  'job','esdras','nehemías','nehemias','ester','rut','booz','noemí','noemi',
  'José','josé','jose','maría','maria','pedro','pablo','saulo','juan','andrés','andres',
  'santiago','felipe','bartolomé','bartolome','mateo','tomás','tomas','simón','simon',
  'judas','matías','matias','lucas','marcos','timoteo','tito','filemón','filemon',
  'nicodemo','lázaro','lazaro','marta','magdalena','pilato','herodes','caifás','caifas',
  'anás','anas','zacarias','zacarías','isabel','isabel','santiago','bernabe','barnabé',
  'esteban','felipe','cornelius','corneli','cornelió','cornelius','aquila','priscilla','priscilla',
  'apollo','apolos','Silas','silas','tito','onesimo','filemon','noé','noe','adam','adán','adan',
  'eva','cain','caín','abel','set','enoc','matusalen','matusalén','sem','cam','jafet',
  'abrahan','sara','agar','ismael','isai','isaí','jesse','jesé','jese','ruth','boaz',
  'gideon','gedeón','gedeon','sansón','sanson','delila','delilah','samuel','eli',
  'natan','natán','urías','urias','betsabé','betsabe','rehoboam','roboam','jeroboam',
  'ajos','achab','acáb','acab','jezebel','jezabel','nebuchadnezzar','nabucodonosor',
  'cyrus','ciro','darius','darío','dario','artajerjes','artaxerxes','mardoqueo','amardis',
  'hannah','ana','samuel','josias','josías','ezequias','hezekiah','manases','manasés',
  'jesus','jesús','cristo','mesías','mesias','jehová','jehova','yahvé','yahweh','señor',
  'satanás','satanas','diablo','belial','miguel','gabriel','rafael',
  // ampliados Destacar
  'lea','raquel','laban','labán','ruben','rubén','simeon','simeón','levi','leví','dan','neftali','neftalí',
  'gad','aser','asér','zabulon','zabulón','isacar','benjamin','benjamín','juda','judá','diná','dina',
  'miriam','maria','caleb','eleazar','itamar','finees','fineés','baalam','balaam',
  'debora','débora','barac','jael','jeftee','jefté','eli','jonathan','jonatán','goliat','absalon','absalón',
  'salomon','salomón','roboam','roboám','jeroboam','jeroboám','eliseo','naaman','naamán',
  'ezekiel','ezequiel','baltasar','esdras','ester','aman','haman',
  'isaias','isaías','jeremias','jeremías','joel','abdias','abdías','jonas','jonás',
  'emmanuel','emanuel','manuel','jesucristo','cefas','cefás','tadeo','iscariote',
  'pablo','barnabas','barnabás','barnabé','silas','priscilla','priscila','lidia',
  'gamaliel','caiafas','caifás','herodias','herodías','lazaro','lázaro','magdalena',
  'elizabeth','elisabet','elisabeth','lucifer','beelzebú','beelzebub',
  'booz','boaz','bildad','zofar','elifaz','eliú','ona','onan','tamar','rahab','raab',
  'uriah','joab','seba','gad','melquisedec','melchizedek','jetro','jetró','hobab',
  'balac','balák','rahab','raab','salmon','booz','obed','jesse','isaí',
  'asaf','heman','etan','jedutun','sadrac','mesac','abednego','abed-nego',
  'miqueas','nahum','nahúm','habacuc','sofonias','sofonías','hageo','zacarias','malaquias',
  'bartolome','bartolomé','andres','andrés','tomas','tomás','mateo','lucas','marcos',
  'timoteo','tito','filemon','filemón','onesimo','onesímo','epafrodito','arquipo',
  'sofia','sabiduria','sabiduría'

].map(s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')));

const EASY_CITIES = new Set([
  'jerusalén','jerusalem','sion','sión','belén','belen','nazaret','galilea','judea','samaria',
  'canaán','canaan','egipto','babilonia','babel','asiria','ninive','nínive','ninivé',
  'roma','grecia','corinto','efeso','éfeso','filipos','tesalónica','tesalonica','antioquía','antioquia',
  'damasco','tiro','sidón','sidon','capernaum','cafarnaúm','cafarnaum','betania','betfagé','betfage',
  'getsemaní','getsmani','gólgota','golgota','calvario','jordán','jordan','sinaí','sinai','horeb',
  'edén','eden','sodoma','gomorra','jericó','jerico','hebrón','hebron','betel','siló','silo',
  'mizpa','gilgal','ai','hai','siquem','siquem','samaria','jezreel','megido','armagedón','armagedon',
  'patmos','creta','chipre','malta','troas','mileto','pergamino','pérgamo','pergamo','esmirna',
  'tarsis','nínive','ur','harán','haran','egipto','gosén','gosen','ramses','pithom',
  'madian','midian','edom','moab','amón','amon','filistea','gaza','asdod','ascalón','ascalon',
  'gat','hebrón','beerseba','beer-seba','dan','betlehem','bethlehem'
,

  // ampliados Destacar lugares
  'beerseba','bersheba','hebron','hebrón','siquem','siquem','siloh','siló','gilgal','mizpa',
  'gabaon','gabaón','gabaa','tirsa','jezreel','megiddo','hazor','hazór',
  'betel','bet-el','jerico','jericó','caná','cana','idumea','edom','moab','amon','amón',
  'filistea','gosén','gosen','ramses','raamses','ur','haran','harán','padan','mesopotamia',
  'adma','seboim','zoar','mambre','mamre','olivos','nebo','pisga','carmelo','tabor','hermon','hermón',
  'genesaret','genesareth','etiopia','etiopía','cus','libia','arabia','fenicia','tarsis',
  'pafos','perga','iconio','listra','derbe','colosas','laodicea','filadelfia','esmirna',
  'pergamo','pérgamo','tiatira','sardis','sardes','bitinia','galacia','macedonia','acaya','acaia',
  'patmos','malta','melita','creta','chipre','troas','asia','siria','judea','judá',
  'betlehem','belen','belén','jerusalen','jerusalén','efeso','éfeso','tesalonica','tesalónica',
  'baal','peor','silo','siló','siloe','siloé','getsemani','getsemaní','golgota','gólgota',
  'sinaí','sinai','horeb','edén','eden','sodoma','gomorra','ninive','nínive','asiria','persia','media',
  'italia','grecia','roma','egipto','babilonia','babel','canaán','canaan','galilea','samaria',
  'damasco','tiro','sidón','sidon','nazaret','capernaum','cafarnaum','cafarnaúm','betania','betfage'
].map(s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')));

function normEasy(s){
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,'');
}

function buildJesusMap(book, chap){
  const map = {};
  if(!JESUS_BOOKS.has(book)) return map;
  const chapData = (BIBLE[book]||{})[chap];
  if(!chapData) return map;
  let speaking = false;
  const startRe = /(?:^|[.¶;]\s*)(?:Y\s+)?(?:entonces\s+)?(?:respondi[oó]|respondi[oó]le|d[ií]jole|d[ií]cele|dijo|dice|clam[oó]|pregunt[oó]|habl[oó]|exclam[oó]|mand[oó]|llam[oó]|ense[nñ]aba[^.]*diciendo)\s+(?:Jes[uú]s|el\s+Se[nñ]or)|(?:Jes[uú]s|el\s+Se[nñ]or)\s+(?:respondi[oó]|respondi[oó]le|d[ií]jole|d[ií]cele|dijo|dice|clam[oó]|pregunt[oó]|habl[oó]|les\s+dijo|le\s+dijo|ense[nñ]aba)/i;
  const startRe2 = /(?:dicho\s+esto|abriendo\s+[eé]l\s+su\s+boca)[^.]*diciendo/i;
  const otherRe = /(?:^|[.¶;]\s*)(?:Y\s+)?(?:entonces\s+)?(?:respondi[oó]|dijo|dice|clam[oó]|pregunt[oó])\s+(?:Pedro|Pilato|los\s+disc[ií]pulos|los\s+fariseos|ellos|ella|el\s+centuri[oó]n|un\s+|la\s+mujer|Caif[aá]s|Herodes|Juan|Natanael|Tom[aá]s|Felipe|Andr[eé]s|Judas|la\s+gente|el\s+pueblo|los\s+Jud[ií]os|Nicodemo)/i;
  sortedVerseNums(book, chap).forEach(v=>{
    const t = chapData[v] || '';
    if(otherRe.test(t) && !startRe.test(t)){
      speaking = false;
    }
    if(startRe.test(t) || startRe2.test(t)){
      speaking = true;
      map[v] = true;
      return;
    }
    if(speaking) map[v] = true;
  });
  return map;
}
function stripPilcrow(text){
  return (text||'').replace(/¶\s*/g,'').replace(/\u00b6\s*/g,'');
}
function formatVerseHtml(text, isJesus){
  // Quitar marca de párrafo de algunas ediciones RV
  let clean = stripPilcrow(text);
  const esc = clean.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const body = esc.replace(/([A-Za-záéíóúÁÉÍÓÚñÑüÜ]+)/g, (m)=>{
    let cls = 'w';
    if(easyReading){
      const n = normEasy(m);
      if(EASY_CITIES.has(n)) cls += ' easy-city';
      else if(EASY_NAMES.has(n)) cls += ' easy-name';
    }
    return `<span class="${cls}">${m}</span>`;
  });
  // Color de Jesús solo en modo lectura fácil
  if(easyReading && isJesus) return `<span class="jesus-words">${body}</span>`;
  return body;
}
function updateEasyBtn(){
  const btn = document.getElementById('easy-btn');
  if(!btn) return;
  btn.classList.toggle('easy-on', easyReading);
  btn.classList.toggle('highlight-on', easyReading);
  btn.textContent = easyReading ? '✓ ✨ Destacar' : '✨ Destacar';
  btn.setAttribute('data-tooltip', 'Destacar nombres, ciudades y palabras de Jesús');
  const host = document.getElementById('reader-verses') || reader;
  if(host){
    host.classList.toggle('highlight-mode', !!easyReading);
  }
  if(reader) reader.classList.toggle('highlight-mode', !!easyReading);
}

function scrollVerseIntoView(vnum){
  requestAnimationFrame(()=>{
    const rows = reader.querySelectorAll('.verse');
    let target = null;
    rows.forEach(row=>{
      const n = row.querySelector('.vnum');
      if(n && String(n.textContent) === String(vnum)) target = row;
    });
    if(!target){
      target = reader.querySelector('.verse.active-detail') || reader.querySelector('.verse.selected');
    }
    if(target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}





/* ===== Resaltar (subrayado por versículo, no global) =====
   Cada marca: { id, book, chap, vnum, text }
   id = book|chap|vnum|textoNormalizado
*/
let seferHighlights = [];
try{
  const raw = store.get('bp_verse_highlights', null);
  if(Array.isArray(raw)) seferHighlights = raw;
  else {
    // migrar formato antiguo (solo palabras globales) → se descarta
    store.set('bp_verse_highlights', []);
  }
}catch(e){ seferHighlights = []; }

function seferNormPhrase(s){
  return String(s||'').trim().replace(/\s+/g,' ').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

function seferHighlightId(book, chap, vnum, text){
  return [book, String(chap), String(vnum), seferNormPhrase(text)].join('|');
}

function saveHighlighted(){
  try{ store.set('bp_verse_highlights', seferHighlights); }catch(e){}
}
function loadHighlighted(){
  try{
    const raw = store.get('bp_verse_highlights', []);
    seferHighlights = Array.isArray(raw) ? raw : [];
  }catch(e){ seferHighlights = []; }
  return seferHighlights;
}

/** Alterna resaltado del texto exacto en un versículo concreto */
function toggleVerseHighlight(book, chap, vnum, text){
  const phrase = String(text||'').trim().replace(/\s+/g,' ');
  if(!book || !chap || !vnum || phrase.length < 1) return false;
  const id = seferHighlightId(book, chap, vnum, phrase);
  const idx = seferHighlights.findIndex(h => h.id === id);
  if(idx >= 0){
    seferHighlights.splice(idx, 1);
    saveHighlighted();
    return false; // removed
  }
  seferHighlights.push({ id, book, chap: String(chap), vnum: String(vnum), text: phrase });
  saveHighlighted();
  return true; // added
}

function getHighlightsForVerse(book, chap, vnum){
  const b = book, c = String(chap), v = String(vnum);
  return seferHighlights.filter(h => h.book === b && String(h.chap) === c && String(h.vnum) === v);
}

/** Envuelve frases resaltadas dentro del HTML de un versículo (texto ya escapado o plano) */
function applyHighlightsToVerseHtml(htmlOrText, book, chap, vnum){
  const list = getHighlightsForVerse(book, chap, vnum);
  if(!list.length) return htmlOrText;
  // Trabajar sobre texto plano si viene con spans: aplicar sobre text nodes es complejo;
  // estrategia: si hay spans .w, marcar spans que formen parte de una frase; si es plano, wrap de substrings.
  let s = String(htmlOrText);
  // Ordenar por longitud desc para no romper frases largas
  const sorted = [...list].sort((a,b)=> (b.text||'').length - (a.text||'').length);
  sorted.forEach(h=>{
    const phrase = h.text;
    if(!phrase) return;
    // Escapar regex
    const esc = phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+');
    try{
      const re = new RegExp('('+esc+')', 'i');
      // Solo primera aparición por frase en el versículo (comportamiento subrayador)
      s = s.replace(re, function(m){
        if(/word-highlighted/.test(m)) return m;
        return '<mark class="word-highlighted sefer-hl">'+m+'</mark>';
      });
    }catch(e){}
  });
  return s;
}

function applyWordHighlightsToElement(root){
  // compat: no-op global; el resaltado es por versículo al renderizar
  if(!root) return;
}

// compat API antigua
let highlightedWords = new Set();
function saveHighlightedWords(){ saveHighlighted(); }
function toggleHighlightedWord(){ /* deprecated */ }
function seferNormWordKey(w){ return seferNormPhrase(w); }

window.seferHighlights = seferHighlights;
window.saveHighlighted = saveHighlighted;
window.loadHighlighted = loadHighlighted;
window.toggleVerseHighlight = toggleVerseHighlight;
window.getHighlightsForVerse = getHighlightsForVerse;
window.applyHighlightsToVerseHtml = applyHighlightsToVerseHtml;
window.applyWordHighlightsToElement = applyWordHighlightsToElement;
window.seferHighlightId = seferHighlightId;
window.seferNormPhrase = seferNormPhrase;
