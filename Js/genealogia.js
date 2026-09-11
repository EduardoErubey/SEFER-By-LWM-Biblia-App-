/* SEFER module: genealogia.js — script clásico (sin import/export) */

/* --- SEFER genealogia.js lines 2809-3024 --- */
/* =========================================================
   INSTRUCCIONES
   ========================================================= */

/* Pantalla completa (Fullscreen API ≈ F11) */
(function wireFullscreen(){
  const btn = document.getElementById('fullscreen-btn');
  if(!btn) return;
  function isFs(){
    return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
  }
  function updateBtn(){
    if(isFs()){
      btn.textContent = '⛶';
      btn.setAttribute('data-tooltip', 'Salir de pantalla completa (Esc o F11)');
      btn.title = 'Salir de pantalla completa';
    } else {
      btn.textContent = '⛶';
      btn.setAttribute('data-tooltip', 'Pantalla completa (como F11)');
      btn.title = 'Pantalla completa';
    }
  }
  async function toggle(){
    try{
      if(isFs()){
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
        if(exit) await exit.call(document);
      } else {
        const el = document.documentElement;
        const req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
        if(req) await req.call(el);
        else alert('Tu navegador no permite pantalla completa desde la página. Usa F11.');
      }
    }catch(e){
      console.warn('Fullscreen', e);
      alert('No se pudo activar pantalla completa. Prueba F11.');
    }
    updateBtn();
  }
  btn.addEventListener('click', toggle);
  document.addEventListener('fullscreenchange', ()=>{ updateBtn(); if(isFs()){ try{ setAchProgress('fullscreen_1',1); }catch(e){} } });
  document.addEventListener('webkitfullscreenchange', ()=>{ updateBtn(); if(isFs()){ try{ setAchProgress('fullscreen_1',1); }catch(e){} } });
  updateBtn();
})();


/* → movido a data/ (ver script src) */


const GENE_SPARSE_MSG = 'No hay demasiada información al respecto en las Escrituras sobre esta persona. Aparece en la genealogía o en menciones breves, pero la Biblia no desarrolla una biografía amplia.';

function geneHasRichBio(p){
  return !!(p && p.bio && String(p.bio).trim().length >= 40);
}
function geneChildren(id){
  return Object.keys(GENEALOGY_PEOPLE).filter(k=>GENEALOGY_PEOPLE[k].parent===id);
}
function geneRoots(){
  return Object.keys(GENEALOGY_PEOPLE).filter(k=>!GENEALOGY_PEOPLE[k].parent);
}
function geneSearchNorm(s){
  return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}

let geneSelected = null;
const GENE_FEATURED = ['adam','noe','abraham','sara','isaac','jacob','jose','moises','rut','david','salomon','elias','isaias','daniel','maria','jesus','pedro','pablo'];

function geneChip(id, label){
  return '<button type="button" class="gd-chip big" data-gene-go="'+id+'">'+label+'</button>';
}

const GENE_NT_HINT = /mateo|marcos|lucas|juan|hechos|romanos|corintios|galatas|gálatas|efesios|filipenses|colosenses|tesalonicenses|timoteo|tito|filemon|filemón|hebreos|santiago|pedro|judas|apocalipsis|jesus|jesús|cristo/;
const GENE_AT_HINT = /genesis|génesis|exodo|éxodo|levitico|levítico|numeros|números|deuteronomio|josue|josué|jueces|rut|samuel|reyes|cronicas|crónicas|esdras|nehemias|nehemías|ester|job|salmos|proverbios|eclesiastes|eclesiastés|cantares|isaias|isaías|jeremias|jeremías|lamentaciones|ezequiel|daniel|oseas|oseas|joel|amos|amós|abdias|abdías|jonas|jonás|miqueas|nahum|nahúm|habacuc|sofonias|sofonías|hageo|zacarias|zacarías|malaquias|malaquías/;

function geneEra(id){
  const p = GENEALOGY_PEOPLE[id];
  if(!p) return '';
  if(p.era) return p.era;
  const blob = ((p.refs||[]).join(' ') + ' ' + (p.name||'') + ' ' + (p.bio||'')).toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const nt = GENE_NT_HINT.test(blob);
  const at = GENE_AT_HINT.test(blob);
  if(nt && !at) return 'Nuevo Testamento';
  if(at && !nt) return 'Antiguo Testamento';
  if(nt && at) return 'Antiguo y Nuevo Testamento';
  // nombres clave
  const n = geneSearchNorm(p.name||'');
  if(/jesus|pedro|pablo|maria|juan|pilato|barrabas|judas iscariote|herodes|caifas/.test(n)) return 'Nuevo Testamento';
  if(/abraham|moises|david|salomon|noe|adan|eva|jose|isaac|jacob/.test(n)) return 'Antiguo Testamento';
  return 'Periodo bíblico (ver pasajes)';
}

let geneHistory = [];

function renderGeneHome(filter){
  const det = document.getElementById('gene-detail');
  if(!det) return;
  const q = geneSearchNorm(filter||'');
  let ids = Object.keys(GENEALOGY_PEOPLE);
  if(q){
    ids = ids.filter(id=> geneSearchNorm(GENEALOGY_PEOPLE[id].name).includes(q));
  }
  ids.sort((a,b)=> GENEALOGY_PEOPLE[a].name.localeCompare(GENEALOGY_PEOPLE[b].name,'es'));
  if(!ids.length){
    det.innerHTML = '<p class="gd-empty">No se encontró ese nombre. Prueba «David», «Judas Iscariote» o «Moisés».</p>';
    return;
  }
  let html = '<p class="gd-hint">'+(q?'Resultados ('+ids.length+'):':'Lista de personas ('+ids.length+'). Toca un nombre:')+'</p>';
  html += '<ul class="bio-list">';
  ids.forEach(id=>{
    const p = GENEALOGY_PEOPLE[id];
    const rich = geneHasRichBio(p);
    const era = geneEra(id);
    const preview = rich ? (p.bio.slice(0, 90) + (p.bio.length>90?'…':'')) : (p.bio && p.bio.trim() ? p.bio : 'Mención breve en la Escritura; hay poca información detallada.');
    html += '<li class="bio-list-item" data-gene-go="'+id+'"><strong>'+p.name+'</strong><span class="bio-era-tag">'+era+'</span><span class="bio-preview">'+preview+'</span></li>';
  });
  html += '</ul>';
  det.innerHTML = html;
  det.querySelectorAll('[data-gene-go]').forEach(btn=>{
    btn.onclick = ()=> selectGenePerson(btn.getAttribute('data-gene-go'));
  });
}

function selectGenePerson(id, fromBack){
  if(!fromBack && geneSelected && geneSelected !== id){
    geneHistory.push(geneSelected);
  }
  geneSelected = id;
  const p = GENEALOGY_PEOPLE[id];
  const det = document.getElementById('gene-detail');
  if(!det || !p) return;
  const parent = p.parent && GENEALOGY_PEOPLE[p.parent] ? GENEALOGY_PEOPLE[p.parent] : null;
  const kids = geneChildren(id);
  const rich = geneHasRichBio(p);
  const era = geneEra(id);

  let bioHtml = rich
    ? '<p class="gd-bio">'+p.bio+'</p>'
    : '<p class="gd-empty">'+(p.bio && p.bio.trim() ? p.bio : 'No hay biografía detallada de esta persona en SEFER. Solo se conoce lo que mencionan brevemente las Escrituras.')+'</p>';

  let family = '';
  if(parent){
    family += '<div class="gd-section">⬆️ Padre / madre</div><div class="gd-chips">'+geneChip(p.parent, parent.name)+'</div>';
  }
  if(kids.length){
    family += '<div class="gd-section">⬇️ Hijos</div><div class="gd-chips">'+
      kids.map(k=> geneChip(k, GENEALOGY_PEOPLE[k].name)).join('')+
      '</div>';
  }

  const refs = (p.refs||[]).map(r=>'<button type="button" class="gd-ref" data-ref="'+String(r).replace(/"/g,'')+'">'+r+'</button>').join('');
  const canBack = geneHistory.length > 0;

  det.innerHTML =
    '<div class="bio-nav-row" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;">'+
      '<button type="button" class="btn" id="gene-back-btn">'+(canBack?'← Atrás':'← Lista')+'</button>'+
      (canBack?'<button type="button" class="btn" id="gene-back-home">Todos los nombres</button>':'')+
    '</div>'+
    '<div class="gd-name">'+p.name+'</div>'+
    '<div class="gd-era" style="font-size:12.5px;font-weight:600;color:var(--gold);margin:0 0 10px;">📆 Época: '+era+'</div>'+
    bioHtml+
    (refs ? '<div class="gd-section">📖 Leer en la Biblia</div><div class="gd-refs">'+refs+'</div>' : '')+
    family;

  document.getElementById('gene-back-btn')?.addEventListener('click', ()=>{
    if(geneHistory.length){
      const prev = geneHistory.pop();
      selectGenePerson(prev, true);
    } else {
      geneSelected = null;
      renderGeneHome(document.getElementById('gene-search')?.value || '');
    }
  });
  document.getElementById('gene-back-home')?.addEventListener('click', ()=>{
    geneHistory = [];
    geneSelected = null;
    renderGeneHome(document.getElementById('gene-search')?.value || '');
  });
  det.querySelectorAll('[data-gene-go]').forEach(btn=>{
    btn.onclick = ()=> selectGenePerson(btn.getAttribute('data-gene-go'));
  });
  det.querySelectorAll('.gd-ref').forEach(btn=>{
    btn.onclick = ()=>{
      const ref = btn.getAttribute('data-ref')||'';
      const parsed = typeof parseRefQuery === 'function' ? parseRefQuery(ref) : null;
      if(parsed && typeof goToRef === 'function' && goToRef(parsed)){
        closeGenealogia();
      } else if(parsed && parsed.book){
        goTo(parsed.book, parsed.chap||'1');
        closeGenealogia();
      } else {
        alert('No se pudo abrir: '+ref);
      }
    };
  });
}

function openGenealogia(){
  const m = document.getElementById('modal-genealogia');
  if(!m) return;
  m.style.display = 'flex';
  const search = document.getElementById('gene-search');
  if(search) search.value = '';
  geneSelected = null;
  geneHistory = [];
  renderGeneHome('');
  search?.focus();
}
function closeGenealogia(){
  const m = document.getElementById('modal-genealogia');
  if(m) m.style.display = 'none';
}


/* → movido a data/ (ver script src) */

