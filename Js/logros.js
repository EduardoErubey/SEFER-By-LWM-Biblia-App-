/* SEFER module: logros.js — script clásico (sin import/export) */

/* --- SEFER logros.js lines 4451-4794 --- */
/* =========================================================
   LOGROS / INSIGNIAS + PERFIL GOOGLE
   ========================================================= */
const BOOK_BADGE_TITLES = {
  /* —— Antiguo Testamento —— */
  'Génesis':'En el principio…',
  'Éxodo':'Libertador del pueblo',
  'Levítico':'Santo como Él es santo',
  'Números':'En el desierto',
  'Deuteronomio':'Escucha, Israel',
  'Josué':'La tierra prometida',
  'Jueces':'Cada uno hacía lo que bien le parecía',
  'Rut':'Tu pueblo será mi pueblo',
  '1 Samuel':'Un rey según el pueblo',
  '2 Samuel':'El trono de David',
  '1 Reyes':'La gloria de Salomón',
  '2 Reyes':'El reino dividido',
  '1 Crónicas':'Linaje y alabanza',
  '2 Crónicas':'El templo y los reyes',
  'Esdras':'Volvieron a Jerusalén',
  'Nehemías':'Levantemos el muro',
  'Ester':'Para un tiempo como este',
  'Job':'Aunque Él me mate…',
  'Salmos':'Alabad al Señor',
  'Proverbios':'El principio de la sabiduría',
  'Eclesiastés':'Todo tiene su tiempo',
  'Cantares':'Cantar de los cantares',
  'Isaías':'El siervo sufriente',
  'Jeremías':'Profeta de lágrimas',
  'Lamentaciones':'Grandes son tus misericordias',
  'Ezequiel':'Ruedas dentro de ruedas',
  'Daniel':'En el foso de los leones',
  'Oseas':'Amor que restaura',
  'Joel':'Derramaré mi Espíritu',
  'Amós':'Que fluya la justicia',
  'Abdías':'El día de Edom',
  'Jonás':'Tres días en el pez',
  'Miqueas':'Oh hombre, Él te ha declarado',
  'Nahúm':'Ruina de Nínive',
  'Habacuc':'El justo por la fe vivirá',
  'Sofonías':'El día del Señor',
  'Hageo':'Reedifica la casa',
  'Zacarías':'No con ejército, sino con mi Espíritu',
  'Malaquías':'El sol de justicia',
  /* —— Nuevo Testamento —— */
  'Mateo':'El Reino de los cielos',
  'Marcos':'El Hijo del Hombre',
  'Lucas':'El Salvador de todos',
  'Juan':'La Palabra se hizo carne',
  'Hechos':'Hasta lo último de la tierra',
  'Romanos':'Justificados por la fe',
  '1 Corintios':'El cuerpo de Cristo',
  '2 Corintios':'Poder en la debilidad',
  'Gálatas':'Libres en Cristo',
  'Efesios':'Sentados en lugares celestiales',
  'Filipenses':'Gozo en toda circunstancia',
  'Colosenses':'Cristo en vosotros, la esperanza',
  '1 Tesalonicenses':'La venida del Señor',
  '2 Tesalonicenses':'Firmeza hasta el fin',
  '1 Timoteo':'Combate la buena batalla',
  '2 Timoteo':'Predica la palabra',
  'Tito':'Enseñanza sana',
  'Filemón':'Ya no como esclavo',
  'Hebreos':'Mejor pacto, mejor sacrificio',
  'Santiago':'Sed hacedores de la palabra',
  '1 Pedro':'Piedras vivas',
  '2 Pedro':'Participantes de la naturaleza divina',
  '1 Juan':'Dios es amor',
  '2 Juan':'Andar en la verdad',
  '3 Juan':'Copartícipe de la verdad',
  'Judas':'Contender por la fe',
  'Apocalipsis':'Cielos nuevos y tierra nueva'
};

function buildAchievementDefs(){
  const defs = [
    {id:'first_chapter', icon:'📖', title:'Primer paso', desc:'Abre tu primer capítulo', goal:1},
    {id:'notes_1', icon:'📝', title:'Anotador', desc:'Guarda 1 nota', goal:1},
    {id:'notes_10', icon:'📓', title:'Escriba', desc:'Guarda 10 notas', goal:10},
    {id:'notes_50', icon:'🗂️', title:'Archivero', desc:'Guarda 50 notas', goal:50},
    {id:'favs_1', icon:'❤️', title:'Corazón', desc:'Marca 1 favorito', goal:1},
    {id:'favs_25', icon:'💖', title:'Coleccionista', desc:'Marca 25 favoritos', goal:25},
    {id:'favs_100', icon:'💎', title:'Tesorero', desc:'Marca 100 favoritos', goal:100},
    {id:'meanings_1', icon:'📚', title:'Léxico', desc:'Guarda 1 significado', goal:1},
    {id:'meanings_20', icon:'🧠', title:'Erudito', desc:'Guarda 20 significados', goal:20},
    {id:'project_1', icon:'🎬', title:'Proyector', desc:'Proyecta un versículo', goal:1},
    {id:'plan_day_1', icon:'📅', title:'Discípulo del día', desc:'Completa 1 día del plan', goal:1},
    {id:'plan_day_7', icon:'🔥', title:'Constante', desc:'Completa 7 días del plan', goal:7},
    {id:'plan_day_30', icon:'🏆', title:'Bereano', desc:'Completa 30 días del plan', goal:30},
    {id:'cloud_1', icon:'☁️', title:'En la nube', desc:'Sincroniza con Google Drive', goal:1},
    {id:'themes_5', icon:'🎨', title:'Estilo', desc:'Prueba 5 temas distintos', goal:5},
    {id:'themes_10', icon:'🌈', title:'Arcoíris', desc:'Prueba los 10 temas', goal:10},
    {id:'detail_1', icon:'🔍', title:'Detallista', desc:'Activa Resaltar', goal:1},
    {id:'books_10', icon:'🗺️', title:'Explorador', desc:'Abre 10 libros distintos', goal:10},
    {id:'books_39', icon:'📜', title:'Estudiante del AT', desc:'Abre los 39 libros del AT', goal:39},
    {id:'books_27', icon:'✝️', title:'Estudiante del NT', desc:'Abre los 27 libros del NT', goal:27},
    {id:'books_66', icon:'👑', title:'Conocedor de la Escritura', desc:'Abre los 66 libros', goal:66},
    {id:'fullscreen_1', icon:'⛶', title:'Inmersión', desc:'Usa pantalla completa', goal:1}
  ];
  (window.BOOK_ORDER || []).forEach(entry=>{
    const name = entry.name;
    const title = BOOK_BADGE_TITLES[name] || ('Lector de ' + name);
    defs.push({
      id: 'book_' + name,
      icon: entry.testament === 'NT' ? '✝️' : '📖',
      title: title,
      desc: 'Lee al menos un capítulo de ' + name,
      goal: 1,
      book: name
    });
  });
  return defs;
}
let ACH_DEFS = [];
let achState = store.get('bp_achievements', {
  unlocked: {}, // id -> timestamp
  progress: {}, // id -> number
  booksRead: {}, // book -> true
  themesTried: {},
  planDaysDone: {}
});
let googleProfile = store.get('bp_google_profile', null);

function saveAchievements(){
  store.set('bp_achievements', achState);
  if(typeof scheduleDriveSave === 'function') scheduleDriveSave();
}
function saveGoogleProfile(){
  store.set('bp_google_profile', googleProfile);
}

function unlockAchievement(id){
  if(!id || achState.unlocked[id]) return false;
  achState.unlocked[id] = Date.now();
  saveAchievements();
  const def = ACH_DEFS.find(d=>d.id===id);
  showAchievementToast(def || {icon:'🏆', title:id});
  const lista = document.getElementById('lista-logros');
  if(lista && document.getElementById('modal-perfil')?.style.display === 'flex'){
    renderAchievementsList();
    updateProfileStats();
  }
  return true;
}

function setAchProgress(id, value){
  const def = ACH_DEFS.find(d=>d.id===id);
  if(!def) return;
  const v = Math.max(0, value|0);
  const prev = achState.progress[id] || 0;
  if(v === prev && (v < def.goal || achState.unlocked[id])) return;
  achState.progress[id] = v;
  if(v >= def.goal) unlockAchievement(id);
  else saveAchievements();
}

function bumpAchProgress(id, by=1){
  setAchProgress(id, (achState.progress[id]||0) + by);
}

function showAchievementToast(def){
  const el = document.getElementById('toast-logro');
  if(!el) return;
  clearTimeout(showAchievementToast._t);
  clearTimeout(showAchievementToast._t2);
  el.classList.remove('hide');
  el.innerHTML =
    '<div class="tl-icon">'+(def.icon||'🏆')+'</div>'+
    '<div class="tl-body">'+
      '<div class="tl-title">'+(def.title||'Logro desbloqueado')+'</div>'+
      '<p class="tl-desc">'+(def.desc||'Logro desbloqueado')+'</p>'+
    '</div>';
  el.style.display = 'flex';
  el.classList.remove('show','hide');
  void el.offsetWidth;
  el.classList.add('show');
  showAchievementToast._t = setTimeout(()=>{
    el.classList.remove('show');
    el.classList.add('hide');
    showAchievementToast._t2 = setTimeout(()=>{
      el.classList.remove('hide');
      el.style.display = 'none';
    }, 450);
  }, 4200);
}

function trackBookRead(book){
  if(!book) return;
  if(!achState.booksRead) achState.booksRead = {};
  if(!achState.booksRead[book]){
    achState.booksRead[book] = true;
    saveAchievements();
  }
  const books = Object.keys(achState.booksRead);
  setAchProgress('first_chapter', 1);
  setAchProgress('book_' + book, 1);
  setAchProgress('books_10', books.length);
  setAchProgress('books_66', books.length);
  const at = (window.BOOK_ORDER||[]).filter(e=>e.testament==='AT').map(e=>e.name);
  const nt = (window.BOOK_ORDER||[]).filter(e=>e.testament==='NT').map(e=>e.name);
  setAchProgress('books_39', at.filter(b=>achState.booksRead[b]).length);
  setAchProgress('books_27', nt.filter(b=>achState.booksRead[b]).length);
}

function trackThemeTried(theme){
  if(!theme) return;
  if(!achState.themesTried) achState.themesTried = {};
  achState.themesTried[theme] = true;
  const n = Object.keys(achState.themesTried).length;
  setAchProgress('themes_5', n);
  setAchProgress('themes_10', n);
}

function trackNotesCount(){
  const n = Object.values(notes||{}).filter(t=>t && String(t).trim()).length;
  setAchProgress('notes_1', n);
  setAchProgress('notes_10', n);
  setAchProgress('notes_50', n);
}
function trackFavsCount(){
  const n = Object.keys(favorites||{}).filter(k=>favorites[k]).length;
  setAchProgress('favs_1', n);
  setAchProgress('favs_25', n);
  setAchProgress('favs_100', n);
}
function trackMeaningsCount(){
  const n = Object.keys(typeof savedMeanings!=='undefined'?savedMeanings:{}).length;
  setAchProgress('meanings_1', n);
  setAchProgress('meanings_20', n);
}
function trackPlanProgress(){
  if(!achState.planDaysDone) achState.planDaysDone = {};
  // count days with any completed checkbox from localStorage keys plan_dia_*
  const days = new Set();
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k && k.startsWith('plan_') && localStorage.getItem(k)==='true'){
      const m = k.match(/plan_(?:canonical|inverse|parallel|chrono)_dia_(\d+)_/) || k.match(/plan_dia_(\d+)_/);
      if(m) days.add(m[1]);
    }
  }
  days.forEach(d=> achState.planDaysDone[d]=true);
  const n = Object.keys(achState.planDaysDone).length;
  setAchProgress('plan_day_1', n);
  setAchProgress('plan_day_7', n);
  setAchProgress('plan_day_30', n);
}

function updateProfileStats(){
  const el = document.getElementById('perfil-stats');
  if(!el) return;
  const total = ACH_DEFS.length || 1;
  const done = Object.keys(achState.unlocked||{}).length;
  el.textContent = done + ' / ' + total + ' logros · ' + Object.keys(achState.booksRead||{}).length + ' libros leídos';
}

function renderAchievementsList(){
  const lista = document.getElementById('lista-logros');
  if(!lista) return;
  if(!ACH_DEFS.length) ACH_DEFS = buildAchievementDefs();
  const unlocked = [];
  const locked = [];
  ACH_DEFS.forEach(def=>{
    const has = !!achState.unlocked[def.id];
    const prog = achState.progress[def.id] || 0;
    (has ? unlocked : locked).push({def, prog, has});
  });
  const row = (item)=>{
    const {def, prog, has} = item;
    const pct = Math.min(100, Math.round((prog/def.goal)*100));
    return '<div style="display:flex;gap:10px;align-items:flex-start;padding:10px;margin-bottom:8px;border:1px solid var(--line);border-radius:8px;background:'+(has?'color-mix(in srgb, var(--gold) 12%, var(--card-bg))':'var(--parchment)')+';opacity:'+(has?'1':'0.72')+';">'+
      '<div style="font-size:26px;line-height:1;width:36px;text-align:center;filter:'+(has?'none':'grayscale(1)')+';">'+def.icon+'</div>'+
      '<div style="flex:1;min-width:0;">'+
        '<div style="font-weight:600;font-size:13.5px;">'+def.title+(has?' ✓':'')+'</div>'+
        '<div style="font-size:12px;color:var(--ink-soft);margin-top:2px;">'+def.desc+'</div>'+
        (!has ? '<div style="margin-top:6px;height:5px;background:var(--line);border-radius:3px;overflow:hidden;"><div style="height:100%;width:'+pct+'%;background:var(--rubric);"></div></div><div style="font-size:10.5px;color:var(--ink-soft);margin-top:3px;">'+Math.min(prog,def.goal)+' / '+def.goal+'</div>' : '<div style="font-size:10.5px;color:var(--ink-soft);margin-top:4px;">Desbloqueado</div>')+
      '</div></div>';
  };
  lista.innerHTML =
    (unlocked.length ? '<div style="font-size:12px;font-weight:600;color:var(--rubric);margin:4px 0 8px;">Desbloqueados ('+unlocked.length+')</div>'+unlocked.map(row).join('') : '')+
    (locked.length ? '<div style="font-size:12px;font-weight:600;color:var(--ink-soft);margin:12px 0 8px;">En progreso / bloqueados ('+locked.length+')</div>'+locked.map(row).join('') : '');
}

function refreshProfileHeader(){
  const nameEl = document.getElementById('perfil-nombre');
  const emailEl = document.getElementById('perfil-email');
  const img = document.getElementById('perfil-foto');
  const ph = document.getElementById('perfil-foto-placeholder');
  if(googleProfile && googleProfile.email){
    if(nameEl) nameEl.textContent = googleProfile.name || 'Usuario';
    if(emailEl) emailEl.textContent = googleProfile.email;
    if(img && googleProfile.picture){
      img.src = googleProfile.picture;
      img.style.display = 'block';
      if(ph) ph.style.display = 'none';
    }
  } else {
    if(nameEl) nameEl.textContent = 'Invitado';
    if(emailEl) emailEl.textContent = 'Conecta con ☁️ Sincronizar para ver tu cuenta de Google';
    if(img){ img.style.display = 'none'; img.removeAttribute('src'); }
    if(ph) ph.style.display = 'flex';
  }
  updateProfileStats();
}

function openPerfilModal(){
  if(!ACH_DEFS.length) ACH_DEFS = buildAchievementDefs();
  const m = document.getElementById('modal-perfil');
  if(!m) return;
  m.style.display = 'flex';
  refreshProfileHeader();
  renderAchievementsList();
}
function closePerfilModal(){
  const m = document.getElementById('modal-perfil');
  if(m) m.style.display = 'none';
}
document.getElementById('btn-user-profile')?.addEventListener('click', openPerfilModal);
document.getElementById('cerrar-perfil')?.addEventListener('click', closePerfilModal);
document.getElementById('cerrar-perfil-2')?.addEventListener('click', closePerfilModal);
document.getElementById('modal-perfil')?.addEventListener('click', (e)=>{ if(e.target.id==='modal-perfil') closePerfilModal(); });

async function fetchGoogleProfile(){
  try{
    const token = gapi?.client?.getToken()?.access_token;
    if(!token) return;
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if(!res.ok) return;
    const data = await res.json();
    googleProfile = {
      name: data.name || data.given_name || '',
      email: data.email || '',
      picture: data.picture || ''
    };
    saveGoogleProfile();
    refreshProfileHeader();
  }catch(e){ console.warn('userinfo', e); }
}

// init defs after BOOK_ORDER available
setTimeout(()=>{ ACH_DEFS = buildAchievementDefs(); }, 0);

