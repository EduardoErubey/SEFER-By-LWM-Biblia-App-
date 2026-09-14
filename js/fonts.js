/* SEFER module: fonts.js — script clásico (sin import/export) */

/* --- SEFER fonts.js lines 779-831 --- */
function setupFontFamilyMenu(){
  const btn = document.getElementById('font-family-btn');
  if(!btn) return;
  let menu = document.getElementById('font-family-menu');
  if(!menu){
    menu = document.createElement('div');
    menu.id = 'font-family-menu';
  }
  if(menu.parentElement !== document.body){
    document.body.appendChild(menu);
  }
  function renderMenu(){
    const fonts = (typeof SEFER_FONTS!=='undefined' && SEFER_FONTS) ? SEFER_FONTS : [];
    menu.innerHTML = fonts.map(f=>
      '<button type="button" data-font="'+f.id+'" class="'+(f.id===verseFontFamily?'active':'')+'" style="font-family:'+f.stack+'">'+f.name+'</button>'
    ).join('');
    menu.querySelectorAll('button').forEach(b=>{
      b.onclick = function(e){
        e.preventDefault();
        e.stopPropagation();
        verseFontFamily = b.getAttribute('data-font');
        try{ store.set('sefer_font_family', verseFontFamily); }catch(err){}
        applyVerseFont();
        try{ if(typeof showWelcome==='undefined' || !showWelcome) renderReader(); }catch(err){}
        menu.classList.remove('open');
        renderMenu();
      };
    });
  }
  renderMenu();
  function placeFontMenu(){
    const r = btn.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.zIndex = '5000';
    menu.style.width = 'max-content';
    menu.style.minWidth = '0';
    menu.style.maxWidth = 'min(280px, 92vw)';
    menu.style.boxSizing = 'border-box';
    menu.classList.add('open');
    menu.style.visibility = 'hidden';
    menu.style.left = '0px';
    menu.style.top = '0px';
    const mw = Math.max(menu.offsetWidth, 120);
    const mh = menu.offsetHeight || 40;
    let left = r.left;
    let top = r.bottom + 6;
    if(left + mw > window.innerWidth - 8) left = Math.max(8, window.innerWidth - mw - 8);
    if(top + mh > window.innerHeight - 8) top = Math.max(8, r.top - mh - 6);
    menu.style.left = left + 'px';
    menu.style.top = top + 'px';
    menu.style.visibility = '';
  }
  btn.onclick = function(e){
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll('#version-menu.open').forEach(m=>m.classList.remove('open'));
    const open = !menu.classList.contains('open');
    if(open){ placeFontMenu(); }
    else menu.classList.remove('open');
  };
  window.addEventListener('resize', function(){ if(menu.classList.contains('open')) placeFontMenu(); });
  document.addEventListener('click', function(e){
    if(e.target === btn || btn.contains(e.target) || menu.contains(e.target)) return;
    menu.classList.remove('open');
  });
  try{ applyVerseFont(); }catch(err){}
}
// Scrollbar personalizada: ▲ + track/thumb + ▼, colores del tema, alineada al borde
