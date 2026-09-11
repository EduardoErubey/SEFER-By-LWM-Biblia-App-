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
  btn.onclick = function(e){
    e.preventDefault();
    e.stopPropagation();
    document.querySelectorAll('#version-menu.open').forEach(m=>m.classList.remove('open'));
    const open = !menu.classList.contains('open');
    if(open){
      const r = btn.getBoundingClientRect();
      menu.style.position = 'fixed';
      menu.style.top = (r.bottom + 6) + 'px';
      menu.style.left = Math.max(8, Math.min(r.right - 200, window.innerWidth - 220)) + 'px';
      menu.style.zIndex = '5000';
      menu.classList.add('open');
    } else {
      menu.classList.remove('open');
    }
  };
  document.addEventListener('click', function(e){
    if(e.target === btn || btn.contains(e.target) || menu.contains(e.target)) return;
    menu.classList.remove('open');
  });
  try{ applyVerseFont(); }catch(err){}
}
// Scrollbar personalizada: ▲ + track/thumb + ▼, colores del tema, alineada al borde
