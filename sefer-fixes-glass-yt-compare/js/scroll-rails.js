/* SEFER module: scroll-rails.js — script clásico (sin import/export) */

/* --- SEFER scroll-rails.js lines 832-994 --- */
function attachScrollRail(scrollEl, railId){
  if(!scrollEl) return;
  const old = document.getElementById(railId);
  if(old) old.remove();

  // Host: contenedor relative que envuelve o rodea el área con scroll
  let host;
  if(scrollEl.id === 'reader-verses'){
    host = scrollEl.parentElement || scrollEl; // #reader
    if(getComputedStyle(host).position === 'static') host.style.position = 'relative';
  } else if(scrollEl.id === 'book-list'){
    if(!scrollEl.parentElement?.classList.contains('sefer-scroll-wrap')){
      const w = document.createElement('div');
      w.className = 'sefer-scroll-wrap';
      scrollEl.parentNode.insertBefore(w, scrollEl);
      w.appendChild(scrollEl);
    }
    host = scrollEl.parentElement;
  } else {
    if(!scrollEl.parentElement?.classList.contains('sefer-scroll-wrap')){
      const w = document.createElement('div');
      w.className = 'sefer-scroll-wrap';
      scrollEl.parentNode.insertBefore(w, scrollEl);
      w.appendChild(scrollEl);
    }
    host = scrollEl.parentElement;
  }

  scrollEl.classList.add('sefer-scroll-target');

  const sb = document.createElement('div');
  sb.id = railId;
  sb.className = 'sefer-sb';
  sb.innerHTML =
    '<button type="button" class="sefer-sb-btn sefer-sb-up" title="Subir" aria-label="Subir">▲</button>'+
    '<div class="sefer-sb-track"><div class="sefer-sb-thumb"></div></div>'+
    '<button type="button" class="sefer-sb-btn sefer-sb-down" title="Bajar" aria-label="Bajar">▼</button>';
  host.appendChild(sb);

  const track = sb.querySelector('.sefer-sb-track');
  const thumb = sb.querySelector('.sefer-sb-thumb');
  const upBtn = sb.querySelector('.sefer-sb-up');
  const downBtn = sb.querySelector('.sefer-sb-down');

  const syncPos = ()=>{
    if(scrollEl.id === 'reader-verses'){
      sb.style.top = (scrollEl.offsetTop || 0) + 'px';
      sb.style.height = (scrollEl.offsetHeight || 0) + 'px';
      sb.style.bottom = 'auto';
      sb.style.right = '0';
    } else {
      sb.style.top = '0';
      sb.style.bottom = '0';
      sb.style.height = 'auto';
      sb.style.right = '0';
    }
  };

  const updateThumb = ()=>{
    const ch = scrollEl.clientHeight || 1;
    const sh = scrollEl.scrollHeight || 1;
    const st = scrollEl.scrollTop || 0;
    const trackH = track.clientHeight || 1;
    if(sh <= ch + 1){
      sb.style.display = 'none';
      return;
    }
    sb.style.display = 'flex';
    const ratio = ch / sh;
    const thumbH = Math.max(18, Math.round(trackH * ratio));
    const maxTop = Math.max(0, trackH - thumbH);
    const top = maxTop * (st / Math.max(1, sh - ch));
    thumb.style.height = thumbH + 'px';
    thumb.style.top = top + 'px';
  };

  const step = ()=> Math.max(40, Math.floor((scrollEl.clientHeight||300)*0.3));
  const doScroll = (dir)=>{
    scrollEl.scrollTop = Math.max(0, Math.min(scrollEl.scrollHeight - scrollEl.clientHeight, scrollEl.scrollTop + dir * step()));
    updateThumb();
  };

  upBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); doScroll(-1); });
  downBtn.addEventListener('click', (e)=>{ e.preventDefault(); e.stopPropagation(); doScroll(1); });

  // Mantener pulsado
  function hold(btn, dir){
    let raf = null;
    const tick = ()=>{ scrollEl.scrollTop += dir * Math.max(12, step()*0.1); updateThumb(); raf = requestAnimationFrame(tick); };
    const start = (e)=>{ e.preventDefault(); e.stopPropagation(); if(raf) cancelAnimationFrame(raf); tick(); };
    const stop = ()=>{ if(raf) cancelAnimationFrame(raf); raf = null; };
    btn.addEventListener('mousedown', start);
    btn.addEventListener('mouseup', stop);
    btn.addEventListener('mouseleave', stop);
    btn.addEventListener('touchstart', start, {passive:false});
    btn.addEventListener('touchend', stop);
  }
  hold(upBtn, -1);
  hold(downBtn, 1);

  // Clic en el track
  track.addEventListener('click', (e)=>{
    if(e.target === thumb) return;
    const rect = track.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const ratio = y / Math.max(1, rect.height);
    scrollEl.scrollTop = ratio * (scrollEl.scrollHeight - scrollEl.clientHeight);
    updateThumb();
  });

  // Arrastrar thumb
  let dragging = false, startY = 0, startTop = 0;
  thumb.addEventListener('mousedown', (e)=>{
    e.preventDefault(); e.stopPropagation();
    dragging = true;
    thumb.classList.add('dragging');
    startY = e.clientY;
    startTop = parseFloat(thumb.style.top) || 0;
  });
  window.addEventListener('mousemove', (e)=>{
    if(!dragging) return;
    const trackH = track.clientHeight || 1;
    const thumbH = thumb.offsetHeight || 18;
    const maxTop = Math.max(0, trackH - thumbH);
    let top = Math.max(0, Math.min(maxTop, startTop + (e.clientY - startY)));
    thumb.style.top = top + 'px';
    const sh = scrollEl.scrollHeight - scrollEl.clientHeight;
    scrollEl.scrollTop = (maxTop > 0 ? top / maxTop : 0) * sh;
  });
  window.addEventListener('mouseup', ()=>{
    if(!dragging) return;
    dragging = false;
    thumb.classList.remove('dragging');
  });

  scrollEl.addEventListener('scroll', updateThumb, {passive:true});

  syncPos();
  updateThumb();
  if(typeof ResizeObserver !== 'undefined'){
    const ro = new ResizeObserver(()=>{ syncPos(); updateThumb(); });
    ro.observe(scrollEl);
    ro.observe(host);
  }
  window.addEventListener('resize', ()=>{ syncPos(); updateThumb(); });
}
function setupBookListScrollRail(){
  try{
    const bl = document.getElementById('book-list');
    if(bl) attachScrollRail(bl, 'booklist-scroll-rail');
  }catch(e){}
}
function setupReaderVersesScrollRail(){
  try{
    const rv = document.getElementById('reader-verses');
    if(rv) attachScrollRail(rv, 'reader-scroll-rail');
  }catch(e){}
}
function setupReaderScrollArrows(){
  setupBookListScrollRail();
  setupReaderVersesScrollRail();
}

