/* SEFER module: youtube.js — script clásico (sin import/export) */

/* --- SEFER youtube.js lines 4279-4450 --- */
/* =========================================================

/* =========================================================
   YOUTUBE — sermón en esquina (solo iframe embed)
   ========================================================= */
let ytPosition = 'bl';

function extractYouTubeId(url){
  if(!url) return null;
  const s = String(url).trim();
  let m = s.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if(m) return m[1];
  m = s.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if(m) return m[1];
  m = s.match(/youtube\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{6,})/);
  if(m) return m[1];
  if(/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  return null;
}
function buildYouTubeEmbedSrc(id){
  const params = [
    'rel=0',
    'modestbranding=1',
    'controls=1',
    'fs=1',
    'iv_load_policy=3',
    'playsinline=1',
    'autoplay=1'
  ].join('&');
  return 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?' + params;
}
function applyYoutubePosition(){
  const wrap = document.getElementById('yt-player-wrap');
  if(!wrap) return;
  // Garantizar que el player viva dentro de #nav (por si quedó fuera)
  const nav = document.getElementById('nav');
  const bookList = document.getElementById('book-list');
  if(nav && bookList && wrap.parentElement !== nav){
    bookList.insertAdjacentElement('afterend', wrap);
  }
  wrap.classList.add('yt-sidebar');
  wrap.classList.remove('yt-pos-br', 'yt-pos-tr', 'yt-pos-bl');
  // limpiar estilos inline de posicionamiento flotante
  wrap.style.position = '';
  wrap.style.left = '';
  wrap.style.right = '';
  wrap.style.top = '';
  wrap.style.bottom = '';
  wrap.style.width = '';
  wrap.style.zIndex = '';
  const visible = wrap.style.display !== 'none' && wrap.style.display !== '';
  setYoutubeLayoutActive(visible);
}
function setYoutubeLayoutActive(active){
  document.body.classList.remove('yt-active-br', 'yt-active-tr', 'yt-active-bl', 'yt-sidebar-active');
  if(active) document.body.classList.add('yt-sidebar-active');
}
function openYoutubeModal(prefill){
  const m = document.getElementById('modal-youtube');
  const input = document.getElementById('yt-url-input');
  if(!m) return;
  m.style.display = 'flex';
  if(input){
    input.value = prefill || store.get('bp_yt_url', '') || '';
    setTimeout(()=> input.focus(), 50);
  }
}
function closeYoutubeModal(){
  const m = document.getElementById('modal-youtube');
  if(m) m.style.display = 'none';
}
function closeYoutubePlayer(){
  const wrap = document.getElementById('yt-player-wrap');
  const box = document.getElementById('yt-iframe-box');
  if(box) box.innerHTML = '';
  if(wrap){
    wrap.style.display = 'none';
    wrap.setAttribute('aria-hidden', 'true');
  }
  setYoutubeLayoutActive(false);
}
function clearYoutubeLink(){
  store.set('bp_yt_url', '');
  const input = document.getElementById('yt-url-input');
  if(input) input.value = '';
  const title = document.getElementById('yt-player-title');
  if(title) title.textContent = 'Sermón';
  // Solo borra el enlace (y detiene el vídeo si estaba cargado); no cierra el modal
  closeYoutubePlayer();
}
async function fetchYoutubeMeta(id){
  const titleEl = document.getElementById('yt-player-title');
  if(titleEl) titleEl.textContent = 'Cargando…';
  try{
    const pageUrl = 'https://www.youtube.com/watch?v=' + encodeURIComponent(id);
    const oembed = 'https://www.youtube.com/oembed?url=' + encodeURIComponent(pageUrl) + '&format=json';
    const res = await fetch(oembed);
    if(!res.ok) throw new Error('oembed '+res.status);
    const data = await res.json();
    const t = (data.title || 'Vídeo').trim();
    const ch = (data.author_name || '').trim();
    if(titleEl) titleEl.textContent = ch ? (t + ' - ' + ch) : t;
    titleEl.title = titleEl.textContent;
  }catch(e){
    if(titleEl){
      titleEl.textContent = 'Vídeo de YouTube';
      titleEl.title = id;
    }
  }
}
function loadYoutubeFromUrl(raw){
  const id = extractYouTubeId(raw);
  if(!id){
    alert('No se reconoció un enlace de YouTube válido.\nEjemplos:\nhttps://www.youtube.com/watch?v=XXXXXXXXXXX\nhttps://youtu.be/XXXXXXXXXXX');
    return false;
  }
  store.set('bp_yt_url', String(raw).trim());
  const wrap = document.getElementById('yt-player-wrap');
  const box = document.getElementById('yt-iframe-box');
  if(!wrap || !box) return false;
  box.innerHTML = '';
  const iframe = document.createElement('iframe');
  iframe.src = buildYouTubeEmbedSrc(id);
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  iframe.allowFullscreen = true;
  iframe.title = 'Sermón de YouTube';
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  box.appendChild(iframe);
  wrap.style.display = 'flex';
  wrap.setAttribute('aria-hidden', 'false');
  applyYoutubePosition();
  setYoutubeLayoutActive(true);
  fetchYoutubeMeta(id);
  closeYoutubeModal();
  return true;
}
document.getElementById('youtube-btn')?.addEventListener('click', ()=> openYoutubeModal());
document.getElementById('cerrar-youtube-modal')?.addEventListener('click', closeYoutubeModal);
document.getElementById('modal-youtube')?.addEventListener('click', (e)=>{
  if(e.target.id === 'modal-youtube') closeYoutubeModal();
});
document.getElementById('yt-load-btn')?.addEventListener('click', ()=>{
  const v = document.getElementById('yt-url-input')?.value || '';
  loadYoutubeFromUrl(v);
});
document.getElementById('yt-paste-btn')?.addEventListener('click', async ()=>{
  const input = document.getElementById('yt-url-input');
  if(!input) return;
  try{
    const text = await navigator.clipboard.readText();
    if(text){ input.value = text.trim(); input.focus(); }
    else alert('El portapapeles está vacío.');
  }catch(err){
    alert('No se pudo pegar automáticamente. Usa Ctrl+V en el campo.');
    input.focus();
  }
});
document.getElementById('yt-url-input')?.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){
    e.preventDefault();
    loadYoutubeFromUrl(e.target.value || '');
  }
});
document.getElementById('yt-close-btn')?.addEventListener('click', closeYoutubePlayer);
document.getElementById('yt-change-btn')?.addEventListener('click', ()=>{
  openYoutubeModal(store.get('bp_yt_url', '') || '');
});
document.getElementById('yt-clear-btn')?.addEventListener('click', clearYoutubeLink);
document.getElementById('yt-clear-modal-btn')?.addEventListener('click', clearYoutubeLink);
/* yt-pos eliminado: siempre inferior izquierda */
applyYoutubePosition();

