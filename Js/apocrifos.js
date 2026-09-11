/* SEFER module: apocrifos.js — script clásico (sin import/export) */

/* --- SEFER apocrifos.js lines 3025-3052 --- */
function openApocrifos(){
  const m = document.getElementById('modal-apocrifos');
  const body = document.getElementById('apocrifos-body');
  if(!m || !body) return;
  body.innerHTML = APOCRIFOS_INFO.map(x=>'<div style="margin-bottom:14px;"><div style="font-weight:700;color:var(--rubric);margin-bottom:4px;">'+x.t+'</div><div style="color:var(--ink);">'+x.d+'</div></div>').join('');
  m.style.display = 'flex';
}
function closeApocrifos(){
  const m = document.getElementById('modal-apocrifos');
  if(m) m.style.display = 'none';
}
document.getElementById('apocrifos-btn')?.addEventListener('click', openApocrifos);
document.getElementById('cerrar-apocrifos')?.addEventListener('click', closeApocrifos);
document.getElementById('modal-apocrifos')?.addEventListener('click', (e)=>{ if(e.target.id==='modal-apocrifos') closeApocrifos(); });

document.getElementById('biography-btn')?.addEventListener('click', openGenealogia);
document.getElementById('genealogy-btn')?.addEventListener('click', openGenealogia);
document.getElementById('cerrar-genealogia')?.addEventListener('click', closeGenealogia);
document.getElementById('modal-genealogia')?.addEventListener('click', (e)=>{
  if(e.target.id === 'modal-genealogia') closeGenealogia();
});
document.getElementById('gene-search')?.addEventListener('input', (e)=>{
  const q = e.target.value || '';
  if(geneSelected && !q) return; // si estás viendo ficha y borras búsqueda, no forzar
  geneSelected = null;
  renderGeneHome(q);
});

