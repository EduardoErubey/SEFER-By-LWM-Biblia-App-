/* SEFER module: plan.js — script clásico (sin import/export) */

/* --- SEFER plan.js lines 3997-4223 --- */
/* =========================================================
   PLAN DE LECTURA ANUAL (muestra lecturas del día + progreso)
   ========================================================= */

/* → movido a data/ (ver script src) */

/* Orden cronológico aproximado (lectura devocional, no académico estricto) */
const CHRONO_BOOKS = [
  'Génesis','Job','Éxodo','Levítico','Números','Deuteronomio','Josué','Jueces','Rut',
  '1 Samuel','2 Samuel','1 Crónicas','Salmos','1 Reyes','2 Crónicas','2 Reyes',
  'Proverbios','Eclesiastés','Cantares','Isaías','Oseas','Joel','Amós','Abdías','Jonás',
  'Miqueas','Nahúm','Habacuc','Sofonías','Jeremías','Lamentaciones','Ezequiel','Daniel',
  'Esdras','Hageo','Zacarías','Ester','Nehemías','Malaquías',
  'Mateo','Marcos','Lucas','Juan','Hechos','Santiago','Gálatas','1 Tesalonicenses','2 Tesalonicenses',
  '1 Corintios','2 Corintios','Romanos','Efesios','Filipenses','Colosenses','Filemón',
  '1 Timoteo','Tito','1 Pedro','2 Timoteo','2 Pedro','Hebreos','Judas','1 Juan','2 Juan','3 Juan',
  'Apocalipsis'
];

function chaptersOfBook(book){
  if(!BIBLE[book]) return [];
  return Object.keys(BIBLE[book]).map(Number).sort((a,b)=>a-b);
}
function queueFromBooks(books){
  const q = [];
  books.forEach(b=>{
    chaptersOfBook(b).forEach(c=> q.push(b + ' ' + c));
  });
  return q;
}
function distributeQueue(queue, days){
  const plan = {};
  const total = queue.length || 1;
  // repartir capítulos de forma equilibrada en `days`
  for(let d=1; d<=days; d++){
    const start = Math.floor((d-1)*total/days);
    const end = Math.floor(d*total/days);
    const slice = queue.slice(start, end);
    plan[d] = slice.length ? slice : [(queue[0]||'Salmos 1')];
  }
  return plan;
}
function buildPlanByOrder(order){
  const days = 365;
  if(order === 'parallel'){
    const atQ = queueFromBooks(AT_BOOKS_CANON);
    const ntQ = queueFromBooks(NT_BOOKS_CANON);
    const plan = {};
    let ai = 0, ni = 0;
    for(let d=1; d<=days; d++){
      const lecturas = [];
      for(let k=0;k<3 && ai<atQ.length;k++,ai++) lecturas.push(atQ[ai]);
      if(ntQ.length){ lecturas.push(ntQ[ni % ntQ.length]); ni++; }
      // si se acabó el AT, seguir con lo que quede del NT
      if(!lecturas.length && ni < ntQ.length){
        for(let k=0;k<4 && ni<ntQ.length;k++,ni++) lecturas.push(ntQ[ni]);
      }
      plan[d] = lecturas.length ? lecturas : ['Salmos 1'];
    }
    return plan;
  }
  if(order === 'canonical'){
    return distributeQueue(queueFromBooks(AT_BOOKS_CANON.concat(NT_BOOKS_CANON)), days);
  }
  if(order === 'inverse'){
    return distributeQueue(queueFromBooks(NT_BOOKS_CANON.concat(AT_BOOKS_CANON)), days);
  }
  // chrono
  const chrono = CHRONO_BOOKS.filter(b=>BIBLE[b]);
  const fallback = AT_BOOKS_CANON.concat(NT_BOOKS_CANON);
  return distributeQueue(queueFromBooks(chrono.length ? chrono : fallback), days);
}

let planOrder = store.get('bp_plan_order', 'canonical'); // canonical | inverse | parallel | chrono
let PLAN_ANUAL = buildPlanByOrder(planOrder);

let planViewDay = null;
let planMode = store.get('bp_plan_mode', 'calendar'); // 'calendar' | 'today'
let planStartDate = store.get('bp_plan_start', null); // ISO date string when mode=today

function obtenerDiaDelAno(date){
  const hoy = date || new Date();
  const inicio = new Date(hoy.getFullYear(), 0, 0);
  const diff = hoy - inicio;
  return Math.floor(diff / (1000*60*60*24));
}
function obtenerDiaPlan(date){
  const hoy = date || new Date();
  if(planMode === 'today' && planStartDate){
    const start = new Date(planStartDate + 'T00:00:00');
    const diff = hoy - start;
    const day = Math.floor(diff / (1000*60*60*24)) + 1;
    return Math.max(1, Math.min(365, day));
  }
  return obtenerDiaDelAno(hoy);
}
function setPlanMode(mode){
  planMode = mode;
  store.set('bp_plan_mode', mode);
  if(mode === 'today' && !planStartDate){
    const d = new Date();
    planStartDate = d.toISOString().slice(0,10);
    store.set('bp_plan_start', planStartDate);
  }
  document.querySelectorAll('.plan-mode-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.mode === mode);
  });
  const label = document.getElementById('plan-mode-label');
  if(label){
    const orderNames = {canonical:'AT→NT', inverse:'NT→AT', parallel:'Paralelo', chrono:'Cronológico'};
    const o = orderNames[planOrder] || planOrder;
    label.textContent = mode === 'today'
      ? `(${o} · desde ${planStartDate||''})`
      : `(${o} · año calendario)`;
  }
  document.querySelectorAll('.plan-order-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.order === planOrder);
  });
  planViewDay = obtenerDiaPlan();
  cargarPlanLectura(planViewDay);
}
function parsePlanRef(ref){
  // "Génesis 1" or "1 Samuel 3"
  const m = (ref||'').match(/^(.+?)\s+(\d+)$/);
  if(!m) return null;
  return {book: m[1].trim(), chap: m[2]};
}
function cargarPlanLectura(dia){
  const diaActual = dia || obtenerDiaPlan();
  planViewDay = diaActual;
  const elDia = document.getElementById('dia-actual-plan');
  if(elDia) elDia.textContent = diaActual + ' / 365';
  const label = document.getElementById('plan-mode-label');
  if(label){
    const orderNames = {canonical:'AT→NT', inverse:'NT→AT', parallel:'Paralelo', chrono:'Cronológico'};
    const o = orderNames[planOrder] || planOrder;
    label.textContent = planMode === 'today'
      ? `(${o} · desde ${planStartDate||''})`
      : `(${o} · año calendario)`;
  }
  document.querySelectorAll('.plan-mode-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.mode === planMode);
  });
  document.querySelectorAll('.plan-order-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.order === planOrder);
  });
  const lecturas = PLAN_ANUAL[diaActual] || ['Lectura no definida'];
  const contenedor = document.getElementById('lectura-de-hoy');
  if(!contenedor) return;
  contenedor.innerHTML = '';
  lecturas.forEach((lectura, index)=>{
    const key = `plan_${planOrder}_dia_${diaActual}_lec_${index}`;
    const completado = localStorage.getItem(key) === 'true';
    const div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);';
    div.innerHTML = `
      <input type="checkbox" id="lectura-${index}" ${completado?'checked':''} style="width:18px;height:18px;">
      <label for="lectura-${index}" style="flex:1;cursor:pointer;font-family:var(--font-body);">${lectura}</label>
      <button type="button" class="btn" data-plan-go style="font-size:11px;padding:4px 8px;">Ir</button>`;
    div.querySelector('input').onchange = (e)=>{
      localStorage.setItem(key, e.target.checked);
      if(typeof scheduleDriveSave === 'function') scheduleDriveSave();
      try{ if(typeof trackPlanProgress==='function') trackPlanProgress(); }catch(e){}
    };
    div.querySelector('[data-plan-go]').onclick = ()=>{
      const p = parsePlanRef(lectura);
      if(p && BIBLE[p.book]){
        openTestaments.add(BOOK_ORDER.find(e=>e.name===p.book)?.testament || 'AT');
        openBooks.add(p.book);
        saveNavState();
        goTo(p.book, p.chap);
        renderBookList();
        closePlanModal();
      } else {
        alert('No se pudo abrir: '+lectura);
      }
    };
    contenedor.appendChild(div);
  });
}
function openPlanModal(){
  const m = document.getElementById('modal-plan-lectura');
  if(!m) return;
  m.style.display = 'flex';
  cargarPlanLectura(planViewDay || obtenerDiaPlan());
}
document.getElementById('plan-mode-calendar')?.addEventListener('click', ()=> setPlanMode('calendar'));
document.getElementById('plan-mode-today')?.addEventListener('click', ()=>{
  // Reiniciar fecha de inicio a hoy si el usuario elige "Desde hoy"
  const d = new Date();
  planStartDate = d.toISOString().slice(0,10);
  store.set('bp_plan_start', planStartDate);
  setPlanMode('today');
});
function setPlanOrder(order){
  if(!order || order === planOrder) {
    document.querySelectorAll('.plan-order-btn').forEach(b=> b.classList.toggle('active', b.dataset.order===planOrder));
    return;
  }
  planOrder = order;
  store.set('bp_plan_order', planOrder);
  PLAN_ANUAL = buildPlanByOrder(planOrder);
  planViewDay = obtenerDiaPlan();
  cargarPlanLectura(planViewDay);
  if(typeof scheduleDriveSave === 'function') scheduleDriveSave();
}
document.querySelectorAll('.plan-order-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> setPlanOrder(btn.dataset.order));
});
function closePlanModal(){
  const m = document.getElementById('modal-plan-lectura');
  if(m) m.style.display = 'none';
}
document.getElementById('plan-btn')?.addEventListener('click', openPlanModal);
document.getElementById('cerrar-plan')?.addEventListener('click', closePlanModal);
document.getElementById('plan-prev-day')?.addEventListener('click', ()=>{
  const d = Math.max(1, (planViewDay||obtenerDiaDelAno())-1);
  cargarPlanLectura(d);
});
document.getElementById('plan-next-day')?.addEventListener('click', ()=>{
  const d = Math.min(365, (planViewDay||obtenerDiaDelAno())+1);
  cargarPlanLectura(d);
});
document.getElementById('modal-plan-lectura')?.addEventListener('click', (e)=>{
  if(e.target.id === 'modal-plan-lectura') closePlanModal();
});

