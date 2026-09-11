/* SEFER module: glosario.js — script clásico (sin import/export) */

/* --- SEFER glosario.js lines 4224-4278 --- */
/* =========================================================
   GLOSARIO (usa el diccionario bíblico ya existente + extras)
   ========================================================= */

/* → movido a data/ (ver script src) */

function renderizarGlosario(filtro=''){
  const lista = document.getElementById('lista-glosario');
  if(!lista) return;
  lista.innerHTML = '';
  const q = (filtro||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const all = buildGlosarioList();
  const filtrados = q
    ? all.filter(item=>{
        const p = item.palabra.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        const d = (item.definicion||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
        return p.includes(q) || d.includes(q);
      })
    : all; // todos los términos (sin límite)
  if(!filtrados.length){
    lista.innerHTML = '<li style="color:var(--ink-soft);font-style:italic;padding:8px 0;">No se encontró la palabra.</li>';
    return;
  }
  filtrados.forEach(item=>{
    const li = document.createElement('li');
    li.style.cssText = 'padding:8px 0;border-bottom:1px solid var(--line);';
    li.innerHTML = `<strong style="color:var(--rubric);">${item.palabra}:</strong> <span style="color:var(--ink);">${item.definicion}</span>`;
    lista.appendChild(li);
  });
  if(!q && all.length>80){
    const more = document.createElement('li');
    more.style.cssText = 'padding:8px 0;color:var(--ink-soft);font-style:italic;';
    more.textContent = `Escribe para buscar entre ${all.length} términos…`;
    lista.appendChild(more);
  }
}
function openGlosario(){
  const m = document.getElementById('modal-glosario');
  if(!m) return;
  m.style.display = 'flex';
  renderizarGlosario();
  const inp = document.getElementById('buscador-glosario');
  if(inp){ inp.value=''; setTimeout(()=>inp.focus(), 50); }
}
function closeGlosario(){
  const m = document.getElementById('modal-glosario');
  if(m) m.style.display = 'none';
}
document.getElementById('glossary-btn')?.addEventListener('click', openGlosario);
document.getElementById('cerrar-glosario')?.addEventListener('click', closeGlosario);
document.getElementById('buscador-glosario')?.addEventListener('input', (e)=> renderizarGlosario(e.target.value));
document.getElementById('modal-glosario')?.addEventListener('click', (e)=>{
  if(e.target.id === 'modal-glosario') closeGlosario();
});

